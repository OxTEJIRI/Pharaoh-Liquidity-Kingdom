export type GamePhase = 'start' | 'pool-select' | 'vote' | 'playing' | 'results'
export type RoundStatus = 'idle' | 'warning' | 'impact' | 'caught' | 'missed' | 'victory' | 'defeat'
export type PoolId = 'stable' | 'volatile' | 'new-pool'
export type WaveKind = 'standard' | 'volatility' | 'whale'
export type Direction = 'buy' | 'sell'
export type VoteId = 'stability' | 'volatility' | 'precision'

export interface PoolScenario {
  id: PoolId
  name: string
  pair: string
  description: string
  riskLabel: string
  basePrice: number
  volatility: number
  feeScale: number
  initialHalfWidth: number
  accent: string
}

export interface TradeWave {
  id: number
  impactAt: number
  warningAt: number
  direction: Direction
  sizeUsd: number
  movePct: number
  feeValue: number
  kind: WaveKind
}

export interface LiquidityRange {
  center: number
  halfWidth: number
}

export interface VoteChoice {
  id: VoteId
  key: string
  title: string
  description: string
  multiplierLabel: string
}

export interface TradeResult {
  wave: TradeWave
  caught: boolean
  playerReward: number
  rivalReward: number
  priceBefore: number
  priceAfter: number
  scoreDelta: number
}

export interface RoundState {
  elapsed: number
  duration: number
  pool: PoolScenario
  vote: VoteId
  waves: TradeWave[]
  nextWaveIndex: number
  price: number
  activeRange: LiquidityRange
  stagedRange: LiquidityRange
  rebalanceCharges: number
  playerScore: number
  rivalScore: number
  playerFees: number
  rivalFees: number
  voteBonus: number
  productiveSeconds: number
  rivalProductiveSeconds: number
  caught: number
  missed: number
  rivalCaught: number
  status: RoundStatus
  lastResult: TradeResult | null
  eventMessage: string
  eventKind: WaveKind | null
  eventNonce: number
  finished: boolean
}

export interface Scorecard {
  winner: 'player' | 'rival'
  margin: number
  playerScore: number
  rivalScore: number
  playerFees: number
  rivalFees: number
  productivePercent: number
  rivalProductivePercent: number
  caught: number
  missed: number
  voteBonus: number
  rank: string
}
