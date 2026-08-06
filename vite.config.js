import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Matches the server's own default (config.js: PORT ?? 3000). Override with
  // API_PROXY_TARGET when the API runs elsewhere — e.g. another project is
  // already using 3000 locally.
  const apiTarget = env.API_PROXY_TARGET || 'http://localhost:3000'

  return {
  plugins: [react(), tailwindcss()],

  server: {
    // Honour PORT when the environment assigns one. Vite does not read it on
    // its own — it defaults to 5173 and fails outright if that is taken — so a
    // harness or container that hands the port over via the environment would
    // otherwise be ignored. Falls back to Vite's default when unset.
    ...(process.env.PORT ? { port: Number(process.env.PORT) } : {}),

    // apiClient.js fetches relative /api paths. Without this proxy every API
    // call under `npm run dev` 404s against the Vite dev server instead of
    // reaching Express.
    //
    // Note this is the API's port, not the dev server's — so the frontend can
    // move to any port without breaking the connection to the backend.
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: false,
      },
    },
  },

  build: {
    rollupOptions: {
      output: {
        // Function form: the object form matched on module id and ended up
        // putting React inside the `icons` chunk, leaving `vendor` at 3.6 KB.
        //
        // The prompt engines are deliberately no longer named here. A named
        // manual chunk that is reachable from the entry gets a
        // <link rel="modulepreload">, so ~145 KB gzip of engine data was being
        // fetched before the user had even signed in. The heavy tabs are lazy
        // now, which lets Rollup emit those engines as true async chunks.
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/scheduler')) {
            return 'vendor'
          }
          if (id.includes('node_modules/lucide-react')) return 'icons'
        },
      },
    },
    chunkSizeWarningLimit: 800,
  },
  }
})
