import { POOLS } from '../data/pools'
import type { PoolId } from '../game/types'

interface Props { onSelect: (id: PoolId) => void }

export function PoolSelect({ onSelect }: Props) {
  return <main className="selection-screen screen-enter">
    <header className="selection-header"><div><p className="eyebrow">Choose the arena</p><h1>Three markets.<br/>Three kinds of danger.</h1></div><p>Idle LP will use the same wide range every round. Your advantage is precision.</p></header>
    <div className="pool-deck">
      {POOLS.map((pool, index) => <button className="pool-option" key={pool.id} onClick={() => onSelect(pool.id)} style={{'--pool-accent': pool.accent} as React.CSSProperties}>
        <span className="pool-number">0{index + 1}</span><span className="risk-tag">{pool.riskLabel}</span>
        <div className="pool-orbit"><i/><span>{pool.pair.split(' / ')[0]}</span><span>{pool.pair.split(' / ')[1]}</span></div>
        <h2>{pool.name}</h2><strong>{pool.pair}</strong><p>{pool.description}</p>
        <div className="pool-data"><span><small>START PRICE</small>{pool.basePrice.toLocaleString(undefined,{maximumFractionDigits:2})}</span><span><small>FEE POWER</small>{pool.feeScale.toFixed(2)}×</span></div>
        <span className="select-label">Select with {index + 1}</span>
      </button>)}
    </div>
  </main>
}
