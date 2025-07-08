import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  FileText, 
  Download, 
  RotateCcw, 
  Play, 
  ArrowLeft,
  Info,
  CheckCircle,
  Eye,
  Zap,
  Copy,
  Search
} from 'lucide-react'
import FileDropzone from '../components/FileDropzone'
import { pdfToImages, downloadFile, getPDFInfo } from '../utils/pdfUtils'
import { createWorker } from 'tesseract.js'

const OCRPDF = () => {
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [extractedText, setExtractedText] = useState('')
  const [currentStep, setCurrentStep] = useState('')
  const [language, setLanguage] = useState('eng')
  const [confidence, setConfidence] = useState(0)

  const supportedLanguages = {
    'eng': 'English',
    'spa': 'Spanish',
    'fra': 'French',
    'deu': 'German',
    'ita': 'Italian',
    'por': 'Portuguese',
    'rus': 'Russian',
    'chi_sim': 'Chinese (Simplified)',
    'chi_tra': 'Chinese (Traditional)',
    'jpn': 'Japanese',
    'kor': 'Korean',
    'ara': 'Arabic',
    'hin': 'Hindi'
  }

  const handleFilesChange = async (newFiles) => {
    setFiles(newFiles)
    setResult(null)
    setProgress(0)
    setExtractedText('')
    setConfidence(0)
    
    if (newFiles.length > 0) {
      try {
        const info = await getPDFInfo(newFiles[0])
        setPdfInfo(info)
      } catch (error) {
        toast.error('Failed to read PDF information')
      }
    }
  }

  const handleOCR = async () => {
    if (files.length === 0) {
      toast.error('Please select a PDF file')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setResult(null)
    setExtractedText('')
    setCurrentStep('Converting PDF to images...')

    try {
      // Step 1: Convert PDF to images
      const images = await pdfToImages(files[0], 'png', (progress) => {
        setProgress(progress * 0.3) // 30% for conversion
      })

      setCurrentStep('Initializing OCR engine...')
      
      // Step 2: Initialize Tesseract worker
      const worker = await createWorker()
      await worker.loadLanguage(language)
      await worker.initialize(language)
      
      setProgress(35)
      setCurrentStep('Extracting text from images...')

      // Step 3: Process each image with OCR
      let fullText = ''
      let totalConfidence = 0
      
      for (let i = 0; i < images.length; i++) {
        const image = images[i]
        setCurrentStep(`Processing page ${i + 1} of ${images.length}...`)
        
        // Convert blob to image URL
        const imageUrl = URL.createObjectURL(image.blob)
        
        // Perform OCR
        const { data: { text, confidence } } = await worker.recognize(imageUrl)
        
        // Add page separator and text
        fullText += `\n\n--- Page ${i + 1} ---\n\n${text.trim()}`
        totalConfidence += confidence
        
        // Clean up
        URL.revokeObjectURL(imageUrl)
        
        // Update progress
        setProgress(35 + ((i + 1) / images.length) * 60) // 60% for OCR processing
      }

      setCurrentStep('Finishing up...')
      
      // Step 4: Clean up worker
      await worker.terminate()
      
      const averageConfidence = Math.round(totalConfidence / images.length)
      setConfidence(averageConfidence)
      setExtractedText(fullText.trim())
      
      setProgress(100)
      setCurrentStep('OCR completed successfully!')
      
      // Create downloadable text file
      const textBlob = new Blob([fullText], { type: 'text/plain' })
      const textArrayBuffer = await textBlob.arrayBuffer()
      
      setResult({
        text: fullText.trim(),
        confidence: averageConfidence,
        pageCount: images.length,
        data: textArrayBuffer,
        filename: files[0].name.replace('.pdf', '_extracted_text.txt'),
        wordCount: fullText.trim().split(/\s+/).filter(word => word.length > 0).length
      })
      
      toast.success('Text extracted successfully!')
    } catch (error) {
      console.error('OCR Error:', error)
      toast.error(`OCR failed: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      downloadFile(result.data, result.filename, 'text/plain')
      toast.success('Download started!')
    }
  }

  const handleCopyText = () => {
    if (extractedText) {
      navigator.clipboard.writeText(extractedText)
      toast.success('Text copied to clipboard!')
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setProgress(0)
    setIsProcessing(false)
    setPdfInfo(null)
    setExtractedText('')
    setCurrentStep('')
    setLanguage('eng')
    setConfidence(0)
  }

  const getConfidenceColor = (confidence) => {
    if (confidence >= 90) return 'green'
    if (confidence >= 70) return 'yellow'
    return 'red'
  }

  const getConfidenceLabel = (confidence) => {
    if (confidence >= 90) return 'Excellent'
    if (confidence >= 70) return 'Good'
    if (confidence >= 50) return 'Fair'
    return 'Poor'
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <Search className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">OCR PDF</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Extract text from scanned PDFs and images using advanced OCR technology. 
            Convert your documents into searchable and editable text.
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
              <h3 className="text-white font-semibold mb-2">OCR Technology</h3>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Optical Character Recognition extracts text from images</li>
                <li>• Supports multiple languages and fonts</li>
                <li>• Works with scanned documents and images</li>
                <li>• Outputs searchable and editable text</li>
                <li>• Powered by Tesseract.js for high accuracy</li>
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

        {/* PDF Info & OCR Settings */}
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
                Document Information & OCR Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Document Info */}
                <div>
                  <h4 className="text-white font-medium mb-3">Document Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-white/60">Total Pages</p>
                      <p className="text-white font-medium">{pdfInfo.pageCount}</p>
                    </div>
                    <div>
                      <p className="text-white/60">File Size</p>
                      <p className="text-white font-medium">{(files[0]?.size / 1024 / 1024).toFixed(1)} MB</p>
                    </div>
                    <div>
                      <p className="text-white/60">Status</p>
                      <p className="text-white font-medium">Ready for OCR</p>
                    </div>
                    <div>
                      <p className="text-white/60">Language</p>
                      <p className="text-white font-medium">{supportedLanguages[language]}</p>
                    </div>
                  </div>
                </div>
                
                {/* OCR Settings */}
                <div>
                  <h4 className="text-white font-medium mb-3">OCR Settings</h4>
                  <div>
                    <label className="block text-white/80 font-medium mb-2">
                      Text Language
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                    >
                      {Object.entries(supportedLanguages).map(([code, name]) => (
                        <option key={code} value={code} className="bg-gray-800">
                          {name}
                        </option>
                      ))}
                    </select>
                    <p className="text-white/60 text-sm mt-1">
                      Select the primary language of your document for better accuracy
                    </p>
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
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Processing OCR...</h3>
                  <p className="text-white/60 text-sm">{currentStep}</p>
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
                  <h3 className="text-white font-semibold">Text Extracted Successfully!</h3>
                  <p className="text-white/60 text-sm">
                    {result.wordCount} words extracted from {result.pageCount} pages
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60">Pages Processed</p>
                  <p className="text-white font-medium">{result.pageCount}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60">Word Count</p>
                  <p className="text-white font-medium">{result.wordCount.toLocaleString()}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60">Confidence</p>
                  <p className={`font-medium text-${getConfidenceColor(result.confidence)}-400`}>
                    {result.confidence}% ({getConfidenceLabel(result.confidence)})
                  </p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60">Language</p>
                  <p className="text-white font-medium">{supportedLanguages[language]}</p>
                </div>
              </div>
              
              {/* Text Preview */}
              <div className="bg-white/5 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-white font-medium flex items-center">
                    <Eye className="w-4 h-4 mr-2" />
                    Extracted Text Preview
                  </h4>
                  <button
                    onClick={handleCopyText}
                    className="btn-secondary text-sm flex items-center space-x-1"
                  >
                    <Copy className="w-3 h-3" />
                    <span>Copy All</span>
                  </button>
                </div>
                <div className="max-h-64 overflow-y-auto bg-black/20 rounded p-3">
                  <pre className="text-white/80 text-sm whitespace-pre-wrap">
                    {extractedText.substring(0, 2000)}
                    {extractedText.length > 2000 && '...'}
                  </pre>
                </div>
                {extractedText.length > 2000 && (
                  <p className="text-white/60 text-xs mt-2">
                    Showing first 2000 characters. Download full text file for complete content.
                  </p>
                )}
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Text File</span>
                </button>
                <button
                  onClick={handleCopyText}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy to Clipboard</span>
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Process Another PDF</span>
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
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleOCR}
                disabled={isProcessing}
                className={`btn-primary flex items-center space-x-2 ${
                  isProcessing 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-glow'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>
                  {isProcessing ? 'Processing...' : 'Extract Text'}
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

export default OCRPDF 