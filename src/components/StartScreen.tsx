import { LEARNING_GOAL } from '../data/copy'

interface Props { onStart: () => void }

export function StartScreen({ onStart }: Props) {
  return <main className="start-screen screen-enter">
    <div className="start-copy">
      <div className="brand-lockup"><span className="scarab-mark" aria-hidden="true">◇</span><span>PHARAOH'S LIQUIDITY KINGDOM</span></div>
      <p className="eyebrow">Risk-free strategy arena</p>
      <h1>Outsmart the<br/><em>idle liquidity.</em></h1>
      <p className="start-lede">Trader caravans arrive fast. Place your range, catch their flow, and beat Idle LP before the market closes.</p>
      <div className="start-actions"><button className="primary-button" onClick={onStart}>Enter the market</button><span>60 seconds · 10 trade waves</span></div>
      <p className="lesson-line"><b>THE LESSON</b> {LEARNING_GOAL}</p>
    </div>
    <div className="start-arena" aria-hidden="true">
      <div className="sun-dial"><span className="scarab-hero">◇</span><i/><i/><i/></div>
      <div className="rival-card"><small>YOUR RIVAL</small><strong>IDLE LP</strong><span>Wide. Passive. Relentless.</span></div>
    </div>
    <div className="simulation-ribbon">SIMULATION ONLY · NO WALLET · NO REAL ASSETS · NO LIVE TRADING</div>
  </main>
}
