import { capitalEfficiency, rangeBounds, rangeSafety } from '../game/balance'
import type { RoundState } from '../game/types'

interface Props { round: RoundState; onMove: (delta: number) => void; onWidth: (factor: number) => void; onCenter: () => void; onDeploy: () => void }

export function RangeBoard({ round, onMove, onWidth, onCenter, onDeploy }: Props) {
  const low = round.pool.basePrice * .58
  const high = round.pool.basePrice * 1.42
  const toPercent = (price: number) => ((price - low) / (high - low)) * 100
  const active = rangeBounds(round.activeRange)
  const staged = rangeBounds(round.stagedRange)
  const efficiency = capitalEfficiency(round.stagedRange, round.price)
  const stagedChanged = Math.abs(round.stagedRange.center - round.activeRange.center) > .0001 || Math.abs(round.stagedRange.halfWidth - round.activeRange.halfWidth) > .0001
  const pricePosition = Math.max(0, Math.min(100, toPercent(round.price)))
  return <section className="range-board">
    <div className="board-heading"><div><p className="eyebrow">Active liquidity corridor</p><h2>{round.pool.pair}</h2></div><div className="current-price"><small>MARKET PRICE</small><strong>{round.price.toLocaleString(undefined,{maximumFractionDigits:2})}</strong></div></div>
    <div className="market-lane">
      <div className="lane-grid"/>
      <div className="active-range" style={{left: `${toPercent(active.min)}%`, width: `${toPercent(active.max) - toPercent(active.min)}%`}}><span>ACTIVE</span></div>
      <div className={`staged-range ${stagedChanged ? 'changed' : ''}`} style={{left: `${toPercent(staged.min)}%`, width: `${toPercent(staged.max) - toPercent(staged.min)}%`}}><i/><i/></div>
      <div className="price-scarab" style={{left: `${pricePosition}%`}}><span>◇</span><small>{round.price.toFixed(round.price > 100 ? 0 : 2)}</small></div>
      <div className={`caravan ${round.status === 'warning' ? 'approaching' : ''}`}><span>◆◆◆</span><small>CARAVAN</small></div>
    </div>
    <div className="range-numbers"><span>{staged.min.toFixed(round.price > 100 ? 0 : 2)}<small>MIN</small></span><div><small>CAPITAL EFFICIENCY</small><strong>{efficiency.toFixed(1)}×</strong><b>{rangeSafety(round.stagedRange, round.pool)}% safety</b></div><span>{staged.max.toFixed(round.price > 100 ? 0 : 2)}<small>MAX</small></span></div>
    <div className="range-controls">
      <div className="control-cluster"><button onClick={() => onMove(-round.pool.basePrice * .025)} aria-label="Move range left">←</button><button onClick={() => onMove(round.pool.basePrice * .025)} aria-label="Move range right">→</button><span>MOVE RANGE</span></div>
      <div className="control-cluster"><button onClick={() => onWidth(.82)} aria-label="Narrow range">NARROW</button><button onClick={() => onWidth(1.2)} aria-label="Widen range">WIDEN</button><span>RISK / REWARD</span></div>
      <button className="center-button" onClick={onCenter}>CENTER ON PRICE</button>
      <button className={`deploy-button ${stagedChanged ? 'ready' : ''}`} disabled={!stagedChanged || round.rebalanceCharges === 0} onClick={onDeploy}><span>DEPLOY RANGE</span><b>{'◆'.repeat(round.rebalanceCharges)}{'◇'.repeat(3 - round.rebalanceCharges)}</b></button>
    </div>
  </section>
}
