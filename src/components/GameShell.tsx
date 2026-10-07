import type { ReactNode } from 'react'

interface Props { children: ReactNode; time: number; muted: boolean; volume: number; onMute: () => void; onVolume: (value: number) => void }

export function GameShell({ children, time, muted, volume, onMute, onVolume }: Props) {
  return <main className="game-shell">
    <header className="game-header"><div className="mini-brand"><span className="scarab-mark">◇</span><b>LIQUIDITY KINGDOM</b></div><div className="round-clock"><small>MARKET CLOSES IN</small><strong>{Math.max(0, time).toFixed(1)}s</strong></div><div className="audio-controls"><button aria-label={muted ? 'Unmute game audio' : 'Mute game audio'} onClick={onMute}>{muted ? 'SOUND OFF' : 'SOUND ON'}</button><input aria-label="Game audio volume" type="range" min="0" max="1" step="0.05" value={volume} onChange={(event) => onVolume(Number(event.target.value))}/></div></header>
    {children}
    <footer className="game-footer"><span>← → MOVE</span><span>↑ NARROW</span><span>↓ WIDEN</span><span>SPACE DEPLOY</span><b>SIMULATION ONLY</b></footer>
  </main>
}
