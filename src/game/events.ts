import { WAVE_TIMES } from '../data/events'
import type { PoolScenario, TradeWave, WaveKind } from './types'
import { WARNING_SECONDS } from './balance'

function randomSequence(seed: number) {
  let value = seed >>> 0
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0
    return value / 4294967296
  }
}

export function createTradeWaves(pool: PoolScenario, seed = 2403): TradeWave[] {
  const random = randomSequence(seed + pool.id.length * 97)
  return WAVE_TIMES.map((impactAt, index) => {
    const kind: WaveKind = index === WAVE_TIMES.length - 1 ? 'whale' : index === 6 ? 'volatility' : 'standard'
    const kindScale = kind === 'whale' ? 2.7 : kind === 'volatility' ? 1.7 : 1
    const direction = random() > 0.48 ? 'buy' : 'sell'
    const movePct = pool.volatility * (0.48 + random() * 0.72) * kindScale
    const sizeUsd = Math.round((180_000 + random() * 720_000) * kindScale)
    const feeValue = (8 + sizeUsd / 48_000) * pool.feeScale * kindScale
    return { id: index + 1, impactAt, warningAt: impactAt - WARNING_SECONDS, direction, sizeUsd, movePct, feeValue, kind }
  })
}
