import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'favicon.svg'],
      manifest: {
        name: 'El Campo - Granja Avícola',
        short_name: 'El Campo',
        description: 'Sistema ERP completo para gestión de granja avícola - Producción, Finanzas, Salud y más',
        theme_color: '#059669',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        categories: ['finance', 'productivity', 'business'],
        icons: [
          {
            src: 'web-app-manifest-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'web-app-manifest-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ],
        shortcuts: [
          {
            name: 'Registrar Gasto',
            short_name: 'Gasto',
            description: 'Registrar un nuevo gasto rápidamente',
            url: '/gastos',
            icons: [{ src: 'web-app-manifest-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Ver Dashboard',
            short_name: 'Dashboard',
            description: 'Ver resumen financiero',
            url: '/',
            icons: [{ src: 'web-app-manifest-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Registrar Recolección',
            short_name: 'Recolección',
            description: 'Registrar producción de huevos',
            url: '/produccion/recoleccion',
            icons: [{ src: 'web-app-manifest-192x192.png', sizes: '192x192' }]
          },
          {
            name: 'Calendario',
            short_name: 'Calendario',
            description: 'Ver eventos y recordatorios',
            url: '/calendario',
            icons: [{ src: 'web-app-manifest-192x192.png', sizes: '192x192' }]
          }
        ]
      },
      workbox: {
        // Cache de recursos estáticos
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        // NO usar navigateFallback - causa falsos offline en refresh
        // navigateFallback removido para evitar que muestre offline.html incorrectamente
        navigateFallbackDenylist: [/^\/api/, /^\/offline\.html/],
        // Runtime caching para API - Optimizado para PWA offline
        runtimeCaching: [
          {
            // Navegación - NetworkFirst para evitar falsos offline en F5
            urlPattern: ({ request }) => request.mode === 'navigate',
            handler: 'NetworkFirst',
            options: {
              cacheName: 'pages-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 horas
              },
              networkTimeoutSeconds: 5,
            }
          },
          {
            // API calls - NetworkFirst con fallback a cache para modo offline
            urlPattern: /^https?:\/\/.*\/api\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 // 24 horas
              },
              cacheableResponse: {
                statuses: [0, 200]
              },
              networkTimeoutSeconds: 3, // Timeout corto para fallback rápido
            }
          },
          {
            // Imágenes - CacheFirst para mejor performance
            urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
              expiration: {
                maxEntries: 200,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 días
              }
            }
          },
          {
            // Fuentes y assets estáticos
            urlPattern: /\.(?:woff|woff2|ttf|eot)$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'font-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 año
              }
            }
          }
        ],
        // Skip waiting para actualizaciones inmediatas
        skipWaiting: true,
        clientsClaim: true,
      }
    })
  ],
  // Optimizaciones de build
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
              'react-query': ['@tanstack/react-query'],
          'charts': ['recharts'],
        }
      }
    }
  },
  // Optimizar dev server
  server: {
    port: 5173,
    strictPort: false,
    open: true
  }
})