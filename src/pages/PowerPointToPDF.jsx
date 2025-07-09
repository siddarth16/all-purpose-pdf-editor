import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Presentation, Upload, AlertCircle, Settings, Info, CheckCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { convertPowerPointToPDF } from '../utils/pdfUtils'

const PowerPointToPDF = () => {
  const [file, setFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversionSettings, setConversionSettings] = useState({
    slideLayout: 'slide',
    includeNotes: false,
    includeHiddenSlides: false,
    quality: 'high',
    handoutPages: 1
  })

  const onDrop = (acceptedFiles) => {
    const pptFile = acceptedFiles.find(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation' ||
      file.type === 'application/vnd.ms-powerpoint' ||
      file.name.endsWith('.pptx') ||
      file.name.endsWith('.ppt')
    )
    
    if (!pptFile) {
      toast.error('Please select a PowerPoint file (.ppt, .pptx)')
      return
    }

    setFile(pptFile)
    toast.info('PowerPoint file selected. Note: Basic conversion available - full slide extraction requires server-side processing.')
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': ['.pptx'],
      'application/vnd.ms-powerpoint': ['.ppt']
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

  const handleConvertPowerPoint = async () => {
    if (!file) {
      toast.error('Please select a PowerPoint file')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('Converting PowerPoint to PDF...')
    
    try {
      const result = await convertPowerPointToPDF(file, conversionSettings)
      
      toast.dismiss(loadingToast)
      toast.success(`Successfully created PDF from ${file.name}!`)
      
      if (result.note) {
        toast.info(result.note)
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to convert PowerPoint to PDF')
      console.error('PowerPoint conversion error:', error)
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
            <Presentation className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            PowerPoint to PDF
          </h1>
          <p className="text-lg text-white/80">
            Convert PowerPoint presentations to PDF documents
          </p>
        </div>

        {/* Feature Info */}
        <div className="mb-8 p-6 bg-orange-500/10 border border-orange-500/20 rounded-2xl">
          <div className="flex items-start space-x-4">
            <CheckCircle className="w-6 h-6 text-orange-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-orange-400 font-semibold mb-2">PowerPoint to PDF Conversion</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                This tool creates a basic PDF from PowerPoint files (.ppt, .pptx) with file information.
                Full slide extraction and formatting preservation requires server-side processing.
              </p>
              <p className="text-white/60 text-sm">
                Basic conversion available now - comprehensive slide conversion planned for server version.
              </p>
            </div>
          </div>
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
              {isDragActive ? 'Drop PowerPoint file here' : 'Drag & drop PowerPoint file here'}
            </p>
            <p className="text-white/60">
              or click to select file (.ppt, .pptx)
            </p>
          </div>
        </div>

        {/* File Info & Settings */}
        {file && (
          <div className="mt-8 glass rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Presentation className="w-6 h-6 text-orange-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">{file.name}</h3>
                <p className="text-white/60">
                  {formatFileSize(file.size)} • {file.type || 'PowerPoint Presentation'}
                </p>
              </div>
            </div>

            {/* Conversion Settings */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5 text-white/60" />
                <h4 className="text-white font-medium">Conversion Settings</h4>
              </div>

              {/* Slide Layout */}
              <div className="space-y-3">
                <label className="block text-white/80 text-sm font-medium">
                  PDF Layout
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="slide"
                      checked={conversionSettings.slideLayout === 'slide'}
                      onChange={(e) => setConversionSettings(prev => ({ ...prev, slideLayout: e.target.value }))}
                      className="text-primary-500"
                    />
                    <span className="text-white">Full slide per page</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="handout"
                      checked={conversionSettings.slideLayout === 'handout'}
                      onChange={(e) => setConversionSettings(prev => ({ ...prev, slideLayout: e.target.value }))}
                      className="text-primary-500"
                    />
                    <span className="text-white">Handout format</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="notes"
                      checked={conversionSettings.slideLayout === 'notes'}
                      onChange={(e) => setConversionSettings(prev => ({ ...prev, slideLayout: e.target.value }))}
                      className="text-primary-500"
                    />
                    <span className="text-white">Notes view</span>
                  </label>
                </div>
              </div>

              {/* Handout Pages (if handout selected) */}
              {conversionSettings.slideLayout === 'handout' && (
                <div className="space-y-3">
                  <label className="block text-white/80 text-sm font-medium">
                    Slides per Page
                  </label>
                  <select
                    value={conversionSettings.handoutPages}
                    onChange={(e) => setConversionSettings(prev => ({ ...prev, handoutPages: parseInt(e.target.value) }))}
                    className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                  >
                    <option value={1}>1 slide per page</option>
                    <option value={2}>2 slides per page</option>
                    <option value={4}>4 slides per page</option>
                    <option value={6}>6 slides per page</option>
                    <option value={9}>9 slides per page</option>
                  </select>
                </div>
              )}

              {/* Quality */}
              <div className="space-y-3">
                <label className="block text-white/80 text-sm font-medium">
                  Output Quality
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="high"
                      checked={conversionSettings.quality === 'high'}
                      onChange={(e) => setConversionSettings(prev => ({ ...prev, quality: e.target.value }))}
                      className="text-primary-500"
                    />
                    <span className="text-white">High Quality</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="medium"
                      checked={conversionSettings.quality === 'medium'}
                      onChange={(e) => setConversionSettings(prev => ({ ...prev, quality: e.target.value }))}
                      className="text-primary-500"
                    />
                    <span className="text-white">Medium Quality</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="low"
                      checked={conversionSettings.quality === 'low'}
                      onChange={(e) => setConversionSettings(prev => ({ ...prev, quality: e.target.value }))}
                      className="text-primary-500"
                    />
                    <span className="text-white">Low Quality (Smaller file)</span>
                  </label>
                </div>
              </div>

              {/* Include Notes */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conversionSettings.includeNotes}
                    onChange={(e) => setConversionSettings(prev => ({ ...prev, includeNotes: e.target.checked }))}
                    className="text-primary-500"
                  />
                  <span className="text-white">Include speaker notes</span>
                </label>
                <p className="text-white/60 text-sm ml-6">
                  Add presenter notes below each slide
                </p>
              </div>

              {/* Include Hidden Slides */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conversionSettings.includeHiddenSlides}
                    onChange={(e) => setConversionSettings(prev => ({ ...prev, includeHiddenSlides: e.target.checked }))}
                    className="text-primary-500"
                  />
                  <span className="text-white">Include hidden slides</span>
                </label>
                <p className="text-white/60 text-sm ml-6">
                  Include slides that are marked as hidden in the presentation
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => setFile(null)}
                className="btn-secondary"
              >
                Remove File
              </button>
              <button
                onClick={handleConvertPowerPoint}
                disabled={isProcessing}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Convert to PDF (Demo)'}
              </button>
            </div>

            {/* Server-Side Info */}
            <div className="mt-6 p-4 bg-orange-500/10 border border-orange-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">Server Implementation Features:</p>
                  <ul className="text-white/70 space-y-1">
                    <li>• Full slide layout and formatting preservation</li>
                    <li>• Animation and transition handling</li>
                    <li>• Embedded media extraction and placement</li>
                    <li>• Custom handout layouts and note pages</li>
                    <li>• Slide master and theme preservation</li>
                    <li>• Vector graphics and chart rendering</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Alternative Solutions */}
        <div className="mt-8 glass rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Current Workarounds</h3>
          <div className="space-y-4">
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h4 className="text-green-400 font-medium mb-2">✓ Export from PowerPoint:</h4>
              <p className="text-white/70 text-sm">
                Use "Export as PDF" or "Save as PDF" directly from Microsoft PowerPoint with full layout options.
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <h4 className="text-purple-400 font-medium mb-2">✓ Google Slides:</h4>
              <p className="text-white/70 text-sm">
                Upload to Google Slides and use "File → Download → PDF Document" with various layout options.
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2">✓ LibreOffice Impress:</h4>
              <p className="text-white/70 text-sm">
                Open PowerPoint files in LibreOffice Impress and export as PDF with customizable settings.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PowerPointToPDF 