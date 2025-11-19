import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react({
      // Isso ajuda com imports de ícones
      babel: {
        plugins: [
          [
            'babel-plugin-import',
            {
              libraryName: 'react-icons',
              libraryDirectory: 'esm',
              camel2DashComponentName: false
            }
          ]
        ]
      }
    }),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'LevelFit - Sua Jornada Épica',
        short_name: 'LevelFit',
        description: 'Transforme seu corpo em uma lenda - Sistema de leveling fitness estilo Solo Leveling',
        theme_color: '#1e90ff',
        background_color: '#0a0a0f',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true
    }
  }
})