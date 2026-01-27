import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
// Fuentes locales (optimizadas)
import '@fontsource/inter/400.css'; // Regular
import '@fontsource/inter/500.css'; // Medium
import '@fontsource/inter/600.css'; // Semi-bold
import '@fontsource/inter/700.css'; // Bold
import './index.css'
import { QueryProvider } from './components/providers/QueryProvider'

// Importar el registro de la PWA
import { registerSW } from 'virtual:pwa-register'

registerSW({ immediate: true })

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryProvider>
    <App />
    </QueryProvider>
  </React.StrictMode>,
)