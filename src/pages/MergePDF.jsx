import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  Combine, 
  Download, 
  RotateCcw, 
  Play, 
  ArrowLeft,
  DragHandleDots2Icon,
  Info,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import FileDropzone from '../components/FileDropzone'
import { mergePDFs, downloadFile } from '../utils/pdfUtils'

const MergePDF = () => {
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [draggedIndex, setDraggedIndex] = useState(null)

  const handleFilesChange = (newFiles) => {
    setFiles(newFiles)
    setResult(null)
    setProgress(0)
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error('Please select at least 2 PDF files to merge')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    try {
      const mergedPdfBytes = await mergePDFs(files, (progress) => {
        setProgress(progress)
      })
      
      setResult(mergedPdfBytes)
      toast.success('PDFs merged successfully!')
    } catch (error) {
      toast.error(`Failed to merge PDFs: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      const filename = `merged_${new Date().toISOString().split('T')[0]}.pdf`
      downloadFile(result, filename)
      toast.success('Download started!')
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setProgress(0)
    setIsProcessing(false)
  }

  const handleDragStart = (e, index) => {
    setDraggedIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e, dropIndex) => {
    e.preventDefault()
    
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      const newFiles = [...files]
      const draggedFile = newFiles[draggedIndex]
      
      // Remove dragged file
      newFiles.splice(draggedIndex, 1)
      
      // Insert at new position
      const adjustedDropIndex = draggedIndex < dropIndex ? dropIndex - 1 : dropIndex
      newFiles.splice(adjustedDropIndex, 0, draggedFile)
      
      setFiles(newFiles)
    }
    
    setDraggedIndex(null)
  }

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
    setResult(null)
  }

  const moveFile = (fromIndex, toIndex) => {
    const newFiles = [...files]
    const [movedFile] = newFiles.splice(fromIndex, 1)
    newFiles.splice(toIndex, 0, movedFile)
    setFiles(newFiles)
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
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
              <Combine className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Merge PDF</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Combine multiple PDF files into a single document. 
            Drag and drop to reorder files before merging.
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
                <li>• Upload 2 or more PDF files</li>
                <li>• Drag and drop files to reorder them</li>
                <li>• Click "Merge PDFs" to combine them</li>
                <li>• Download your merged PDF file</li>
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
            maxFiles={10}
            allowMultiple={true}
          />
        </motion.div>

        {/* File List with Drag and Drop */}
        {files.length > 0 && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <h3 className="text-white font-semibold mb-4 flex items-center">
              <DragHandleDots2Icon className="w-5 h-5 mr-2" />
              Files to Merge ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((file, index) => (
                <motion.div
                  key={file.name}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`glass rounded-xl p-4 cursor-move transition-all duration-200 ${
                    draggedIndex === index ? 'opacity-50' : 'hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileDrag={{ scale: 1.05 }}
                >
                  <div className="flex items-center space-x-4">
                    <div className="text-white/50 text-sm font-mono">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-white font-medium truncate">{file.name}</h4>
                      <p className="text-white/60 text-sm">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(index)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                      aria-label="Remove file"
                    >
                      <X className="w-5 h-5 text-white/70 hover:text-white" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-4 text-center">
              <p className="text-white/60 text-sm">
                Drag and drop files to reorder them before merging
              </p>
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
                <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Merging PDFs...</h3>
                  <p className="text-white/60 text-sm">Please wait while we combine your files</p>
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
                  <h3 className="text-white font-semibold">Merge Complete!</h3>
                  <p className="text-white/60 text-sm">
                    {files.length} files merged successfully
                  </p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Merged PDF</span>
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Merge More Files</span>
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
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleMerge}
                disabled={isProcessing || files.length < 2}
                className={`btn-primary flex items-center space-x-2 ${
                  isProcessing || files.length < 2 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-glow'
                }`}
              >
                <Combine className="w-4 h-4" />
                <span>
                  {isProcessing ? 'Merging...' : `Merge ${files.length} PDFs`}
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
            
            {files.length < 2 && (
              <p className="text-white/60 text-sm mt-4 flex items-center justify-center">
                <AlertCircle className="w-4 h-4 mr-2" />
                Please upload at least 2 PDF files to merge
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default MergePDF 