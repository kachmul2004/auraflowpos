import { Plugin } from '../../core/lib/types/plugin.types';
import { TrendingUp } from 'lucide-react';

export const employeePerformancePlugin: Plugin = {
  id: 'employee-performance',
  name: 'Employee Performance Tracking',
  description: 'Comprehensive employee performance analytics with sales metrics, goal tracking, leaderboards, and commission calculations',
  version: '1.0.0',
  category: 'analytics',
  icon: TrendingUp,
  author: 'AuraFlow',
  enabled: true,
  config: {
    metrics: {
      trackSales: true,
      trackTransactions: true,
      trackAverageOrderValue: true,
      trackItemsPerTransaction: true,
      trackRefunds: true,
      trackVoids: true,
      trackDiscounts: true,
      trackUpsells: true,
      trackCustomerSatisfaction: false, // Future feature
      trackSpeed: true, // Transaction processing speed
      trackAccuracy: true, // Cash handling accuracy
    },
    goals: {
      enableGoals: true,
      goalPeriod: 'monthly', // 'daily', 'weekly', 'monthly', 'quarterly'
      autoResetGoals: true,
      goalTypes: ['revenue', 'transactions', 'items_sold', 'customer_count'],
      enableStreaks: true, // Track goal achievement streaks
      enableBadges: true, // Achievement badges
    },
    leaderboard: {
      enabled: true,
      updateFrequency: 'realtime', // 'realtime', 'hourly', 'daily'
      categories: ['revenue', 'transactions', 'aov', 'upsells'],
      showTop: 10,
      allowAnonymous: false,
      displayMode: 'all', // 'all', 'top-only', 'team-based'
    },
    commission: {
      enabled: false, // Coming soon
      structure: 'tiered', // 'flat', 'percentage', 'tiered'
      rate: 0, // Percentage or flat amount
      minimumThreshold: 0,
      tiers: [],
      payPeriod: 'monthly'
    },
    notifications: {
      goalAchieved: true,
      topPerformer: true,
      underPerformance: false,
      dailySummary: false,
      weeklySummary: true,
      monthlySummary: true
    },
    privacy: {
      allowEmployeeSelfView: true,
      hideOtherEmployeesData: false,
      anonymizeLeaderboard: false,
      requireManagerApproval: false
    },
    reporting: {
      enableComparative: true,
      enableTrends: true,
      enableForecasting: false, // Future ML feature
      comparisonPeriods: ['day', 'week', 'month', 'quarter', 'year'],
      exportFormats: ['csv', 'pdf', 'excel']
    },
    gamification: {
      enablePoints: false, // Future feature
      enableLevels: false,
      enableChallenges: false,
      enableTeamCompetitions: false
    }
  },
  requiredPermissions: ['view_reports', 'view_employees'],
  dependencies: [],
  optionalDependencies: ['analytics-reporting', 'multi-location'],
  industries: ['restaurant', 'retail', 'cafe', 'pharmacy', 'salon', 'general', 'ultimate'],
  packageTier: 'professional',
  routes: [
    {
      path: '/admin/employees/performance',
      component: 'EmployeePerformance'
    },
    {
      path: '/admin/employees/performance/:id',
      component: 'EmployeeDetails'
    }
  ],
  adminNavigation: {
    label: 'Employee Performance',
    icon: TrendingUp,
    path: '/admin/employees/performance',
    section: 'analytics',
    order: 3
  },
  features: [
    'Individual employee metrics',
    'Sales performance tracking',
    'Transaction analytics',
    'Average order value (AOV) tracking',
    'Items per transaction',
    'Refund and void tracking',
    'Discount usage monitoring',
    'Upsell effectiveness',
    'Processing speed metrics',
    'Cash handling accuracy',
    'Performance leaderboards',
    'Employee rankings',
    'Goal setting and tracking',
    'Goal achievement badges',
    'Streak tracking',
    'Comparative analytics',
    'Period-over-period comparison',
    'Shift-level performance',
    'Time-based analysis',
    'Performance trends',
    'Top performer identification',
    'Underperformance alerts',
    'Export capabilities',
    'Commission calculations (planned)',
    'Team competitions (planned)',
    'Customer satisfaction tracking (planned)'
  ],
  settings: [
    {
      key: 'metrics.trackSales',
      label: 'Track Sales Performance',
      type: 'boolean',
      defaultValue: true,
      description: 'Monitor employee sales metrics'
    },
    {
      key: 'goals.enableGoals',
      label: 'Enable Goal Tracking',
      type: 'boolean',
      defaultValue: true,
      description: 'Set and track employee performance goals'
    },
    {
      key: 'goals.goalPeriod',
      label: 'Goal Period',
      type: 'select',
      options: [
        { label: 'Daily', value: 'daily' },
        { label: 'Weekly', value: 'weekly' },
        { label: 'Monthly', value: 'monthly' },
        { label: 'Quarterly', value: 'quarterly' }
      ],
      defaultValue: 'monthly',
      description: 'How often goals reset'
    },
    {
      key: 'leaderboard.enabled',
      label: 'Enable Leaderboards',
      type: 'boolean',
      defaultValue: true,
      description: 'Show employee performance rankings'
    },
    {
      key: 'leaderboard.showTop',
      label: 'Leaderboard Size',
      type: 'number',
      defaultValue: 10,
      description: 'Number of top performers to display'
    },
    {
      key: 'privacy.allowEmployeeSelfView',
      label: 'Allow Employee Self-View',
      type: 'boolean',
      defaultValue: true,
      description: 'Employees can view their own performance'
    },
    {
      key: 'privacy.hideOtherEmployeesData',
      label: 'Hide Other Employees',
      type: 'boolean',
      defaultValue: false,
      description: 'Employees cannot see others\' performance'
    }
  ],
  businessBenefits: [
    'Identify top performers for recognition and promotion',
    'Detect training needs through performance gaps',
    'Increase motivation through leaderboards and goals',
    'Optimize staffing based on performance data',
    'Reduce turnover by recognizing high performers',
    'Improve average transaction value through tracking',
    'Calculate accurate commission and bonuses',
    'Make data-driven hiring decisions',
    'Benchmark performance across locations',
    'Identify best practices from top performers'
  ],
  useCases: [
    'Monthly performance reviews',
    'Sales contests and competitions',
    'Commission calculations',
    'Training needs assessment',
    'Promotion decisions',
    'Recognition programs',
    'Scheduling optimization',
    'Performance improvement plans',
    'Bonus allocation',
    'Best practice identification'
  ],
  metrics: {
    totalSales: 'Total revenue per employee',
    transactionCount: 'Number of transactions processed',
    averageOrderValue: 'Average transaction amount',
    itemsPerTransaction: 'Average items sold per transaction',
    upsellRate: 'Percentage of upsells',
    refundRate: 'Percentage of refunds',
    voidRate: 'Percentage of voided transactions',
    processingSpeed: 'Average transaction time',
    goalAchievementRate: 'Percentage of goals achieved',
    performanceScore: 'Overall performance score (0-100)'
  },
  dataSchema: {
    employeePerformance: {
      employeeId: 'string',
      employeeName: 'string',
      period: 'string',
      metrics: {
        totalSales: 'number',
        transactionCount: 'number',
        averageOrderValue: 'number',
        itemsSold: 'number',
        itemsPerTransaction: 'number',
        refunds: 'number',
        voids: 'number',
        discountsGiven: 'number',
        upsells: 'number'
      },
      goals: {
        salesGoal: 'number',
        salesActual: 'number',
        transactionGoal: 'number',
        transactionActual: 'number'
      },
      ranking: 'number',
      performanceScore: 'number'
    }
  }
};
