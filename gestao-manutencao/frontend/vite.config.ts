// frontend/vite.config.ts

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// +++ INÍCIO DAS ADIÇÕES +++
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'
// +++ FIM DAS ADIÇÕES +++


// https://vitejs.dev/config/
export default defineConfig({
  // +++ INÍCIO DAS ADIÇÕES +++
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer(),
      ],
    },
  },
  // +++ FIM DAS ADIÇÕES +++
  plugins: [react()],
})