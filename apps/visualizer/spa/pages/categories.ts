/**
 * This is a list of the categories and previews data that is used in the visualizer.
 */

import { Category } from '../src/data';

const apollo = {
  id: 'apollo',
  name: 'Apollo',
  previews: [
    {
      id: 'grid',
      name: 'Grid',
    },
    {
      id: 'grid-with-navigation',
      name: 'Grid w/ Navigation',
    },
    {
      id: 'navigation-learner',
      name: 'Navigation (Learner)',
    },
    {
      id: 'navigation-admin',
      name: 'Navigation (Admin)',
    },
    {
      id: 'dropdown',
      name: 'Dropdown',
    },
    {
      id: 'badges',
      name: 'Badges',
    },
    {
      id: 'buttons',
      name: 'Buttons',
    },
    {
      id: 'text-inputs',
      name: 'Text Inputs',
    },
    {
      id: 'radio-buttons',
      name: 'Radio Buttons',
    },
    {
      id: 'toasts',
      name: 'Toasts',
    },
    {
      id: 'simple-modals',
      name: 'Simple Modals',
    },
  ],
};

const skillsPlatform = {
  id: 'skills-platform',
  name: 'Degreed Skills',
  previews: [
    {
      id: 'home',
      name: 'Home',
    },
    {
      id: 'skill-list',
      name: 'Skill List',
    },
    {
      id: 'publish-scales',
      name: 'Publish Scales',
    },
    {
      id: 'create-novel-skill-details',
      name: 'Create Novel Skill Details',
    },
    {
      id: 'create-novel-skill-settings',
      name: 'Create Novel Skill Settings',
    },
    {
      id: 'edit-novel-skill',
      name: 'Edit Novel Skill',
    },
    {
      id: 'skill-details',
      name: 'Skill Details',
    },
    {
      id: 'skill-sources',
      name: 'Skill Sources',
    },
  ],
};

const learnerHub = {
  id: 'learner-hub',
  name: 'Learner Hub',
  previews: [
    {
      id: 'link-cards',
      name: 'Link Cards',
    },
    {
      id: 'assigned-cards',
      name: 'Assigned Cards',
    },
    {
      id: 'activity-cards',
      name: 'Activity Cards',
    },
    {
      id: 'learner-hub-home',
      name: 'Learner Hub Home',
    },
    {
      id: 'learner-hub-home-loading',
      name: 'Learner Hub Home Loading',
    },
    {
      id: 'dismiss-modal',
      name: 'Dismiss Modal',
    },
    {
      id: 'report-a-problem-modal',
      name: 'Report a Problem Modal',
    },
    {
      id: 'add-to-plan-modal',
      name: 'Add to Plan Modal',
    },
    {
      id: 'add-to-pathway-modal',
      name: 'Add to Pathway Modal',
    },
    {
      id: 'learning-tabs',
      name: 'Learning Tabs',
    },
    {
      id: 'skills-sections',
      name: 'Skills Sections',
    },
    {
      id: 'assignments',
      name: 'Assignments',
    },
    {
      id: 'opportunities',
      name: 'Opportunities',
    },
    {
      id: 'connect',
      name: 'Connect',
    },
  ],
};

const sessionManagement = {
  id: 'session-management',
  name: 'Session Management',
  previews: [
    {
      id: 'session-management-default',
      name: '1. Default',
    },
    {
      id: 'session-management-changes',
      name: '2. Changes',
    },
    {
      id: 'session-management-confirm',
      name: '3. Confirmation Dialog',
    },
    {
      id: 'session-management-success',
      name: '4. Success Toast',
    },
  ],
};

const branding = {
  id: 'branding',
  name: 'Branding',
  previews: [
    {
      id: 'navigation-skeletons',
      name: '1. Navigation Skeletons',
      designUrl: 'https://www.figma.com/design/omP1p0TtLGYzkVGs5lqp03/LXP-Nav-(Q3-Pre-Release)?node-id=8341-6181&node-type=frame&m=dev',
    },
    {
      id: 'navigation-default',
      name: '2. Navigation Default',
      designUrl: 'https://www.figma.com/design/omP1p0TtLGYzkVGs5lqp03/LXP-Nav-(Q3-Pre-Release)?node-id=8341-6181&node-type=frame&m=dev',
    },
    {
      id: 'navigation-loading',
      name: '3. Navigation Loading',
      designUrl: 'https://www.figma.com/design/omP1p0TtLGYzkVGs5lqp03/LXP-Nav-(Q3-Pre-Release)?node-id=8342-8091&node-type=frame&m=dev',
    },
    {
      id: 'navigation-complete',
      name: '4. Navigation Complete',
      designUrl: 'https://www.figma.com/design/omP1p0TtLGYzkVGs5lqp03/LXP-Nav-(Q3-Pre-Release)?node-id=8322-5484&node-type=frame&m=dev',
    },
    {
      id: 'endorsements',
      name: 'Endorsements',
    },
    {
      id: 'org-name',
      name: 'Org Name',
    },
    {
      id: 'publish-changes-modal',
      name: 'Publish Changes Modal',
    },
    {
      id: 'unpublished-changes-modal',
      name: 'Unpublished Changes Modal',
    },
  ],
};

const catalogDashboard = {
  id: 'catalog-dashboard',
  name: 'Catalog Dashboard',
  previews: [
    {
      id: 'breadcrumbs',
      name: 'Breadcrumbs',
    },
    {
      id: 'content-skill-suggestions',
      name: 'Content Skill Suggestions',
    },
    {
      id: 'skill-suggestions-drawer',
      name: 'Skill Suggestions Drawer',
    },
    {
      id: 'confirm-bulk-tagging',
      name: 'Confirm Bulk Tagging',
    },
    {
      id: 'bulk-add-in-progress',
      name: 'Bulk Add In Progress',
    },
    {
      id: 'bulk-add-successful',
      name: 'Bulk Add Successful',
    },
    {
      id: 'bulk-add-error',
      name: 'Bulk Add Error',
    },
  ],
};

export default [apollo, skillsPlatform, learnerHub, sessionManagement, branding, catalogDashboard] satisfies Category[];
