import { useState } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Layout, Search } from '../components';
import { Contact } from './contact/contact';
import { Home } from './home/home';
import { SettingsDashboard } from './settings/settings-dashboard';

export function App() {
  const [openSearch, setOpenSearch] = useState(false);

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement>) => {
    setOpenSearch((open) => !open);
  };

  const handleAdd = (e: React.MouseEvent<HTMLButtonElement>) => {
    // TODO: Show add dialog
  };

  return (
    <>
      <Layout onSearch={handleSearch} onAdd={handleAdd}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/settings">
            <Route path="dashboard" element={<SettingsDashboard />} />
          </Route>
        </Routes>
      </Layout>

      <Search open={openSearch} onClose={() => setOpenSearch(false)} />
    </>
  );
}

export default App;
