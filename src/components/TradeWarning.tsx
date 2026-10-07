import type { RoundState } from '../game/types'
import { upcomingWave } from '../game/simulation'

export function TradeWarning({ round }: { round: RoundState }) {
  const wave = upcomingWave(round)
  if (!wave) return <section className="trade-warning empty"><span>All caravans processed</span></section>
  const countdown = Math.max(0, wave.impactAt - round.elapsed)
  const visible = countdown <= 3
  return <section className={`trade-warning ${visible ? `visible ${wave.kind}` : ''}`} aria-live="polite">
    <div className="warning-label"><i/><span>{wave.kind === 'whale' ? 'WHALE ALERT' : wave.kind === 'volatility' ? 'VOLATILITY SPIKE' : 'CARAVAN INBOUND'}</span></div>
    <div className="warning-count"><strong>{visible ? countdown.toFixed(1) : '—'}</strong><small>SECONDS</small></div>
    <div className="warning-stat"><small>DIRECTION</small><strong className={wave.direction}>{wave.direction === 'buy' ? 'BUYING' : 'SELLING'}</strong></div>
    <div className="warning-stat"><small>TRADE SIZE</small><strong>${(wave.sizeUsd / 1000).toFixed(0)}K</strong></div>
    <div className="warning-stat"><small>EXPECTED MOVE</small><strong>{wave.direction === 'buy' ? '+' : '−'}{(wave.movePct * 100).toFixed(1)}%</strong></div>
    <div className="warning-stat reward"><small>FEE VALUE</small><strong>{wave.feeValue.toFixed(1)}</strong></div>
  </section>
}
