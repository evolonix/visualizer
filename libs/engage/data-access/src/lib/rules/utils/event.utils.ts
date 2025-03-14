import { RuleEvent } from '@engage/remote-api';

const EVENT_DISPLAY_MAPPINGS: { [key: string]: string } = {
  'Pathway Completed': 'User Completes Pathway',
  'Onboarding Completed': 'User Completes Onboarding',
  'Opportunity Mentor Requested': 'User Requested as Mentor',
  'Mentorship Completed': 'User Completes Mentorship',
};

/**
 * Maps event name to friendly display name.  If the event name does not match the lookup
 * we'll default to use the event name as the display name.
 */
export const makeEventDisplay = (eventName: string): RuleEvent => {
  const displayName = EVENT_DISPLAY_MAPPINGS[eventName] ?? eventName;
  return { name: eventName, displayName };
};
