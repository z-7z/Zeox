import { createContext, useContext, useLayoutEffect, useState, type ReactNode } from 'react';

// A non-secret, per-tab UI preference, not authentication or authorization.
// Files, tool history and credentials must never go in Web Storage.
const guestKey = 'zeoxfucator:preview';
type Theme = 'light' | 'dark';
interface SiteSession {
  theme: Theme;
  toggleTheme: () => void;
  guest: boolean;
  enterGuest: () => void;
  endGuest: () => void;
}
const Site = createContext<SiteSession | null>(null);

export function SiteProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('dark');
  const [guest, setGuest] = useState(() => {
    try {
      return sessionStorage.getItem(guestKey) === 'guest';
    } catch {
      return false;
    }
  });
  function changeGuest(active: boolean) {
    try {
      if (active) sessionStorage.setItem(guestKey, 'guest');
      else sessionStorage.removeItem(guestKey);
    } catch {
      /* Storage can be disabled. The preview still works until refresh. */
    }
    setGuest(active);
  }
  // Public pages, workspace surfaces and body-portaled controls share one palette.
  useLayoutEffect(() => {
    document.documentElement.dataset.theme = theme;
    return () => {
      delete document.documentElement.dataset.theme;
    };
  }, [theme]);
  return (
    <Site.Provider
      value={{
        theme,
        toggleTheme: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')),
        guest,
        enterGuest: () => changeGuest(true),
        endGuest: () => changeGuest(false),
      }}
    >
      {children}
    </Site.Provider>
  );
}

export function useSite() {
  const site = useContext(Site);
  if (!site) throw new Error('Missing site session');
  return site;
}
