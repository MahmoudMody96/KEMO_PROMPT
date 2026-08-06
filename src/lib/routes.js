// src/lib/routes.js — Path <-> tab mapping for the hand-rolled router.
//
// Lives outside AppContext.jsx so that file exports only components/hooks and
// React Fast Refresh keeps working during development.

/**
 * Every tab that has a URL.
 *
 * `admin` is reachable by path but is rendered by AuthGate outside the normal
 * tab switch, so it appears here for path recognition only.
 */
export const VALID_TABS = [
    'home', 'generator', 'extractor', 'trendhunter', 'promptarchitect',
    'secretvault', 'admin', 'login', 'pricing', 'about', 'services', 'contact',
];

/**
 * Routes an anonymous visitor may open.
 *
 * The landing page is public: the app used to answer every URL with the login
 * form, so a first-time visitor had to create an account before seeing what the
 * product does. Everything that spends credits still requires an account.
 */
export const PUBLIC_TABS = ['home', 'login', 'pricing', 'about', 'services', 'contact'];

export const isPublicTab = (tab) => PUBLIC_TABS.includes(tab);

const normalizePath = (pathname) =>
    (pathname || '/').replace(/^\/+|\/+$/g, '').toLowerCase();

/**
 * The tab a path should render. Unknown paths fall back to 'home' — use
 * isKnownPath to tell a real homepage from a typo.
 */
export const tabFromPath = (pathname) => {
    const path = normalizePath(pathname);
    if (!path) return 'home';
    return VALID_TABS.includes(path) ? path : 'home';
};

/** True when the path names a real tab, or is the root. */
export const isKnownPath = (pathname) => {
    const path = normalizePath(pathname);
    return path === '' || VALID_TABS.includes(path);
};

/** The URL a tab should live at. */
export const pathForTab = (tab) => (tab === 'home' ? '/' : `/${tab}`);
