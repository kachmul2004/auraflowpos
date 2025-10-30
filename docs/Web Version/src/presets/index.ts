/**
 * Preset Registry
 * 
 * Central registry of all industry presets.
 */

import { Preset, PresetRegistry } from '../core/lib/types/plugin.types';
import { restaurantPreset } from './restaurant.preset';
import { retailPreset } from './retail.preset';
import { pharmacyPreset } from './pharmacy.preset';
import { cafePreset } from './cafe.preset';
import { salonPreset } from './salon.preset';
import { barPreset } from './bar.preset';
import { generalPreset } from './general.preset';
import { ultimatePreset } from './ultimate.preset';

export const presets: PresetRegistry = {
  restaurant: restaurantPreset,
  retail: retailPreset,
  pharmacy: pharmacyPreset,
  cafe: cafePreset,
  salon: salonPreset,
  bar: barPreset,
  general: generalPreset,
  ultimate: ultimatePreset,
};

export function getPreset(id: string): Preset | undefined {
  return presets[id];
}

export function getAllPresets(): Preset[] {
  return Object.values(presets);
}

export function getPresetIds(): string[] {
  return Object.keys(presets);
}

/**
 * Get current preset from settings
 */
export function getCurrentPreset(): Preset {
  if (typeof window === 'undefined') return restaurantPreset;
  
  const stored = localStorage.getItem('auraflow:preset');
  if (stored && presets[stored]) {
    return presets[stored];
  }
  
  return restaurantPreset;
}

/**
 * Save current preset to settings
 */
export function setCurrentPreset(presetId: string): void {
  if (typeof window === 'undefined') return;
  if (!presets[presetId]) {
    console.warn(`Preset ${presetId} not found`);
    return;
  }
  
  localStorage.setItem('auraflow:preset', presetId);
}

// Export individual presets
export { restaurantPreset } from './restaurant.preset';
export { retailPreset } from './retail.preset';
export { pharmacyPreset } from './pharmacy.preset';
export { cafePreset } from './cafe.preset';
export { salonPreset } from './salon.preset';
export { barPreset } from './bar.preset';
export { generalPreset } from './general.preset';
export { ultimatePreset } from './ultimate.preset';