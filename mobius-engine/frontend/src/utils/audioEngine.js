// ============================================================================
// PROJECT MOBIUS: STARK AUDIO ENGINE & SYNTHETIC SOUNDSCAPES
// Web Audio API Procedural Synthesizer + SpeechSynthesis AI Interface
// ============================================================================

class StarkAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true; // Default muted to comply with browser autoplay rules
    this.ambientGainNode = null;
    this.ambientOsc1 = null;
    this.ambientOsc2 = null;
    this.ambientLfo = null;
    this.isAmbientPlaying = false;
    this.voicePersona = 'JARVIS'; // 'JARVIS' | 'FRIDAY'
    this.speechEnabled = true;
    this.lastSpokenText = '';
    this.lastSpokenTime = 0;
  }

  // Initialize or resume AudioContext on user interaction
  initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted) {
    this.isMuted = muted;
    if (this.isMuted) {
      this.stopAmbientHum();
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    } else {
      this.initContext();
      this.startAmbientHum();
      this.playHoloBlip(600, 0.1);
      this.speak("Stark tactical HUD online. All quantum telemetry channels synchronized.");
    }
  }

  setVoicePersona(persona) {
    this.voicePersona = persona;
    if (!this.isMuted && this.speechEnabled) {
      if (persona === 'JARVIS') {
        this.speak("J.A.R.V.I.S. neural protocol active, sir.");
      } else {
        this.speak("F.R.I.D.A.Y. online. Ready to analyze timelines, boss.");
      }
    }
  }

  toggleSpeech(enabled) {
    this.speechEnabled = enabled;
    if (!enabled && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }

  // --------------------------------------------------------------------------
  // PROCEDURAL SFX GENERATION VIA WEB AUDIO API
  // --------------------------------------------------------------------------

  // Holographic UI click / blip
  playHoloBlip(freq = 1400, duration = 0.06) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, now + duration);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + duration);
    } catch {
      // Ignore audio glitches safely
    }
  }

  // Stepping through timeline jump
  playQuantumStep(forward = true) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const startFreq = forward ? 320 : 640;
      const endFreq = forward ? 880 : 280;
      const dur = 0.18;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(endFreq, now + dur);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.Q.value = 3;

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + dur);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + dur);
    } catch {}
  }

  // Critical Incursion / High Entropy Klaxon
  playAlarmKlaxon() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.setValueAtTime(370, now + 0.15);
      osc.frequency.setValueAtTime(440, now + 0.3);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {}
  }

  // Victory / Stone Secured Harmonious Chime
  playVictoryChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const now = this.ctx.currentTime + idx * 0.08;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
      });
    } catch {}
  }

  // Deep Sub-Bass Quantum Gauntlet Snap
  playGauntletSnap() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(28, now + 0.6);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.8);
    } catch {}
  }

  // --------------------------------------------------------------------------
  // AMBIENT REACTOR & QUANTUM FIELD HUM
  // --------------------------------------------------------------------------

  startAmbientHum() {
    if (this.isMuted || this.isAmbientPlaying) return;
    this.initContext();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;

      // Master ambient gain
      this.ambientGainNode = this.ctx.createGain();
      this.ambientGainNode.gain.setValueAtTime(0.0001, now);
      this.ambientGainNode.gain.exponentialRampToValueAtTime(0.035, now + 2); // Soft background drone

      // Sub-bass oscillator (55Hz A1)
      this.ambientOsc1 = this.ctx.createOscillator();
      this.ambientOsc1.type = 'sine';
      this.ambientOsc1.frequency.setValueAtTime(55, now);

      // Warm harmonic oscillator (110Hz A2)
      this.ambientOsc2 = this.ctx.createOscillator();
      this.ambientOsc2.type = 'triangle';
      this.ambientOsc2.frequency.setValueAtTime(110, now);

      // Lowpass filter to muffle harsh harmonics
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, now);

      // LFO for slow throbbing pulse (0.25 Hz = once every 4 seconds)
      this.ambientLfo = this.ctx.createOscillator();
      const lfoGain = this.ctx.createGain();
      this.ambientLfo.frequency.setValueAtTime(0.25, now);
      lfoGain.gain.setValueAtTime(20, now);

      this.ambientLfo.connect(lfoGain);
      lfoGain.connect(filter.frequency);

      this.ambientOsc1.connect(filter);
      this.ambientOsc2.connect(filter);
      filter.connect(this.ambientGainNode);
      this.ambientGainNode.connect(this.ctx.destination);

      this.ambientOsc1.start(now);
      this.ambientOsc2.start(now);
      this.ambientLfo.start(now);
      this.isAmbientPlaying = true;
    } catch (e) {
      console.warn("Ambient hum initialization delayed:", e);
    }
  }

  stopAmbientHum() {
    if (!this.isAmbientPlaying || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      if (this.ambientGainNode) {
        this.ambientGainNode.gain.setValueAtTime(this.ambientGainNode.gain.value, now);
        this.ambientGainNode.gain.exponentialRampToValueAtTime(0.0001, now + 0.8);
      }
      setTimeout(() => {
        if (this.ambientOsc1) {
          try { this.ambientOsc1.stop(); } catch {}
          this.ambientOsc1.disconnect();
          this.ambientOsc1 = null;
        }
        if (this.ambientOsc2) {
          try { this.ambientOsc2.stop(); } catch {}
          this.ambientOsc2.disconnect();
          this.ambientOsc2 = null;
        }
        if (this.ambientLfo) {
          try { this.ambientLfo.stop(); } catch {}
          this.ambientLfo.disconnect();
          this.ambientLfo = null;
        }
        this.isAmbientPlaying = false;
      }, 900);
    } catch {}
  }

  // --------------------------------------------------------------------------
  // STARK AI VOICE SYNTHESIZER (J.A.R.V.I.S. / F.R.I.D.A.Y.)
  // --------------------------------------------------------------------------

  speak(text, priority = false) {
    if (this.isMuted || !this.speechEnabled) return;
    if (!window.speechSynthesis) return;

    // Debounce identical speech within 3 seconds unless prioritized
    const now = Date.now();
    if (!priority && text === this.lastSpokenText && now - this.lastSpokenTime < 3500) {
      return;
    }
    this.lastSpokenText = text;
    this.lastSpokenTime = now;

    try {
      // Cancel previous speech if priority
      if (priority) {
        window.speechSynthesis.cancel();
      }

      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();

      if (this.voicePersona === 'JARVIS') {
        // Look for British / English Male voice
        const jarvisVoice = voices.find(
          v => (v.lang.includes('en-GB') || v.lang.includes('en_GB')) && (v.name.includes('Male') || v.name.includes('George') || v.name.includes('David'))
        ) || voices.find(v => v.lang.includes('en-GB')) || voices.find(v => v.lang.startsWith('en'));

        if (jarvisVoice) utterance.voice = jarvisVoice;
        utterance.pitch = 0.95; // Slightly deeper, refined British tone
        utterance.rate = 1.05;  // Crisp, articulate tempo
      } else {
        // F.R.I.D.A.Y. - Female / Irish or Irish-English tone
        const fridayVoice = voices.find(
          v => (v.lang.includes('en-IE') || v.lang.includes('en-GB')) && (v.name.includes('Female') || v.name.includes('Hazel') || v.name.includes('Susan'))
        ) || voices.find(v => v.name.includes('Female')) || voices.find(v => v.lang.startsWith('en'));

        if (fridayVoice) utterance.voice = fridayVoice;
        utterance.pitch = 1.15; // Bright, precise tone
        utterance.rate = 1.1;   // Rapid, technical tempo
      }

      utterance.volume = 0.85;
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn("Speech synthesis unavailable:", e);
    }
  }
}

// Export singleton instance
export const starkAudio = new StarkAudioEngine();
export default starkAudio;
