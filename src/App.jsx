import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/themeStore'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'

// Temporarily simplified test component
const TestComponent = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: 'bold'
    }}>
      🎉 PDF TOOLKIT IS WORKING! 🎉
      <br />
      <div style={{ fontSize: '16px', marginTop: '20px', textAlign: 'center' }}>
        If you can see this, the React app is rendering properly.
        <br />
        The issue might be with specific components or CSS.
      </div>
    </div>
  )
}

function App() {
  const { theme } = useThemeStore()
  
  React.useEffect(() => {
    document.documentElement.className = theme
  }, [theme])

  // Temporary test mode - comment out to restore full app
  return <TestComponent />

  // Full app (commented out for testing)
  /*
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
            },
          }}
        />
      </div>
    </Router>
  )
  */
}

export default App 