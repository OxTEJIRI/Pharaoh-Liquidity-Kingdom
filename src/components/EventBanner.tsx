import type { RoundState } from '../game/types'

export function EventBanner({ round }: { round: RoundState }) {
  const resultClass = round.status === 'caught' ? 'caught' : round.status === 'missed' ? 'missed' : round.status === 'warning' ? 'warning' : ''
  return <div className={`event-banner ${resultClass}`} key={round.eventNonce} role="status" aria-live="assertive">
    <span>{round.eventMessage}</span>
    {round.status === 'caught' && <div className="coin-burst" aria-hidden="true">{Array.from({length: 12}, (_, index) => <i key={index} style={{'--coin': index} as React.CSSProperties}>₱</i>)}</div>}
  </div>
}
