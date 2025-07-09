import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileText, Upload, Download, X, ArrowUp, ArrowDown } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { mergePDFs } from '../utils/pdfUtils'

const MergePDF = () => {
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = (acceptedFiles) => {
    const pdfFiles = acceptedFiles.filter(file => file.type === 'application/pdf')
    if (pdfFiles.length !== acceptedFiles.length) {
      toast.error('Please select only PDF files')
    }
    setFiles(prev => [...prev, ...pdfFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name
    }))])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: true
  })

  const removeFile = (id) => {
    setFiles(prev => prev.filter(file => file.id !== id))
  }

  const moveFile = (id, direction) => {
    setFiles(prev => {
      const index = prev.findIndex(file => file.id === id)
      if (index === -1) return prev
      
      const newFiles = [...prev]
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      
      if (targetIndex >= 0 && targetIndex < newFiles.length) {
        [newFiles[index], newFiles[targetIndex]] = [newFiles[targetIndex], newFiles[index]]
      }
      
      return newFiles
    })
  }

  const handleMergePDFs = async () => {
    if (files.length < 2) {
      toast.error('Please select at least 2 PDF files to merge')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('Merging PDFs...')
    
    try {
      const fileList = files.map(f => f.file)
      await mergePDFs(fileList)
      toast.dismiss(loadingToast)
      toast.success('PDFs merged successfully! Download started.')
      setFiles([]) // Clear files after successful merge
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to merge PDFs')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Merge PDF Files
          </h1>
          <p className="text-lg text-white/80">
            Combine multiple PDF files into a single document
          </p>
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
            <Upload className="w-12 h-12 text-white/60 mx-auto mb-4" />
            <p className="text-white text-lg mb-2">
              {isDragActive ? 'Drop PDF files here' : 'Drag & drop PDF files here'}
            </p>
            <p className="text-white/60">
              or click to select files
            </p>
          </div>
        </div>

        {/* File List */}
        {files.length > 0 && (
          <div className="mt-8 glass rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Selected Files ({files.length})
            </h3>
            <div className="space-y-3">
              {files.map((fileData, index) => (
                <div key={fileData.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileText className="w-5 h-5 text-red-400" />
                    <span className="text-white font-medium">{fileData.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moveFile(fileData.id, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowUp className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => moveFile(fileData.id, 'down')}
                      disabled={index === files.length - 1}
                      className="p-1 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ArrowDown className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => removeFile(fileData.id)}
                      className="p-1 rounded hover:bg-white/10 text-red-400 hover:text-red-300"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {files.length > 0 && (
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => setFiles([])}
              className="btn-secondary"
            >
              Clear All
            </button>
            <button
              onClick={handleMergePDFs}
              disabled={isProcessing || files.length < 2}
              className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Processing...' : 'Merge PDFs'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default MergePDF 