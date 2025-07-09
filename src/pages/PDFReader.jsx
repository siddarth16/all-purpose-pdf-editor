import React, { useState, useEffect, useRef } from 'react'
import { useDropzone } from 'react-dropzone'
import { BookOpen, Upload, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight, Search, Download } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { loadPDFDocument } from '../utils/pdfUtils'
import * as pdfjsLib from 'pdfjs-dist'

// Set up PDF.js worker to use local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

const PDFReader = () => {
  const [file, setFile] = useState(null)
  const [pdfDoc, setPdfDoc] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1.0)
  const [rotation, setRotation] = useState(0)
  const [searchText, setSearchText] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const canvasRef = useRef(null)
  const containerRef = useRef(null)

  const onDrop = async (acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf')
    if (!pdfFile) {
      toast.error('Please select a PDF file')
      return
    }

    setFile(pdfFile)
    setIsLoading(true)
    
    try {
      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await loadPDFDocument(arrayBuffer)
      setPdfDoc(pdf)
      setTotalPages(pdf.numPages)
      setCurrentPage(1)
      setScale(1.0)
      setRotation(0)
      setSearchText('')
      setSearchResults([])
      
      toast.success('PDF loaded successfully')
    } catch (error) {
      toast.error('Failed to load PDF file')
      console.error('Error loading PDF:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  const renderPage = async (pageNumber) => {
    if (!pdfDoc || !canvasRef.current) return
    
    try {
      const page = await pdfDoc.getPage(pageNumber)
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      // Calculate viewport
      const viewport = page.getViewport({ 
        scale: scale, 
        rotation: rotation 
      })
      
      // Set canvas dimensions
      canvas.height = viewport.height
      canvas.width = viewport.width
      canvas.style.width = '100%'
      canvas.style.height = 'auto'
      
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height)
      
      // Render page
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      
      await page.render(renderContext).promise
    } catch (error) {
      console.error('Error rendering page:', error)
      toast.error('Failed to render page')
    }
  }

  const searchInPDF = async (searchTerm) => {
    if (!pdfDoc || !searchTerm.trim()) {
      setSearchResults([])
      return
    }
    
    setIsSearching(true)
    const results = []
    
    try {
      for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
        const page = await pdfDoc.getPage(pageNum)
        const textContent = await page.getTextContent()
        const pageText = textContent.items.map(item => item.str).join(' ')
        
        if (pageText.toLowerCase().includes(searchTerm.toLowerCase())) {
          results.push({
            page: pageNum,
            text: pageText,
            matches: (pageText.toLowerCase().match(new RegExp(searchTerm.toLowerCase(), 'g')) || []).length
          })
        }
      }
      
      setSearchResults(results)
      if (results.length === 0) {
        toast.info('No search results found')
      } else {
        toast.success(`Found ${results.length} pages with "${searchTerm}"`)
      }
    } catch (error) {
      console.error('Error searching PDF:', error)
      toast.error('Failed to search PDF')
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    searchInPDF(searchText)
  }

  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber)
    }
  }

  const zoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 3.0))
  }

  const zoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5))
  }

  const rotateRight = () => {
    setRotation(prev => (prev + 90) % 360)
  }

  const downloadPDF = () => {
    if (!file) return
    
    const url = URL.createObjectURL(file)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    a.click()
    URL.revokeObjectURL(url)
  }

  // Render current page when dependencies change
  useEffect(() => {
    if (pdfDoc) {
      renderPage(currentPage)
    }
  }, [pdfDoc, currentPage, scale, rotation])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!pdfDoc) return
      
      switch (e.key) {
        case 'ArrowLeft':
          if (currentPage > 1) setCurrentPage(prev => prev - 1)
          break
        case 'ArrowRight':
          if (currentPage < totalPages) setCurrentPage(prev => prev + 1)
          break
        case '+':
          if (e.ctrlKey) {
            e.preventDefault()
            zoomIn()
          }
          break
        case '-':
          if (e.ctrlKey) {
            e.preventDefault()
            zoomOut()
          }
          break
        case 'r':
          if (e.ctrlKey) {
            e.preventDefault()
            rotateRight()
          }
          break
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentPage, totalPages, pdfDoc])

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            PDF Reader
          </h1>
          <p className="text-lg text-white/80">
            View and navigate through PDF documents
          </p>
        </div>

        {/* File Upload */}
        {!file && (
          <div
            {...getRootProps()}
            className={`glass rounded-2xl p-8 border-2 border-dashed transition-all duration-300 cursor-pointer ${
              isDragActive 
                ? 'border-primary-400 bg-primary-500/10' 
                : 'border-white/30 hover:border-white/50'
            }`}
          >
            <input {...getInputProps()} />
            <div className="text-center">
              <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
              <p className="text-white text-lg mb-2">
                {isDragActive ? 'Drop PDF file here' : 'Drag & drop PDF file here'}
              </p>
              <p className="text-white/60">
                or click to select file
              </p>
            </div>
          </div>
        )}

        {/* PDF Viewer */}
        {file && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="glass rounded-2xl p-4">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
                {/* File Info */}
                <div className="flex items-center space-x-3">
                  <div>
                    <h3 className="font-semibold text-white">{file.name}</h3>
                    <p className="text-white/60 text-sm">
                      {totalPages} pages • {Math.round(scale * 100)}% zoom
                    </p>
                  </div>
                </div>

                {/* Navigation */}
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage <= 1}
                    className="btn-secondary p-2 disabled:opacity-50"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      min="1"
                      max={totalPages}
                      value={currentPage}
                      onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                      className="w-16 bg-black/20 text-white text-center rounded px-2 py-1 border border-white/20"
                    />
                    <span className="text-white/60">of {totalPages}</span>
                  </div>
                  
                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage >= totalPages}
                    className="btn-secondary p-2 disabled:opacity-50"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>

                {/* Tools */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={zoomOut}
                    className="btn-secondary p-2"
                    title="Zoom out (Ctrl+-)"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                  <button
                    onClick={zoomIn}
                    className="btn-secondary p-2"
                    title="Zoom in (Ctrl++)"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={rotateRight}
                    className="btn-secondary p-2"
                    title="Rotate (Ctrl+R)"
                  >
                    <RotateCw className="w-5 h-5" />
                  </button>
                  <button
                    onClick={downloadPDF}
                    className="btn-secondary p-2"
                    title="Download PDF"
                  >
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Search */}
              <div className="mt-4 pt-4 border-t border-white/20">
                <form onSubmit={handleSearch} className="flex items-center space-x-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/60" />
                    <input
                      type="text"
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      placeholder="Search in PDF..."
                      className="w-full bg-black/20 text-white placeholder-white/50 rounded-lg pl-10 pr-4 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSearching}
                    className="btn-primary disabled:opacity-50"
                  >
                    {isSearching ? 'Searching...' : 'Search'}
                  </button>
                </form>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-4 max-h-32 overflow-y-auto">
                    <div className="text-white/80 text-sm mb-2">
                      Found in {searchResults.length} pages:
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {searchResults.map((result, index) => (
                        <button
                          key={index}
                          onClick={() => goToPage(result.page)}
                          className={`px-3 py-1 rounded text-sm transition-colors ${
                            currentPage === result.page
                              ? 'bg-primary-500 text-white'
                              : 'bg-white/10 text-white/80 hover:bg-white/20'
                          }`}
                        >
                          Page {result.page} ({result.matches} matches)
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* PDF Canvas */}
            <div className="glass rounded-2xl p-6">
              <div 
                ref={containerRef}
                className="flex justify-center items-center min-h-[600px] overflow-auto"
              >
                {isLoading ? (
                  <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-white">Loading PDF...</p>
                  </div>
                ) : (
                  <canvas
                    ref={canvasRef}
                    className="max-w-full h-auto shadow-2xl border border-white/20"
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '8px'
                    }}
                  />
                )}
              </div>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="glass rounded-2xl p-4">
              <div className="text-white/80 text-sm">
                <strong>Keyboard shortcuts:</strong> Arrow keys (navigate), Ctrl+Plus/Minus (zoom), Ctrl+R (rotate)
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PDFReader 