import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Table, Upload, AlertCircle, Settings, Info, CheckCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { convertExcelToPDF } from '../utils/pdfUtils'

const ExcelToPDF = () => {
  const [file, setFile] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [conversionSettings, setConversionSettings] = useState({
    pageSize: 'A4',
    orientation: 'landscape',
    fitToPage: true,
    includeGridlines: true,
    includeHeaders: true,
    worksheetSelection: 'all'
  })

  const onDrop = (acceptedFiles) => {
    const excelFile = acceptedFiles.find(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.type === 'application/vnd.ms-excel' ||
      file.name.endsWith('.xlsx') ||
      file.name.endsWith('.xls')
    )
    
    if (!excelFile) {
      toast.error('Please select an Excel file (.xls, .xlsx)')
      return
    }

    setFile(excelFile)
    toast.success('Excel file selected and ready for conversion!')
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
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

  const handleConvertExcel = async () => {
    if (!file) {
      toast.error('Please select an Excel file')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('Converting Excel file to PDF...')
    
    try {
      const result = await convertExcelToPDF(file, conversionSettings)
      
      toast.dismiss(loadingToast)
      toast.success(`Successfully converted ${file.name} to PDF!`)
      
      if (result.sheetsProcessed) {
        toast.info(`Converted ${result.sheetsProcessed} worksheet${result.sheetsProcessed === 1 ? '' : 's'} to PDF`)
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to convert Excel file to PDF')
      console.error('Excel conversion error:', error)
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
            <Table className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Excel to PDF
          </h1>
          <p className="text-lg text-white/80">
            Convert Excel spreadsheets to PDF documents
          </p>
        </div>

        {/* Feature Info */}
        <div className="mb-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl">
          <div className="flex items-start space-x-4">
            <CheckCircle className="w-6 h-6 text-green-400 mt-1 flex-shrink-0" />
            <div>
              <h3 className="text-green-400 font-semibold mb-2">Excel to PDF Conversion</h3>
              <p className="text-white/80 text-sm leading-relaxed mb-3">
                This tool converts Excel spreadsheets (.xls, .xlsx) to PDF format using client-side processing.
                Data from all worksheets is extracted and formatted into a table-based PDF layout.
              </p>
              <p className="text-white/60 text-sm">
                Best results with data-heavy spreadsheets. Complex formulas and charts may not display.
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
              {isDragActive ? 'Drop Excel file here' : 'Drag & drop Excel file here'}
            </p>
            <p className="text-white/60">
              or click to select file (.xls, .xlsx)
            </p>
          </div>
        </div>

        {/* File Info & Settings */}
        {file && (
          <div className="mt-8 glass rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <Table className="w-6 h-6 text-green-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">{file.name}</h3>
                <p className="text-white/60">
                  {formatFileSize(file.size)} • {file.type || 'Excel Spreadsheet'}
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
                  <option value="Letter">Letter</option>
                  <option value="Legal">Legal</option>
                  <option value="Tabloid">Tabloid</option>
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
                    <span className="text-white">Landscape (Recommended)</span>
                  </label>
                </div>
              </div>

              {/* Worksheet Selection */}
              <div className="space-y-3">
                <label className="block text-white/80 text-sm font-medium">
                  Worksheets to Convert
                </label>
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="all"
                      checked={conversionSettings.worksheetSelection === 'all'}
                      onChange={(e) => setConversionSettings(prev => ({ ...prev, worksheetSelection: e.target.value }))}
                      className="text-primary-500"
                    />
                    <span className="text-white">All worksheets</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="active"
                      checked={conversionSettings.worksheetSelection === 'active'}
                      onChange={(e) => setConversionSettings(prev => ({ ...prev, worksheetSelection: e.target.value }))}
                      className="text-primary-500"
                    />
                    <span className="text-white">Active worksheet only</span>
                  </label>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      value="selected"
                      checked={conversionSettings.worksheetSelection === 'selected'}
                      onChange={(e) => setConversionSettings(prev => ({ ...prev, worksheetSelection: e.target.value }))}
                      className="text-primary-500"
                    />
                    <span className="text-white">Selected worksheets</span>
                  </label>
                </div>
              </div>

              {/* Fit to Page */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conversionSettings.fitToPage}
                    onChange={(e) => setConversionSettings(prev => ({ ...prev, fitToPage: e.target.checked }))}
                    className="text-primary-500"
                  />
                  <span className="text-white">Fit content to page width</span>
                </label>
                <p className="text-white/60 text-sm ml-6">
                  Scale content to fit within page margins
                </p>
              </div>

              {/* Include Gridlines */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conversionSettings.includeGridlines}
                    onChange={(e) => setConversionSettings(prev => ({ ...prev, includeGridlines: e.target.checked }))}
                    className="text-primary-500"
                  />
                  <span className="text-white">Include gridlines</span>
                </label>
                <p className="text-white/60 text-sm ml-6">
                  Show cell borders in the PDF output
                </p>
              </div>

              {/* Include Headers */}
              <div className="space-y-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={conversionSettings.includeHeaders}
                    onChange={(e) => setConversionSettings(prev => ({ ...prev, includeHeaders: e.target.checked }))}
                    className="text-primary-500"
                  />
                  <span className="text-white">Include row and column headers</span>
                </label>
                <p className="text-white/60 text-sm ml-6">
                  Show A, B, C column headers and 1, 2, 3 row numbers
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
                onClick={handleConvertExcel}
                disabled={isProcessing}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Convert to PDF (Demo)'}
              </button>
            </div>

            {/* Server-Side Info */}
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Info className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">Server Implementation Features:</p>
                  <ul className="text-white/70 space-y-1">
                    <li>• Full Excel formula support and calculation</li>
                    <li>• Chart and graph rendering</li>
                    <li>• Multiple worksheet handling</li>
                    <li>• Cell formatting preservation (colors, fonts, borders)</li>
                    <li>• Page break optimization</li>
                    <li>• Print area respect and custom scaling</li>
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
              <h4 className="text-green-400 font-medium mb-2">✓ Export from Excel:</h4>
              <p className="text-white/70 text-sm">
                Use "Export as PDF" or "Save as PDF" directly from Microsoft Excel or Google Sheets.
              </p>
            </div>
            <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <h4 className="text-purple-400 font-medium mb-2">✓ Print to PDF:</h4>
              <p className="text-white/70 text-sm">
                Open in Excel Online or Google Sheets and use browser's "Print to PDF" feature.
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2">✓ LibreOffice Calc:</h4>
              <p className="text-white/70 text-sm">
                Open Excel files in LibreOffice Calc and export as PDF with extensive formatting options.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExcelToPDF 