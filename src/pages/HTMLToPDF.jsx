import React, { useState } from 'react'
import { FileUp, Globe, Code, Settings, FileText, Download } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { convertHTMLToPDF, convertURLToPDF } from '../utils/pdfUtils'

const HTMLToPDF = () => {
  const [conversionType, setConversionType] = useState('html') // 'html' or 'url'
  const [htmlContent, setHtmlContent] = useState('')
  const [url, setUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [filename, setFilename] = useState('converted-webpage.pdf')
  const [format, setFormat] = useState('a4')
  const [orientation, setOrientation] = useState('portrait')
  const [quality, setQuality] = useState(1)
  const [scale, setScale] = useState(1)

  const sampleHTML = `<!DOCTYPE html>
<html>
<head>
    <title>Sample Document</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        p { line-height: 1.6; }
        .highlight { background-color: yellow; }
    </style>
</head>
<body>
    <h1>Sample HTML Document</h1>
    <p>This is a sample HTML document that will be converted to PDF.</p>
    <p>You can include <strong>bold text</strong>, <em>italic text</em>, and <span class="highlight">highlighted text</span>.</p>
    <ul>
        <li>Bullet point 1</li>
        <li>Bullet point 2</li>
        <li>Bullet point 3</li>
    </ul>
</body>
</html>`

  const handleConvert = async () => {
    if (conversionType === 'html' && !htmlContent.trim()) {
      toast.error('Please enter HTML content')
      return
    }
    
    if (conversionType === 'url' && !url.trim()) {
      toast.error('Please enter a URL')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading(`Converting ${conversionType === 'html' ? 'HTML' : 'webpage'} to PDF...`)

    try {
      const options = {
        filename,
        format,
        orientation,
        quality,
        scale
      }

      if (conversionType === 'html') {
        await convertHTMLToPDF(htmlContent, options)
      } else {
        await convertURLToPDF(url, options)
      }

      toast.dismiss(loadingToast)
      toast.success('PDF created successfully! Download started.')
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to convert to PDF')
    } finally {
      setIsProcessing(false)
    }
  }

  const loadSampleHTML = () => {
    setHtmlContent(sampleHTML)
  }

  const clearContent = () => {
    setHtmlContent('')
    setUrl('')
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-rose-500 to-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileUp className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            HTML to PDF
          </h1>
          <p className="text-lg text-white/80">
            Convert HTML content or web pages to PDF documents
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="glass rounded-2xl p-6">
            {/* Conversion Type */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white mb-4">Conversion Type</h3>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="html"
                    checked={conversionType === 'html'}
                    onChange={(e) => setConversionType(e.target.value)}
                    className="text-primary-500"
                  />
                  <Code className="w-4 h-4 text-white" />
                  <span className="text-white">HTML Code</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="url"
                    checked={conversionType === 'url'}
                    onChange={(e) => setConversionType(e.target.value)}
                    className="text-primary-500"
                  />
                  <Globe className="w-4 h-4 text-white" />
                  <span className="text-white">Website URL</span>
                </label>
              </div>
            </div>

            {/* HTML Input */}
            {conversionType === 'html' && (
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <label className="block text-white font-medium">HTML Content</label>
                  <button
                    onClick={loadSampleHTML}
                    className="text-sm btn-secondary py-1 px-3"
                  >
                    Load Sample
                  </button>
                </div>
                <textarea
                  value={htmlContent}
                  onChange={(e) => setHtmlContent(e.target.value)}
                  placeholder="Enter your HTML content here..."
                  rows="12"
                  className="w-full bg-black/20 text-white placeholder-white/50 rounded-lg px-4 py-3 border border-white/20 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 font-mono text-sm"
                />
              </div>
            )}

            {/* URL Input */}
            {conversionType === 'url' && (
              <div className="mb-6">
                <label className="block text-white font-medium mb-3">Website URL</label>
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full bg-black/20 text-white placeholder-white/50 rounded-lg px-4 py-3 border border-white/20 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                />
                <p className="text-white/60 text-sm mt-2">
                  Note: Some websites may block cross-origin requests
                </p>
              </div>
            )}

            {/* Filename */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">Filename</label>
              <input
                type="text"
                value={filename}
                onChange={(e) => setFilename(e.target.value)}
                className="w-full bg-black/20 text-white placeholder-white/50 rounded-lg px-4 py-3 border border-white/20 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-4">
              <button
                onClick={clearContent}
                className="btn-secondary flex-1"
              >
                Clear
              </button>
              <button
                onClick={handleConvert}
                disabled={isProcessing || (conversionType === 'html' && !htmlContent.trim()) || (conversionType === 'url' && !url.trim())}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Converting...' : 'Convert to PDF'}
              </button>
            </div>
          </div>

          {/* Settings Section */}
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Settings className="w-5 h-5 text-white/60" />
              <h3 className="text-lg font-semibold text-white">PDF Settings</h3>
            </div>

            {/* Format */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">Page Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-black/20 text-white rounded-lg px-4 py-3 border border-white/20 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="a4">A4</option>
                <option value="a3">A3</option>
                <option value="a5">A5</option>
                <option value="letter">Letter</option>
                <option value="legal">Legal</option>
              </select>
            </div>

            {/* Orientation */}
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">Orientation</label>
              <div className="flex space-x-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="portrait"
                    checked={orientation === 'portrait'}
                    onChange={(e) => setOrientation(e.target.value)}
                    className="text-primary-500"
                  />
                  <span className="text-white">Portrait</span>
                </label>
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    value="landscape"
                    checked={orientation === 'landscape'}
                    onChange={(e) => setOrientation(e.target.value)}
                    className="text-primary-500"
                  />
                  <span className="text-white">Landscape</span>
                </label>
              </div>
            </div>

            {/* Quality */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-white font-medium">Quality</label>
                <span className="text-white/60 text-sm">
                  {quality === 1 ? 'High' : quality >= 0.7 ? 'Medium' : 'Low'}
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1"
                step="0.1"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Scale */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <label className="block text-white font-medium">Scale</label>
                <span className="text-white/60 text-sm">
                  {scale}x
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Info */}
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-rose-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">Conversion Notes:</p>
                  <ul className="text-white/70 space-y-1">
                    <li>• HTML content is rendered as it would appear in a browser</li>
                    <li>• CSS styles are preserved in the conversion</li>
                    <li>• External resources may not load due to CORS restrictions</li>
                    <li>• Complex layouts may require adjustment</li>
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

export default HTMLToPDF 