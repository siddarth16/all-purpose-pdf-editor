import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Minimize2, Upload, FileText, Download, Info } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { compressPDF, getPDFInfo } from '../utils/pdfUtils'

const CompressPDF = () => {
  const [file, setFile] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [compressionLevel, setCompressionLevel] = useState(0.7)

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

  const getCompressionLabel = (level) => {
    if (level <= 0.3) return 'Maximum Compression'
    if (level <= 0.5) return 'High Compression'
    if (level <= 0.7) return 'Medium Compression'
    return 'Low Compression'
  }

  const handleCompressPDF = async () => {
    if (!file) {
      toast.error('Please select a PDF file')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('Compressing PDF...')

    try {
      await compressPDF(file, compressionLevel)
      toast.dismiss(loadingToast)
      toast.success('PDF compressed successfully! Download started.')
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to compress PDF')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Minimize2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Compress PDF
          </h1>
          <p className="text-lg text-white/80">
            Reduce PDF file size while maintaining quality
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
            <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
            <p className="text-white text-lg mb-2">
              {isDragActive ? 'Drop PDF file here' : 'Drag & drop PDF file here'}
            </p>
            <p className="text-white/60">
              or click to select file
            </p>
          </div>
        </div>

        {/* File Info & Compression Settings */}
        {file && pdfInfo && (
          <div className="mt-8 glass rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">{file.name}</h3>
                <p className="text-white/60">
                  {formatFileSize(file.size)} • {pdfInfo.pageCount} pages
                </p>
              </div>
            </div>

            {/* Compression Level */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-white font-medium">Compression Level</h4>
                <div className="flex items-center space-x-2">
                  <Info className="w-4 h-4 text-white/60" />
                  <span className="text-white/60 text-sm">
                    {getCompressionLabel(compressionLevel)}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3">
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={compressionLevel}
                  onChange={(e) => setCompressionLevel(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                />
                
                <div className="flex justify-between text-xs text-white/60">
                  <span>Maximum</span>
                  <span>High</span>
                  <span>Medium</span>
                  <span>Low</span>
                </div>
              </div>
            </div>

            {/* Compression Info */}
            <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">Compression Tips:</p>
                  <ul className="text-white/70 space-y-1">
                    <li>• Higher compression = smaller file size but may reduce quality</li>
                    <li>• Medium compression is recommended for most documents</li>
                    <li>• Text-heavy PDFs compress better than image-heavy ones</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setFile(null)}
                className="btn-secondary"
              >
                Remove File
              </button>
              <button
                onClick={handleCompressPDF}
                disabled={isProcessing}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Compress PDF'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CompressPDF 