import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, Upload, AlertCircle, Settings, Info } from 'lucide-react'
import { toast } from 'react-hot-toast'

const WordToPDF = () => {
  const [file, setFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversionSettings, setConversionSettings] = useState({
    pageSize: 'A4',
    orientation: 'portrait',
    margin: 20,
    preserveFormatting: true
  })

  const onDrop = (acceptedFiles) => {
    const wordFile = acceptedFiles.find(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.type === 'application/msword' ||
      file.name.endsWith('.docx') ||
      file.name.endsWith('.doc')
    )
    
    if (!wordFile) {
      toast.error('Please select a Word document (.doc, .docx)')
      return
    }

    setFile(wordFile)
    toast.info('Word document selected. Note: Full conversion requires server-side processing.')
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc']
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

  const handleConvertWord = async () => {
    if (!file) {
      toast.error('Please select a Word document')
      return
    }

    setIsProcessing(true)
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false)
      toast.error('Word to PDF conversion requires server-side processing. This feature will be available in the server version.')
    }, 2000)
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Word to PDF
          </h1>
          <p className="text-lg text-white/80">
            Convert Word documents to PDF format
          </p>
        </div>

        {/* Important Notice */}
        <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-amber-400 font-semibold mb-2">Client-Side Limitation</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                Converting Word documents to PDF requires complex document processing that cannot be fully 
                implemented in a web browser due to security and technical limitations. For complete Word 
                to PDF conversion with perfect formatting preservation, server-side processing is required.
              </p>
              <p className="text-white/60 text-sm">
                This interface demonstrates the planned feature that will be available in the server version.
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
              {isDragActive ? 'Drop Word document here' : 'Drag & drop Word document here'}
            </p>
            <p className="text-white/60">
              or click to select file (.doc, .docx)
            </p>
          </div>
        </div>

        {/* File Info & Settings */}
        {file && (
          <div className="mt-8 glass rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">{file.name}</h3>
                <p className="text-white/60">
                  {formatFileSize(file.size)} • {file.type || 'Word Document'}
                </p>
              </div>
            </div>

            {/* Conversion Settings */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5 text-white/60" />
                <h4 className="text-white font-medium">Conversion Settings</h4>
              </div>

              {/* Page Size */}
              <div className="space-y-3">
                <label className="block text-white/80 text-sm font-medium">
                  Page Size
                </label>
                <select
                  value={conversionSettings.pageSize}
                  onChange={(e) => setConversionSettings(prev => ({ ...prev, pageSize: e.target.value }))}
                  className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                >
                  <option value="A4">A4</option>
                  <option value="A3">A3</option>
                  <option value="A5">A5</option>
                  <option value="Letter">Letter</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>

              {/* Orientation */}
              <div className="space-y-3">
                <label className="block text-white/80 text-sm font-medium">
                  Orientation
                </label>
                <div className="flex space-x-4">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="portrait"
                      checked={conversionSettings.orientation === 'portrait'}
                      onChange={(e) => setConversionSettings(prev => ({ ...prev, orientation: e.target.value }))}
                      className="text-primary-500"
                    />
                    <span className="text-white">Portrait</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="landscape"
                      checked={conversionSettings.orientation === 'landscape'}
                      onChange={(e) => setConversionSettings(prev => ({ ...prev, orientation: e.target.value }))}
                      className="text-primary-500"
                    />
                    <span className="text-white">Landscape</span>
                  </label>
                </div>
              </div>

              {/* Margin */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-white/80 text-sm font-medium">
                    Margin
                  </label>
                  <span className="text-white/60 text-sm">
                    {conversionSettings.margin}mm
                  </span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="40"
                  value={conversionSettings.margin}
                  onChange={(e) => setConversionSettings(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Preserve Formatting */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conversionSettings.preserveFormatting}
                    onChange={(e) => setConversionSettings(prev => ({ ...prev, preserveFormatting: e.target.checked }))}
                    className="text-primary-500"
                  />
                  <span className="text-white">Preserve original formatting</span>
                </label>
                <p className="text-white/60 text-sm ml-6">
                  Maintain fonts, styles, and layout from the original document
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
                onClick={handleConvertWord}
                disabled={isProcessing}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Convert to PDF (Demo)'}
              </button>
            </div>

            {/* Server-Side Info */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">Future Server Implementation:</p>
                  <ul className="text-white/70 space-y-1">
                    <li>• Perfect formatting preservation using LibreOffice/Pandoc</li>
                    <li>• Support for complex documents with tables and images</li>
                    <li>• Batch processing for multiple documents</li>
                    <li>• Custom styling and template options</li>
                    <li>• Password-protected document support</li>
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
              <h4 className="text-green-400 font-medium mb-2">✓ Use existing tools:</h4>
              <p className="text-white/70 text-sm">
                Save your Word document as PDF directly from Microsoft Word, Google Docs, or LibreOffice Writer.
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <h4 className="text-purple-400 font-medium mb-2">✓ Print to PDF:</h4>
              <p className="text-white/70 text-sm">
                Use your browser's "Print to PDF" feature when viewing documents in online office suites.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WordToPDF 