import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  Hash, 
  Download, 
  RotateCcw, 
  Play, 
  ArrowLeft,
  Info,
  CheckCircle,
  FileText,
  Zap,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react'
import FileDropzone from '../components/FileDropzone'
import { addPageNumbersToPDF, downloadFile, getPDFInfo } from '../utils/pdfUtils'

const PageNumbers = () => {
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  
  // Page number settings
  const [position, setPosition] = useState('bottom-right')
  const [fontSize, setFontSize] = useState(12)
  const [startNumber, setStartNumber] = useState(1)
  const [format, setFormat] = useState('number')
  const [prefix, setPrefix] = useState('')
  const [suffix, setSuffix] = useState('')

  const positions = {
    'top-left': { label: 'Top Left', x: 50, y: 750 },
    'top-center': { label: 'Top Center', x: 300, y: 750 },
    'top-right': { label: 'Top Right', x: 550, y: 750 },
    'bottom-left': { label: 'Bottom Left', x: 50, y: 50 },
    'bottom-center': { label: 'Bottom Center', x: 300, y: 50 },
    'bottom-right': { label: 'Bottom Right', x: 550, y: 50 }
  }

  const formats = {
    'number': { label: '1, 2, 3...', format: (n) => n.toString() },
    'roman-lower': { label: 'i, ii, iii...', format: (n) => toRoman(n).toLowerCase() },
    'roman-upper': { label: 'I, II, III...', format: (n) => toRoman(n) },
    'alpha-lower': { label: 'a, b, c...', format: (n) => String.fromCharCode(96 + n) },
    'alpha-upper': { label: 'A, B, C...', format: (n) => String.fromCharCode(64 + n) }
  }

  // Helper function to convert numbers to Roman numerals
  const toRoman = (num) => {
    const values = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    const symbols = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I']
    let result = ''
    
    for (let i = 0; i < values.length; i++) {
      while (num >= values[i]) {
        result += symbols[i]
        num -= values[i]
      }
    }
    return result
  }

  const handleFilesChange = async (newFiles) => {
    setFiles(newFiles)
    setResult(null)
    setProgress(0)
    
    if (newFiles.length > 0) {
      try {
        const info = await getPDFInfo(newFiles[0])
        setPdfInfo(info)
      } catch (error) {
        toast.error('Failed to read PDF information')
      }
    }
  }

  const handleAddPageNumbers = async () => {
    if (files.length === 0) {
      toast.error('Please select a PDF file')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    try {
      const selectedPosition = positions[position]
      const selectedFormat = formats[format]
      
      const options = {
        x: selectedPosition.x,
        y: selectedPosition.y,
        fontSize: fontSize,
        startNumber: startNumber,
        format: (pageNum) => {
          const formattedNum = selectedFormat.format(pageNum)
          return `${prefix}${formattedNum}${suffix}`
        }
      }

      const numberedPdfBytes = await addPageNumbersToPDF(
        files[0], 
        options,
        (progress) => {
          setProgress(progress)
        }
      )
      
      setResult({
        data: numberedPdfBytes,
        filename: files[0].name.replace('.pdf', '_numbered.pdf'),
        settings: {
          position: positions[position].label,
          format: formats[format].label,
          fontSize,
          startNumber,
          totalPages: pdfInfo.pageCount,
          prefix,
          suffix
        }
      })
      
      toast.success('Page numbers added successfully!')
    } catch (error) {
      toast.error(`Failed to add page numbers: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      downloadFile(result.data, result.filename)
      toast.success('Download started!')
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setProgress(0)
    setIsProcessing(false)
    setPdfInfo(null)
    setPosition('bottom-right')
    setFontSize(12)
    setStartNumber(1)
    setFormat('number')
    setPrefix('')
    setSuffix('')
  }

  const getPreviewText = () => {
    const selectedFormat = formats[format]
    const sample1 = selectedFormat.format(startNumber)
    const sample2 = selectedFormat.format(startNumber + 1)
    return `${prefix}${sample1}${suffix}, ${prefix}${sample2}${suffix}...`
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
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Hash className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Add Page Numbers</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Add professional page numbers to your PDF documents. 
            Customize position, format, and styling to match your needs.
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
            <Info className="w-5 h-5 text-indigo-400 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-2">How it works</h3>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Upload a PDF file</li>
                <li>• Choose position and format for page numbers</li>
                <li>• Set starting number and custom prefix/suffix</li>
                <li>• Preview the formatting</li>
                <li>• Download PDF with page numbers added</li>
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
                  <p className="text-white/60">Total Pages</p>
                  <p className="text-white font-medium">{pdfInfo.pageCount}</p>
                </div>
                <div>
                  <p className="text-white/60">File Size</p>
                  <p className="text-white font-medium">{(files[0]?.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <div>
                  <p className="text-white/60">Starting Number</p>
                  <p className="text-white font-medium">{startNumber}</p>
                </div>
                <div>
                  <p className="text-white/60">Ending Number</p>
                  <p className="text-white font-medium">{startNumber + pdfInfo.pageCount - 1}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Page Number Settings */}
        {pdfInfo && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="glass rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Type className="w-5 h-5 mr-2" />
                Page Number Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Position */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-white font-medium mb-2">Position</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(positions).map(([key, pos]) => (
                      <button
                        key={key}
                        onClick={() => setPosition(key)}
                        className={`p-3 text-sm rounded-lg border transition-all ${
                          position === key
                            ? 'border-indigo-500 bg-indigo-500/20 text-white'
                            : 'border-white/20 text-white/70 hover:border-white/40'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Format */}
                <div>
                  <label className="block text-white font-medium mb-2">Number Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    {Object.entries(formats).map(([key, fmt]) => (
                      <option key={key} value={key} className="bg-gray-800">
                        {fmt.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Font Size */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Font Size ({fontSize}px)
                  </label>
                  <input
                    type="range"
                    min="8"
                    max="24"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                {/* Start Number */}
                <div>
                  <label className="block text-white font-medium mb-2">Start Number</label>
                  <input
                    type="number"
                    min="1"
                    value={startNumber}
                    onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
                    className="input-glass w-full"
                  />
                </div>
                
                {/* Prefix */}
                <div>
                  <label className="block text-white font-medium mb-2">Prefix (optional)</label>
                  <input
                    type="text"
                    value={prefix}
                    onChange={(e) => setPrefix(e.target.value)}
                    placeholder="e.g., Page "
                    className="input-glass w-full"
                  />
                </div>
                
                {/* Suffix */}
                <div>
                  <label className="block text-white font-medium mb-2">Suffix (optional)</label>
                  <input
                    type="text"
                    value={suffix}
                    onChange={(e) => setSuffix(e.target.value)}
                    placeholder="e.g., /10"
                    className="input-glass w-full"
                  />
                </div>
              </div>
              
              {/* Preview */}
              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <h4 className="text-white font-medium mb-2">Preview</h4>
                <div className="bg-white/10 rounded p-4 text-center">
                  <div className="text-white/70 text-sm mb-2">
                    Position: {positions[position].label} • Format: {formats[format].label}
                  </div>
                  <div className="text-white font-mono" style={{ fontSize: `${fontSize}px` }}>
                    {getPreviewText()}
                  </div>
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
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Adding Page Numbers...</h3>
                  <p className="text-white/60 text-sm">Processing all pages in your document</p>
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
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Page Numbers Added!</h3>
                  <p className="text-white/60 text-sm">
                    Numbers added to {result.settings.totalPages} pages
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-sm">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60">Position</p>
                  <p className="text-white font-medium">{result.settings.position}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60">Format</p>
                  <p className="text-white font-medium">{result.settings.format}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60">Font Size</p>
                  <p className="text-white font-medium">{result.settings.fontSize}px</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Numbered PDF</span>
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Number Another PDF</span>
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
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleAddPageNumbers}
                disabled={isProcessing}
                className={`btn-primary flex items-center space-x-2 ${
                  isProcessing 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-glow'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>
                  {isProcessing ? 'Adding Numbers...' : 'Add Page Numbers'}
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

export default PageNumbers 