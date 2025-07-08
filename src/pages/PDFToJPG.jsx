import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  FileImage, 
  Download, 
  RotateCcw, 
  Play, 
  ArrowLeft,
  Info,
  CheckCircle,
  AlertCircle,
  FileText,
  Package,
  Eye,
  Image as ImageIcon
} from 'lucide-react'
import FileDropzone from '../components/FileDropzone'
import { pdfToImages, downloadFilesAsZip, getPDFInfo } from '../utils/pdfUtils'

const PDFToJPG = () => {
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [quality, setQuality] = useState(0.9)
  const [format, setFormat] = useState('jpg')
  const [convertAllPages, setConvertAllPages] = useState(true)
  const [selectedPages, setSelectedPages] = useState([])

  const handleFilesChange = async (newFiles) => {
    setFiles(newFiles)
    setResult(null)
    setProgress(0)
    
    if (newFiles.length > 0) {
      try {
        const info = await getPDFInfo(newFiles[0])
        setPdfInfo(info)
        setSelectedPages(Array.from({ length: info.pageCount }, (_, i) => i + 1))
      } catch (error) {
        toast.error('Failed to read PDF information')
      }
    }
  }

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error('Please select a PDF file to convert')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    try {
      const images = await pdfToImages(files[0], format, (progress) => {
        setProgress(progress)
      })

      // Filter images based on selected pages if not converting all
      const filteredImages = convertAllPages 
        ? images 
        : images.filter((_, index) => selectedPages.includes(index + 1))
      
      setResult(filteredImages)
      toast.success(`Converted ${filteredImages.length} pages to ${format.toUpperCase()}!`)
    } catch (error) {
      toast.error(`Failed to convert PDF: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      const filesForZip = result.map(img => ({
        name: img.name,
        data: img.blob
      }))
      const zipName = `pdf_to_${format}_${new Date().toISOString().split('T')[0]}.zip`
      downloadFilesAsZip(filesForZip, zipName)
      toast.success('Download started!')
    }
  }

  const handleDownloadSingle = async (image, index) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(image.blob)
    link.download = image.name
    link.click()
    URL.revokeObjectURL(link.href)
    toast.success('Download started!')
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setProgress(0)
    setIsProcessing(false)
    setPdfInfo(null)
    setSelectedPages([])
  }

  const handlePageSelection = (pageNumber) => {
    if (selectedPages.includes(pageNumber)) {
      setSelectedPages(selectedPages.filter(p => p !== pageNumber))
    } else {
      setSelectedPages([...selectedPages, pageNumber])
    }
  }

  const selectAllPages = () => {
    setSelectedPages(Array.from({ length: pdfInfo.pageCount }, (_, i) => i + 1))
  }

  const deselectAllPages = () => {
    setSelectedPages([])
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-white/70 hover:text-white mb-6 transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Tools</span>
          </Link>
          
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center">
              <FileImage className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">PDF to JPG</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Convert PDF pages to high-quality JPG images. 
            Convert all pages or select specific pages.
          </p>
        </motion.div>

        {/* Info Card */}
        <motion.div
          className="glass rounded-xl p-6 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-pink-400 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-2">How it works</h3>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Upload a PDF file</li>
                <li>• Choose image format (JPG or PNG)</li>
                <li>• Select pages to convert (optional)</li>
                <li>• Adjust quality settings</li>
                <li>• Download images individually or as ZIP</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* File Upload */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <FileDropzone
            onFilesChange={handleFilesChange}
            acceptedFileTypes={['.pdf']}
            maxFiles={1}
            allowMultiple={false}
          />
        </motion.div>

        {/* PDF Info */}
        {pdfInfo && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="glass rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                PDF Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-white/60">Pages</p>
                  <p className="text-white font-medium">{pdfInfo.pageCount}</p>
                </div>
                <div>
                  <p className="text-white/60">Title</p>
                  <p className="text-white font-medium">{pdfInfo.title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/60">Author</p>
                  <p className="text-white font-medium">{pdfInfo.author || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/60">File Size</p>
                  <p className="text-white font-medium">
                    {(files[0]?.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Conversion Settings */}
        {pdfInfo && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="glass rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Conversion Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Format Selection */}
                <div>
                  <label className="block text-white font-medium mb-3">Output Format</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="format"
                        value="jpg"
                        checked={format === 'jpg'}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <p className="text-white font-medium">JPG</p>
                        <p className="text-white/60 text-sm">Smaller file size, good for photos</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="format"
                        value="png"
                        checked={format === 'png'}
                        onChange={(e) => setFormat(e.target.value)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <p className="text-white font-medium">PNG</p>
                        <p className="text-white/60 text-sm">Higher quality, transparency support</p>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Quality Settings */}
                <div>
                  <label className="flex items-center justify-between text-white font-medium mb-3">
                    <span>Image Quality</span>
                    <span className="text-sm text-white/70">{Math.round(quality * 100)}%</span>
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={quality}
                    onChange={(e) => setQuality(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex justify-between text-xs text-white/60 mt-1">
                    <span>Lower Quality</span>
                    <span>Higher Quality</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Page Selection */}
        {pdfInfo && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Page Selection</h3>
                <div className="flex items-center space-x-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={convertAllPages}
                      onChange={(e) => setConvertAllPages(e.target.checked)}
                      className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                    />
                    <span className="text-white text-sm">Convert all pages</span>
                  </label>
                </div>
              </div>
              
              {!convertAllPages && (
                <div>
                  <div className="flex items-center space-x-4 mb-4">
                    <button
                      onClick={selectAllPages}
                      className="text-primary-400 hover:text-primary-300 text-sm"
                    >
                      Select All
                    </button>
                    <button
                      onClick={deselectAllPages}
                      className="text-primary-400 hover:text-primary-300 text-sm"
                    >
                      Deselect All
                    </button>
                    <span className="text-white/60 text-sm">
                      {selectedPages.length} of {pdfInfo.pageCount} pages selected
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-8 sm:grid-cols-12 lg:grid-cols-16 gap-2">
                    {Array.from({ length: pdfInfo.pageCount }, (_, i) => i + 1).map(pageNumber => (
                      <button
                        key={pageNumber}
                        onClick={() => handlePageSelection(pageNumber)}
                        className={`aspect-square rounded-lg border-2 text-sm font-medium transition-all duration-200 ${
                          selectedPages.includes(pageNumber)
                            ? 'border-primary-500 bg-primary-500/20 text-primary-300'
                            : 'border-white/20 hover:border-white/40 text-white/70'
                        }`}
                      >
                        {pageNumber}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Progress Bar */}
        {isProcessing && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="glass rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Converting to {format.toUpperCase()}...</h3>
                  <p className="text-white/60 text-sm">Please wait while we convert your PDF pages</p>
                </div>
              </div>
              
              <div className="progress-bar">
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-white/60 mt-2">
                <span>Progress</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Result */}
        {result && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass rounded-xl p-6">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Conversion Complete!</h3>
                  <p className="text-white/60 text-sm">
                    {result.length} pages converted to {format.toUpperCase()}
                  </p>
                </div>
              </div>
              
              {/* Image Preview Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
                {result.map((image, index) => (
                  <div key={index} className="relative group">
                    <div className="aspect-square bg-white/10 rounded-lg overflow-hidden">
                      <img
                        src={URL.createObjectURL(image.blob)}
                        alt={`Page ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => handleDownloadSingle(image, index)}
                        className="bg-white/20 hover:bg-white/30 rounded-full p-2 transition-colors duration-200"
                      >
                        <Download className="w-4 h-4 text-white" />
                      </button>
                    </div>
                    <p className="text-white/70 text-xs mt-2 text-center">{image.name}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Download All as ZIP</span>
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Convert Another PDF</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        {files.length > 0 && !result && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleConvert}
                disabled={isProcessing || (!convertAllPages && selectedPages.length === 0)}
                className={`btn-primary flex items-center space-x-2 ${
                  isProcessing || (!convertAllPages && selectedPages.length === 0)
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-glow'
                }`}
              >
                <FileImage className="w-4 h-4" />
                <span>
                  {isProcessing ? 'Converting...' : `Convert to ${format.toUpperCase()}`}
                </span>
              </button>
              
              <button
                onClick={handleReset}
                className="btn-secondary flex items-center space-x-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
            
            {!convertAllPages && selectedPages.length === 0 && (
              <p className="text-white/60 text-sm mt-4 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Please select at least one page to convert
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default PDFToJPG 