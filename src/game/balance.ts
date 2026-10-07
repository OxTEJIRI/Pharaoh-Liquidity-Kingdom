import type { LiquidityRange, PoolScenario, TradeWave, VoteId } from './types'

export const ROUND_DURATION = 60
export const WARNING_SECONDS = 3
export const MAX_REBALANCES = 3
export const MIN_HALF_WIDTH_RATIO = 0.018
export const MAX_HALF_WIDTH_RATIO = 0.18

export const rangeBounds = (range: LiquidityRange) => ({
  min: range.center - range.halfWidth,
  max: range.center + range.halfWidth,
})

export function capitalEfficiency(range: LiquidityRange, referencePrice: number): number {
  const widthRatio = (range.halfWidth * 2) / referencePrice
  return Math.max(1, Math.min(8, 0.3 / widthRatio))
}

export function rangeSafety(range: LiquidityRange, pool: PoolScenario): number {
  const widthRatio = range.halfWidth / pool.basePrice
  return Math.max(12, Math.min(96, Math.round((widthRatio / pool.volatility) * 36)))
}

export function voteMultiplier(vote: VoteId, wave: TradeWave, efficiency: number): number {
  if (vote === 'stability') return 1.08
  if (vote === 'volatility') return wave.kind === 'standard' ? 1 : 1.4
  return efficiency >= 3 ? 1.22 : 1
}

export function intersectsRange(before: number, after: number, range: LiquidityRange): boolean {
  const { min, max } = rangeBounds(range)
  return Math.max(before, after) >= min && Math.min(before, after) <= max
}

export function clampRange(range: LiquidityRange, pool: PoolScenario): LiquidityRange {
  const minWidth = pool.basePrice * MIN_HALF_WIDTH_RATIO
  const maxWidth = pool.basePrice * MAX_HALF_WIDTH_RATIO
  const halfWidth = Math.max(minWidth, Math.min(maxWidth, range.halfWidth))
  const minCenter = pool.basePrice * 0.62 + halfWidth
  const maxCenter = pool.basePrice * 1.38 - halfWidth
  return { center: Math.max(minCenter, Math.min(maxCenter, range.center)), halfWidth }
}
