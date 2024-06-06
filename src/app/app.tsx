import { useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { AppSearch, Layout } from '../components';
// import configurationJson from '../data/layout.config.json?raw';
import { EventBus, inject } from '../lib';
import { Contact } from './contact/contact';
import { Home } from './home/home';
import { SettingsDashboard } from './settings/settings-dashboard';

// const configuration: LayoutConfiguration = JSON.parse(configurationJson);

export function App() {
  const [openSearch, setOpenSearch] = useState(false);
  const eventBus = inject<EventBus>(EventBus);

  useEffect(() => {
    const unsubscribeSearch = eventBus?.on('search', (e) => {
      console.log(e);
      setOpenSearch((open) => !open);
    });
    const unsubscribeAdd = eventBus?.on('add', (e) => console.log(e));

    return () => {
      unsubscribeSearch?.();
      unsubscribeAdd?.();
    };
  }, [eventBus]);

  return (
    <>
      <Layout
      // configuration={configuration}
      // onSearch={() => {
      //   setOpenSearch((open) => !open);
      // }}
      // onAdd={(e) => {
      //   console.log(e.currentTarget);
      // }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/settings">
            <Route path="dashboard" element={<SettingsDashboard />} />
          </Route>
        </Routes>
      </Layout>

      <AppSearch open={openSearch} onClose={() => setOpenSearch(false)} />
    </>
  );
}

export default App;
