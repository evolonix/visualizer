import { createContext, useState } from 'react';

export const AuthContext = createContext({});

// The Provider is defined in the context tree but NOT currently not used by views
// @TODO - should be an authStore and registered in the DI

export const AuthProvider = ({ children }: { children?: React.ReactNode }) => {
  const [auth, setAuth] = useState({});

  return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>;
};
