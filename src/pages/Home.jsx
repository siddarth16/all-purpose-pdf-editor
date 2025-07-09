import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { 
  FileText, 
  Scissors, 
  Minimize2, 
  FileImage, 
  Image, 
  Shield,
  Edit3,
  Droplets,
  Hash,
  Eye,
  Search,
  FileUp,
  Settings,
  Upload,
  ArrowRight
} from 'lucide-react'

const tools = [
  {
    name: 'Merge PDF',
    description: 'Combine multiple PDF files into one',
    icon: FileText,
    path: '/merge-pdf',
    color: 'from-blue-500 to-blue-600'
  },
  {
    name: 'Split PDF',
    description: 'Extract pages from PDF files',
    icon: Scissors,
    path: '/split-pdf',
    color: 'from-purple-500 to-purple-600'
  },
  {
    name: 'Compress PDF',
    description: 'Reduce PDF file size',
    icon: Minimize2,
    path: '/compress-pdf',
    color: 'from-green-500 to-green-600'
  },
  {
    name: 'Edit PDF',
    description: 'Add text, shapes, and annotations',
    icon: Edit3,
    path: '/edit-pdf',
    color: 'from-pink-500 to-pink-600'
  },
  {
    name: 'Protect PDF',
    description: 'Add password protection to PDF',
    icon: Shield,
    path: '/protect-pdf',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    name: 'Watermark PDF',
    description: 'Add watermarks to PDF files',
    icon: Droplets,
    path: '/watermark-pdf',
    color: 'from-cyan-500 to-cyan-600'
  },
  {
    name: 'Page Numbers',
    description: 'Add page numbers to PDF',
    icon: Hash,
    path: '/page-numbers',
    color: 'from-yellow-500 to-yellow-600'
  },
  {
    name: 'PDF to JPG',
    description: 'Convert PDF pages to JPG images',
    icon: FileImage,
    path: '/pdf-to-jpg',
    color: 'from-orange-500 to-orange-600'
  },
  {
    name: 'JPG to PDF',
    description: 'Convert JPG images to PDF',
    icon: Image,
    path: '/jpg-to-pdf',
    color: 'from-red-500 to-red-600'
  },
  {
    name: 'PDF to PNG',
    description: 'Convert PDF pages to PNG images',
    icon: FileImage,
    path: '/pdf-to-png',
    color: 'from-emerald-500 to-emerald-600'
  },
  {
    name: 'PNG to PDF',
    description: 'Convert PNG images to PDF',
    icon: Image,
    path: '/png-to-pdf',
    color: 'from-lime-500 to-lime-600'
  },
  {
    name: 'PDF Reader',
    description: 'View and read PDF files',
    icon: Eye,
    path: '/pdf-reader',
    color: 'from-teal-500 to-teal-600'
  },
  {
    name: 'OCR PDF',
    description: 'Extract text from scanned PDFs',
    icon: Search,
    path: '/ocr-pdf',
    color: 'from-violet-500 to-violet-600'
  },
  {
    name: 'HTML to PDF',
    description: 'Convert HTML pages to PDF',
    icon: FileUp,
    path: '/html-to-pdf',
    color: 'from-rose-500 to-rose-600'
  },
  {
    name: 'Word to PDF',
    description: 'Convert Word documents to PDF',
    icon: FileText,
    path: '/word-to-pdf',
    color: 'from-blue-400 to-blue-500'
  },
  {
    name: 'Excel to PDF',
    description: 'Convert Excel spreadsheets to PDF',
    icon: FileText,
    path: '/excel-to-pdf',
    color: 'from-green-400 to-green-500'
  },
  {
    name: 'PowerPoint to PDF',
    description: 'Convert PowerPoint presentations to PDF',
    icon: FileText,
    path: '/powerpoint-to-pdf',
    color: 'from-red-400 to-red-500'
  },
  {
    name: 'PDF to Word',
    description: 'Convert PDF to Word documents',
    icon: FileText,
    path: '/pdf-to-word',
    color: 'from-blue-600 to-blue-700'
  },
  {
    name: 'PDF to Excel',
    description: 'Convert PDF to Excel spreadsheets',
    icon: FileText,
    path: '/pdf-to-excel',
    color: 'from-green-600 to-green-700'
  },
  {
    name: 'Unlock PDF',
    description: 'Remove password protection from PDF',
    icon: Settings,
    path: '/unlock-pdf',
    color: 'from-amber-500 to-amber-600'
  },
  {
    name: 'Organize PDF',
    description: 'Reorder, rotate, and manage PDF pages',
    icon: Settings,
    path: '/organize-pdf',
    color: 'from-slate-500 to-slate-600'
  }
]

