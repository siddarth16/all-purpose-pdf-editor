import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText,
  Scissors,
  Combine,
  Compress,
  FileImage,
  Image,
  Edit3,
  RotateCw,
  Shield,
  Unlock,
  PenTool,
  Droplets,
  Hash,
  Wrench,
  Eye,
  Scan,
  Globe,
  ArrowRight,
  Star,
  Zap,
  Users,
  Lock,
  Download,
  Sparkles
} from 'lucide-react'

const Home = () => {
  const pdfTools = [
    {
      name: 'Merge PDF',
      description: 'Combine multiple PDF files into one',
      icon: Combine,
      path: '/merge-pdf',
      color: 'from-blue-500 to-blue-600',
      popular: true
    },
    {
      name: 'Split PDF',
      description: 'Extract pages from your PDF',
      icon: Scissors,
      path: '/split-pdf',
      color: 'from-purple-500 to-purple-600',
      popular: true
    },
    {
      name: 'Compress PDF',
      description: 'Reduce PDF file size',
      icon: Compress,
      path: '/compress-pdf',
      color: 'from-green-500 to-green-600',
      popular: true
    },
    {
      name: 'PDF to Word',
      description: 'Convert PDF to Word document',
      icon: FileText,
      path: '/pdf-to-word',
      color: 'from-indigo-500 to-indigo-600',
      popular: true
    },
    {
      name: 'Word to PDF',
      description: 'Convert Word to PDF',
      icon: FileText,
      path: '/word-to-pdf',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'PDF to Excel',
      description: 'Convert PDF to Excel spreadsheet',
      icon: FileText,
      path: '/pdf-to-excel',
      color: 'from-emerald-500 to-emerald-600'
    },
    {
      name: 'Excel to PDF',
      description: 'Convert Excel to PDF',
      icon: FileText,
      path: '/excel-to-pdf',
      color: 'from-teal-500 to-teal-600'
    },
    {
      name: 'PDF to PowerPoint',
      description: 'Convert PDF to PowerPoint',
      icon: FileText,
      path: '/pdf-to-powerpoint',
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'PowerPoint to PDF',
      description: 'Convert PowerPoint to PDF',
      icon: FileText,
      path: '/powerpoint-to-pdf',
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'PDF to JPG',
      description: 'Convert PDF pages to JPG images',
      icon: FileImage,
      path: '/pdf-to-jpg',
      color: 'from-pink-500 to-pink-600'
    },
    {
      name: 'JPG to PDF',
      description: 'Convert JPG images to PDF',
      icon: Image,
      path: '/jpg-to-pdf',
      color: 'from-violet-500 to-violet-600'
    },
    {
      name: 'PDF to PNG',
      description: 'Convert PDF pages to PNG images',
      icon: FileImage,
      path: '/pdf-to-png',
      color: 'from-cyan-500 to-cyan-600'
    },
    {
      name: 'PNG to PDF',
      description: 'Convert PNG images to PDF',
      icon: Image,
      path: '/png-to-pdf',
      color: 'from-sky-500 to-sky-600'
    },
    {
      name: 'Edit PDF',
      description: 'Add text, images, and shapes',
      icon: Edit3,
      path: '/edit-pdf',
      color: 'from-amber-500 to-amber-600',
      popular: true
    },
    {
      name: 'Organize PDF',
      description: 'Reorder, rotate, and delete pages',
      icon: RotateCw,
      path: '/organize-pdf',
      color: 'from-lime-500 to-lime-600'
    },
    {
      name: 'Protect PDF',
      description: 'Add password protection',
      icon: Shield,
      path: '/protect-pdf',
      color: 'from-red-500 to-red-600'
    },
    {
      name: 'Unlock PDF',
      description: 'Remove PDF password',
      icon: Unlock,
      path: '/unlock-pdf',
      color: 'from-yellow-500 to-yellow-600'
    },
    {
      name: 'Sign PDF',
      description: 'Add digital signature',
      icon: PenTool,
      path: '/sign-pdf',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      name: 'Watermark PDF',
      description: 'Add watermark to PDF',
      icon: Droplets,
      path: '/watermark-pdf',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Page Numbers',
      description: 'Add page numbers to PDF',
      icon: Hash,
      path: '/page-numbers',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Repair PDF',
      description: 'Fix corrupted PDF files',
      icon: Wrench,
      path: '/repair-pdf',
      color: 'from-gray-500 to-gray-600'
    },
    {
      name: 'OCR PDF',
      description: 'Extract text from scanned PDFs',
      icon: Scan,
      path: '/ocr-pdf',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'HTML to PDF',
      description: 'Convert HTML to PDF',
      icon: Globe,
      path: '/html-to-pdf',
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'PDF Reader',
      description: 'View and read PDF files',
      icon: Eye,
      path: '/pdf-reader',
      color: 'from-slate-500 to-slate-600'
    }
  ]

  const features = [
    {
      icon: Lock,
      title: '100% Secure',
      description: 'All processing happens in your browser. Your files never leave your device.'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Client-side processing means instant results without server delays.'
    },
    {
      icon: Users,
      title: 'No Registration',
      description: 'Use all tools immediately without creating an account or providing email.'
    },
    {
      icon: Download,
      title: 'Always Free',
      description: 'All features are completely free with no limits or hidden costs.'
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 }
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.section 
        className="relative py-20 lg:py-32"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="relative inline-block mb-8">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent">
              Ultimate PDF Toolkit
            </h1>
            <motion.div
              className="absolute -top-2 -right-2 w-6 h-6 bg-accent-500 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          
          <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
            Free, secure, and powerful PDF tools. No registration required, 
            no limits, completely private.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="#tools"
              className="btn-primary flex items-center space-x-2"
            >
              <span>Explore All Tools</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="https://github.com/yourusername/ultimate-pdf-toolkit"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary flex items-center space-x-2"
            >
              <span>View on GitHub</span>
              <Star className="w-4 h-4" />
            </a>
          </div>

          {/* Features Grid */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  className="glass rounded-xl p-6 hover:shadow-glow transition-all duration-300"
                  variants={itemVariants}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </motion.section>

      {/* Tools Section */}
      <motion.section
        id="tools"
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Complete PDF Solution
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Everything you need to work with PDF files, all in one place
            </p>
          </div>

          {/* Popular Tools */}
          <div className="mb-12">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <Sparkles className="w-6 h-6 mr-2 text-accent-400" />
              Popular Tools
            </h3>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {pdfTools.filter(tool => tool.popular).map((tool, index) => {
                const Icon = tool.icon
                return (
                  <motion.div key={tool.name} variants={itemVariants}>
                    <Link
                      to={tool.path}
                      className="tool-card group relative overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      <div className="relative z-10">
                        <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">{tool.name}</h3>
                        <p className="text-white/70 text-sm">{tool.description}</p>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Star className="w-4 h-4 text-accent-400" />
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>

          {/* All Tools */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">All Tools</h3>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {pdfTools.map((tool, index) => {
                const Icon = tool.icon
                return (
                  <motion.div key={tool.name} variants={itemVariants}>
                    <Link
                      to={tool.path}
                      className="tool-card group relative overflow-hidden"
                    >
                      <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      <div className="relative z-10">
                        <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-white font-semibold mb-2">{tool.name}</h3>
                        <p className="text-white/70 text-sm">{tool.description}</p>
                      </div>
                      {tool.popular && (
                        <div className="absolute top-2 right-2">
                          <Star className="w-4 h-4 text-accent-400" />
                        </div>
                      )}
                    </Link>
                  </motion.div>
                )
              })}
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass rounded-2xl p-8 lg:p-12 glow-effect">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Start using our powerful PDF tools right now. No sign-up required!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/merge-pdf"
                className="btn-primary flex items-center space-x-2"
              >
                <Combine className="w-4 h-4" />
                <span>Try Merge PDF</span>
              </Link>
              <Link
                to="/edit-pdf"
                className="btn-secondary flex items-center space-x-2"
              >
                <Edit3 className="w-4 h-4" />
                <span>Edit PDF Online</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home 