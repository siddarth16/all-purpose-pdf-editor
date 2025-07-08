import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  Image, 
  Download, 
  RotateCcw, 
  Play, 
  ArrowLeft,
  Info,
  CheckCircle,
  FileText,
  Zap,
  Archive
} from 'lucide-react'
import FileDropzone from '../components/FileDropzone'
import { pdfToImages, downloadFile, downloadFilesAsZip, getPDFInfo } from '../utils/pdfUtils'

const PDFToPNG = () => {
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [selectedPages, setSelectedPages] = useState('all')
  const [pageRange, setPageRange] = useState('')

  const handleFilesChange = async (newFiles) => {
    setFiles(newFiles)
    setResult(null)
    setProgress(0)
    
    if (newFiles.length > 0) {
      try {
        const info = await getPDFInfo(newFiles[0])
        setPdfInfo(info)
        setSelectedPages('all')
        setPageRange(`1-${info.pageCount}`)
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
      const images = await pdfToImages(files[0], 'png', (progress) => {
        setProgress(progress)
      })
      
      setResult({
        images,
        filename: files[0].name.replace('.pdf', '')
      })
      
      toast.success(`PDF converted to ${images.length} PNG images successfully!`)
    } catch (error) {
      toast.error(`Failed to convert PDF: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownloadAll = async () => {
    if (result && result.images.length > 0) {
      const files = result.images.map(img => ({
        name: img.name,
        data: img.blob
      }))
      
      await downloadFilesAsZip(files, `${result.filename}_pages.zip`)
      toast.success('All images downloaded as ZIP!')
    }
  }

  const handleDownloadSingle = (image) => {
    const url = URL.createObjectURL(image.blob)
    const a = document.createElement('a')
    a.href = url
    a.download = image.name
    a.click()
    URL.revokeObjectURL(url)
    toast.success('Image downloaded!')
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setProgress(0)
    setIsProcessing(false)
    setPdfInfo(null)
    setSelectedPages('all')
    setPageRange('')
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
              <Image className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">PDF to PNG</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Convert your PDF pages to high-quality PNG images. 
            Download individually or as a complete ZIP archive.
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
                <li>• Each page will be converted to a PNG image</li>
                <li>• Download images individually or as a ZIP</li>
                <li>• PNG format supports transparency and lossless compression</li>
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
                  <p className="text-white/60">File Size</p>
                  <p className="text-white font-medium">{(files[0]?.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <div>
                  <p className="text-white/60">Images to Create</p>
                  <p className="text-white font-medium">{pdfInfo.pageCount} PNG files</p>
                </div>
                <div>
                  <p className="text-white/60">Format</p>
                  <p className="text-white font-medium">PNG (Lossless)</p>
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
                <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Converting PDF to PNG...</h3>
                  <p className="text-white/60 text-sm">Processing each page into high-quality PNG images</p>
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
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Conversion Complete!</h3>
                    <p className="text-white/60 text-sm">
                      {result.images.length} PNG images created
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDownloadAll}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Archive className="w-4 h-4" />
                  <span>Download All as ZIP</span>
                </button>
              </div>
              
              {/* Image Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                {result.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={URL.createObjectURL(image.blob)}
                      alt={`Page ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border border-white/20"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => handleDownloadSingle(image)}
                        className="btn-primary text-sm flex items-center space-x-1"
                      >
                        <Download className="w-3 h-3" />
                        <span>Download</span>
                      </button>
                    </div>
                    <p className="text-white/60 text-xs mt-2 text-center">
                      Page {index + 1}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
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
            transition={{ duration: 0.5, delay: 0.4 }}
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
                  {isProcessing ? 'Converting...' : 'Convert to PNG'}
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

export default PDFToPNG 