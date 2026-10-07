import { useCallback, useEffect, useRef, useState } from 'react'
import { useGameAudio } from './audio/useGameAudio'
import { EventBanner } from './components/EventBanner'
import { GameShell } from './components/GameShell'
import { PoolSelect } from './components/PoolSelect'
import { RangeBoard } from './components/RangeBoard'
import { ResultsScreen } from './components/ResultsScreen'
import { ScoreRace } from './components/ScoreRace'
import { StartScreen } from './components/StartScreen'
import { TradeWarning } from './components/TradeWarning'
import { VotePanel } from './components/VotePanel'
import { getPool } from './data/pools'
import { advanceRound, createRound, deployRange, stageAroundPrice, stageRange } from './game/simulation'
import type { GamePhase, PoolId, RoundState, VoteId } from './game/types'

export function App() {
  const [phase, setPhase] = useState<GamePhase>('start')
  const [poolId, setPoolId] = useState<PoolId>('stable')
  const [vote, setVote] = useState<VoteId | null>(null)
  const [round, setRound] = useState<RoundState | null>(null)
  const raf = useRef(0)
  const lastFrame = useRef(0)
  const audio = useGameAudio(round)

  const beginRound = useCallback(() => {
    if (!vote) return
    const next = createRound(getPool(poolId), vote)
    setRound(next)
    setPhase('playing')
    audio.reset()
    audio.play('round-start')
  }, [audio, poolId, vote])

  useEffect(() => {
    if (phase !== 'playing') return
    const frame = (now: number) => {
      if (!lastFrame.current) lastFrame.current = now
      const delta = (now - lastFrame.current) / 1000
      lastFrame.current = now
      setRound((current) => current ? advanceRound(current, delta) : current)
      raf.current = requestAnimationFrame(frame)
    }
    raf.current = requestAnimationFrame(frame)
    return () => { cancelAnimationFrame(raf.current); lastFrame.current = 0 }
  }, [phase])

  useEffect(() => {
    if (round?.finished && phase === 'playing') {
      const timeout = window.setTimeout(() => setPhase('results'), 900)
      return () => window.clearTimeout(timeout)
    }
  }, [round?.finished, phase])

  const modifyRange = useCallback((delta: number, factor = 1) => setRound((current) => current ? stageRange(current, delta, factor) : current), [])
  const centerRange = useCallback(() => setRound((current) => current ? stageAroundPrice(current) : current), [])
  const commitRange = useCallback(() => {
    setRound((current) => current ? deployRange(current) : current)
    audio.play('rebalance')
  }, [audio])

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (phase === 'pool-select' && ['1','2','3'].includes(event.key)) {
        const ids: PoolId[] = ['stable','volatile','new-pool']; setPoolId(ids[Number(event.key)-1]); setPhase('vote')
      } else if (phase === 'vote' && ['1','2','3'].includes(event.key)) {
        const ids: VoteId[] = ['stability','volatility','precision']; setVote(ids[Number(event.key)-1])
      } else if (phase === 'vote' && event.key === 'Enter' && vote) beginRound()
      else if (phase === 'playing') {
        if (event.key === 'ArrowLeft') modifyRange(-getPool(poolId).basePrice * .025)
        if (event.key === 'ArrowRight') modifyRange(getPool(poolId).basePrice * .025)
        if (event.key === 'ArrowUp') modifyRange(0, .82)
        if (event.key === 'ArrowDown') modifyRange(0, 1.2)
        if (event.code === 'Space') { event.preventDefault(); commitRange() }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [beginRound, commitRange, modifyRange, phase, poolId, vote])

  if (phase === 'start') return <StartScreen onStart={() => { audio.play('round-start'); setPhase('pool-select') }}/>
  if (phase === 'pool-select') return <PoolSelect onSelect={(id) => { setPoolId(id); setVote(null); setPhase('vote') }}/>
  if (phase === 'vote') return <VotePanel pool={getPool(poolId)} selected={vote} onSelect={setVote} onContinue={beginRound}/>
  if (phase === 'results' && round) return <ResultsScreen round={round} onReplay={beginRound} onPools={() => setPhase('pool-select')}/>
  if (!round) return null
  return <GameShell time={round.duration - round.elapsed} muted={audio.muted} volume={audio.volume} onMute={() => audio.setMuted(!audio.muted)} onVolume={audio.setVolume}>
    <div className="game-layout">
      <ScoreRace round={round}/>
      <TradeWarning round={round}/>
      <EventBanner round={round}/>
      <RangeBoard round={round} onMove={(delta) => modifyRange(delta)} onWidth={(factor) => modifyRange(0, factor)} onCenter={centerRange} onDeploy={commitRange}/>
      <aside className="round-ledger"><div><small>TRADES CAUGHT</small><strong>{round.caught}<span>/10</span></strong></div><div><small>TRADES MISSED</small><strong>{round.missed}</strong></div><div><small>FEES CAPTURED</small><strong>${round.playerFees.toFixed(2)}</strong></div><div><small>REBALANCE CHARGES</small><strong>{round.rebalanceCharges}<span>/3</span></strong></div></aside>
    </div>
  </GameShell>
}
