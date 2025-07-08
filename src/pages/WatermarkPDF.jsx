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
  Palette,
  RotateCw,
  Eye
} from 'lucide-react'
import FileDropzone from '../components/FileDropzone'
import { addWatermarkToPDF, downloadFile, getPDFInfo } from '../utils/pdfUtils'

const WatermarkPDF = () => {
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  
  // Watermark settings
  const [watermarkText, setWatermarkText] = useState('CONFIDENTIAL')
  const [fontSize, setFontSize] = useState(50)
  const [opacity, setOpacity] = useState(0.3)
  const [angle, setAngle] = useState(45)
  const [color, setColor] = useState('#808080')
  const [position, setPosition] = useState('center')

  const positions = {
    'top-left': { label: 'Top Left', x: 100, y: 700 },
    'top-center': { label: 'Top Center', x: 300, y: 700 },
    'top-right': { label: 'Top Right', x: 500, y: 700 },
    'center-left': { label: 'Center Left', x: 100, y: 400 },
    'center': { label: 'Center', x: 300, y: 400 },
    'center-right': { label: 'Center Right', x: 500, y: 400 },
    'bottom-left': { label: 'Bottom Left', x: 100, y: 100 },
    'bottom-center': { label: 'Bottom Center', x: 300, y: 100 },
    'bottom-right': { label: 'Bottom Right', x: 500, y: 100 }
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

  const handleAddWatermark = async () => {
    if (files.length === 0) {
      toast.error('Please select a PDF file')
      return
    }

    if (!watermarkText.trim()) {
      toast.error('Please enter watermark text')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    try {
      // Convert hex color to RGB
      const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255
        } : { r: 0.5, g: 0.5, b: 0.5 }
      }

      const selectedPosition = positions[position]
      const watermarkOptions = {
        x: selectedPosition.x,
        y: selectedPosition.y,
        fontSize: fontSize,
        opacity: opacity,
        angle: angle,
        color: hexToRgb(color)
      }

      const watermarkedPdfBytes = await addWatermarkToPDF(
        files[0], 
        watermarkText, 
        watermarkOptions, 
        (progress) => {
          setProgress(progress)
        }
      )
      
      setResult({
        data: watermarkedPdfBytes,
        filename: files[0].name.replace('.pdf', '_watermarked.pdf'),
        settings: {
          text: watermarkText,
          position: positions[position].label,
          fontSize,
          opacity: Math.round(opacity * 100),
          angle,
          color
        }
      })
      
      toast.success('Watermark added successfully!')
    } catch (error) {
      toast.error(`Failed to add watermark: ${error.message}`)
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
    setWatermarkText('CONFIDENTIAL')
    setFontSize(50)
    setOpacity(0.3)
    setAngle(45)
    setColor('#808080')
    setPosition('center')
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
            <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-2xl flex items-center justify-center">
              <Hash className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Add Watermark</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Add text watermarks to your PDF documents for branding, 
            copyright protection, or document classification.
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
            <Info className="w-5 h-5 text-teal-400 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-2">How it works</h3>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Upload a PDF file</li>
                <li>• Enter your watermark text</li>
                <li>• Customize position, size, color, and opacity</li>
                <li>• Preview settings and apply watermark</li>
                <li>• Download the watermarked PDF</li>
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
                  <p className="text-white/60">File Size</p>
                  <p className="text-white font-medium">{(files[0]?.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <div>
                  <p className="text-white/60">Title</p>
                  <p className="text-white font-medium">{pdfInfo.title || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-white/60">Watermark</p>
                  <p className="text-white font-medium">Will be added to all pages</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Watermark Settings */}
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
                Watermark Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Text Input */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-white font-medium mb-2">Watermark Text</label>
                  <input
                    type="text"
                    value={watermarkText}
                    onChange={(e) => setWatermarkText(e.target.value)}
                    placeholder="Enter watermark text"
                    className="input-glass w-full"
                  />
                </div>
                
                {/* Font Size */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Font Size ({fontSize}px)
                  </label>
                  <input
                    type="range"
                    min="20"
                    max="100"
                    value={fontSize}
                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                {/* Opacity */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Opacity ({Math.round(opacity * 100)}%)
                  </label>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={opacity}
                    onChange={(e) => setOpacity(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                {/* Angle */}
                <div>
                  <label className="block text-white font-medium mb-2">
                    Rotation ({angle}°)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="360"
                    value={angle}
                    onChange={(e) => setAngle(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                {/* Color */}
                <div>
                  <label className="block text-white font-medium mb-2">Color</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="color"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="w-12 h-10 rounded border border-white/20"
                    />
                    <input
                      type="text"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                      className="input-glass flex-1"
                    />
                  </div>
                </div>
                
                {/* Position */}
                <div className="col-span-1 md:col-span-2">
                  <label className="block text-white font-medium mb-2">Position</label>
                  <div className="grid grid-cols-3 gap-2">
                    {Object.entries(positions).map(([key, pos]) => (
                      <button
                        key={key}
                        onClick={() => setPosition(key)}
                        className={`p-2 text-sm rounded-lg border transition-all ${
                          position === key
                            ? 'border-teal-500 bg-teal-500/20 text-white'
                            : 'border-white/20 text-white/70 hover:border-white/40'
                        }`}
                      >
                        {pos.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Preview */}
              <div className="mt-6 p-4 bg-white/5 rounded-lg">
                <h4 className="text-white font-medium mb-2 flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </h4>
                <div className="relative bg-white/10 rounded h-32 flex items-center justify-center overflow-hidden">
                  <div
                    style={{
                      fontSize: `${fontSize / 4}px`,
                      opacity: opacity,
                      color: color,
                      transform: `rotate(${angle}deg)`,
                      fontWeight: 'bold',
                      textAlign: 'center'
                    }}
                  >
                    {watermarkText || 'Preview Text'}
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
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Adding Watermark...</h3>
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
                  <h3 className="text-white font-semibold">Watermark Added!</h3>
                  <p className="text-white/60 text-sm">
                    "{result.settings.text}" has been added to all pages
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6 text-sm">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60">Position</p>
                  <p className="text-white font-medium">{result.settings.position}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60">Font Size</p>
                  <p className="text-white font-medium">{result.settings.fontSize}px</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60">Opacity</p>
                  <p className="text-white font-medium">{result.settings.opacity}%</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Watermarked PDF</span>
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Add Another Watermark</span>
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
                onClick={handleAddWatermark}
                disabled={isProcessing}
                className={`btn-primary flex items-center space-x-2 ${
                  isProcessing 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-glow'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>
                  {isProcessing ? 'Adding Watermark...' : 'Add Watermark'}
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

export default WatermarkPDF 