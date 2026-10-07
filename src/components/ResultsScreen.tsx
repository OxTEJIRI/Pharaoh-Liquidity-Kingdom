import { createScorecard } from '../game/scoring'
import type { RoundState } from '../game/types'

interface Props { round: RoundState; onReplay: () => void; onPools: () => void }

export function ResultsScreen({ round, onReplay, onPools }: Props) {
  const score = createScorecard(round)
  const metrics = [
    ['Fees captured', `$${score.playerFees.toFixed(2)}`, `$${score.rivalFees.toFixed(2)}`],
    ['Productive liquidity', `${score.productivePercent.toFixed(0)}%`, `${score.rivalProductivePercent.toFixed(0)}%`],
    ['Trades caught', String(score.caught), String(round.rivalCaught)],
    ['Trades missed', String(score.missed), String(10 - round.rivalCaught)],
    ['Vote impact', `+$${score.voteBonus.toFixed(1)}`, 'No vote'],
  ]
  return <main className={`results-screen ${score.winner} screen-enter`}>
    <header className="result-hero"><p className="eyebrow">Round complete</p><h1>{score.winner === 'player' ? 'The kingdom chose' : 'Idle liquidity held'}<br/><em>{score.winner === 'player' ? 'the active keeper.' : 'the stronger line.'}</em></h1><p>{score.winner === 'player' ? `Victory by ${score.margin.toLocaleString()} points. Precision beat passive coverage.` : `Defeat by ${score.margin.toLocaleString()} points. Your range was powerful—but absent too often.`}</p></header>
    <div className="results-grid"><section className="final-score"><div><small>KEEPER RANK</small><strong>{score.rank}</strong></div><div className="score-duel"><span><small>YOU</small><b>{score.playerScore.toLocaleString()}</b></span><i>VS</i><span className="rival"><small>IDLE LP</small><b>{score.rivalScore.toLocaleString()}</b></span></div><p>Tight liquidity multiplies rewards. Productive liquidity keeps that multiplier alive.</p></section><section className="metric-table"><div className="metric-head"><span>ROUND METRIC</span><b>YOU</b><b>IDLE LP</b></div>{metrics.map(([label, player, rival]) => <div className="metric-row" key={label}><span>{label}</span><b>{player}</b><b>{rival}</b></div>)}</section></div>
    <div className="result-actions"><button className="secondary-button" onClick={onPools}>Change market</button><button className="primary-button" onClick={onReplay}>Run it back</button></div>
    <div className="simulation-ribbon">SIMULATION ONLY · NO WALLET · NO REAL ASSETS · NO LIVE TRADING</div>
  </main>
}
