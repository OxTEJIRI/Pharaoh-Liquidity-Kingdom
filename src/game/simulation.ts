import { EVENT_COPY } from '../data/events'
import { MAX_REBALANCES, ROUND_DURATION, capitalEfficiency, clampRange, intersectsRange, rangeBounds, voteMultiplier } from './balance'
import { createTradeWaves } from './events'
import { idleRange, resolveRival } from './rivalAI'
import type { LiquidityRange, PoolScenario, RoundState, TradeResult, VoteId } from './types'

export function createRound(pool: PoolScenario, vote: VoteId, seed = 2403): RoundState {
  const range = { center: pool.basePrice, halfWidth: pool.initialHalfWidth }
  return {
    elapsed: 0,
    duration: ROUND_DURATION,
    pool,
    vote,
    waves: createTradeWaves(pool, seed),
    nextWaveIndex: 0,
    price: pool.basePrice,
    activeRange: range,
    stagedRange: range,
    rebalanceCharges: MAX_REBALANCES,
    playerScore: 0,
    rivalScore: 0,
    playerFees: 0,
    rivalFees: 0,
    voteBonus: 0,
    productiveSeconds: 0,
    rivalProductiveSeconds: 0,
    caught: 0,
    missed: 0,
    rivalCaught: 0,
    status: 'idle',
    lastResult: null,
    eventMessage: 'The market gates are opening',
    eventKind: null,
    eventNonce: 0,
    finished: false,
  }
}

function contains(price: number, range: LiquidityRange) {
  const bounds = rangeBounds(range)
  return price >= bounds.min && price <= bounds.max
}

function copyForWave(state: RoundState) {
  const wave = state.waves[state.nextWaveIndex]
  if (!wave) return ''
  const choices = EVENT_COPY[wave.kind]
  return choices[wave.id % choices.length]
}

function resolveWave(state: RoundState): RoundState {
  const wave = state.waves[state.nextWaveIndex]
  if (!wave) return state
  const before = state.price
  const signedMove = wave.direction === 'buy' ? wave.movePct : -wave.movePct
  const after = Math.max(state.pool.basePrice * 0.42, before * (1 + signedMove))
  const caught = intersectsRange(before, after, state.activeRange)
  const efficiency = capitalEfficiency(state.activeRange, before)
  const basePlayerReward = caught ? wave.feeValue * efficiency : 0
  const playerReward = basePlayerReward * voteMultiplier(state.vote, wave, efficiency)
  const scoreDelta = caught ? Math.round(playerReward * 10 + 80 * efficiency) : -90
  const rival = resolveRival(before, after, state.pool, wave)
  const result: TradeResult = { wave, caught, playerReward, rivalReward: rival.reward, priceBefore: before, priceAfter: after, scoreDelta }
  return {
    ...state,
    price: after,
    nextWaveIndex: state.nextWaveIndex + 1,
    playerScore: Math.max(0, state.playerScore + scoreDelta),
    rivalScore: state.rivalScore + rival.score + (caught ? 0 : 45),
    playerFees: state.playerFees + playerReward,
    rivalFees: state.rivalFees + rival.reward,
    voteBonus: state.voteBonus + Math.max(0, playerReward - basePlayerReward),
    caught: state.caught + (caught ? 1 : 0),
    missed: state.missed + (caught ? 0 : 1),
    rivalCaught: state.rivalCaught + (rival.caught ? 1 : 0),
    status: caught ? 'caught' : 'missed',
    lastResult: result,
    eventMessage: caught ? `TRADE CAUGHT · +${Math.max(0, scoreDelta).toLocaleString()} PTS` : 'MISSED TRADE · IDLE LP ADVANCES',
    eventKind: wave.kind,
    eventNonce: state.eventNonce + 1,
  }
}

export function advanceRound(previous: RoundState, deltaSeconds: number): RoundState {
  if (previous.finished) return previous
  // Keep the 60-second market clock accurate even when a browser throttles
  // requestAnimationFrame in a background tab.
  const safeDelta = Math.max(0, Math.min(deltaSeconds, 2))
  let state = { ...previous, elapsed: Math.min(previous.duration, previous.elapsed + safeDelta) }
  state.productiveSeconds += contains(state.price, state.activeRange) ? safeDelta : 0
  state.rivalProductiveSeconds += contains(state.price, idleRange(state.pool)) ? safeDelta : 0
  let wave = state.waves[state.nextWaveIndex]
  while (wave && state.elapsed >= wave.impactAt) {
    state = resolveWave(state)
    wave = state.waves[state.nextWaveIndex]
  }
  if (wave && state.elapsed >= wave.warningAt && state.elapsed < wave.impactAt) {
    state.status = 'warning'
    state.eventKind = wave.kind
    state.eventMessage = copyForWave(state)
  } else if (state.status === 'warning' || (state.lastResult && state.elapsed - state.lastResult.wave.impactAt > 2.2)) {
    state.status = 'idle'
    state.eventKind = null
    state.eventMessage = 'Reposition before the next caravan'
  }
  if (state.elapsed >= state.duration) {
    state.finished = true
    state.status = state.playerScore >= state.rivalScore ? 'victory' : 'defeat'
  }
  return state
}

export function stageRange(state: RoundState, centerDelta: number, widthFactor = 1): RoundState {
  const staged = clampRange({ center: state.stagedRange.center + centerDelta, halfWidth: state.stagedRange.halfWidth * widthFactor }, state.pool)
  return { ...state, stagedRange: staged }
}

export function stageAroundPrice(state: RoundState) {
  return { ...state, stagedRange: clampRange({ ...state.stagedRange, center: state.price }, state.pool) }
}

export function deployRange(state: RoundState): RoundState {
  if (state.rebalanceCharges <= 0 || state.finished) return state
  return {
    ...state,
    activeRange: state.stagedRange,
    rebalanceCharges: state.rebalanceCharges - 1,
    status: 'impact',
    eventMessage: `RANGE DEPLOYED · ${state.rebalanceCharges - 1} CHARGES LEFT`,
    eventNonce: state.eventNonce + 1,
  }
}

export function upcomingWave(state: RoundState) {
  return state.waves[state.nextWaveIndex] ?? null
}
