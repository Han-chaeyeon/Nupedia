import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const OMDB_KEY_VALUE = 'c31378ff';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],

  define: {
    'import.meta.env.VITE_OMDB_API_KEY': JSON.stringify(OMDB_KEY_VALUE)
  }
})

