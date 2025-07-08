import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowLeft, Info, Zap } from 'lucide-react'

const ComingSoonPage = ({ 
  title, 
  description, 
  icon: Icon, 
  gradient,
  features = [],
  relatedTools = []
}) => {
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
            <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-2xl flex items-center justify-center`}>
              <Icon className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">{title}</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            {description}
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
            <Info className="w-5 h-5 text-primary-400 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-2">Coming Soon</h3>
              <p className="text-white/70 text-sm">
                This tool is currently in development and will be available soon with full functionality.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features Preview */}
        {features.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="glass rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Zap className="w-5 h-5 mr-2" />
                Planned Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start space-x-3">
                    <div className="w-2 h-2 bg-primary-400 rounded-full mt-2"></div>
                    <div>
                      <h4 className="text-white font-medium text-sm">{feature.title}</h4>
                      <p className="text-white/60 text-xs">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Related Tools */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="glass rounded-xl p-8">
            <h3 className="text-white font-semibold mb-4">🚧 Under Development</h3>
            <p className="text-white/70 mb-6">
              While this tool is being built, try our other available PDF tools:
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {relatedTools.map((tool, index) => (
                <Link
                  key={index}
                  to={tool.path}
                  className="bg-white/5 hover:bg-white/10 rounded-xl p-4 transition-all duration-200 border border-white/10 hover:border-white/20"
                >
                  <tool.icon className="w-8 h-8 text-primary-400 mb-2 mx-auto" />
                  <h4 className="text-white font-medium text-sm mb-1">{tool.name}</h4>
                  <p className="text-white/60 text-xs">{tool.description}</p>
                </Link>
              ))}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/" className="btn-primary">
                View All Tools
              </Link>
              <Link to="/merge-pdf" className="btn-secondary">
                Try Merge PDF
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default ComingSoonPage 