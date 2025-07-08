import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/themeStore'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'

function App() {
  console.log('App component is rendering!')
  
  try {
    const { theme } = useThemeStore()
    console.log('Theme store working, current theme:', theme)
    
    React.useEffect(() => {
      document.documentElement.className = theme
    }, [theme])
    
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
  } catch (error) {
    console.error('Error in App component:', error)
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#ff0000',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold',
        flexDirection: 'column',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div>❌ ERROR IN APP COMPONENT</div>
        <div style={{ fontSize: '16px', marginTop: '20px' }}>
          {error.message}
        </div>
      </div>
    )
  }
}

export default App 