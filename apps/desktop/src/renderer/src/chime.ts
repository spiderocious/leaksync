// The warm arrival chime — synthesized with the Web Audio API so there's no
// audio asset to ship. Two soft sine tones (a gentle major third), short with a
// slow release: "felt, not heard", matching the e-ink stance.
let ctx: AudioContext | null = null;

export const playChime = (): void => {
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    const now = ctx.currentTime;
    const tones = [528, 660]; // C5-ish + E5-ish
    tones.forEach((freq, i) => {
      const osc = ctx!.createOscillator();
      const gain = ctx!.createGain();
      osc.type = 'sine';
      osc.frequency.value = freq;
      const start = now + i * 0.06;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.09, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.9);
      osc.connect(gain).connect(ctx!.destination);
      osc.start(start);
      osc.stop(start + 0.95);
    });
  } catch {
    // audio unavailable — silently skip
  }
};
