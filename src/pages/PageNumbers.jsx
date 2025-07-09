import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Hash, Upload, FileText, Settings, Download } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { addPageNumbersToPDF, getPDFInfo } from '../utils/pdfUtils'

const PageNumbers = () => {
  const [file, setFile] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [position, setPosition] = useState('bottom-center')
  const [startNumber, setStartNumber] = useState(1)
  const [fontSize, setFontSize] = useState(12)
  const [format, setFormat] = useState('number') // 'number', 'page-x', 'page-x-of-y'

  const onDrop = async (acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf')
    if (!pdfFile) {
      toast.error('Please select a PDF file')
      return
    }

    setFile(pdfFile)
    
    // Get PDF info
    try {
      const info = await getPDFInfo(pdfFile)
      setPdfInfo(info)
    } catch (error) {
      toast.error('Failed to read PDF file')
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleAddPageNumbers = async () => {
    if (!file) {
      toast.error('Please select a PDF file')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('Adding page numbers...')

    try {
      // Map format to the correct format string
      let formatString
      switch (format) {
        case 'number':
          formatString = '{n}'
          break
        case 'page-x':
          formatString = 'Page {n}'
          break
        case 'page-x-of-y':
          formatString = 'Page {n} of {total}'
          break
        default:
          formatString = '{n}'
      }

      await addPageNumbersToPDF(file, {
        position,
        startPage: startNumber,
        fontSize,
        format: formatString
      })
      toast.dismiss(loadingToast)
      toast.success('Page numbers added successfully! Download started.')
      
      // Clear form after success
      setFile(null)
      setPdfInfo(null)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to add page numbers. Please check your file and try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Hash className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
            Add Page Numbers
          </h1>
          <p className="text-lg text-secondary">
            Add customizable page numbers to your PDF documents
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

        {/* File Info & Settings */}
        {file && pdfInfo && (
          <div className="mt-8 glass rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-lg font-semibold text-primary">{file.name}</h3>
                <p className="text-secondary">
                  {formatFileSize(file.size)} • {pdfInfo.pageCount} pages
                </p>
              </div>
            </div>

            {/* Page Number Settings */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5 text-secondary" />
                <h4 className="text-primary font-medium">Page Number Settings</h4>
              </div>

              {/* Position */}
              <div className="space-y-3">
                <label className="block text-secondary text-sm font-medium">
                  Position
                </label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  className="w-full bg-black/20 text-primary rounded-lg px-3 py-2 border border-white/20 focus:outline-none focus:border-primary-400"
                >
                  <option value="top-left">Top Left</option>
                  <option value="top-center">Top Center</option>
                  <option value="top-right">Top Right</option>
                  <option value="bottom-left">Bottom Left</option>
                  <option value="bottom-center">Bottom Center</option>
                  <option value="bottom-right">Bottom Right</option>
                </select>
              </div>

              {/* Format */}
              <div className="space-y-3">
                <label className="block text-secondary text-sm font-medium">
                  Number Format
                </label>
                <select
                  value={format}
                  onChange={(e) => setFormat(e.target.value)}
                  className="w-full bg-black/20 text-primary rounded-lg px-3 py-2 border border-white/20 focus:outline-none focus:border-primary-400"
                >
                  <option value="number">1, 2, 3...</option>
                  <option value="page-x">Page 1, Page 2...</option>
                  <option value="page-x-of-y">Page 1 of 10, Page 2 of 10...</option>
                </select>
              </div>

              {/* Start Number */}
              <div className="space-y-3">
                <label className="block text-secondary text-sm font-medium">
                  Start Number
                </label>
                <input
                  type="number"
                  min="1"
                  value={startNumber}
                  onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                  className="w-full bg-black/20 text-primary rounded-lg px-3 py-2 border border-white/20 focus:outline-none focus:border-primary-400"
                />
              </div>

              {/* Font Size */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-secondary text-sm font-medium">
                    Font Size
                  </label>
                  <span className="text-muted text-sm">
                    {fontSize}pt
                  </span>
                </div>
                <input
                  type="range"
                  min="8"
                  max="24"
                  value={fontSize}
                  onChange={(e) => setFontSize(parseInt(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted">
                  <span>8pt</span>
                  <span>16pt</span>
                  <span>24pt</span>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Hash className="w-5 h-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-primary font-medium mb-1">Page Number Info:</p>
                  <ul className="text-secondary space-y-1">
                    <li>• Page numbers will be added to all pages</li>
                    <li>• Position determines where numbers appear on each page</li>
                    <li>• Start number allows you to begin from any number</li>
                    <li>• Font size controls the text size of page numbers</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => {
                  setFile(null)
                  setPdfInfo(null)
                }}
                className="btn-secondary"
              >
                Remove File
              </button>
              <button
                onClick={handleAddPageNumbers}
                disabled={isProcessing}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Adding Numbers...' : 'Add Page Numbers'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PageNumbers 