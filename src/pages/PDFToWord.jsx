import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, Upload, AlertCircle, Settings, Info } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { getPDFInfo } from '../utils/pdfUtils'

const PDFToWord = () => {
  const [file, setFile] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversionSettings, setConversionSettings] = useState({
    outputFormat: 'docx',
    preserveLayout: true,
    extractImages: true,
    preserveFormatting: true,
    enableOCR: false
  })

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
      toast.info('PDF selected. Note: Full conversion requires server-side processing.')
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

  const handleConvertPDF = async () => {
    if (!file) {
      toast.error('Please select a PDF file')
      return
    }

    setIsProcessing(true)
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false)
      toast.error('PDF to Word conversion requires server-side processing with specialized libraries. This feature will be available in the server version.')
    }, 2000)
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            PDF to Word
          </h1>
          <p className="text-lg text-white/80">
            Convert PDF documents to editable Word format
          </p>
        </div>

        {/* Important Notice */}
        <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-amber-400 font-semibold mb-2">Server-Side Processing Required</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                Converting PDF to Word is a complex process that requires specialized document processing 
                libraries and OCR capabilities. This cannot be reliably implemented in a web browser due 
                to the complexity of PDF structure analysis and Word document generation.
              </p>
              <p className="text-white/60 text-sm">
                This interface demonstrates the planned feature for server-side implementation.
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
                      value="docx"
                      checked={conversionSettings.outputFormat === 'docx'}
                      onChange={(e) => setConversionSettings(prev => ({ ...prev, outputFormat: e.target.value }))}
                      className="text-primary-500"
                    />
                    <span className="text-white">DOCX (Recommended)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="doc"
                      checked={conversionSettings.outputFormat === 'doc'}
                      onChange={(e) => setConversionSettings(prev => ({ ...prev, outputFormat: e.target.value }))}
                      className="text-primary-500"
                    />
                    <span className="text-white">DOC (Legacy)</span>
                  </label>
                </div>
              </div>

              {/* Preserve Layout */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conversionSettings.preserveLayout}
                    onChange={(e) => setConversionSettings(prev => ({ ...prev, preserveLayout: e.target.checked }))}
                    className="text-primary-500"
                  />
                  <span className="text-white">Preserve original layout</span>
                </label>
                <p className="text-white/60 text-sm ml-6">
                  Maintain page structure, columns, and positioning
                </p>
              </div>

              {/* Extract Images */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conversionSettings.extractImages}
                    onChange={(e) => setConversionSettings(prev => ({ ...prev, extractImages: e.target.checked }))}
                    className="text-primary-500"
                  />
                  <span className="text-white">Extract and embed images</span>
                </label>
                <p className="text-white/60 text-sm ml-6">
                  Include images from PDF in the Word document
                </p>
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
                  <span className="text-white">Preserve text formatting</span>
                </label>
                <p className="text-white/60 text-sm ml-6">
                  Maintain fonts, styles, colors, and sizes
                </p>
              </div>

              {/* Enable OCR */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conversionSettings.enableOCR}
                    onChange={(e) => setConversionSettings(prev => ({ ...prev, enableOCR: e.target.checked }))}
                    className="text-primary-500"
                  />
                  <span className="text-white">Enable OCR for scanned documents</span>
                </label>
                <p className="text-white/60 text-sm ml-6">
                  Extract text from image-based PDFs using OCR technology
                </p>
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
                {isProcessing ? 'Processing...' : `Convert to ${conversionSettings.outputFormat.toUpperCase()} (Demo)`}
              </button>
            </div>

            {/* Server-Side Info */}
            <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">Server Implementation Features:</p>
                  <ul className="text-white/70 space-y-1">
                    <li>• Advanced PDF parsing with pdfplumber/PyPDF2</li>
                    <li>• OCR integration with Tesseract for scanned documents</li>
                    <li>• Table structure recognition and recreation</li>
                    <li>• Image extraction and embedding</li>
                    <li>• Font and style preservation</li>
                    <li>• Complex layout handling (columns, headers, footers)</li>
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
              <h4 className="text-green-400 font-medium mb-2">✓ Online converters:</h4>
              <p className="text-white/70 text-sm">
                Use reputable online PDF to Word converters (be mindful of privacy for sensitive documents).
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <h4 className="text-purple-400 font-medium mb-2">✓ Desktop software:</h4>
              <p className="text-white/70 text-sm">
                Adobe Acrobat, Microsoft Word (Open PDF feature), or LibreOffice Writer can convert PDFs.
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2">✓ Copy and paste:</h4>
              <p className="text-white/70 text-sm">
                For simple documents, copy text from our PDF Reader and paste into Word.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PDFToWord 