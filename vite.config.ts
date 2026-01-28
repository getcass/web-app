import { defineConfig, loadEnv } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')
  const baseFromEnv = env.VITE_BASE?.trim()
  const defaultBase = command === 'build' ? './' : '/'
  const baseRaw = baseFromEnv && baseFromEnv.length > 0 ? baseFromEnv : defaultBase
  const baseNormalized = baseRaw === './' ? './' : baseRaw.endsWith('/') ? baseRaw : `${baseRaw}/`

  return {
    // In build output, default to relative asset URLs so the site works on GitHub
    // Pages (`/repo/`) and when opened from `dist/` directly. Override with
    // `VITE_BASE=/` (or `/repo/`) if you need a fixed base path.
    base: baseNormalized,
    plugins: [
      // The React and Tailwind plugins are both required for Make, even if
      // Tailwind is not being actively used – do not remove them
      react(),
      tailwindcss(),
    ],
    resolve: {
      alias: {
        // Alias @ to the src directory
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
