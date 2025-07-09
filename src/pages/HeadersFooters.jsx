import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { 
  FileText, Upload, Settings, AlignLeft, AlignCenter, AlignRight,
  Calendar, Hash, Type, Palette, Layout, Info, CheckCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'
import { addHeadersFootersToPDF, getPDFInfo } from '../utils/pdfUtils'

const HeadersFooters = () => {
  const [file, setFile] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [settings, setSettings] = useState({
    // Header settings
    headerText: '',
    headerPosition: 'center',
    
    // Footer settings
    footerText: '',
    footerPosition: 'center',
    
    // Font settings
    fontSize: 10,
    fontColor: '#000000',
    
    // Margin settings
    marginTop: 30,
    marginBottom: 30,
    marginLeft: 50,
    marginRight: 50,
    
    // Page range settings
    startPage: 1,
    endPage: '',
    showOnFirstPage: true,
    
    // Additional options
    dateFormat: '',
    customText: '',
    includePageNumbers: false,
    pageNumberFormat: 'Page {n}'
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
      setSettings(prev => ({ ...prev, endPage: info.pageCount }))
      toast.success('PDF loaded successfully!')
    } catch (error) {
      toast.error('Failed to load PDF information')
      console.error('PDF info error:', error)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleAddHeadersFooters = async () => {
    if (!file) {
      toast.error('Please select a PDF file')
      return
    }

    if (!settings.headerText && !settings.footerText && !settings.includePageNumbers) {
      toast.error('Please add at least header text, footer text, or enable page numbers')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('Adding headers and footers to PDF...')

    try {
      const options = {
        ...settings,
        endPage: settings.endPage ? parseInt(settings.endPage) : null,
        startPage: parseInt(settings.startPage) || 1,
        fontSize: parseFloat(settings.fontSize) || 10,
        marginTop: parseFloat(settings.marginTop) || 30,
        marginBottom: parseFloat(settings.marginBottom) || 30,
        marginLeft: parseFloat(settings.marginLeft) || 50,
        marginRight: parseFloat(settings.marginRight) || 50
      }

      const result = await addHeadersFootersToPDF(file, options)
      
      toast.dismiss(loadingToast)
      toast.success(`Successfully added headers and footers to ${result.pagesProcessed} pages!`)
      
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to add headers and footers')
      console.error('Headers/Footers error:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const alignmentOptions = [
    { value: 'left', label: 'Left', icon: AlignLeft },
    { value: 'center', label: 'Center', icon: AlignCenter },
    { value: 'right', label: 'Right', icon: AlignRight }
  ]

  const dateFormatOptions = [
    { value: '', label: 'None' },
    { value: 'date', label: 'Date (MM/DD/YYYY)' },
    { value: 'datetime', label: 'Date & Time' }
  ]

  const pageNumberFormats = [
    { value: 'Page {n}', label: 'Page 1' },
    { value: 'Page {n} of {total}', label: 'Page 1 of 10' },
    { value: '{n}', label: '1' },
    { value: '{n}/{total}', label: '1/10' },
    { value: '- {n} -', label: '- 1 -' }
  ]

  if (!file) {
    return (
      <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Layout className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              PDF Headers & Footers
            </h1>
            <p className="text-lg text-secondary">
              Add custom headers and footers to your PDF documents
            </p>
          </div>

          {/* Feature Info */}
          <div className="mb-8 p-6 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl">
            <div className="flex items-start space-x-4">
              <CheckCircle className="w-6 h-6 text-indigo-400 mt-1 flex-shrink-0" />
              <div>
                <h3 className="text-indigo-400 font-semibold mb-2">Professional Document Enhancement</h3>
                <p className="text-white/80 text-sm leading-relaxed mb-3">
                  Add professional headers and footers to your PDF documents with customizable text, 
                  positioning, dates, page numbers, and styling options.
                </p>
                <p className="text-white/60 text-sm">
                  Perfect for reports, presentations, legal documents, and branded materials.
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
              <Upload className="w-12 h-12 text-secondary mx-auto mb-4" />
              <p className="text-primary text-lg mb-2">
                {isDragActive ? 'Drop PDF file here' : 'Drag & drop PDF file here'}
              </p>
              <p className="text-muted">
                or click to select file
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Layout className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">PDF Headers & Footers</h1>
              <p className="text-muted text-sm">{file.name}</p>
            </div>
          </div>
          {pdfInfo && (
            <p className="text-secondary">
              {pdfInfo.pageCount} pages • {formatFileSize(file.size)}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Settings Panel */}
          <div className="space-y-6">
            {/* Header Settings */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Type className="w-5 h-5 text-indigo-400" />
                <h3 className="text-white font-semibold">Header Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Header Text
                  </label>
                  <input
                    type="text"
                    value={settings.headerText}
                    onChange={(e) => handleSettingChange('headerText', e.target.value)}
                    placeholder="Enter header text..."
                    className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Header Alignment
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {alignmentOptions.map(option => {
                      const Icon = option.icon
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleSettingChange('headerPosition', option.value)}
                          className={`p-3 rounded-lg border transition-all ${
                            settings.headerPosition === option.value
                              ? 'bg-primary-500 border-primary-500 text-white'
                              : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          <Icon className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-xs">{option.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Settings */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Type className="w-5 h-5 text-indigo-400" />
                <h3 className="text-white font-semibold">Footer Settings</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Footer Text
                  </label>
                  <input
                    type="text"
                    value={settings.footerText}
                    onChange={(e) => handleSettingChange('footerText', e.target.value)}
                    placeholder="Enter footer text..."
                    className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Footer Alignment
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {alignmentOptions.map(option => {
                      const Icon = option.icon
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleSettingChange('footerPosition', option.value)}
                          className={`p-3 rounded-lg border transition-all ${
                            settings.footerPosition === option.value
                              ? 'bg-primary-500 border-primary-500 text-white'
                              : 'bg-white/10 border-white/20 text-white/70 hover:bg-white/20'
                          }`}
                        >
                          <Icon className="w-4 h-4 mx-auto mb-1" />
                          <span className="text-xs">{option.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Options */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Settings className="w-5 h-5 text-indigo-400" />
                <h3 className="text-white font-semibold">Additional Options</h3>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Date Format
                  </label>
                  <select
                    value={settings.dateFormat}
                    onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                    className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                  >
                    {dateFormatOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.includePageNumbers}
                      onChange={(e) => handleSettingChange('includePageNumbers', e.target.checked)}
                      className="rounded text-primary-500"
                    />
                    <span className="text-white">Include Page Numbers</span>
                  </label>
                </div>

                {settings.includePageNumbers && (
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Page Number Format
                    </label>
                    <select
                      value={settings.pageNumberFormat}
                      onChange={(e) => handleSettingChange('pageNumberFormat', e.target.value)}
                      className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                    >
                      {pageNumberFormats.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.showOnFirstPage}
                      onChange={(e) => handleSettingChange('showOnFirstPage', e.target.checked)}
                      className="rounded text-primary-500"
                    />
                    <span className="text-white">Show on First Page</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Styling and Page Range */}
          <div className="space-y-6">
            {/* Styling Settings */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Palette className="w-5 h-5 text-indigo-400" />
                <h3 className="text-white font-semibold">Styling</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Font Size
                    </label>
                    <input
                      type="number"
                      min="6"
                      max="24"
                      value={settings.fontSize}
                      onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                      className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Font Color
                    </label>
                    <input
                      type="color"
                      value={settings.fontColor}
                      onChange={(e) => handleSettingChange('fontColor', e.target.value)}
                      className="w-full h-10 bg-black/20 rounded-lg border border-white/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Top Margin
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={settings.marginTop}
                      onChange={(e) => handleSettingChange('marginTop', e.target.value)}
                      className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Bottom Margin
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={settings.marginBottom}
                      onChange={(e) => handleSettingChange('marginBottom', e.target.value)}
                      className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Left Margin
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={settings.marginLeft}
                      onChange={(e) => handleSettingChange('marginLeft', e.target.value)}
                      className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Right Margin
                    </label>
                    <input
                      type="number"
                      min="10"
                      max="100"
                      value={settings.marginRight}
                      onChange={(e) => handleSettingChange('marginRight', e.target.value)}
                      className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Page Range */}
            <div className="glass rounded-2xl p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Hash className="w-5 h-5 text-indigo-400" />
                <h3 className="text-white font-semibold">Page Range</h3>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      Start Page
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={pdfInfo?.pageCount || 999}
                      value={settings.startPage}
                      onChange={(e) => handleSettingChange('startPage', e.target.value)}
                      className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-white/80 text-sm font-medium mb-2">
                      End Page
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={pdfInfo?.pageCount || 999}
                      value={settings.endPage}
                      onChange={(e) => handleSettingChange('endPage', e.target.value)}
                      placeholder={`Max: ${pdfInfo?.pageCount || '?'}`}
                      className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                    />
                  </div>
                </div>
                <p className="text-white/60 text-sm">
                  Leave end page empty to apply to all pages from start page onwards
                </p>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={handleAddHeadersFooters}
              disabled={isProcessing}
              className="w-full btn-primary py-4 text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Adding Headers & Footers...' : 'Add Headers & Footers'}
            </button>
          </div>
        </div>

        {/* Usage Info */}
        <div className="mt-8 glass rounded-2xl p-6">
          <div className="flex items-start space-x-3">
            <Info className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-white font-medium mb-1">Headers & Footers Usage:</p>
              <ul className="text-white/70 space-y-1">
                <li>• Add professional headers and footers to brand your documents</li>
                <li>• Use {'{n}'} for page numbers and {'{total}'} for total pages in custom text</li>
                <li>• Choose from automatic date/time insertion options</li>
                <li>• Customize margins, fonts, colors, and alignment</li>
                <li>• Apply to specific page ranges or entire document</li>
                <li>• Perfect for reports, presentations, and legal documents</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HeadersFooters 