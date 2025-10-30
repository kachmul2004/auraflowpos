/**
 * Audio Utilities for POS System
 * Provides beep sounds and audio feedback
 */

// Simple beep sound using Web Audio API
export const playBeep = (frequency: number = 800, duration: number = 100, volume: number = 0.3) => {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration / 1000);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + duration / 1000);
  } catch (error) {
    console.warn('Audio playback not supported:', error);
  }
};

// Preset sounds
export const sounds = {
  // Product added to cart - pleasant upward beep (increased volume)
  addToCart: () => playBeep(600, 80, 0.5),
  
  // Success - two-tone success sound
  success: () => {
    playBeep(800, 100, 0.5);
    setTimeout(() => playBeep(1000, 100, 0.5), 100);
  },
  
  // Sale complete - "Cha-ching!" sound (three ascending tones)
  saleComplete: () => {
    playBeep(523, 80, 0.5); // C
    setTimeout(() => playBeep(659, 80, 0.5), 80); // E
    setTimeout(() => playBeep(784, 120, 0.5), 160); // G
  },
  
  // Error - lower tone
  error: () => playBeep(300, 200, 0.6),
  
  // Warning - medium tone
  warning: () => playBeep(500, 150, 0.5),
  
  // Scan success - quick high beep
  scan: () => playBeep(1200, 60, 0.5),
  
  // Cash drawer open - double beep
  cashDrawer: () => {
    playBeep(700, 100, 0.5);
    setTimeout(() => playBeep(700, 100, 0.5), 150);
  },
  
  // Button click - subtle
  click: () => playBeep(900, 40, 0.3),
  
  // Remove from cart - descending tone
  removeFromCart: () => playBeep(800, 80, 0.4),
  
  // Checkout initiated - ascending chirp
  checkout: () => {
    playBeep(600, 60, 0.4);
    setTimeout(() => playBeep(800, 60, 0.4), 60);
  },
};

// User preference for sound
let soundEnabled = true;

// Load from localStorage on init
const storedSound = localStorage.getItem('pos-app-settings');
if (storedSound) {
  try {
    const settings = JSON.parse(storedSound);
    soundEnabled = settings.soundEnabled ?? true;
  } catch {
    soundEnabled = true;
  }
}

export const setSoundEnabled = (enabled: boolean) => {
  soundEnabled = enabled;
};

export const isSoundEnabled = (): boolean => {
  return soundEnabled;
};

// Play sound only if enabled
export const playSound = (soundFn: () => void) => {
  if (isSoundEnabled()) {
    soundFn();
  }
};