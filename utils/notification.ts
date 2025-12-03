/**
 * Notification Sound Manager
 * Plays a simple notification sound when admin gets a notification
 */

export const playNotificationSound = (): void => {
  // Create a simple beep sound using Web Audio API
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Frequency for the beep (in Hz)
  const frequency = 800;
  const duration = 0.2; // 200ms
  
  // Create oscillator and gain nodes
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  // Configure sound
  oscillator.frequency.value = frequency;
  oscillator.type = 'sine';
  
  // Create envelope (fade in/out)
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
  
  // Play the sound
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

export const playNotificationSoundDouble = (): void => {
  // Play two beeps for more noticeable notification
  playNotificationSound();
  setTimeout(() => {
    playNotificationSound();
  }, 250);
};
