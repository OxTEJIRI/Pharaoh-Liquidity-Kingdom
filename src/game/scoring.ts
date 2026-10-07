import type { RoundState, Scorecard } from './types'

export function createScorecard(state: RoundState): Scorecard {
  const winner = state.playerScore >= state.rivalScore ? 'player' : 'rival'
  const margin = Math.abs(state.playerScore - state.rivalScore)
  const productivePercent = Math.min(100, (state.productiveSeconds / state.duration) * 100)
  const rivalProductivePercent = Math.min(100, (state.rivalProductiveSeconds / state.duration) * 100)
  const rank = state.playerScore >= 1800 ? 'Grand Vizier of Flow' : state.playerScore >= 1250 ? 'Royal Market Keeper' : state.playerScore >= 800 ? 'Caravan Scout' : 'Idle Scribe'
  return {
    winner,
    margin,
    playerScore: state.playerScore,
    rivalScore: state.rivalScore,
    playerFees: state.playerFees,
    rivalFees: state.rivalFees,
    productivePercent,
    rivalProductivePercent,
    caught: state.caught,
    missed: state.missed,
    voteBonus: state.voteBonus,
    rank,
  }
}
