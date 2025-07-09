import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileImage, Upload, FileText, Settings, Download, Palette } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { convertPDFToPNG, convertPDFToMultipleFormats, getPDFInfo } from '../utils/pdfUtils'

const PDFToPNG = () => {
  const [file, setFile] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversionMode, setConversionMode] = useState('png') // 'png' or 'multiple'
  const [selectedFormats, setSelectedFormats] = useState(['png'])
  const [scale, setScale] = useState(2.0)
  const [preserveTransparency, setPreserveTransparency] = useState(true)
  const [backgroundColor, setBackgroundColor] = useState('#ffffff')
  const [quality, setQuality] = useState(0.9)

  const availableFormats = [
    { id: 'png', name: 'PNG', description: 'Lossless with transparency support' },
    { id: 'jpg', name: 'JPG', description: 'Smaller file size, no transparency' },
    { id: 'webp', name: 'WebP', description: 'Modern format, smaller than PNG' }
  ]

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

  const getScaleLabel = (scale) => {
    if (scale >= 3.0) return 'Very High Resolution'
    if (scale >= 2.0) return 'High Resolution'
    if (scale >= 1.5) return 'Medium Resolution'
    return 'Low Resolution'
  }

  const handleFormatToggle = (formatId) => {
    setSelectedFormats(prev => {
      if (prev.includes(formatId)) {
        return prev.filter(f => f !== formatId)
      } else {
        return [...prev, formatId]
      }
    })
  }

  const handleConvertPDF = async () => {
    if (!file) {
      toast.error('Please select a PDF file')
      return
    }

    if (conversionMode === 'multiple' && selectedFormats.length === 0) {
      toast.error('Please select at least one output format')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('Converting PDF to images...')

    try {
      const options = {
        scale,
        preserveTransparency,
        backgroundColor: preserveTransparency ? null : backgroundColor,
        quality
      }

      let result
      if (conversionMode === 'png') {
        result = await convertPDFToPNG(file, options)
        toast.dismiss(loadingToast)
        toast.success(`Successfully converted ${result.imageCount} pages to PNG! Downloads started.`)
      } else {
        result = await convertPDFToMultipleFormats(file, selectedFormats, options)
        toast.dismiss(loadingToast)
        toast.success(`Successfully converted ${result.pagesProcessed} pages to ${selectedFormats.join(', ').toUpperCase()}! Downloads started.`)
      }
      
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
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileImage className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            PDF to PNG
          </h1>
          <p className="text-lg text-white/80">
            Convert PDF pages to PNG images with transparency support
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

            {/* Conversion Mode */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5 text-white/60" />
                <h4 className="text-white font-medium">Conversion Settings</h4>
              </div>

              {/* Mode Selection */}
              <div className="space-y-3">
                <label className="block text-white/80 text-sm font-medium">
                  Conversion Mode
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="png"
                      checked={conversionMode === 'png'}
                      onChange={(e) => setConversionMode(e.target.value)}
                      className="text-primary-500"
                    />
                    <span className="text-white">PNG Only</span>
                    <span className="text-white/60 text-sm">(Best for transparency)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="multiple"
                      checked={conversionMode === 'multiple'}
                      onChange={(e) => setConversionMode(e.target.value)}
                      className="text-primary-500"
                    />
                    <span className="text-white">Multiple Formats</span>
                    <span className="text-white/60 text-sm">(Convert to several formats)</span>
                  </label>
                </div>
              </div>

              {/* Format Selection for Multiple Mode */}
              {conversionMode === 'multiple' && (
                <div className="space-y-3">
                  <label className="block text-white/80 text-sm font-medium">
                    Output Formats
                  </label>
                  <div className="space-y-2">
                    {availableFormats.map(format => (
                      <label key={format.id} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selectedFormats.includes(format.id)}
                          onChange={() => handleFormatToggle(format.id)}
                          className="text-primary-500"
                        />
                        <div>
                          <span className="text-white font-medium">{format.name}</span>
                          <p className="text-white/60 text-sm">{format.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Resolution Scale */}
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
                  max="4"
                  step="0.5"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-white/60">
                  <span>1x</span>
                  <span>2x</span>
                  <span>3x</span>
                  <span>4x</span>
                </div>
              </div>

              {/* Transparency Settings */}
              <div className="space-y-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={preserveTransparency}
                    onChange={(e) => setPreserveTransparency(e.target.checked)}
                    className="text-primary-500"
                  />
                  <span className="text-white text-sm">Preserve transparency (PNG)</span>
                </label>

                {!preserveTransparency && (
                  <div className="space-y-3 ml-6">
                    <label className="block text-white/80 text-sm font-medium">
                      Background Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-8 rounded border border-white/20 bg-transparent cursor-pointer"
                      />
                      <input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        placeholder="#ffffff"
                        className="flex-1 bg-black/20 text-white placeholder-white/50 rounded px-3 py-1 border border-white/20 focus:border-primary-500 focus:outline-none text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Quality Setting (for non-PNG formats) */}
              {conversionMode === 'multiple' && selectedFormats.some(f => f !== 'png') && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="block text-white/80 text-sm font-medium">
                      Image Quality (JPG/WebP)
                    </label>
                    <span className="text-white/60 text-sm">
                      {Math.round(quality * 100)}%
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
              )}
            </div>

            {/* Conversion Info */}
            <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <FileImage className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">PNG Conversion Info:</p>
                  <ul className="text-white/70 space-y-1">
                    <li>• PNG format preserves transparency and quality</li>
                    <li>• Higher resolution scale = better quality, larger files</li>
                    <li>• Transparency preservation works best with PNG format</li>
                    <li>• Each page will be converted to separate image files</li>
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
                disabled={isProcessing || (conversionMode === 'multiple' && selectedFormats.length === 0)}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Converting...' : 
                 conversionMode === 'png' ? 'Convert to PNG' : 
                 `Convert to ${selectedFormats.length} format${selectedFormats.length === 1 ? '' : 's'}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default PDFToPNG 