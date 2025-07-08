import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useThemeStore } from './store/themeStore'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import ComingSoonPage from './components/ComingSoonPage'
import MergePDF from './pages/MergePDF'

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
              
              {/* Working PDF Tools */}
              <Route path="/merge-pdf" element={<MergePDF />} />
              
              {/* Other tools with ComingSoonPage */}
              <Route path="/split-pdf" element={<ComingSoonPage title="Split PDF" description="Extract pages from your PDF" icon="✂️" />} />
              <Route path="/compress-pdf" element={<ComingSoonPage title="Compress PDF" description="Reduce PDF file size" icon="📦" />} />
              <Route path="/edit-pdf" element={<ComingSoonPage title="Edit PDF" description="Add text, images, and shapes to your PDF" icon="✏️" />} />
              <Route path="/organize-pdf" element={<ComingSoonPage title="Organize PDF" description="Reorder, rotate, and delete pages" icon="📑" />} />
              <Route path="/protect-pdf" element={<ComingSoonPage title="Protect PDF" description="Add password protection" icon="🔒" />} />
              <Route path="/unlock-pdf" element={<ComingSoonPage title="Unlock PDF" description="Remove PDF password" icon="🔓" />} />
              <Route path="/sign-pdf" element={<ComingSoonPage title="Sign PDF" description="Add digital signature" icon="✍️" />} />
              <Route path="/watermark-pdf" element={<ComingSoonPage title="Watermark PDF" description="Add watermark to PDF" icon="💧" />} />
              <Route path="/page-numbers" element={<ComingSoonPage title="Page Numbers" description="Add page numbers to PDF" icon="🔢" />} />
              <Route path="/repair-pdf" element={<ComingSoonPage title="Repair PDF" description="Fix corrupted PDF files" icon="🔧" />} />
              <Route path="/ocr-pdf" element={<ComingSoonPage title="OCR PDF" description="Extract text from scanned PDFs" icon="🔍" />} />
              <Route path="/pdf-reader" element={<ComingSoonPage title="PDF Reader" description="View and read PDF files" icon="📖" />} />
              <Route path="/pdf-to-word" element={<ComingSoonPage title="PDF to Word" description="Convert PDF to Word document" icon="📄" />} />
              <Route path="/word-to-pdf" element={<ComingSoonPage title="Word to PDF" description="Convert Word to PDF" icon="📄" />} />
              <Route path="/pdf-to-excel" element={<ComingSoonPage title="PDF to Excel" description="Convert PDF to Excel spreadsheet" icon="📊" />} />
              <Route path="/excel-to-pdf" element={<ComingSoonPage title="Excel to PDF" description="Convert Excel to PDF" icon="📊" />} />
              <Route path="/pdf-to-powerpoint" element={<ComingSoonPage title="PDF to PowerPoint" description="Convert PDF to PowerPoint" icon="📽️" />} />
              <Route path="/powerpoint-to-pdf" element={<ComingSoonPage title="PowerPoint to PDF" description="Convert PowerPoint to PDF" icon="📽️" />} />
              <Route path="/pdf-to-jpg" element={<ComingSoonPage title="PDF to JPG" description="Convert PDF pages to JPG images" icon="🖼️" />} />
              <Route path="/jpg-to-pdf" element={<ComingSoonPage title="JPG to PDF" description="Convert JPG images to PDF" icon="🖼️" />} />
              <Route path="/pdf-to-png" element={<ComingSoonPage title="PDF to PNG" description="Convert PDF pages to PNG images" icon="🖼️" />} />
              <Route path="/png-to-pdf" element={<ComingSoonPage title="PNG to PDF" description="Convert PNG images to PDF" icon="🖼️" />} />
              <Route path="/html-to-pdf" element={<ComingSoonPage title="HTML to PDF" description="Convert HTML to PDF" icon="🌐" />} />
              
              {/* Fallback route */}
              <Route path="*" element={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-white mb-4">Page Not Found</h1>
                    <p className="text-white/80">This page doesn't exist.</p>
                  </div>
                </div>
              } />
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