// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Toaster } from './components/ui/sonner'
import { SocketProvider } from './context/SocketContext'

createRoot(document.getElementById('root')).render(
//close button porp is also in toaster sonner

  <SocketProvider>
    <App />
    <Toaster closeButton/>
    </SocketProvider>
 
)
