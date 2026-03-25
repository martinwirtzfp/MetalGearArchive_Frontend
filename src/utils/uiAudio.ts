let audioContext: AudioContext | null = null;

const getAudioContext = (): AudioContext | null => {
  const AC = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) {
    return null;
  }
  if (!audioContext) {
    audioContext = new AC();
  }
  if (audioContext.state === 'suspended') {
    void audioContext.resume();
  }
  return audioContext;
};

export const playUiPulse = (baseFrequency = 620, duration = 0.045): void => {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  const oscillator = context.createOscillator();
  const gainNode = context.createGain();

  oscillator.type = 'triangle';
  oscillator.frequency.value = baseFrequency;

  gainNode.gain.setValueAtTime(0.0001, context.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.08, context.currentTime + 0.004);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration);

  oscillator.connect(gainNode);
  gainNode.connect(context.destination);

  oscillator.start();
  oscillator.stop(context.currentTime + duration);
};

export const initUiAudio = (): void => {
  window.addEventListener(
    'pointerdown',
    () => {
      playUiPulse(560, 0.03);
    },
    { passive: true }
  );
};
