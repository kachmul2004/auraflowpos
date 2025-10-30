import { Plugin } from '../../core/lib/types/plugin.types';
import { BarChart3 } from 'lucide-react';

export const analyticsReportingPlugin: Plugin = {
  id: 'analytics-reporting',
  name: 'Analytics & Reporting',
  description: 'Advanced business intelligence with real-time analytics, sales trends, and custom reports',
  version: '1.0.0',
  category: 'analytics',
  icon: BarChart3,
  author: 'AuraFlow',
  enabled: true,
  config: {
    refreshInterval: 30000, // 30 seconds
    defaultDateRange: 'last7days',
    enableRealTime: true,
    enableForecasting: true,
    enableExport: true,
    enableScheduledReports: false, // Future feature
    retentionDays: 90, // How long to keep analytics data
    chartTheme: 'dark',
    defaultMetrics: [
      'totalSales',
      'transactionCount',
      'averageOrderValue',
      'topProducts',
      'customerRetention',
      'salesByHour'
    ],
    dashboardLayout: {
      kpiCards: 4,
      charts: 6,
      tables: 2
    },
    exportFormats: ['csv', 'excel', 'pdf', 'json'],
    notifications: {
      dailySummary: false,
      weeklySummary: false,
      monthlySummary: false,
      alerts: {
        lowSales: false,
        highRefunds: false,
        inventoryAlerts: false
      }
    }
  },
  requiredPermissions: ['view_reports', 'view_analytics'],
  dependencies: [],
  industries: ['restaurant', 'retail', 'cafe', 'pharmacy', 'salon', 'general', 'ultimate'],
  packageTier: 'professional',
  routes: [
    {
      path: '/admin/analytics',
      component: 'AnalyticsReportingDashboard'
    }
  ],
  adminNavigation: {
    label: 'Analytics',
    icon: BarChart3,
    path: '/admin/analytics',
    section: 'reports',
    order: 1
  },
  features: [
    'Real-time KPI dashboard',
    'Sales trends and forecasting',
    'Product performance analysis',
    'Customer behavior insights',
    'Revenue analytics by period',
    'Custom date range filtering',
    'Export to multiple formats',
    'Comparative analytics (YoY, MoM)',
    'Hourly/Daily/Weekly/Monthly views',
    'Top products and categories',
    'Employee performance metrics',
    'Payment method breakdown',
    'Refund and void tracking',
    'Customer lifetime value',
    'Sales by location (if multi-location enabled)'
  ],
  settings: [
    {
      key: 'refreshInterval',
      label: 'Auto-refresh Interval',
      type: 'select',
      options: [
        { label: '10 seconds', value: 10000 },
        { label: '30 seconds', value: 30000 },
        { label: '1 minute', value: 60000 },
        { label: '5 minutes', value: 300000 },
        { label: 'Manual only', value: 0 }
      ],
      defaultValue: 30000,
      description: 'How often to refresh analytics data automatically'
    },
    {
      key: 'defaultDateRange',
      label: 'Default Date Range',
      type: 'select',
      options: [
        { label: 'Today', value: 'today' },
        { label: 'Yesterday', value: 'yesterday' },
        { label: 'Last 7 Days', value: 'last7days' },
        { label: 'Last 30 Days', value: 'last30days' },
        { label: 'This Month', value: 'thisMonth' },
        { label: 'Last Month', value: 'lastMonth' },
        { label: 'This Year', value: 'thisYear' }
      ],
      defaultValue: 'last7days',
      description: 'Default time period for analytics'
    },
    {
      key: 'enableRealTime',
      label: 'Enable Real-Time Analytics',
      type: 'boolean',
      defaultValue: true,
      description: 'Show live updates as transactions occur'
    },
    {
      key: 'enableForecasting',
      label: 'Enable Sales Forecasting',
      type: 'boolean',
      defaultValue: true,
      description: 'Show predicted sales trends based on historical data'
    },
    {
      key: 'chartTheme',
      label: 'Chart Theme',
      type: 'select',
      options: [
        { label: 'Dark', value: 'dark' },
        { label: 'Light', value: 'light' },
        { label: 'Auto', value: 'auto' }
      ],
      defaultValue: 'dark',
      description: 'Color theme for charts and graphs'
    }
  ],
  businessBenefits: [
    'Make data-driven business decisions',
    'Identify sales trends and opportunities',
    'Optimize inventory based on product performance',
    'Understand customer behavior patterns',
    'Track employee performance and productivity',
    'Monitor business health in real-time',
    'Reduce costs through analytics insights',
    'Increase revenue with forecasting'
  ],
  useCases: [
    'Daily sales performance review',
    'Weekly business health check',
    'Monthly performance reports',
    'Quarterly board presentations',
    'Product mix optimization',
    'Staff scheduling based on busy hours',
    'Marketing campaign effectiveness',
    'Customer retention analysis'
  ]
};
