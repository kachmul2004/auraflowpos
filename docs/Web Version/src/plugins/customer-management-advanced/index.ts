import { Plugin } from '../../core/lib/types/plugin.types';
import { Users } from 'lucide-react';

export const customerManagementAdvancedPlugin: Plugin = {
  id: 'customer-management-advanced',
  name: 'Advanced Customer Management',
  description: 'Comprehensive customer intelligence with segmentation, RFM analysis, lifecycle tracking, and targeted campaigns',
  version: '1.0.0',
  category: 'customers',
  icon: Users,
  author: 'AuraFlow',
  enabled: true,
  config: {
    segmentation: {
      enableRFM: true, // Recency, Frequency, Monetary analysis
      enableLifecycle: true, // New, Active, At-Risk, Churned, VIP
      enableCustomSegments: true,
      rfmThresholds: {
        recency: {
          recent: 30, // Last 30 days = recent
          moderate: 90, // 30-90 days = moderate
          // > 90 days = inactive
        },
        frequency: {
          low: 2, // < 2 purchases = low
          medium: 5, // 2-5 purchases = medium
          high: 10, // 5-10 purchases = high
          // > 10 = very high
        },
        monetary: {
          low: 50, // < $50 = low value
          medium: 200, // $50-200 = medium value
          high: 500, // $200-500 = high value
          // > $500 = very high value
        }
      },
      lifecycleStages: {
        new: {
          maxDays: 30,
          maxPurchases: 1
        },
        active: {
          minPurchases: 2,
          maxDaysSinceLastPurchase: 60
        },
        atRisk: {
          minDaysSinceLastPurchase: 60,
          maxDaysSinceLastPurchase: 120
        },
        churned: {
          minDaysSinceLastPurchase: 120
        },
        vip: {
          minPurchases: 10,
          minLifetimeValue: 1000
        }
      }
    },
    campaigns: {
      enableTargeting: true,
      enableAutomation: false, // Future feature
      channels: ['email', 'sms', 'in-app'],
      templates: {
        welcome: true,
        winBack: true,
        vipReward: true,
        birthdayOffer: true,
        customPromo: true
      }
    },
    insights: {
      enablePredictions: false, // Future ML feature
      enableBehaviorTracking: true,
      enableCohortAnalysis: true,
      predictChurn: false,
      predictLifetimeValue: false
    },
    privacy: {
      enableGDPR: true,
      dataRetentionDays: 730, // 2 years
      allowExport: true,
      allowDeletion: true,
      requireConsent: true
    },
    notifications: {
      newCustomerAlert: false,
      vipMilestoneAlert: true,
      churnRiskAlert: false,
      campaignResults: true
    }
  },
  requiredPermissions: ['view_customers', 'edit_customers', 'view_analytics'],
  dependencies: [],
  optionalDependencies: ['loyalty-program', 'analytics-reporting'],
  industries: ['restaurant', 'retail', 'cafe', 'pharmacy', 'salon', 'general', 'ultimate'],
  packageTier: 'professional',
  routes: [
    {
      path: '/admin/customers/advanced',
      component: 'AdvancedCustomerManagement'
    }
  ],
  adminNavigation: {
    label: 'Customer Insights',
    icon: Users,
    path: '/admin/customers/advanced',
    section: 'customers',
    order: 2
  },
  features: [
    'RFM Analysis (Recency, Frequency, Monetary)',
    'Customer Lifecycle Stages',
    'Automatic Segmentation',
    'Custom Segment Builder',
    'Customer Value Scoring',
    'Purchase History Deep Dive',
    'Behavior Tracking',
    'Targeted Campaigns',
    'Campaign Templates',
    'Email/SMS Integration (planned)',
    'Customer Tags and Notes',
    'Export Segments',
    'GDPR Compliance Tools',
    'Cohort Analysis',
    'Customer Journey Mapping',
    'Churn Prediction (planned)',
    'Lifetime Value Prediction (planned)'
  ],
  settings: [
    {
      key: 'segmentation.enableRFM',
      label: 'Enable RFM Analysis',
      type: 'boolean',
      defaultValue: true,
      description: 'Use Recency, Frequency, Monetary analysis for customer segmentation'
    },
    {
      key: 'segmentation.enableLifecycle',
      label: 'Enable Lifecycle Stages',
      type: 'boolean',
      defaultValue: true,
      description: 'Track customers through lifecycle stages (New, Active, At-Risk, etc.)'
    },
    {
      key: 'campaigns.enableTargeting',
      label: 'Enable Targeted Campaigns',
      type: 'boolean',
      defaultValue: true,
      description: 'Create and send targeted marketing campaigns to customer segments'
    },
    {
      key: 'privacy.enableGDPR',
      label: 'Enable GDPR Compliance',
      type: 'boolean',
      defaultValue: true,
      description: 'Include GDPR compliance tools (data export, deletion, consent)'
    },
    {
      key: 'privacy.dataRetentionDays',
      label: 'Data Retention Period',
      type: 'number',
      defaultValue: 730,
      description: 'Days to retain customer data (730 = 2 years)'
    }
  ],
  businessBenefits: [
    'Increase customer retention by identifying at-risk customers',
    'Boost revenue with targeted marketing to high-value segments',
    'Reduce churn through proactive engagement',
    'Optimize marketing spend by targeting the right customers',
    'Improve customer lifetime value with personalized experiences',
    'Make data-driven decisions about customer acquisition',
    'Build stronger customer relationships through insights',
    'Comply with privacy regulations (GDPR, CCPA)'
  ],
  useCases: [
    'Win-back campaigns for churned customers',
    'VIP rewards for high-value customers',
    'Welcome series for new customers',
    'Birthday/anniversary offers',
    'Product recommendations based on purchase history',
    'Early access to sales for loyal customers',
    'Referral programs targeting advocates',
    'Seasonal promotions to relevant segments'
  ],
  metrics: {
    customerRetention: 'Percentage of customers who return',
    averageLifetimeValue: 'Average total revenue per customer',
    segmentSize: 'Number of customers in each segment',
    campaignConversion: 'Percentage of campaign recipients who convert',
    churnRate: 'Percentage of customers who stop purchasing',
    customerSatisfaction: 'NPS or satisfaction scores'
  }
};
