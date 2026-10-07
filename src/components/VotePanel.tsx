import { VOTES } from '../data/copy'
import type { PoolScenario, VoteId } from '../game/types'

interface Props { pool: PoolScenario; selected: VoteId | null; onSelect: (id: VoteId) => void; onContinue: () => void }

export function VotePanel({ pool, selected, onSelect, onContinue }: Props) {
  return <main className="vote-screen screen-enter">
    <div className="vote-intro"><p className="eyebrow">Pre-round incentive vote</p><h1>Choose what<br/><em>the kingdom rewards.</em></h1><p>Your vote changes the multiplier for this round. Read the market before you commit.</p><div className="chosen-pool"><small>SELECTED MARKET</small><strong>{pool.name}</strong><span>{pool.pair}</span></div></div>
    <div className="vote-stack">
      {VOTES.map((vote) => <button key={vote.id} className={`vote-card ${selected === vote.id ? 'selected' : ''}`} onClick={() => onSelect(vote.id)}>
        <span className="keycap">{vote.key}</span><span className="vote-copy"><strong>{vote.title}</strong><small>{vote.description}</small></span><b>{vote.multiplierLabel}</b>
      </button>)}
      <button className="primary-button" disabled={!selected} onClick={onContinue}>Open the market gates</button>
      <p className="control-note">Press 1–3 to vote · Enter to continue</p>
    </div>
  </main>
}
