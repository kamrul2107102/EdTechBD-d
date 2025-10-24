import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: [
      'react-syntax-highlighter',
      'react-syntax-highlighter/dist/esm/languages/hljs/javascript',
      'react-syntax-highlighter/dist/esm/languages/hljs/python',
      'react-syntax-highlighter/dist/esm/styles/hljs'
    ],
    esbuildOptions: {
      plugins: [
        {
          name: 'ignore-refractor',
          setup(build) {
            // Mark refractor imports as external - both lang and lib
            build.onResolve({ filter: /^refractor\/(lang|lib)\// }, () => ({
              path: 'refractor-stub',
              namespace: 'refractor-stub'
            }))
            build.onLoad({ filter: /.*/, namespace: 'refractor-stub' }, () => ({
              contents: 'export const refractor = {}; export default {};',
              loader: 'js'
            }))
          }
        }
      ]
    }
  },
  build: {
    commonjsOptions: {
      include: [/react-syntax-highlighter/, /node_modules/]
    }
  }
})
