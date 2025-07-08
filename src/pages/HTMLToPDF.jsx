import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  Code, 
  Download, 
  RotateCcw, 
  Play, 
  ArrowLeft,
  Info,
  CheckCircle,
  FileText,
  Zap,
  Eye,
  Layout,
  Settings
} from 'lucide-react'
import { htmlToPDF, downloadFile } from '../utils/pdfUtils'

const HTMLToPDF = () => {
  const [htmlContent, setHtmlContent] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [previewMode, setPreviewMode] = useState(false)
  
  // PDF options
  const [orientation, setOrientation] = useState('portrait')
  const [format, setFormat] = useState('a4')
  const [margins, setMargins] = useState(20)

  const defaultHTML = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Document</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            margin: 0;
            padding: 20px;
            color: #333;
        }
        .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }
        .header h1 {
            color: #2563eb;
            margin: 0;
        }
        .content {
            max-width: 800px;
            margin: 0 auto;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: #1e40af;
            border-left: 4px solid #3b82f6;
            padding-left: 15px;
        }
        .highlight {
            background-color: #fef3c7;
            padding: 10px;
            border-radius: 5px;
            margin: 10px 0;
        }
        .footer {
            text-align: center;
            margin-top: 50px;
            padding-top: 20px;
            border-top: 1px solid #ccc;
            color: #666;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>HTML to PDF Converter</h1>
        <p>Convert your HTML content to professional PDF documents</p>
    </div>
    
    <div class="content">
        <div class="section">
            <h2>Welcome</h2>
            <p>This is a sample HTML document that demonstrates various formatting options. You can edit this content or replace it with your own HTML.</p>
            
            <div class="highlight">
                <strong>Tip:</strong> You can use CSS to style your document and make it look professional.
            </div>
        </div>
        
        <div class="section">
            <h2>Features</h2>
            <ul>
                <li>Professional PDF generation</li>
                <li>Custom CSS styling</li>
                <li>Multiple page formats</li>
                <li>Responsive design support</li>
            </ul>
        </div>
        
        <div class="section">
            <h2>Getting Started</h2>
            <ol>
                <li>Write or paste your HTML content</li>
                <li>Preview the result</li>
                <li>Configure PDF settings</li>
                <li>Generate and download your PDF</li>
            </ol>
        </div>
    </div>
    
    <div class="footer">
        <p>Generated with HTML to PDF Converter</p>
    </div>
</body>
</html>`

  const pageFormats = {
    'a4': { label: 'A4 (210 × 297 mm)', width: 210, height: 297 },
    'letter': { label: 'Letter (8.5 × 11 in)', width: 216, height: 279 },
    'legal': { label: 'Legal (8.5 × 14 in)', width: 216, height: 356 },
    'a3': { label: 'A3 (297 × 420 mm)', width: 297, height: 420 },
    'tabloid': { label: 'Tabloid (11 × 17 in)', width: 279, height: 432 }
  }

  React.useEffect(() => {
    if (!htmlContent.trim()) {
      setHtmlContent(defaultHTML)
    }
  }, [])

  const handleConvert = async () => {
    if (!htmlContent.trim()) {
      toast.error('Please enter HTML content')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    try {
      const options = {
        orientation: orientation,
        format: format,
        border: {
          top: margins + 'mm',
          right: margins + 'mm',
          bottom: margins + 'mm',
          left: margins + 'mm'
        }
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 10
          return newProgress >= 90 ? 90 : newProgress
        })
      }, 200)

      const pdfBytes = await htmlToPDF(htmlContent, options)

      clearInterval(progressInterval)
      setProgress(100)
      
      setResult({
        data: pdfBytes,
        filename: 'document.pdf',
        settings: {
          orientation: orientation,
          format: pageFormats[format].label,
          margins: margins,
          contentLength: htmlContent.length
        }
      })
      
      toast.success('PDF generated successfully!')
    } catch (error) {
      toast.error(`Failed to generate PDF: ${error.message}`)
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
    setHtmlContent(defaultHTML)
    setResult(null)
    setProgress(0)
    setIsProcessing(false)
    setPreviewMode(false)
    setOrientation('portrait')
    setFormat('a4')
    setMargins(20)
  }

  const handleLoadTemplate = (templateName) => {
    const templates = {
      'basic': defaultHTML,
      'invoice': `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
        .invoice-details { margin-bottom: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total { text-align: right; margin-top: 20px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <h1>INVOICE</h1>
            <p>Invoice #: 001</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
        <div>
            <strong>Company Name</strong><br>
            123 Business St<br>
            City, State 12345
        </div>
    </div>
    
    <div class="invoice-details">
        <strong>Bill To:</strong><br>
        Customer Name<br>
        456 Customer Ave<br>
        City, State 67890
    </div>
    
    <table>
        <tr>
            <th>Description</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
        </tr>
        <tr>
            <td>Product/Service 1</td>
            <td>1</td>
            <td>$100.00</td>
            <td>$100.00</td>
        </tr>
        <tr>
            <td>Product/Service 2</td>
            <td>2</td>
            <td>$50.00</td>
            <td>$100.00</td>
        </tr>
    </table>
    
    <div class="total">
        <p>Subtotal: $200.00</p>
        <p>Tax: $20.00</p>
        <p><strong>Total: $220.00</strong></p>
    </div>
</body>
</html>`,
      'report': `<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; }
        .section { margin: 30px 0; }
        .section h2 { color: #333; border-left: 4px solid #007bff; padding-left: 15px; }
        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat { text-align: center; padding: 20px; background: #f8f9fa; border-radius: 8px; }
        .stat h3 { margin: 0; color: #007bff; }
        .stat p { margin: 5px 0 0 0; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Monthly Report</h1>
        <p>Generated on ${new Date().toLocaleDateString()}</p>
    </div>
    
    <div class="section">
        <h2>Executive Summary</h2>
        <p>This report provides an overview of key metrics and performance indicators for the current month.</p>
    </div>
    
    <div class="stats">
        <div class="stat">
            <h3>1,234</h3>
            <p>Total Users</p>
        </div>
        <div class="stat">
            <h3>$56,789</h3>
            <p>Revenue</p>
        </div>
        <div class="stat">
            <h3>98.5%</h3>
            <p>Uptime</p>
        </div>
    </div>
    
    <div class="section">
        <h2>Key Findings</h2>
        <ul>
            <li>User engagement increased by 15% compared to last month</li>
            <li>Revenue grew by 8% month-over-month</li>
            <li>Customer satisfaction rating improved to 4.7/5</li>
        </ul>
    </div>
</body>
</html>`
    }
    
    setHtmlContent(templates[templateName] || defaultHTML)
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Code className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">HTML to PDF</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Convert HTML content to professional PDF documents. 
            Perfect for reports, invoices, and formatted documents.
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
            <Info className="w-5 h-5 text-blue-400 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-2">How it works</h3>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Write or paste your HTML content</li>
                <li>• Use CSS for styling and formatting</li>
                <li>• Configure page settings and margins</li>
                <li>• Preview your document before converting</li>
                <li>• Generate and download the PDF</li>
              </ul>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* HTML Editor */}
          <motion.div
            className="lg:col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center">
                  <Code className="w-5 h-5 mr-2" />
                  HTML Editor
                </h3>
                <div className="flex items-center space-x-2">
                  <select
                    onChange={(e) => handleLoadTemplate(e.target.value)}
                    className="text-sm bg-white/10 border border-white/20 rounded-lg text-white px-3 py-1"
                  >
                    <option value="" className="bg-gray-800">Load Template</option>
                    <option value="basic" className="bg-gray-800">Basic Document</option>
                    <option value="invoice" className="bg-gray-800">Invoice</option>
                    <option value="report" className="bg-gray-800">Report</option>
                  </select>
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`btn-secondary text-sm flex items-center space-x-1 ${
                      previewMode ? 'bg-blue-500/20 border-blue-500/50' : ''
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>{previewMode ? 'Edit' : 'Preview'}</span>
                  </button>
                </div>
              </div>
              
              {previewMode ? (
                <div className="bg-white rounded-lg p-4 max-h-96 overflow-y-auto">
                  <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
                </div>
              ) : (
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  className="w-full h-96 bg-black/20 border border-white/20 rounded-lg p-4 text-white font-mono text-sm resize-none focus:outline-none focus:border-blue-500"
                  placeholder="Enter your HTML content here..."
                />
              )}
              
              <div className="flex items-center justify-between mt-4 text-sm text-white/60">
                <span>Characters: {htmlContent.length.toLocaleString()}</span>
                <span>Lines: {htmlContent.split('\n').length}</span>
              </div>
            </div>
          </motion.div>

          {/* Settings Panel */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            {/* PDF Settings */}
            <div className="glass rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
                PDF Settings
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 font-medium mb-2">
                    Page Format
                  </label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="w-full p-2 bg-white/10 border border-white/20 rounded-lg text-white"
                  >
                    {Object.entries(pageFormats).map(([key, fmt]) => (
                      <option key={key} value={key} className="bg-gray-800">
                        {fmt.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-white/80 font-medium mb-2">
                    Orientation
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="orientation"
                        value="portrait"
                        checked={orientation === 'portrait'}
                        onChange={(e) => setOrientation(e.target.value)}
                        className="w-4 h-4 text-blue-500"
                      />
                      <span className="text-white">Portrait</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        name="orientation"
                        value="landscape"
                        checked={orientation === 'landscape'}
                        onChange={(e) => setOrientation(e.target.value)}
                        className="w-4 h-4 text-blue-500"
                      />
                      <span className="text-white">Landscape</span>
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/80 font-medium mb-2">
                    Margins ({margins}mm)
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="40"
                    value={margins}
                    onChange={(e) => setMargins(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-white/60 mt-1">
                    <span>10mm</span>
                    <span>40mm</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            {isProcessing && (
              <div className="glass rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <Play className="w-4 h-4 text-white animate-pulse" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">Generating PDF...</h3>
                    <p className="text-white/60 text-sm">Converting HTML to PDF document</p>
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
            )}

            {/* Result */}
            {result && (
              <div className="glass rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">PDF Generated!</h3>
                    <p className="text-white/60 text-sm">
                      Document is ready for download
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/60">Format:</span>
                    <span className="text-white">{result.settings.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Orientation:</span>
                    <span className="text-white">{result.settings.orientation}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Margins:</span>
                    <span className="text-white">{result.settings.margins}mm</span>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <button
                    onClick={handleDownload}
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download PDF</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="btn-secondary flex items-center space-x-2"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {!result && (
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleConvert}
                  disabled={isProcessing}
                  className={`btn-primary flex items-center space-x-2 ${
                    isProcessing 
                      ? 'opacity-50 cursor-not-allowed' 
                      : 'hover:shadow-glow'
                  }`}
                >
                  <Zap className="w-4 h-4" />
                  <span>
                    {isProcessing ? 'Generating...' : 'Generate PDF'}
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
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default HTMLToPDF 