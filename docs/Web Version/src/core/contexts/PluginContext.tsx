/**
 * Plugin Context
 * 
 * React context for accessing the plugin manager throughout the app.
 */

import { createContext, useContext, ReactNode } from 'react';
import { PluginManager } from '@/core/lib/plugin-manager';

export const PluginContext = createContext<PluginManager | null>(null);

interface PluginProviderProps {
  children: ReactNode;
  manager: PluginManager;
}

export function PluginProvider({ children, manager }: PluginProviderProps) {
  return (
    <PluginContext.Provider value={manager}>
      {children}
    </PluginContext.Provider>
  );
}

export function usePluginManager(): PluginManager {
  const manager = useContext(PluginContext);
  
  if (!manager) {
    throw new Error('usePluginManager must be used within PluginProvider');
  }
  
  return manager;
}
