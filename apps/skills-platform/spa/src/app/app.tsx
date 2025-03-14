import { Navigate, Route, Routes } from 'react-router-dom';

import { Layout } from '@degreed/apollo-react-cdk';
import { useApolloLayout_SkaaS } from '@degreed/apollo-react-data-access';

import { inject } from '@degreed/core-react';
import { NxBootstrapToken, NxSkillsPlatformBootstrap } from '@skills/data-access';

import { AuthProvider, buildInjector } from '@skills/data-access';
import { MappingDetails, MappingEditor, Publish, ScaleDashboard, ScaleDetails, ScaleEditor, ScalesLayout } from '@skills/ui-scales';
import { SkillDashboard } from '@skills/ui-skills';

import { LAYOUT_OPTIONS } from './app.layout-options';

// Configure DI system
buildInjector();

export function App() {
  const { lang } = inject<NxSkillsPlatformBootstrap>(NxBootstrapToken);
  const { layoutAspect } = useApolloLayout_SkaaS(lang, LAYOUT_OPTIONS);

  return layoutAspect ? (
    <AuthProvider>
      <Layout configuration={layoutAspect}>
        <Routes>
          <Route>
            <Route path="skills">
              <Route index element={<SkillDashboard />} />
            </Route>
            <Route path="scales" element={<ScalesLayout />}>
              <Route index element={<ScaleDashboard />} />
              <Route path="new" element={<ScaleEditor />} />
              <Route path=":scaleId" element={<ScaleDetails />} />
              <Route path=":scaleId/edit" element={<ScaleEditor />} />
              <Route path="mapping">
                <Route index element={<MappingDetails />} />
                <Route path="edit" element={<MappingEditor />} />
              </Route>
            </Route>
            <Route path="publish" element={<Publish />} />

            <Route path="*" element={<Navigate to="/scales" />} />
          </Route>
        </Routes>
      </Layout>
    </AuthProvider>
  ) : null;
}

export default App;
