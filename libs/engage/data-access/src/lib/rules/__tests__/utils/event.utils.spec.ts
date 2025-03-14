import { makeEventDisplay } from '../../utils';

describe('makeEventDisplay', () => {
  it('should return an object with a mapped event name', () => {
    expect(makeEventDisplay('Onboarding Completed')).toEqual({
      name: 'Onboarding Completed',
      displayName: 'User Completes Onboarding',
    });
  });

  it('should return an object with an unmapped event name', () => {
    expect(makeEventDisplay('Unmapped')).toEqual({
      name: 'Unmapped',
      displayName: 'Unmapped',
    });
  });
});
