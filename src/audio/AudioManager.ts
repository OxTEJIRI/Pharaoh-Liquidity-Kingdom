export type SoundEvent = 'round-start' | 'warning' | 'caught' | 'missed' | 'rebalance' | 'volatility' | 'whale' | 'victory' | 'defeat'

type Note = [frequency: number, start: number, duration: number, gain?: number, wave?: OscillatorType]

const PATTERNS: Record<SoundEvent, Note[]> = {
  'round-start': [[196, 0, .1], [294, .1, .11], [392, .22, .2, .16]],
  warning: [[620, 0, .07, .09, 'square']],
  caught: [[440, 0, .09], [660, .07, .12], [880, .16, .22, .14]],
  missed: [[180, 0, .16, .14, 'sawtooth'], [120, .12, .24, .12, 'sawtooth']],
  rebalance: [[240, 0, .08, .08], [360, .05, .11, .09]],
  volatility: [[110, 0, .28, .11, 'sawtooth'], [165, .08, .26, .08, 'square']],
  whale: [[78, 0, .45, .17, 'sawtooth'], [98, .18, .4, .13, 'triangle']],
  victory: [[330, 0, .12], [440, .1, .12], [554, .2, .14], [660, .32, .35, .16]],
  defeat: [[260, 0, .16], [196, .14, .18], [130, .3, .35, .13]],
}

class GameAudioManager {
  private context: AudioContext | null = null
  private muted = false
  private volume = .55

  private ensureContext() {
    if (!this.context) this.context = new AudioContext()
    if (this.context.state === 'suspended') void this.context.resume()
    return this.context
  }

  play(event: SoundEvent) {
    if (this.muted || typeof AudioContext === 'undefined') return
    const context = this.ensureContext()
    const now = context.currentTime
    PATTERNS[event].forEach(([frequency, start, duration, gain = .11, wave = 'triangle']) => {
      const oscillator = context.createOscillator()
      const envelope = context.createGain()
      oscillator.type = wave
      oscillator.frequency.setValueAtTime(frequency, now + start)
      if (event === 'volatility' || event === 'whale') oscillator.frequency.exponentialRampToValueAtTime(frequency * .72, now + start + duration)
      envelope.gain.setValueAtTime(0.0001, now + start)
      envelope.gain.exponentialRampToValueAtTime(Math.max(.0001, gain * this.volume), now + start + .018)
      envelope.gain.exponentialRampToValueAtTime(.0001, now + start + duration)
      oscillator.connect(envelope).connect(context.destination)
      oscillator.start(now + start)
      oscillator.stop(now + start + duration + .03)
    })
  }

  setMuted(value: boolean) { this.muted = value }
  setVolume(value: number) { this.volume = Math.max(0, Math.min(1, value)) }
}

export const audioManager = new GameAudioManager()
