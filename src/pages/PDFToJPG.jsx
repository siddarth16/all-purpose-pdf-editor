import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileImage, Upload, FileText, Settings, Download } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { convertPDFToImages, getPDFInfo } from '../utils/pdfUtils'

const PDFToJPG = () => {
  const [file, setFile] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [outputFormat, setOutputFormat] = useState('jpg')
  const [quality, setQuality] = useState(0.9)
  const [scale, setScale] = useState(2.0)

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

  const getQualityLabel = (quality) => {
    if (quality >= 0.9) return 'High Quality'
    if (quality >= 0.7) return 'Medium Quality'
    return 'Low Quality'
  }

  const getScaleLabel = (scale) => {
    if (scale >= 3.0) return 'Very High Resolution'
    if (scale >= 2.0) return 'High Resolution'
    if (scale >= 1.5) return 'Medium Resolution'
    return 'Low Resolution'
  }

  const handleConvertPDF = async () => {
    if (!file) {
      toast.error('Please select a PDF file')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading(`Converting PDF to ${outputFormat.toUpperCase()}...`)

    try {
      const imageCount = await convertPDFToImages(file, outputFormat, quality)
      toast.dismiss(loadingToast)
      toast.success(`Successfully converted ${imageCount} pages to ${outputFormat.toUpperCase()}! Downloads started.`)
      
      // Clear form after success
      setFile(null)
      setPdfInfo(null)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to convert PDF')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileImage className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            PDF to JPG
          </h1>
          <p className="text-lg text-white/80">
            Convert PDF pages to high-quality JPG or PNG images
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

        {/* File Info & Conversion Settings */}
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

            {/* Conversion Settings */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5 text-white/60" />
                <h4 className="text-white font-medium">Conversion Settings</h4>
              </div>

              {/* Output Format */}
              <div className="space-y-3">
                <label className="block text-white/80 text-sm font-medium">
                  Output Format
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="jpg"
                      checked={outputFormat === 'jpg'}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className="text-primary-500"
                    />
                    <span className="text-white">JPG</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="png"
                      checked={outputFormat === 'png'}
                      onChange={(e) => setOutputFormat(e.target.value)}
                      className="text-primary-500"
                    />
                    <span className="text-white">PNG</span>
                  </label>
                </div>
              </div>

              {/* Quality Setting */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-white/80 text-sm font-medium">
                    Image Quality
                  </label>
                  <span className="text-white/60 text-sm">
                    {getQualityLabel(quality)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1"
                  step="0.1"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/60">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>

              {/* Scale Setting */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-white/80 text-sm font-medium">
                    Resolution Scale
                  </label>
                  <span className="text-white/60 text-sm">
                    {getScaleLabel(scale)}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="3"
                  step="0.5"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/60">
                  <span>1x</span>
                  <span>2x</span>
                  <span>3x</span>
                </div>
              </div>
            </div>

            {/* Conversion Info */}
            <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <FileImage className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">Conversion Info:</p>
                  <ul className="text-white/70 space-y-1">
                    <li>• Each page will be converted to a separate {outputFormat.toUpperCase()} file</li>
                    <li>• Higher quality and resolution = larger file sizes</li>
                    <li>• PNG format supports transparency, JPG is smaller</li>
                    <li>• Files will be downloaded automatically</li>
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
                onClick={handleConvertPDF}
                disabled={isProcessing}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Converting...' : `Convert to ${outputFormat.toUpperCase()}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PDFToJPG 