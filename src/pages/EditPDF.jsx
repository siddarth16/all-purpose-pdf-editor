import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  Edit3, 
  Download, 
  RotateCcw, 
  ArrowLeft,
  Info,
  Type,
  Image as ImageIcon,
  Square,
  Circle,
  Pen
} from 'lucide-react'
import FileDropzone from '../components/FileDropzone'

const EditPDF = () => {
  const [files, setFiles] = useState([])
  const [editMode, setEditMode] = useState('text')
  const [textContent, setTextContent] = useState('')

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles)
  }

  const handleReset = () => {
    setFiles([])
    setTextContent('')
  }

  const editModes = {
    text: { icon: Type, label: 'Add Text', description: 'Add text annotations' },
    image: { icon: ImageIcon, label: 'Add Image', description: 'Insert images' },
    shape: { icon: Square, label: 'Add Shapes', description: 'Draw shapes and lines' },
    draw: { icon: Pen, label: 'Draw', description: 'Free hand drawing' }
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
            <div className="w-16 h-16 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center">
              <Edit3 className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Edit PDF</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Add text, images, shapes, and annotations to your PDF documents.
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
            <Info className="w-5 h-5 text-amber-400 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-2">Coming Soon</h3>
              <p className="text-white/70 text-sm">
                This advanced PDF editor is currently in development. 
                It will support text editing, image insertion, shape drawing, and annotations.
              </p>
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

        {/* Edit Tools */}
        {files.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="glass rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4">Edit Tools</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(editModes).map(([mode, config]) => {
                  const Icon = config.icon
                  return (
                    <button
                      key={mode}
                      onClick={() => setEditMode(mode)}
                      className={`p-4 rounded-xl transition-all duration-200 ${
                        editMode === mode
                          ? 'bg-amber-500/20 border-amber-500/50 border'
                          : 'bg-white/5 hover:bg-white/10 border border-white/10'
                      }`}
                    >
                      <Icon className="w-6 h-6 text-white mb-2" />
                      <p className="text-white font-medium text-sm">{config.label}</p>
                      <p className="text-white/60 text-xs">{config.description}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Development Notice */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="glass rounded-xl p-8">
            <h3 className="text-white font-semibold mb-4">🚧 Under Development</h3>
            <p className="text-white/70 mb-6">
              The PDF editor is being built with advanced features including:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/60 mb-6">
              <div className="text-left">
                <ul className="space-y-2">
                  <li>• Rich text editing with fonts and colors</li>
                  <li>• Image insertion and manipulation</li>
                  <li>• Shape and line drawing tools</li>
                  <li>• Free-hand drawing and highlighting</li>
                </ul>
              </div>
              <div className="text-left">
                <ul className="space-y-2">
                  <li>• Annotation and comment tools</li>
                  <li>• Form field creation and editing</li>
                  <li>• Digital signature placement</li>
                  <li>• Layer management</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/merge-pdf" className="btn-primary">
                Try Merge PDF
              </Link>
              <Link to="/split-pdf" className="btn-secondary">
                Try Split PDF
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default EditPDF 