import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Search, Upload, FileText, Eye, Download, Settings } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { extractTextFromPDFWithOCR, extractTextFromPDF, getPDFInfo } from '../utils/pdfUtils'

const OCRPDF = () => {
  const [file, setFile] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractionType, setExtractionType] = useState('regular') // 'regular' or 'ocr'
  const [ocrLanguage, setOcrLanguage] = useState('eng')
  const [outputFormat, setOutputFormat] = useState('text')
  const [scale, setScale] = useState(2.0)
  const [extractedText, setExtractedText] = useState('')
  const [showPreview, setShowPreview] = useState(false)

  const languages = [
    { code: 'eng', name: 'English' },
    { code: 'spa', name: 'Spanish' },
    { code: 'fra', name: 'French' },
    { code: 'deu', name: 'German' },
    { code: 'ita', name: 'Italian' },
    { code: 'por', name: 'Portuguese' },
    { code: 'rus', name: 'Russian' },
    { code: 'chi_sim', name: 'Chinese (Simplified)' },
    { code: 'jpn', name: 'Japanese' },
    { code: 'kor', name: 'Korean' }
  ]

  const onDrop = async (acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf')
    if (!pdfFile) {
      toast.error('Please select a PDF file')
      return
    }

    setFile(pdfFile)
    setExtractedText('')
    setShowPreview(false)
    
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

  const handleExtractText = async () => {
    if (!file) {
      toast.error('Please select a PDF file')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading(
      extractionType === 'ocr' ? 'Processing OCR...' : 'Extracting text...'
    )

    try {
      let result
      
      if (extractionType === 'ocr') {
        const options = {
          language: ocrLanguage,
          scale: scale,
          outputFormat: outputFormat
        }
        result = await extractTextFromPDFWithOCR(file, options)
      } else {
        result = await extractTextFromPDF(file)
      }

      toast.dismiss(loadingToast)
      
      if (result.success) {
        setExtractedText(result.fullText)
        setShowPreview(true)
        toast.success(`Text extracted from ${result.pagesProcessed} pages! Download started.`)
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to extract text')
    } finally {
      setIsProcessing(false)
    }
  }

  const downloadText = () => {
    if (!extractedText) return
    
    const blob = new Blob([extractedText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `extracted-text-${file.name.replace('.pdf', '.txt')}`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-violet-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            OCR PDF
          </h1>
          <p className="text-lg text-white/80">
            Extract text from PDF documents using OCR technology
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
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
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="w-6 h-6 text-red-400" />
                  <div>
                    <h3 className="text-lg font-semibold text-white">{file.name}</h3>
                    <p className="text-white/60">
                      {formatFileSize(file.size)} • {pdfInfo.pageCount} pages
                    </p>
                  </div>
                </div>

                {/* Extraction Type */}
                <div className="mb-4">
                  <h4 className="text-white font-medium mb-3">Extraction Method</h4>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value="regular"
                        checked={extractionType === 'regular'}
                        onChange={(e) => setExtractionType(e.target.value)}
                        className="text-primary-500"
                      />
                      <span className="text-white">Regular Text Extraction</span>
                      <span className="text-white/60 text-sm">(Fast, works with searchable PDFs)</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value="ocr"
                        checked={extractionType === 'ocr'}
                        onChange={(e) => setExtractionType(e.target.value)}
                        className="text-primary-500"
                      />
                      <span className="text-white">OCR Text Recognition</span>
                      <span className="text-white/60 text-sm">(Slower, works with scanned PDFs)</span>
                    </label>
                  </div>
                </div>

                {/* OCR Settings */}
                {extractionType === 'ocr' && (
                  <div className="space-y-4 mb-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Settings className="w-4 h-4 text-white/60" />
                      <h4 className="text-white font-medium">OCR Settings</h4>
                    </div>
                    
                    {/* Language */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Language
                      </label>
                      <select
                        value={ocrLanguage}
                        onChange={(e) => setOcrLanguage(e.target.value)}
                        className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                      >
                        {languages.map(lang => (
                          <option key={lang.code} value={lang.code}>
                            {lang.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Scale */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-white/80 text-sm font-medium">
                          Image Scale
                        </label>
                        <span className="text-white/60 text-sm">{scale}x</span>
                      </div>
                      <input
                        type="range"
                        min="1"
                        max="3"
                        step="0.5"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-xs text-white/60 mt-1">
                        <span>1x</span>
                        <span>2x</span>
                        <span>3x</span>
                      </div>
                    </div>

                    {/* Output Format */}
                    <div>
                      <label className="block text-white/80 text-sm font-medium mb-2">
                        Output Format
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            value="text"
                            checked={outputFormat === 'text'}
                            onChange={(e) => setOutputFormat(e.target.value)}
                            className="text-primary-500"
                          />
                          <span className="text-white">Text File</span>
                        </label>
                        <label className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="radio"
                            value="pdf"
                            checked={outputFormat === 'pdf'}
                            onChange={(e) => setOutputFormat(e.target.value)}
                            className="text-primary-500"
                          />
                          <span className="text-white">Searchable PDF</span>
                        </label>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setFile(null)}
                    className="btn-secondary flex-1"
                  >
                    Remove File
                  </button>
                  <button
                    onClick={handleExtractText}
                    disabled={isProcessing}
                    className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Extract Text'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-white/60" />
                <h3 className="text-lg font-semibold text-white">Text Preview</h3>
              </div>
              {extractedText && (
                <button
                  onClick={downloadText}
                  className="btn-secondary text-sm py-1 px-3"
                >
                  <Download className="w-4 h-4 inline mr-1" />
                  Download
                </button>
              )}
            </div>

            {extractedText ? (
              <div className="bg-black/20 rounded-lg p-4 h-96 overflow-y-auto">
                <pre className="text-white text-sm whitespace-pre-wrap">
                  {extractedText}
                </pre>
              </div>
            ) : (
              <div className="bg-black/20 rounded-lg p-4 h-96 flex items-center justify-center">
                <div className="text-center">
                  <FileText className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">
                    {file ? 'Click "Extract Text" to see results' : 'Upload a PDF to extract text'}
                  </p>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="mt-4 p-4 bg-violet-500/10 border border-violet-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Search className="w-5 h-5 text-violet-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">OCR Information:</p>
                  <ul className="text-white/70 space-y-1">
                    <li>• Regular extraction is fast but only works with searchable PDFs</li>
                    <li>• OCR works with scanned documents and images</li>
                    <li>• Higher image scale improves OCR accuracy but takes longer</li>
                    <li>• OCR supports multiple languages for better recognition</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OCRPDF 