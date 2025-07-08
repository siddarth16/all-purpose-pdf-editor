import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  Image as ImageIcon, 
  Download, 
  RotateCcw, 
  Play, 
  ArrowLeft,
  Info,
  CheckCircle,
  AlertCircle,
  FileText,
  Move,
  X
} from 'lucide-react'
import FileDropzone from '../components/FileDropzone'
import { imagesToPDF, downloadFile } from '../utils/pdfUtils'

const JPGToPDF = () => {
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [pageLayout, setPageLayout] = useState('auto')
  const [pageOrientation, setPageOrientation] = useState('portrait')
  const [imageQuality, setImageQuality] = useState(0.9)

  const layoutOptions = {
    auto: { label: 'Auto Fit', description: 'Automatically fit images to page' },
    stretch: { label: 'Stretch to Fill', description: 'Stretch images to fill entire page' },
    center: { label: 'Center', description: 'Center images on page with original aspect ratio' }
  }

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles)
    setResult(null)
    setProgress(0)
  }

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error('Please select at least one image file')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    try {
      const pdfBytes = await imagesToPDF(files, (progress) => {
        setProgress(progress)
      })
      
      setResult({
        data: pdfBytes,
        filename: `images_to_pdf_${new Date().toISOString().split('T')[0]}.pdf`,
        pageCount: files.length
      })
      
      toast.success(`${files.length} images converted to PDF successfully!`)
    } catch (error) {
      toast.error(`Failed to convert images: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      downloadFile(result.data, result.filename)
      toast.success('Download started!')
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setProgress(0)
    setIsProcessing(false)
  }

  const moveImage = (fromIndex, toIndex) => {
    const newFiles = [...files]
    const [movedFile] = newFiles.splice(fromIndex, 1)
    newFiles.splice(toIndex, 0, movedFile)
    setFiles(newFiles)
  }

  const removeImage = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    setResult(null)
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
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
            <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-2xl flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">JPG to PDF</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Convert JPG and PNG images to a single PDF document. 
            Drag to reorder images and customize layout settings.
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
            <Info className="w-5 h-5 text-violet-400 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-2">How it works</h3>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Upload JPG or PNG image files</li>
                <li>• Drag and drop to reorder images</li>
                <li>• Choose layout and orientation settings</li>
                <li>• Convert to PDF and download</li>
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
            acceptedFileTypes={['.jpg', '.jpeg', '.png']}
            maxFiles={50}
            allowMultiple={true}
          />
        </motion.div>

        {/* Image List with Drag and Drop */}
        {files.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <Move className="w-5 h-5 mr-2" />
              Images to Convert ({files.length})
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {files.map((file, index) => (
                <motion.div
                  key={file.name}
                  className="glass rounded-xl p-4 group"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                >
                  <div className="relative">
                    <div className="aspect-square bg-white/10 rounded-lg overflow-hidden mb-3">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    
                    <button
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500/80 hover:bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                    
                    <div className="absolute top-2 left-2 bg-black/50 rounded-full px-2 py-1">
                      <span className="text-white text-xs font-medium">{index + 1}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium text-sm truncate mb-1">{file.name}</h4>
                    <p className="text-white/60 text-xs">{formatFileSize(file.size)}</p>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    {index > 0 && (
                      <button
                        onClick={() => moveImage(index, index - 1)}
                        className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors duration-200"
                      >
                        ← Move Up
                      </button>
                    )}
                    {index < files.length - 1 && (
                      <button
                        onClick={() => moveImage(index, index + 1)}
                        className="text-xs bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors duration-200"
                      >
                        Move Down →
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* PDF Settings */}
        {files.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="glass rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">PDF Settings</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Page Layout */}
                <div>
                  <label className="block text-white font-medium mb-3">Page Layout</label>
                  <div className="space-y-2">
                    {Object.entries(layoutOptions).map(([key, option]) => (
                      <label key={key} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="pageLayout"
                          value={key}
                          checked={pageLayout === key}
                          onChange={(e) => setPageLayout(e.target.value)}
                          className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                        />
                        <div>
                          <p className="text-white font-medium">{option.label}</p>
                          <p className="text-white/60 text-sm">{option.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Page Orientation */}
                <div>
                  <label className="block text-white font-medium mb-3">Page Orientation</label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="pageOrientation"
                        value="portrait"
                        checked={pageOrientation === 'portrait'}
                        onChange={(e) => setPageOrientation(e.target.value)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <p className="text-white font-medium">Portrait</p>
                        <p className="text-white/60 text-sm">Tall pages (A4: 210 × 297 mm)</p>
                      </div>
                    </label>
                    
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="pageOrientation"
                        value="landscape"
                        checked={pageOrientation === 'landscape'}
                        onChange={(e) => setPageOrientation(e.target.value)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <div>
                        <p className="text-white font-medium">Landscape</p>
                        <p className="text-white/60 text-sm">Wide pages (A4: 297 × 210 mm)</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>

              {/* Image Quality */}
              <div className="mt-6">
                <label className="flex items-center justify-between text-white font-medium mb-3">
                  <span>Image Quality</span>
                  <span className="text-sm text-white/70">{Math.round(imageQuality * 100)}%</span>
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={imageQuality}
                  onChange={(e) => setImageQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-xs text-white/60 mt-1">
                  <span>Smaller Size</span>
                  <span>Better Quality</span>
                </div>
              </div>
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
                <div className="w-8 h-8 bg-violet-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Converting to PDF...</h3>
                  <p className="text-white/60 text-sm">Please wait while we create your PDF</p>
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
                    {result.pageCount} images converted to PDF
                  </p>
                </div>
              </div>
              
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3">
                  <FileText className="w-8 h-8 text-primary-400" />
                  <div>
                    <h4 className="text-white font-medium">{result.filename}</h4>
                    <p className="text-white/60 text-sm">
                      {result.pageCount} pages • {formatFileSize(result.data.byteLength)}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Convert More Images</span>
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
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleConvert}
                disabled={isProcessing}
                className={`btn-primary flex items-center space-x-2 ${
                  isProcessing 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-glow'
                }`}
              >
                <ImageIcon className="w-4 h-4" />
                <span>
                  {isProcessing ? 'Converting...' : `Convert ${files.length} Images to PDF`}
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
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default JPGToPDF 