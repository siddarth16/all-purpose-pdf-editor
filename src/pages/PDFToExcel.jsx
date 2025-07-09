import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Table, Upload, AlertCircle, Settings, Info } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { getPDFInfo } from '../utils/pdfUtils'

const PDFToExcel = () => {
  const [file, setFile] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversionSettings, setConversionSettings] = useState({
    outputFormat: 'xlsx',
    detectTables: true,
    preserveFormatting: true,
    separateWorksheets: false,
    includeImages: false
  })

  const onDrop = async (acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf')
    if (!pdfFile) {
      toast.error('Please select a PDF file')
      return
    }

    setFile(pdfFile)
    
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
    
    setTimeout(() => {
      setIsProcessing(false)
      toast.error('PDF to Excel conversion requires advanced table detection and spreadsheet generation. This feature will be available in the server version.')
    }, 2000)
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Table className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            PDF to Excel
          </h1>
          <p className="text-lg text-white/80">
            Convert PDF tables and data to Excel spreadsheets
          </p>
        </div>

        {/* Important Notice */}
        <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-amber-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-amber-400 font-semibold mb-2">Advanced Processing Required</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                Converting PDF to Excel requires sophisticated table detection, data extraction, and 
                spreadsheet generation algorithms. This involves complex pattern recognition and 
                structured data analysis that cannot be reliably performed in a web browser.
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
              <Table className="w-6 h-6 text-emerald-400" />
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
                      value="xlsx"
                      checked={conversionSettings.outputFormat === 'xlsx'}
                      onChange={(e) => setConversionSettings(prev => ({ ...prev, outputFormat: e.target.value }))}
                      className="text-primary-500"
                    />
                    <span className="text-white">XLSX (Recommended)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="xls"
                      checked={conversionSettings.outputFormat === 'xls'}
                      onChange={(e) => setConversionSettings(prev => ({ ...prev, outputFormat: e.target.value }))}
                      className="text-primary-500"
                    />
                    <span className="text-white">XLS (Legacy)</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="csv"
                      checked={conversionSettings.outputFormat === 'csv'}
                      onChange={(e) => setConversionSettings(prev => ({ ...prev, outputFormat: e.target.value }))}
                      className="text-primary-500"
                    />
                    <span className="text-white">CSV</span>
                  </label>
                </div>
              </div>

              {/* Detect Tables */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conversionSettings.detectTables}
                    onChange={(e) => setConversionSettings(prev => ({ ...prev, detectTables: e.target.checked }))}
                    className="text-primary-500"
                  />
                  <span className="text-white">Auto-detect tables</span>
                </label>
                <p className="text-white/60 text-sm ml-6">
                  Automatically identify and extract table structures from PDF
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
                  <span className="text-white">Preserve cell formatting</span>
                </label>
                <p className="text-white/60 text-sm ml-6">
                  Maintain fonts, colors, and cell styles from PDF
                </p>
              </div>

              {/* Separate Worksheets */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conversionSettings.separateWorksheets}
                    onChange={(e) => setConversionSettings(prev => ({ ...prev, separateWorksheets: e.target.checked }))}
                    className="text-primary-500"
                  />
                  <span className="text-white">Create separate worksheets for each page</span>
                </label>
                <p className="text-white/60 text-sm ml-6">
                  Put each PDF page in its own Excel worksheet
                </p>
              </div>

              {/* Include Images */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conversionSettings.includeImages}
                    onChange={(e) => setConversionSettings(prev => ({ ...prev, includeImages: e.target.checked }))}
                    className="text-primary-500"
                  />
                  <span className="text-white">Include images and charts</span>
                </label>
                <p className="text-white/60 text-sm ml-6">
                  Embed images and charts from PDF into Excel
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
            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">Server Implementation Features:</p>
                  <ul className="text-white/70 space-y-1">
                    <li>• Advanced table detection with Tabula/pdfplumber</li>
                    <li>• Intelligent data type recognition (numbers, dates, text)</li>
                    <li>• Multi-column table handling</li>
                    <li>• Cell merging and complex layouts</li>
                    <li>• Formula detection and recreation</li>
                    <li>• Batch processing for multiple PDFs</li>
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
                Use specialized PDF to Excel converters (be cautious with sensitive data).
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <h4 className="text-purple-400 font-medium mb-2">✓ Adobe Acrobat:</h4>
              <p className="text-white/70 text-sm">
                Adobe Acrobat Pro has built-in PDF to Excel conversion with table recognition.
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2">✓ Manual extraction:</h4>
              <p className="text-white/70 text-sm">
                Use our PDF Reader to select and copy table data, then paste into Excel.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PDFToExcel 