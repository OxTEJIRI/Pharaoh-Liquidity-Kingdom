import type { PoolScenario } from '../game/types'

export const POOLS: PoolScenario[] = [
  {
    id: 'stable',
    name: 'Stable Market',
    pair: 'sAVAX / USDC',
    description: 'Small moves, dense caravan traffic, lower individual fees.',
    riskLabel: 'Low volatility',
    basePrice: 27.5,
    volatility: 0.022,
    feeScale: 0.86,
    initialHalfWidth: 2.5,
    accent: '#38d9a9',
  },
  {
    id: 'volatile',
    name: 'Volatile Market',
    pair: 'BTC.b / AVAX',
    description: 'Violent price jumps and rich fees reward decisive keepers.',
    riskLabel: 'High volatility',
    basePrice: 3450,
    volatility: 0.068,
    feeScale: 1.32,
    initialHalfWidth: 380,
    accent: '#e84142',
  },
  {
    id: 'new-pool',
    name: 'New Pool',
    pair: 'KING / AVAX',
    description: 'Thin early liquidity creates unpredictable, lucrative waves.',
    riskLabel: 'Uncharted',
    basePrice: 12.4,
    volatility: 0.09,
    feeScale: 1.58,
    initialHalfWidth: 1.8,
    accent: '#d4af37',
  },
]

export const getPool = (id: PoolScenario['id']) => POOLS.find((pool) => pool.id === id) ?? POOLS[0]
