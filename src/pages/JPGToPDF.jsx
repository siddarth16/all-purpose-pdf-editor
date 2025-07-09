import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Image, Upload, X, ArrowUp, ArrowDown, FileText } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { createPDFFromImages } from '../utils/pdfUtils'

const JPGToPDF = () => {
  const [images, setImages] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)

  const onDrop = (acceptedFiles) => {
    const imageFiles = acceptedFiles.filter(file => 
      file.type === 'image/jpeg' || 
      file.type === 'image/jpg' || 
      file.type === 'image/png'
    )
    
    if (imageFiles.length !== acceptedFiles.length) {
      toast.error('Please select only JPG or PNG images')
    }
    
    setImages(prev => [...prev, ...imageFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file)
    }))])
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png']
    },
    multiple: true
  })

  const removeImage = (id) => {
    setImages(prev => {
      const imageToRemove = prev.find(img => img.id === id)
      if (imageToRemove) {
        URL.revokeObjectURL(imageToRemove.preview)
      }
      return prev.filter(img => img.id !== id)
    })
  }

  const moveImage = (id, direction) => {
    setImages(prev => {
      const index = prev.findIndex(img => img.id === id)
      if (index === -1) return prev
      
      const newImages = [...prev]
      const targetIndex = direction === 'up' ? index - 1 : index + 1
      
      if (targetIndex >= 0 && targetIndex < newImages.length) {
        [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]]
      }
      
      return newImages
    })
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleCreatePDF = async () => {
    if (images.length === 0) {
      toast.error('Please select at least one image')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('Converting images to PDF...')

    try {
      const imageFiles = images.map(img => img.file)
      await createPDFFromImages(imageFiles)
      toast.dismiss(loadingToast)
      toast.success('PDF created successfully! Download started.')
      
      // Clear images after successful conversion
      images.forEach(img => URL.revokeObjectURL(img.preview))
      setImages([])
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to create PDF')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Image className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            JPG to PDF
          </h1>
          <p className="text-lg text-white/80">
            Convert JPG and PNG images to PDF document
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
              {isDragActive ? 'Drop images here' : 'Drag & drop images here'}
            </p>
            <p className="text-white/60">
              or click to select JPG/PNG files
            </p>
          </div>
        </div>

        {/* Images List */}
        {images.length > 0 && (
          <div className="mt-8 glass rounded-2xl p-6">
            <h3 className="text-xl font-semibold text-white mb-4">
              Selected Images ({images.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((imageData, index) => (
                <div key={imageData.id} className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg">
                  <img
                    src={imageData.preview}
                    alt={imageData.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-medium truncate">{imageData.name}</p>
                    <p className="text-white/60 text-sm">{formatFileSize(imageData.size)}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => moveImage(imageData.id, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => moveImage(imageData.id, 'down')}
                      disabled={index === images.length - 1}
                      className="p-1 rounded hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4 text-white" />
                    </button>
                    <button
                      onClick={() => removeImage(imageData.id)}
                      className="p-1 rounded hover:bg-white/10 text-red-400 hover:text-red-300"
                      title="Remove"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <FileText className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">Conversion Info:</p>
                  <ul className="text-white/70 space-y-1">
                    <li>• Images will be converted in the order shown above</li>
                    <li>• Each image will become a separate page in the PDF</li>
                    <li>• Original image quality will be preserved</li>
                    <li>• Supported formats: JPG, JPEG, PNG</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => {
                  images.forEach(img => URL.revokeObjectURL(img.preview))
                  setImages([])
                }}
                className="btn-secondary"
              >
                Clear All
              </button>
              <button
                onClick={handleCreatePDF}
                disabled={isProcessing || images.length === 0}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Creating PDF...' : 'Create PDF'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default JPGToPDF 