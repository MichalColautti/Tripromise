import { createContext, useMemo, useState } from 'react';

import * as authService from '../services/authService';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const value = useMemo(
    () => ({
      user,
      logIn: async (email, password) => {
        setUser(await authService.logIn(email, password));
      },
      register: async (data) => {
        setUser(await authService.register(data));
      },
      logOut: async () => {
        await authService.logOut();
        setUser(null);
      },
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
