import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  Compress, 
  Download, 
  RotateCcw, 
  Play, 
  ArrowLeft,
  Info,
  CheckCircle,
  AlertCircle,
  FileText,
  TrendingDown,
  Zap
} from 'lucide-react'
import FileDropzone from '../components/FileDropzone'
import { compressPDF, downloadFile, getPDFInfo } from '../utils/pdfUtils'

const CompressPDF = () => {
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [quality, setQuality] = useState(0.7)
  const [compressionLevel, setCompressionLevel] = useState('medium')

  const compressionLevels = {
    low: { quality: 0.9, label: 'Low Compression', description: 'Smaller file size reduction, higher quality' },
    medium: { quality: 0.7, label: 'Medium Compression', description: 'Balanced compression and quality' },
    high: { quality: 0.5, label: 'High Compression', description: 'Maximum file size reduction, lower quality' }
  }

  const handleFilesChange = async (newFiles) => {
    setFiles(newFiles)
    setResult(null)
    setProgress(0)
    
    if (newFiles.length > 0) {
      try {
        const info = await getPDFInfo(newFiles[0])
        setPdfInfo(info)
      } catch (error) {
        toast.error('Failed to read PDF information')
      }
    }
  }

  const handleCompress = async () => {
    if (files.length === 0) {
      toast.error('Please select a PDF file to compress')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    try {
      const originalSize = files[0].size
      const compressedPdfBytes = await compressPDF(files[0], quality, (progress) => {
        setProgress(progress)
      })
      
      const compressedSize = compressedPdfBytes.byteLength
      const compressionRatio = ((originalSize - compressedSize) / originalSize) * 100

      setResult({
        data: compressedPdfBytes,
        originalSize,
        compressedSize,
        compressionRatio,
        filename: files[0].name.replace('.pdf', '_compressed.pdf')
      })
      
      toast.success(`PDF compressed successfully! ${compressionRatio.toFixed(1)}% reduction`)
    } catch (error) {
      toast.error(`Failed to compress PDF: ${error.message}`)
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
    setPdfInfo(null)
    setQuality(0.7)
    setCompressionLevel('medium')
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleCompressionLevelChange = (level) => {
    setCompressionLevel(level)
    setQuality(compressionLevels[level].quality)
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
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <Compress className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Compress PDF</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Reduce PDF file size while maintaining document quality. 
            Choose compression level based on your needs.
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
            <Info className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-2">How it works</h3>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Upload a PDF file</li>
                <li>• Choose compression level (Low/Medium/High)</li>
                <li>• Adjust quality settings if needed</li>
                <li>• Download the compressed PDF</li>
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
                  <p className="text-white/60">File Size</p>
                  <p className="text-white font-medium">{formatFileSize(files[0]?.size)}</p>
                </div>
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
              </div>
            </div>
          </motion.div>
        )}

        {/* Compression Settings */}
        {pdfInfo && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="glass rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Compression Settings</h3>
              
              {/* Compression Level */}
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">Compression Level</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(compressionLevels).map(([level, config]) => (
                    <label key={level} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="compressionLevel"
                        value={level}
                        checked={compressionLevel === level}
                        onChange={() => handleCompressionLevelChange(level)}
                        className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                      />
                      <div className="flex-1">
                        <p className="text-white font-medium">{config.label}</p>
                        <p className="text-white/60 text-sm">{config.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Quality Slider */}
              <div className="mb-4">
                <label className="flex items-center justify-between text-white font-medium mb-3">
                  <span>Quality</span>
                  <span className="text-sm text-white/70">{Math.round(quality * 100)}%</span>
                </label>
                <div className="relative">
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
                    <span>Smallest</span>
                    <span>Balanced</span>
                    <span>Best Quality</span>
                  </div>
                </div>
              </div>

              {/* Estimated Results */}
              <div className="bg-white/5 rounded-lg p-4">
                <h4 className="text-white font-medium mb-2 flex items-center">
                  <TrendingDown className="w-4 h-4 mr-2" />
                  Estimated Results
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-white/60">Current Size</p>
                    <p className="text-white font-medium">{formatFileSize(files[0]?.size)}</p>
                  </div>
                  <div>
                    <p className="text-white/60">Estimated Size</p>
                    <p className="text-white font-medium">
                      {formatFileSize(files[0]?.size * quality)}
                    </p>
                  </div>
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
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Compressing PDF...</h3>
                  <p className="text-white/60 text-sm">Please wait while we optimize your file</p>
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
                  <h3 className="text-white font-semibold">Compression Complete!</h3>
                  <p className="text-white/60 text-sm">
                    File size reduced by {result.compressionRatio.toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/60 text-sm">Original Size</p>
                  <p className="text-white font-medium text-lg">{formatFileSize(result.originalSize)}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-4">
                  <p className="text-white/60 text-sm">Compressed Size</p>
                  <p className="text-white font-medium text-lg">{formatFileSize(result.compressedSize)}</p>
                </div>
                <div className="bg-green-500/20 rounded-lg p-4">
                  <p className="text-green-300 text-sm">Size Reduction</p>
                  <p className="text-green-200 font-medium text-lg">
                    {result.compressionRatio.toFixed(1)}%
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Compressed PDF</span>
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Compress Another PDF</span>
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
                onClick={handleCompress}
                disabled={isProcessing}
                className={`btn-primary flex items-center space-x-2 ${
                  isProcessing 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-glow'
                }`}
              >
                <Compress className="w-4 h-4" />
                <span>
                  {isProcessing ? 'Compressing...' : 'Compress PDF'}
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

export default CompressPDF 