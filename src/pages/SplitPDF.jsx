import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  Scissors, 
  Download, 
  RotateCcw, 
  Play, 
  ArrowLeft,
  Info,
  CheckCircle,
  AlertCircle,
  FileText,
  Package
} from 'lucide-react'
import FileDropzone from '../components/FileDropzone'
import { splitPDF, downloadFilesAsZip, getPDFInfo } from '../utils/pdfUtils'

const SplitPDF = () => {
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [splitMode, setSplitMode] = useState('individual') // 'individual' or 'ranges'
  const [pageRanges, setPageRanges] = useState([{ start: 1, end: 1 }])

  const handleFilesChange = async (newFiles) => {
    setFiles(newFiles)
    setResult(null)
    setProgress(0)
    
    if (newFiles.length > 0) {
      try {
        const info = await getPDFInfo(newFiles[0])
        setPdfInfo(info)
        setPageRanges([{ start: 1, end: info.pageCount }])
      } catch (error) {
        toast.error('Failed to read PDF information')
      }
    }
  }

  const handleSplit = async () => {
    if (files.length === 0) {
      toast.error('Please select a PDF file to split')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    try {
      let splitPages = []
      
      if (splitMode === 'individual') {
        // Split into individual pages
        for (let i = 1; i <= pdfInfo.pageCount; i++) {
          splitPages.push({ start: i, end: i })
        }
      } else {
        // Use custom page ranges
        splitPages = pageRanges.filter(range => 
          range.start <= pdfInfo.pageCount && 
          range.end <= pdfInfo.pageCount && 
          range.start <= range.end
        )
      }

      const splitResults = await splitPDF(files[0], splitPages, (progress) => {
        setProgress(progress)
      })
      
      setResult(splitResults)
      toast.success(`PDF split into ${splitResults.length} files!`)
    } catch (error) {
      toast.error(`Failed to split PDF: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      const zipName = `split_${new Date().toISOString().split('T')[0]}.zip`
      downloadFilesAsZip(result, zipName)
      toast.success('Download started!')
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setProgress(0)
    setIsProcessing(false)
    setPdfInfo(null)
    setPageRanges([{ start: 1, end: 1 }])
  }

  const addPageRange = () => {
    setPageRanges([...pageRanges, { start: 1, end: pdfInfo?.pageCount || 1 }])
  }

  const removePageRange = (index) => {
    if (pageRanges.length > 1) {
      const newRanges = pageRanges.filter((_, i) => i !== index)
      setPageRanges(newRanges)
    }
  }

  const updatePageRange = (index, field, value) => {
    const newRanges = [...pageRanges]
    newRanges[index][field] = Math.max(1, Math.min(pdfInfo?.pageCount || 1, parseInt(value) || 1))
    setPageRanges(newRanges)
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
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <Scissors className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Split PDF</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Extract pages from your PDF file. Split into individual pages or custom page ranges.
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
            <Info className="w-5 h-5 text-purple-400 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-2">How it works</h3>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Upload a PDF file</li>
                <li>• Choose split mode: individual pages or custom ranges</li>
                <li>• Configure page ranges if needed</li>
                <li>• Download split files as a ZIP archive</li>
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
                  <p className="text-white/60">Pages</p>
                  <p className="text-white font-medium">{pdfInfo.pageCount}</p>
                </div>
                <div>
                  <p className="text-white/60">Title</p>
                  <p className="text-white font-medium">{pdfInfo.title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/60">Author</p>
                  <p className="text-white font-medium">{pdfInfo.author || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/60">Creator</p>
                  <p className="text-white font-medium">{pdfInfo.creator || 'N/A'}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Split Mode Selection */}
        {pdfInfo && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="glass rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Split Mode</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="splitMode"
                    value="individual"
                    checked={splitMode === 'individual'}
                    onChange={(e) => setSplitMode(e.target.value)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="text-white font-medium">Individual Pages</p>
                    <p className="text-white/60 text-sm">Split into {pdfInfo.pageCount} separate files</p>
                  </div>
                </label>
                
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    name="splitMode"
                    value="ranges"
                    checked={splitMode === 'ranges'}
                    onChange={(e) => setSplitMode(e.target.value)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="text-white font-medium">Custom Ranges</p>
                    <p className="text-white/60 text-sm">Define specific page ranges</p>
                  </div>
                </label>
              </div>
            </div>
          </motion.div>
        )}

        {/* Page Ranges Configuration */}
        {pdfInfo && splitMode === 'ranges' && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold">Page Ranges</h3>
                <button
                  onClick={addPageRange}
                  className="btn-secondary text-sm"
                >
                  Add Range
                </button>
              </div>
              
              <div className="space-y-4">
                {pageRanges.map((range, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <label className="text-white/60 text-sm">From:</label>
                      <input
                        type="number"
                        min="1"
                        max={pdfInfo.pageCount}
                        value={range.start}
                        onChange={(e) => updatePageRange(index, 'start', e.target.value)}
                        className="input-glass w-20"
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <label className="text-white/60 text-sm">To:</label>
                      <input
                        type="number"
                        min="1"
                        max={pdfInfo.pageCount}
                        value={range.end}
                        onChange={(e) => updatePageRange(index, 'end', e.target.value)}
                        className="input-glass w-20"
                      />
                    </div>
                    
                    <div className="text-white/60 text-sm">
                      ({range.end - range.start + 1} pages)
                    </div>
                    
                    {pageRanges.length > 1 && (
                      <button
                        onClick={() => removePageRange(index)}
                        className="text-red-500 hover:text-red-400 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                ))}
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
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Splitting PDF...</h3>
                  <p className="text-white/60 text-sm">Please wait while we extract your pages</p>
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
                  <h3 className="text-white font-semibold">Split Complete!</h3>
                  <p className="text-white/60 text-sm">
                    PDF split into {result.length} files
                  </p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-white font-medium mb-2">Generated Files:</h4>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {result.map((file, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <FileText className="w-4 h-4 text-white/60" />
                      <span className="text-white/80">{file.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Package className="w-4 h-4" />
                  <span>Download as ZIP</span>
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Split Another PDF</span>
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
            transition={{ duration: 0.5, delay: 0.6 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleSplit}
                disabled={isProcessing}
                className={`btn-primary flex items-center space-x-2 ${
                  isProcessing 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-glow'
                }`}
              >
                <Scissors className="w-4 h-4" />
                <span>
                  {isProcessing ? 'Splitting...' : 'Split PDF'}
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

export default SplitPDF 