import React, { useState, useRef, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  Edit, Upload, Type, Square, Circle, Minus, 
  MousePointer, Palette, RotateCcw, RotateCw,
  Download, Settings, Layers, Trash2
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { getPDFInfo, loadPDFDocument } from '../utils/pdfUtils'
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker to use local worker file
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js'

const EditPDF = () => {
  const [file, setFile] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [pdfDocument, setPdfDocument] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [scale, setScale] = useState(1.0)
  const [currentTool, setCurrentTool] = useState('select')
  const [elements, setElements] = useState([])
  const [selectedElement, setSelectedElement] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef = useRef(null)
  const overlayRef = useRef(null)

  const [toolSettings, setToolSettings] = useState({
    strokeColor: '#ff0000',
    fillColor: '#ffffff',
    strokeWidth: 2,
    fontSize: 16,
    fontFamily: 'Arial',
    textColor: '#000000',
    opacity: 1
  })

  const tools = [
    { id: 'select', name: 'Select', icon: MousePointer },
    { id: 'text', name: 'Text', icon: Type },
    { id: 'rectangle', name: 'Rectangle', icon: Square },
    { id: 'circle', name: 'Circle', icon: Circle },
    { id: 'line', name: 'Line', icon: Minus }
  ]

  const onDrop = async (acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf')
    if (!pdfFile) {
      toast.error('Please select a PDF file')
      return
    }

    setFile(pdfFile)
    setIsLoading(true)
    
    try {
      const info = await getPDFInfo(pdfFile)
      setPdfInfo(info)
      
      // Load PDF document
      const arrayBuffer = await pdfFile.arrayBuffer()
      const pdf = await loadPDFDocument(arrayBuffer)
      setPdfDocument(pdf)
      setCurrentPage(1)
      
      toast.success('PDF loaded successfully')
    } catch (error) {
      toast.error('Failed to load PDF file')
      console.error('PDF loading error:', error)
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

  const renderPDFPage = async (pageNumber) => {
    if (!pdfDocument) return

    try {
      const page = await pdfDocument.getPage(pageNumber)
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      
      const viewport = page.getViewport({ scale: scale })
      canvas.height = viewport.height
      canvas.width = viewport.width
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      
      await page.render(renderContext).promise
    } catch (error) {
      console.error('Error rendering page:', error)
      toast.error('Failed to render PDF page')
    }
  }

  useEffect(() => {
    if (pdfDocument && currentPage) {
      renderPDFPage(currentPage)
    }
  }, [pdfDocument, currentPage, scale])

  const handleMouseDown = (e) => {
    if (currentTool === 'select') return
    
    const rect = overlayRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setIsDrawing(true)
    
    const newElement = {
      id: Date.now(),
      type: currentTool,
      x,
      y,
      width: 0,
      height: 0,
      ...toolSettings
    }
    
    if (currentTool === 'text') {
      newElement.text = 'Double-click to edit'
    }
    
    setElements([...elements, newElement])
    setSelectedElement(newElement)
  }

  const handleMouseMove = (e) => {
    if (!isDrawing || currentTool === 'select' || currentTool === 'text') return
    
    const rect = overlayRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    setElements(prev => prev.map(el => {
      if (el.id === selectedElement.id) {
        return {
          ...el,
          width: x - el.x,
          height: y - el.y
        }
      }
      return el
    }))
  }

  const handleMouseUp = () => {
    setIsDrawing(false)
  }

  const renderElement = (element) => {
    const { type, x, y, width, height, strokeColor, fillColor, strokeWidth, fontSize, fontFamily, textColor, text, opacity } = element
    
    const style = {
      position: 'absolute',
      left: x,
      top: y,
      opacity: opacity,
      pointerEvents: selectedElement?.id === element.id ? 'auto' : 'none'
    }
    
    switch (type) {
      case 'rectangle':
        return (
          <div
            key={element.id}
            style={{
              ...style,
              width: Math.abs(width),
              height: Math.abs(height),
              border: `${strokeWidth}px solid ${strokeColor}`,
              backgroundColor: fillColor,
              cursor: 'move'
            }}
            onClick={() => setSelectedElement(element)}
          />
        )
      
      case 'circle':
        return (
          <div
            key={element.id}
            style={{
              ...style,
              width: Math.abs(width),
              height: Math.abs(width), // Keep it circular
              border: `${strokeWidth}px solid ${strokeColor}`,
              backgroundColor: fillColor,
              borderRadius: '50%',
              cursor: 'move'
            }}
            onClick={() => setSelectedElement(element)}
          />
        )
      
      case 'line':
        return (
          <div
            key={element.id}
            style={{
              ...style,
              width: Math.abs(width),
              height: strokeWidth,
              backgroundColor: strokeColor,
              cursor: 'move',
              transformOrigin: '0 0',
              transform: `rotate(${Math.atan2(height, width) * 180 / Math.PI}deg)`
            }}
            onClick={() => setSelectedElement(element)}
          />
        )
      
      case 'text':
        return (
          <div
            key={element.id}
            style={{
              ...style,
              fontSize: `${fontSize}px`,
              fontFamily: fontFamily,
              color: textColor,
              cursor: 'move',
              minWidth: '100px',
              padding: '2px'
            }}
            onClick={() => setSelectedElement(element)}
            onDoubleClick={() => {
              const newText = prompt('Enter text:', text)
              if (newText !== null) {
                setElements(prev => prev.map(el => 
                  el.id === element.id ? { ...el, text: newText } : el
                ))
              }
            }}
          >
            {text}
          </div>
        )
      
      default:
        return null
    }
  }

  const deleteSelectedElement = () => {
    if (selectedElement) {
      setElements(prev => prev.filter(el => el.id !== selectedElement.id))
      setSelectedElement(null)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  if (!file) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Edit className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Edit PDF
            </h1>
            <p className="text-lg text-secondary">
              Add text, shapes, and annotations to your PDF documents
            </p>
          </div>

          {/* File Upload */}
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
              <Upload className="w-12 h-12 text-secondary mx-auto mb-4" />
              <p className="text-primary text-lg mb-2">
                {isDragActive ? 'Drop PDF file here' : 'Drag & drop PDF file here'}
              </p>
              <p className="text-muted">
                or click to select file
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center">
              <Edit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">PDF Editor</h1>
              <p className="text-muted text-sm">{file.name}</p>
            </div>
          </div>
        </div>

        {/* Editor Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Tools Panel */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-6 space-y-6">
              {/* Tool Selection */}
              <div>
                <h3 className="text-white font-semibold mb-3">Tools</h3>
                <div className="grid grid-cols-2 gap-2">
                  {tools.map(tool => {
                    const Icon = tool.icon
                    return (
                      <button
                        key={tool.id}
                        onClick={() => setCurrentTool(tool.id)}
                        className={`p-3 rounded-lg transition-all duration-200 ${
                          currentTool === tool.id
                            ? 'bg-primary-500 text-white'
                            : 'bg-white/10 text-white/80 hover:bg-white/20'
                        }`}
                      >
                        <Icon className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs">{tool.name}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Tool Settings */}
              <div>
                <h3 className="text-white font-semibold mb-3">Settings</h3>
                <div className="space-y-4">
                  {(currentTool === 'rectangle' || currentTool === 'circle' || currentTool === 'line') && (
                    <>
                      <div>
                        <label className="block text-white/80 text-sm mb-1">Stroke Color</label>
                        <input
                          type="color"
                          value={toolSettings.strokeColor}
                          onChange={(e) => setToolSettings(prev => ({ ...prev, strokeColor: e.target.value }))}
                          className="w-full h-8 rounded border border-white/20"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-1">Fill Color</label>
                        <input
                          type="color"
                          value={toolSettings.fillColor}
                          onChange={(e) => setToolSettings(prev => ({ ...prev, fillColor: e.target.value }))}
                          className="w-full h-8 rounded border border-white/20"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-1">Stroke Width</label>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={toolSettings.strokeWidth}
                          onChange={(e) => setToolSettings(prev => ({ ...prev, strokeWidth: parseInt(e.target.value) }))}
                          className="w-full"
                        />
                      </div>
                    </>
                  )}
                  
                  {currentTool === 'text' && (
                    <>
                      <div>
                        <label className="block text-white/80 text-sm mb-1">Text Color</label>
                        <input
                          type="color"
                          value={toolSettings.textColor}
                          onChange={(e) => setToolSettings(prev => ({ ...prev, textColor: e.target.value }))}
                          className="w-full h-8 rounded border border-white/20"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-1">Font Size</label>
                        <input
                          type="range"
                          min="10"
                          max="36"
                          value={toolSettings.fontSize}
                          onChange={(e) => setToolSettings(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                          className="w-full"
                        />
                      </div>
                      <div>
                        <label className="block text-white/80 text-sm mb-1">Font Family</label>
                        <select
                          value={toolSettings.fontFamily}
                          onChange={(e) => setToolSettings(prev => ({ ...prev, fontFamily: e.target.value }))}
                          className="w-full bg-black/20 text-white rounded px-3 py-2 border border-white/20"
                        >
                          <option value="Arial">Arial</option>
                          <option value="Times New Roman">Times New Roman</option>
                          <option value="Courier New">Courier New</option>
                          <option value="Georgia">Georgia</option>
                        </select>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="block text-white/80 text-sm mb-1">Opacity</label>
                    <input
                      type="range"
                      min="0.1"
                      max="1"
                      step="0.1"
                      value={toolSettings.opacity}
                      onChange={(e) => setToolSettings(prev => ({ ...prev, opacity: parseFloat(e.target.value) }))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button
                  onClick={deleteSelectedElement}
                  disabled={!selectedElement}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Selected</span>
                </button>
                <button
                  onClick={() => toast.info('Save functionality requires server-side processing')}
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Save PDF</span>
                </button>
              </div>
            </div>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-3">
            <div className="glass rounded-2xl p-6">
              {/* PDF Controls */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    disabled={currentPage <= 1}
                    className="btn-secondary text-sm disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-white">
                    Page {currentPage} of {pdfInfo?.pageCount}
                  </span>
                  <button
                    onClick={() => setCurrentPage(Math.min(pdfInfo?.pageCount || 1, currentPage + 1))}
                    disabled={currentPage >= (pdfInfo?.pageCount || 1)}
                    className="btn-secondary text-sm disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setScale(Math.max(0.5, scale - 0.25))}
                    className="btn-secondary text-sm"
                  >
                    -
                  </button>
                  <span className="text-white text-sm">{Math.round(scale * 100)}%</span>
                  <button
                    onClick={() => setScale(Math.min(2.0, scale + 0.25))}
                    className="btn-secondary text-sm"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Canvas Container */}
              <div className="relative border border-white/20 rounded-lg overflow-auto bg-gray-100" style={{ maxHeight: '70vh' }}>
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    className="block mx-auto"
                    style={{ maxWidth: '100%', height: 'auto' }}
                  />
                  <div
                    ref={overlayRef}
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 cursor-crosshair"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{
                      width: canvasRef.current?.width || '100%',
                      height: canvasRef.current?.height || '100%'
                    }}
                  >
                    {elements.map(renderElement)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Info */}
        <div className="mt-8 glass rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <Settings className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-white font-medium mb-1">PDF Editor Usage:</p>
              <ul className="text-white/70 space-y-1">
                <li>• Select a tool from the left panel and click/drag on the PDF to add elements</li>
                <li>• Double-click text elements to edit content</li>
                <li>• Use the select tool to choose and delete elements</li>
                <li>• Adjust colors, sizes, and opacity in the settings panel</li>
                <li>• Save functionality requires server-side processing for final PDF generation</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditPDF 