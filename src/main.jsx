import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('main.jsx is executing...')

// Remove loading screen immediately
const removeLoadingScreen = () => {
  const loadingElement = document.querySelector('.loading')
  if (loadingElement) {
    loadingElement.remove()
    console.log('Loading screen removed')
  }
}

try {
  console.log('Creating React root...')
  const root = ReactDOM.createRoot(document.getElementById('root'))
  
  console.log('Rendering App...')
  root.render(<App />)
  
  // Remove loading screen
  removeLoadingScreen()
  setTimeout(removeLoadingScreen, 100)
  
  console.log('React app should be rendered!')
  
} catch (error) {
  console.error('CRITICAL ERROR:', error)
  
  // Show error directly in HTML
  const rootElement = document.getElementById('root')
  if (rootElement) {
    rootElement.innerHTML = `
      <div style="background: #ff0000; color: white; padding: 20px; font-size: 20px; text-align: center; min-height: 100vh; display: flex; align-items: center; justify-content: center; flex-direction: column;">
        <h1>CRITICAL ERROR DETECTED</h1>
        <p>${error.message}</p>
        <p style="font-size: 14px; margin-top: 20px;">Check browser console for full error details</p>
      </div>
    `
  }
} 