const Home = () => {
  const [suggestions, setSuggestions] = useState([])
  const [isDragActive, setIsDragActive] = useState(false)

  const getSuggestions = (files) => {
    const suggestions = []
    
    files.forEach(file => {
      if (file.type === 'application/pdf') {
        suggestions.push(
          { name: 'Merge PDF', path: '/merge-pdf', description: 'Combine with other PDFs' },
          { name: 'Split PDF', path: '/split-pdf', description: 'Extract specific pages' },
          { name: 'Compress PDF', path: '/compress-pdf', description: 'Reduce file size' },
          { name: 'Edit PDF', path: '/edit-pdf', description: 'Add text and annotations' },
          { name: 'Protect PDF', path: '/protect-pdf', description: 'Add password protection' }
        )
      } else if (file.type.startsWith('image/')) {
        if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
          suggestions.push({ name: 'JPG to PDF', path: '/jpg-to-pdf', description: 'Convert to PDF' })
        } else if (file.type === 'image/png') {
          suggestions.push({ name: 'PNG to PDF', path: '/png-to-pdf', description: 'Convert to PDF' })
        }
      }
    })
    
    return suggestions.slice(0, 5) // Limit to 5 suggestions
  }

  const onDrop = (acceptedFiles) => {
    const fileSuggestions = getSuggestions(acceptedFiles)
    setSuggestions(fileSuggestions)
  }

  const { getRootProps, getInputProps, isDragActive: dropzoneActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    multiple: true
  })

  const quickActions = [
    { name: 'Merge PDF', path: '/merge-pdf', icon: FileText, color: 'from-blue-500 to-blue-600' },
    { name: 'Split PDF', path: '/split-pdf', icon: Scissors, color: 'from-purple-500 to-purple-600' },
    { name: 'Compress PDF', path: '/compress-pdf', icon: Minimize2, color: 'from-green-500 to-green-600' },
    { name: 'Edit PDF', path: '/edit-pdf', icon: Edit3, color: 'from-pink-500 to-pink-600' }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary mb-4">
              Ultimate{' '}
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                PDF Toolkit
              </span>
            </h1>
            <p className="text-xl text-secondary max-w-3xl mx-auto">
              Free online PDF tools. Merge, split, compress, convert, and edit PDFs. 
              No registration required. Your files never leave your browser.
            </p>
          </div>
          
          {/* Smart File Upload Area */}
          <div className="max-w-4xl mx-auto mb-16">
            <div
              {...getRootProps()}
              className={`glass rounded-2xl p-8 border-2 border-dashed transition-all duration-300 cursor-pointer ${
                dropzoneActive 
                  ? 'border-primary-400 bg-primary-500/10' 
                  : 'border-white/30 hover:border-white/50'
              }`}
            >
              <input {...getInputProps()} />
              <div className="text-center">
                <Upload className="w-12 h-12 text-secondary mx-auto mb-4" />
                <p className="text-primary text-lg mb-2">
                  {dropzoneActive ? 'Drop your files here' : 'Drop files here or click to upload'}
                </p>
                <p className="text-muted text-sm">
                  Supports PDF, JPG, PNG files • We'll suggest the best tools for your files
                </p>
              </div>
            </div>

            {/* File Suggestions */}
            {suggestions.length > 0 && (
              <div className="mt-6 glass rounded-xl p-6">
                <h3 className="text-primary font-semibold mb-4">Suggested actions for your files:</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {suggestions.map((suggestion, index) => (
                    <Link
                      key={index}
                      to={suggestion.path}
                      className="flex items-center space-x-3 p-3 rounded-lg hover:bg-white/10 transition-colors duration-200"
                    >
                      <ArrowRight className="w-4 h-4 text-primary" />
                      <div>
                        <p className="text-primary font-medium text-sm">{suggestion.name}</p>
                        <p className="text-muted text-xs">{suggestion.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mt-6">
              <p className="text-secondary mb-4">Or choose a quick action:</p>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {quickActions.map((action) => (
                  <Link
                    key={action.name}
                    to={action.path}
                    className="flex items-center space-x-3 p-4 glass rounded-xl hover:bg-white/10 transition-all duration-200 hover:scale-105"
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${action.color} rounded-lg flex items-center justify-center`}>
                      <action.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-secondary text-sm font-medium">{action.name}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <a href="#tools" className="btn-secondary">
                Browse All Tools
              </a>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-primary-500/20 rounded-full blur-xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent-500/20 rounded-full blur-xl animate-float delay-1000"></div>
      </section>

      {/* Tools Grid */}
      <section id="tools" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              All PDF Tools
            </h2>
            <p className="text-lg text-secondary">
              Everything you need to work with PDF files
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool.name}
                to={tool.path}
                className="tool-card group"
              >
                <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <tool.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {tool.name}
                </h3>
                <p className="text-sm text-secondary">
                  {tool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary mb-4">
              Why Choose Our PDF Toolkit?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">100% Secure</h3>
              <p className="text-secondary">All processing happens in your browser. Your files never leave your device.</p>
            </div>
            
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Free Forever</h3>
              <p className="text-secondary">No registration, no subscriptions, no hidden fees. Always free to use.</p>
            </div>
            
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-primary mb-2">Easy to Use</h3>
              <p className="text-secondary">Simple drag-and-drop interface. No technical knowledge required.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 