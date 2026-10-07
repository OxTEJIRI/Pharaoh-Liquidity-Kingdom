import type { RoundState } from '../game/types'

export function ScoreRace({ round }: { round: RoundState }) {
  const total = Math.max(1, round.playerScore + round.rivalScore)
  const playerShare = Math.max(8, Math.min(92, round.playerScore / total * 100))
  return <section className="score-race">
    <div className="score-player"><span><small>YOU · MARKET KEEPER</small><strong>{round.playerScore.toLocaleString()}</strong></span><i className="player-pip"/></div>
    <div className="race-track"><div className="player-track" style={{width: `${playerShare}%`}}/><span className="race-crown">◇</span></div>
    <div className="score-player rival"><i className="rival-pip"/><span><small>IDLE LP · PASSIVE</small><strong>{round.rivalScore.toLocaleString()}</strong></span></div>
  </section>
}
