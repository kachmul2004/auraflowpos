import { Plugin } from '../../core/lib/types/plugin.types';
import { Printer, Settings } from 'lucide-react';

export const hardwarePrinterManagementPlugin: Plugin = {
  id: 'hardware-printer-management',
  name: 'Hardware & Printer Management',
  version: '1.0.0',
  description: 'Configure receipt printers, kitchen printers, and routing rules',
  author: 'AuraFlow Team',
  category: 'hardware',
  
  icon: Printer,
  
  // Admin module configuration
  adminModule: {
    label: 'Hardware & Printers',
    icon: Printer,
    path: '/admin/hardware',
    component: () => import('./components/HardwareManagement').then(m => m.HardwareManagement),
  },
  
  // Settings integration
  settings: {
    label: 'Hardware & Printers',
    icon: Settings,
    component: () => import('./components/HardwareManagement').then(m => m.HardwareManagement),
  },
  
  // Dependencies
  dependencies: [],
  
  // Permissions
  permissions: [
    {
      id: 'manage_printers',
      name: 'Manage Printers',
      description: 'Add, edit, and delete printers',
    },
    {
      id: 'configure_kitchen_routing',
      name: 'Configure Kitchen Routing',
      description: 'Set up kitchen printer routing rules',
    },
    {
      id: 'customize_receipts',
      name: 'Customize Receipts',
      description: 'Customize receipt design and content',
    },
    {
      id: 'view_printer_diagnostics',
      name: 'View Printer Diagnostics',
      description: 'View printer status and error logs',
    },
  ],
  
  // Plugin lifecycle
  async onInstall() {
    console.log('✓ Hardware & Printer Management plugin installed');
  },
  
  async onUninstall() {
    console.log('✓ Hardware & Printer Management plugin uninstalled');
  },
  
  async onEnable() {
    console.log('✓ Hardware & Printer Management plugin enabled');
  },
  
  async onDisable() {
    console.log('✓ Hardware & Printer Management plugin disabled');
  },
};
