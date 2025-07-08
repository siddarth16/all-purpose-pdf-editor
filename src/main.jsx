import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Add error handling and debugging
console.log('Starting React app...')

// Function to remove loading screen
const removeLoadingScreen = () => {
  const loadingElement = document.querySelector('.loading')
  if (loadingElement) {
    loadingElement.style.display = 'none'
    console.log('Loading screen removed')
  }
}

// Component wrapper to handle loading screen removal
const AppWrapper = () => {
  React.useEffect(() => {
    // Remove loading screen immediately when component mounts
    removeLoadingScreen()
    
    // Also remove after a short delay as backup
    setTimeout(removeLoadingScreen, 100)
  }, [])

  return <App />
}

// Remove loading screen immediately when this script runs
setTimeout(removeLoadingScreen, 500)

try {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  console.log('Root created successfully')
  
  root.render(
    <React.StrictMode>
      <AppWrapper />
    </React.StrictMode>
  )
  
  console.log('App rendered successfully')
  
  // Additional fallback removal
  setTimeout(removeLoadingScreen, 1000)
  
} catch (error) {
  console.error('Error starting React app:', error)
  
  // Show error message instead of loading screen
  const rootElement = document.getElementById('root')
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; font-family: Arial, sans-serif;">
        <div>
          <h1>Error Loading App</h1>
          <p>${error.message}</p>
          <p style="margin-top: 20px; font-size: 14px; opacity: 0.8;">Check the browser console for more details.</p>
          <button onclick="window.location.reload()" style="background: white; color: #667eea; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-top: 20px;">Reload Page</button>
        </div>
      </div>
    `
  }
} 