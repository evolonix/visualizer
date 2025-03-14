import { useEffect } from 'react';

import { inject } from '@degreed/core-react';
import { useObservable } from '@ngneat/react-rxjs';

import { SkillsFacade } from './skills.facade';
import { SkillsAPI, SkillsDataModel } from './skills.state';
import { SkillsUrlSync } from './skills.url-sync';

/**
 * Find scale in memory or load from API or create a new scale
 */
export function useSkillsStore(): [SkillsDataModel, SkillsAPI] {
  const facade = inject<SkillsFacade>(SkillsFacade);
  const urlSync = inject<SkillsUrlSync>(SkillsUrlSync);
  const [vm] = useObservable(facade.vm$.pipe(urlSync.updateUrl));

  // Only do this 1x at component mount
  useEffect(() => {
    urlSync.isEnabled = true;
    urlSync.updateState();

    return () => {
      urlSync.isEnabled = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Expose API from ViewModel for easy access
  const { api, ...model } = vm;
  return [model, api];
}
