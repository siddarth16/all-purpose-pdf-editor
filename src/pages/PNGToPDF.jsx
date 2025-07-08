import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  FileText, 
  Download, 
  RotateCcw, 
  Play, 
  ArrowLeft,
  Info,
  CheckCircle,
  Image,
  Zap,
  GripVertical,
  Trash2,
  RotateCw,
  Settings
} from 'lucide-react'
import FileDropzone from '../components/FileDropzone'
import { imagesToPDF, downloadFile } from '../utils/pdfUtils'

const PNGToPDF = () => {
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [pageSize, setPageSize] = useState('A4')
  const [orientation, setOrientation] = useState('portrait')
  const [margin, setMargin] = useState(20)
  const [fitToPage, setFitToPage] = useState(true)

  const pageSizes = {
    A4: { width: 595, height: 842 },
    A3: { width: 842, height: 1191 },
    A5: { width: 420, height: 595 },
    Letter: { width: 612, height: 792 },
    Legal: { width: 612, height: 1008 }
  }

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles)
    setResult(null)
    setProgress(0)
  }

  const handleConvert = async () => {
    if (files.length === 0) {
      toast.error('Please select PNG files to convert')
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
        filename: 'converted-images.pdf'
      })
      
      toast.success(`${files.length} PNG images converted to PDF successfully!`)
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

  const handleRemoveFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    setResult(null)
  }

  const handleReorderFiles = (fromIndex, toIndex) => {
    const newFiles = [...files]
    const [removed] = newFiles.splice(fromIndex, 1)
    newFiles.splice(toIndex, 0, removed)
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

  const totalSize = files.reduce((sum, file) => sum + file.size, 0)

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
            <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">PNG to PDF</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Convert your PNG images to a single PDF document. 
            Reorder images and customize page settings.
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
            <Info className="w-5 h-5 text-cyan-400 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-2">How it works</h3>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Upload multiple PNG images</li>
                <li>• Drag and drop to reorder images</li>
                <li>• Customize page size and orientation</li>
                <li>• Download the combined PDF</li>
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
            acceptedFileTypes={['.png', 'image/png']}
            maxFiles={50}
            allowMultiple={true}
          />
        </motion.div>

        {/* File List */}
        {files.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center">
                  <Image className="w-5 h-5 mr-2" />
                  Images ({files.length})
                </h3>
                <div className="text-sm text-white/60">
                  Total size: {formatFileSize(totalSize)}
                </div>
              </div>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {files.map((file, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg"
                  >
                    <GripVertical className="w-4 h-4 text-white/40 cursor-move" />
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">{file.name}</p>
                      <p className="text-white/60 text-xs">{formatFileSize(file.size)}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="p-1 text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
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
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                PDF Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Page Size</label>
                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(e.target.value)}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    {Object.keys(pageSizes).map(size => (
                      <option key={size} value={size} className="bg-gray-800">
                        {size}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Orientation</label>
                  <select
                    value={orientation}
                    onChange={(e) => setOrientation(e.target.value)}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    <option value="portrait" className="bg-gray-800">Portrait</option>
                    <option value="landscape" className="bg-gray-800">Landscape</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">
                    Margin ({margin}px)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={margin}
                    onChange={(e) => setMargin(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="flex items-center space-x-2 text-white font-medium">
                    <input
                      type="checkbox"
                      checked={fitToPage}
                      onChange={(e) => setFitToPage(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span>Fit images to page</span>
                  </label>
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
                <div className="w-8 h-8 bg-cyan-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Converting PNG to PDF...</h3>
                  <p className="text-white/60 text-sm">Creating PDF from {files.length} images</p>
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
                    PDF created with {files.length} images
                  </p>
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
                <Zap className="w-4 h-4" />
                <span>
                  {isProcessing ? 'Converting...' : 'Convert to PDF'}
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

export default PNGToPDF 