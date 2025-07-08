import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// Add error handling and debugging
console.log('Starting React app...')

try {
  const root = ReactDOM.createRoot(document.getElementById('root'))
  console.log('Root created successfully')
  
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
  
  console.log('App rendered successfully')
  
  // Remove loading screen once React has mounted
  setTimeout(() => {
    const loadingElement = document.querySelector('.loading')
    if (loadingElement) {
      loadingElement.style.display = 'none'
      console.log('Loading screen removed')
    }
  }, 100)
  
} catch (error) {
  console.error('Error starting React app:', error)
  
  // Show error message instead of loading screen
  setTimeout(() => {
    const rootElement = document.getElementById('root')
    if (rootElement) {
      rootElement.innerHTML = `
        <div style="display: flex; justify-content: center; align-items: center; height: 100vh; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-align: center; font-family: Arial, sans-serif;">
          <div>
            <h1>Error Loading App</h1>
            <p>${error.message}</p>
            <button onclick="window.location.reload()" style="background: white; color: #667eea; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">Reload Page</button>
          </div>
        </div>
      `
    }
  }, 1000)
} 