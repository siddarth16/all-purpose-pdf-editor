import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Droplets, Upload, FileText, Hash, Type, Palette, RotateCcw } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { addWatermarkToPDF, addPageNumbersToPDF, getPDFInfo } from '../utils/pdfUtils'

const WatermarkPDF = () => {
  const [file, setFile] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState('watermark') // 'watermark' or 'pagenumbers'
  
  // Watermark settings
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL')
  const [watermarkFontSize, setWatermarkFontSize] = useState(50)
  const [watermarkOpacity, setWatermarkOpacity] = useState(0.5)
  const [watermarkRotation, setWatermarkRotation] = useState(45)
  const [watermarkPosition, setWatermarkPosition] = useState('center')
  const [watermarkColor, setWatermarkColor] = useState([0.5, 0.5, 0.5])
  
  // Page numbers settings
  const [pageNumberFormat, setPageNumberFormat] = useState('Page {n} of {total}')
  const [pageNumberPosition, setPageNumberPosition] = useState('bottom-right')
  const [pageNumberFontSize, setPageNumberFontSize] = useState(12)
  const [pageNumberStartPage, setPageNumberStartPage] = useState(1)
  const [pageNumberMargin, setPageNumberMargin] = useState(20)

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

  const handleAddWatermark = async () => {
    if (!file) {
      toast.error('Please select a PDF file')
      return
    }

    if (!watermarkText.trim()) {
      toast.error('Please enter watermark text')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('Adding watermark...')

    try {
      const options = {
        fontSize: watermarkFontSize,
        opacity: watermarkOpacity,
        rotation: watermarkRotation,
        color: watermarkColor,
        position: watermarkPosition
      }

      await addWatermarkToPDF(file, watermarkText, options)
      toast.dismiss(loadingToast)
      toast.success('Watermark added successfully! Download started.')
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to add watermark')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleAddPageNumbers = async () => {
    if (!file) {
      toast.error('Please select a PDF file')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('Adding page numbers...')

    try {
      const options = {
        fontSize: pageNumberFontSize,
        position: pageNumberPosition,
        startPage: pageNumberStartPage,
        format: pageNumberFormat,
        margin: pageNumberMargin
      }

      await addPageNumbersToPDF(file, options)
      toast.dismiss(loadingToast)
      toast.success('Page numbers added successfully! Download started.')
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to add page numbers')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Droplets className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Watermark & Page Numbers
          </h1>
          <p className="text-lg text-white/80">
            Add watermarks and page numbers to your PDF documents
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

        {/* File Info & Settings */}
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

            {/* Tabs */}
            <div className="flex space-x-4 mb-6">
              <button
                onClick={() => setActiveTab('watermark')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'watermark' 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Droplets className="w-4 h-4" />
                <span>Watermark</span>
              </button>
              <button
                onClick={() => setActiveTab('pagenumbers')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === 'pagenumbers' 
                    ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' 
                    : 'text-white/60 hover:text-white'
                }`}
              >
                <Hash className="w-4 h-4" />
                <span>Page Numbers</span>
              </button>
            </div>

            {/* Watermark Settings */}
            {activeTab === 'watermark' && (
              <div className="space-y-6">
                {/* Watermark Text */}
                <div>
                  <label className="block text-white font-medium mb-2">Watermark Text</label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Enter watermark text"
                    className="w-full bg-black/20 text-white placeholder-white/50 rounded-lg px-4 py-3 border border-white/20 focus:border-primary-500 focus:outline-none"
                  />
                </div>

                {/* Position */}
                <div>
                  <label className="block text-white font-medium mb-2">Position</label>
                  <select
                    value={watermarkPosition}
                    onChange={(e) => setWatermarkPosition(e.target.value)}
                    className="w-full bg-black/20 text-white rounded-lg px-4 py-3 border border-white/20 focus:border-primary-500 focus:outline-none"
                  >
                    <option value="center">Center</option>
                    <option value="top">Top</option>
                    <option value="bottom">Bottom</option>
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-white font-medium">Font Size</label>
                    <span className="text-white/60">{watermarkFontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={watermarkFontSize}
                    onChange={(e) => setWatermarkFontSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Opacity */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-white font-medium">Opacity</label>
                    <span className="text-white/60">{Math.round(watermarkOpacity * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={watermarkOpacity}
                    onChange={(e) => setWatermarkOpacity(parseFloat(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Rotation */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-white font-medium">Rotation</label>
                    <span className="text-white/60">{watermarkRotation}°</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={watermarkRotation}
                    onChange={(e) => setWatermarkRotation(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Action Button */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setFile(null)}
                    className="btn-secondary"
                  >
                    Remove File
                  </button>
                  <button
                    onClick={handleAddWatermark}
                    disabled={isProcessing || !watermarkText.trim()}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Add Watermark'}
                  </button>
                </div>
              </div>
            )}

            {/* Page Numbers Settings */}
            {activeTab === 'pagenumbers' && (
              <div className="space-y-6">
                {/* Format */}
                <div>
                  <label className="block text-white font-medium mb-2">Format</label>
                  <select
                    value={pageNumberFormat}
                    onChange={(e) => setPageNumberFormat(e.target.value)}
                    className="w-full bg-black/20 text-white rounded-lg px-4 py-3 border border-white/20 focus:border-primary-500 focus:outline-none"
                  >
                    <option value="Page {n} of {total}">Page {n} of {total}</option>
                    <option value="{n} / {total}">{n} / {total}</option>
                    <option value="{n}">{n}</option>
                    <option value="Page {n}">Page {n}</option>
                  </select>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-white font-medium mb-2">Position</label>
                  <select
                    value={pageNumberPosition}
                    onChange={(e) => setPageNumberPosition(e.target.value)}
                    className="w-full bg-black/20 text-white rounded-lg px-4 py-3 border border-white/20 focus:border-primary-500 focus:outline-none"
                  >
                    <option value="bottom-right">Bottom Right</option>
                    <option value="bottom-left">Bottom Left</option>
                    <option value="bottom-center">Bottom Center</option>
                    <option value="top-right">Top Right</option>
                    <option value="top-left">Top Left</option>
                    <option value="top-center">Top Center</option>
                  </select>
                </div>

                {/* Font Size */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-white font-medium">Font Size</label>
                    <span className="text-white/60">{pageNumberFontSize}px</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="24"
                    value={pageNumberFontSize}
                    onChange={(e) => setPageNumberFontSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Start Page */}
                <div>
                  <label className="block text-white font-medium mb-2">Start Page Number</label>
                  <input
                    type="number"
                    min="1"
                    value={pageNumberStartPage}
                    onChange={(e) => setPageNumberStartPage(parseInt(e.target.value) || 1)}
                    className="w-full bg-black/20 text-white rounded-lg px-4 py-3 border border-white/20 focus:border-primary-500 focus:outline-none"
                  />
                </div>

                {/* Margin */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-white font-medium">Margin</label>
                    <span className="text-white/60">{pageNumberMargin}px</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    value={pageNumberMargin}
                    onChange={(e) => setPageNumberMargin(parseInt(e.target.value))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Action Button */}
                <div className="flex justify-center space-x-4">
                  <button
                    onClick={() => setFile(null)}
                    className="btn-secondary"
                  >
                    Remove File
                  </button>
                  <button
                    onClick={handleAddPageNumbers}
                    disabled={isProcessing}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Add Page Numbers'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default WatermarkPDF 