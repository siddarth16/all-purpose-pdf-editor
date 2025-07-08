import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Star, Zap, Users, Lock, Download } from 'lucide-react'

const Home = () => {
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

  const popularTools = [
    { name: 'Merge PDF', path: '/merge-pdf', color: 'from-blue-500 to-blue-600' },
    { name: 'Split PDF', path: '/split-pdf', color: 'from-purple-500 to-purple-600' },
    { name: 'Compress PDF', path: '/compress-pdf', color: 'from-green-500 to-green-600' },
    { name: 'Edit PDF', path: '/edit-pdf', color: 'from-amber-500 to-amber-600' },
    { name: 'PDF to Word', path: '/pdf-to-word', color: 'from-indigo-500 to-indigo-600' },
    { name: 'Word to PDF', path: '/word-to-pdf', color: 'from-red-500 to-red-600' },
  ]

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
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 bg-clip-text text-transparent mb-8">
            Ultimate PDF Toolkit
          </h1>
          
          <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-3xl mx-auto">
            Free, secure, and powerful PDF tools. No registration required, 
            no limits, completely private.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/merge-pdf"
              className="btn-primary flex items-center space-x-2"
            >
              <span>Start with Merge PDF</span>
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  className="glass rounded-xl p-6 hover:shadow-glow transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                  <p className="text-white/70 text-sm">{feature.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </motion.section>

      {/* Popular Tools Section */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Popular PDF Tools
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Start with our most popular tools to get things done quickly
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularTools.map((tool, index) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  to={tool.path}
                  className="tool-card group relative overflow-hidden block"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                  <div className="relative z-10">
                    <div className={`w-12 h-12 bg-gradient-to-br ${tool.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                      <div className="w-6 h-6 bg-white rounded opacity-80"></div>
                    </div>
                    <h3 className="text-white font-semibold mb-2">{tool.name}</h3>
                    <p className="text-white/70 text-sm">Click to access this tool</p>
                  </div>
                </Link>
              </motion.div>
            ))}
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
              Choose any tool from the dropdown menu above or start with our most popular ones!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/merge-pdf"
                className="btn-primary"
              >
                Try Merge PDF
              </Link>
              <Link
                to="/edit-pdf"
                className="btn-secondary"
              >
                Edit PDF Online
              </Link>
            </div>
          </div>
        </div>
      </motion.section>
    </div>
  )
}

export default Home 