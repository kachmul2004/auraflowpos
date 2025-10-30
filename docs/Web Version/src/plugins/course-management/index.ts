import { Plugin } from '../../core/lib/types/plugin.types';
import { CoursesDialog } from './components/CoursesDialog';

export const courseManagementPlugin: Plugin = {
  id: 'course-management',
  name: 'Course Management',
  version: '1.0.0',
  description: 'Manage order courses (appetizers, entrées, desserts, etc.)',
  author: 'AuraFlow',
  
  components: {
    posView: CoursesDialog,
  },
  
  config: {
    courses: [
      { id: 'appetizer', label: 'Appetizer', order: 1 },
      { id: 'entree', label: 'Entrée', order: 2 },
      { id: 'dessert', label: 'Dessert', order: 3 },
      { id: 'drink', label: 'Drink', order: 0 },
    ],
  },
  
  optionalDependencies: ['kitchen-display'],
  recommendedFor: ['restaurant', 'catering'],
  tier: 'premium',
};

export default courseManagementPlugin;