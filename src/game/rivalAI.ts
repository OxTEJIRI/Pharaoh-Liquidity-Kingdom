import type { LiquidityRange, PoolScenario, TradeWave } from './types'
import { intersectsRange } from './balance'

export function idleRange(pool: PoolScenario): LiquidityRange {
  return { center: pool.basePrice, halfWidth: pool.basePrice * 0.34 }
}

export function resolveRival(before: number, after: number, pool: PoolScenario, wave: TradeWave) {
  const caught = intersectsRange(before, after, idleRange(pool))
  const specialBonus = wave.kind === 'whale' ? 1.22 : wave.kind === 'volatility' ? 1.12 : 1
  const reward = caught ? wave.feeValue * 0.72 * specialBonus : 0
  return { caught, reward, score: caught ? Math.round(reward * 9 + 55) : 0 }
}
