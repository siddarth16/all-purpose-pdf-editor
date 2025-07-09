import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Scissors, Upload, X, FileText, Download } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { splitPDF, getPDFInfo } from '../utils/pdfUtils'

const SplitPDF = () => {
  const [file, setFile] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [splitMode, setSplitMode] = useState('all') // 'all' or 'range'
  const [pageRanges, setPageRanges] = useState([{ start: 1, end: 1, name: 'pages-1-1' }])

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

  const addPageRange = () => {
    const newRange = {
      start: 1,
      end: pdfInfo?.pageCount || 1,
      name: `pages-${pageRanges.length + 1}`
    }
    setPageRanges([...pageRanges, newRange])
  }

  const updatePageRange = (index, field, value) => {
    const updated = [...pageRanges]
    updated[index][field] = value
    setPageRanges(updated)
  }

  const removePageRange = (index) => {
    if (pageRanges.length > 1) {
      setPageRanges(pageRanges.filter((_, i) => i !== index))
    }
  }

  const handleSplitPDF = async () => {
    if (!file) {
      toast.error('Please select a PDF file')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('Splitting PDF...')

    try {
      if (splitMode === 'all') {
        await splitPDF(file)
        toast.dismiss(loadingToast)
        toast.success('PDF split into individual pages! Downloads started.')
      } else {
        // Validate page ranges
        const validRanges = pageRanges.filter(range => {
          const start = parseInt(range.start)
          const end = parseInt(range.end)
          return start >= 1 && end >= start && end <= pdfInfo.pageCount
        })

        if (validRanges.length === 0) {
          toast.dismiss(loadingToast)
          toast.error('Please specify valid page ranges')
          return
        }

        const ranges = validRanges.map(range => ({
          start: parseInt(range.start),
          end: parseInt(range.end),
          name: range.name,
          pages: Array.from(
            { length: parseInt(range.end) - parseInt(range.start) + 1 },
            (_, i) => parseInt(range.start) + i - 1
          )
        }))

        await splitPDF(file, ranges)
        toast.dismiss(loadingToast)
        toast.success('PDF split successfully! Downloads started.')
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to split PDF')
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
            <Scissors className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Split PDF
          </h1>
          <p className="text-lg text-white/80">
            Extract pages from your PDF document
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

        {/* File Info */}
        {file && pdfInfo && (
          <div className="mt-8 glass rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-4">
              <FileText className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">{file.name}</h3>
                <p className="text-white/60">{pdfInfo.pageCount} pages</p>
              </div>
            </div>

            {/* Split Mode Selection */}
            <div className="mb-6">
              <h4 className="text-white font-medium mb-3">Split Mode</h4>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="all"
                    checked={splitMode === 'all'}
                    onChange={(e) => setSplitMode(e.target.value)}
                    className="text-primary-500"
                  />
                  <span className="text-white">Split into individual pages</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="range"
                    checked={splitMode === 'range'}
                    onChange={(e) => setSplitMode(e.target.value)}
                    className="text-primary-500"
                  />
                  <span className="text-white">Split by page ranges</span>
                </label>
              </div>
            </div>

            {/* Page Ranges */}
            {splitMode === 'range' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium">Page Ranges</h4>
                  <button
                    onClick={addPageRange}
                    className="btn-secondary text-sm py-1 px-3"
                  >
                    Add Range
                  </button>
                </div>
                <div className="space-y-3">
                  {pageRanges.map((range, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-white/5 rounded-lg">
                      <input
                        type="text"
                        placeholder="Name"
                        value={range.name}
                        onChange={(e) => updatePageRange(index, 'name', e.target.value)}
                        className="flex-1 bg-black/20 text-white placeholder-white/50 rounded px-3 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                      />
                      <input
                        type="number"
                        placeholder="Start"
                        value={range.start}
                        onChange={(e) => updatePageRange(index, 'start', parseInt(e.target.value) || 1)}
                        min="1"
                        max={pdfInfo.pageCount}
                        className="w-20 bg-black/20 text-white placeholder-white/50 rounded px-3 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                      />
                      <span className="text-white/60">to</span>
                      <input
                        type="number"
                        placeholder="End"
                        value={range.end}
                        onChange={(e) => updatePageRange(index, 'end', parseInt(e.target.value) || 1)}
                        min="1"
                        max={pdfInfo.pageCount}
                        className="w-20 bg-black/20 text-white placeholder-white/50 rounded px-3 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                      />
                      {pageRanges.length > 1 && (
                        <button
                          onClick={() => removePageRange(index)}
                          className="p-1 rounded hover:bg-white/10 text-red-400 hover:text-red-300"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setFile(null)}
                className="btn-secondary"
              >
                Remove File
              </button>
              <button
                onClick={handleSplitPDF}
                disabled={isProcessing}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Split PDF'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SplitPDF 