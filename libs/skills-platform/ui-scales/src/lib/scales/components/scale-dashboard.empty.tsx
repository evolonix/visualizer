import { Link } from 'react-router-dom';

import { inject } from '@degreed/core-react';
import { NxBootstrapToken, NxSkillsPlatformBootstrap } from '@skills/data-access';

export const ScaleDashboardEmpty = () => {
  const { assetUrl } = inject<NxSkillsPlatformBootstrap>(NxBootstrapToken);

  return (
    <div className="tw-flex tw-flex-col tw-items-center">
      <img className="tw-mt-32" src={assetUrl('3_Cats_Curious-366x280.png')} alt="" />
      <p className="tw-mb-4 tw-mt-10 tw-font-semibold">No Scale Sources created yet</p>
      <Link className="tw-btn-primary tw-btn-medium" to="/scales/new">
        Create a Scale
      </Link>
    </div>
  );
};
