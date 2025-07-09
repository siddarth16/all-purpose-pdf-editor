import React from 'react'
import { Link } from 'react-router-dom'
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
  Settings
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
    name: 'Protect PDF',
    description: 'Add password protection to PDF',
    icon: Shield,
    path: '/protect-pdf',
    color: 'from-indigo-500 to-indigo-600'
  },
  {
    name: 'Edit PDF',
    description: 'Add text, shapes, and annotations',
    icon: Edit3,
    path: '/edit-pdf',
    color: 'from-pink-500 to-pink-600'
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
  }
]

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
              Ultimate{' '}
              <span className="bg-gradient-to-r from-primary-400 to-accent-400 bg-clip-text text-transparent">
                PDF Toolkit
              </span>
            </h1>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Free online PDF tools. Merge, split, compress, convert, and edit PDFs. 
              No registration required. Your files never leave your browser.
            </p>
          </div>
          
          <div className="flex justify-center space-x-4 mb-16">
            <Link to="/merge-pdf" className="btn-primary">
              Get Started
            </Link>
            <a href="#tools" className="btn-secondary">
              Browse Tools
            </a>
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              All PDF Tools
            </h2>
            <p className="text-lg text-white/80">
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
                <h3 className="text-lg font-semibold text-white mb-2">
                  {tool.name}
                </h3>
                <p className="text-sm text-white/70">
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
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Why Choose Our PDF Toolkit?
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">100% Secure</h3>
              <p className="text-white/70">All processing happens in your browser. Your files never leave your device.</p>
            </div>
            
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Free Forever</h3>
              <p className="text-white/70">No registration, no subscriptions, no hidden fees. Always free to use.</p>
            </div>
            
            <div className="glass rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Settings className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Easy to Use</h3>
              <p className="text-white/70">Simple drag-and-drop interface. No technical knowledge required.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 