import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';

// A dashboard-only preview entry; the regular dev server and production site
// still serve the public landing page at / and the workspace at /dashboard.
const dashboardPreview: Plugin = {
  name: 'dashboard-preview-entry',
  apply: 'serve',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      if (req.url !== '/') return next();
      res.writeHead(302, { Location: '/dashboard' });
      res.end();
    });
  },
};

export default defineConfig(({ mode }) => ({
  plugins: [react(), ...(mode === 'dashboard' ? [dashboardPreview] : [])],
  server: { host: '0.0.0.0', allowedHosts: ['.e2b.app'] },
}));
