import type { VoteChoice } from '../game/types'

export const VOTES: VoteChoice[] = [
  { id: 'stability', key: '1', title: 'Stable Emissions', description: 'Every captured trade receives a reliable bonus.', multiplierLabel: '+8% all waves' },
  { id: 'volatility', key: '2', title: 'Storm Bounty', description: 'Volatility spikes and the whale pay dramatically more.', multiplierLabel: '+40% special waves' },
  { id: 'precision', key: '3', title: 'Precision Gauge', description: 'Efficient ranges above 3× receive an extra boost.', multiplierLabel: '+22% tight ranges' },
]

export const LEARNING_GOAL = 'Tight liquidity is powerful only when it stays where trades happen.'
