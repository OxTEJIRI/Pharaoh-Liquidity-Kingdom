import { useEffect, useRef, useState } from 'react'
import type { RoundState } from '../game/types'
import { audioManager, type SoundEvent } from './AudioManager'

export function useGameAudio(round: RoundState | null) {
  const [muted, setMutedState] = useState(false)
  const [volume, setVolumeState] = useState(.55)
  const previousNonce = useRef(0)
  const warningSecond = useRef<number | null>(null)
  const finished = useRef(false)

  useEffect(() => {
    if (!round) return
    const wave = round.waves[round.nextWaveIndex]
    if (round.status === 'warning' && wave) {
      const second = Math.ceil(wave.impactAt - round.elapsed)
      if (warningSecond.current !== second) {
        warningSecond.current = second
        audioManager.play(second === 3 && wave.kind === 'whale' ? 'whale' : second === 3 && wave.kind === 'volatility' ? 'volatility' : 'warning')
      }
    } else warningSecond.current = null

    if (round.eventNonce !== previousNonce.current) {
      previousNonce.current = round.eventNonce
      if (round.status === 'caught') audioManager.play('caught')
      if (round.status === 'missed') audioManager.play('missed')
    }
    if (round.finished && !finished.current) {
      finished.current = true
      audioManager.play(round.status === 'victory' ? 'victory' : 'defeat')
    }
  }, [round])

  const play = (event: SoundEvent) => audioManager.play(event)
  const setMuted = (value: boolean) => { setMutedState(value); audioManager.setMuted(value) }
  const setVolume = (value: number) => { setVolumeState(value); audioManager.setVolume(value) }
  const reset = () => { previousNonce.current = 0; warningSecond.current = null; finished.current = false }
  return { muted, volume, play, setMuted, setVolume, reset }
}
