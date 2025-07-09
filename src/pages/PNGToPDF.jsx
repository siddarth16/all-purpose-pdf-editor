import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { FileImage, Upload, Download, Trash2, GripVertical } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { createPDFFromImages } from '../utils/pdfUtils'

const PNGToPDF = () => {
  const [images, setImages] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [pdfSettings, setPdfSettings] = useState({
    pageSize: 'A4',
    orientation: 'portrait',
    margin: 20,
    quality: 0.8,
    preserveTransparency: true
  })

  const onDrop = (acceptedFiles) => {
    const pngFiles = acceptedFiles.filter(file => 
      file.type === 'image/png' || 
      file.type === 'image/jpeg' ||
      file.type === 'image/jpg' ||
      file.type === 'image/gif' ||
      file.type === 'image/webp'
    )
    
    if (pngFiles.length === 0) {
      toast.error('Please select PNG or other image files')
      return
    }

    const newImages = pngFiles.map((file, index) => ({
      id: Date.now() + index,
      file,
      preview: URL.createObjectURL(file),
      name: file.name,
      size: file.size
    }))

    setImages(prev => [...prev, ...newImages])
    toast.success(`${pngFiles.length} image(s) added`)
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/gif': ['.gif'],
      'image/webp': ['.webp']
    },
    multiple: true
  })

  const removeImage = (id) => {
    setImages(prev => {
      const updated = prev.filter(img => img.id !== id)
      const removedImage = prev.find(img => img.id === id)
      if (removedImage) {
        URL.revokeObjectURL(removedImage.preview)
      }
      return updated
    })
  }

  const moveImage = (dragIndex, hoverIndex) => {
    setImages(prev => {
      const newImages = [...prev]
      const draggedImage = newImages[dragIndex]
      newImages.splice(dragIndex, 1)
      newImages.splice(hoverIndex, 0, draggedImage)
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
      toast.error('Please add at least one image')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('Creating PDF from images...')

    try {
      const imageFiles = images.map(img => img.file)
      const options = {
        pageSize: pdfSettings.pageSize,
        orientation: pdfSettings.orientation,
        margin: pdfSettings.margin,
        quality: pdfSettings.quality,
        preserveTransparency: pdfSettings.preserveTransparency
      }

      await createPDFFromImages(imageFiles, options)
      toast.dismiss(loadingToast)
      toast.success('PDF created successfully! Download started.')
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to create PDF')
    } finally {
      setIsProcessing(false)
    }
  }

  const clearAll = () => {
    images.forEach(img => URL.revokeObjectURL(img.preview))
    setImages([])
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileImage className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            PNG to PDF
          </h1>
          <p className="text-lg text-white/80">
            Convert PNG images and other formats to PDF documents
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <div className="lg:col-span-2">
            {/* File Upload */}
            <div
              {...getRootProps()}
              className={`glass rounded-2xl p-8 border-2 border-dashed transition-all duration-300 cursor-pointer mb-6 ${
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
                  or click to select files (PNG, JPG, GIF, WebP)
                </p>
              </div>
            </div>

            {/* Image List */}
            {images.length > 0 && (
              <div className="glass rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Images ({images.length})
                  </h3>
                  <button
                    onClick={clearAll}
                    className="btn-secondary text-sm py-1 px-3"
                  >
                    Clear All
                  </button>
                </div>

                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      className="flex items-center space-x-4 p-3 bg-black/20 rounded-lg hover:bg-black/30 transition-colors"
                    >
                      <div className="flex-shrink-0 cursor-move">
                        <GripVertical className="w-5 h-5 text-white/60" />
                      </div>
                      
                      <div className="flex-shrink-0">
                        <img
                          src={image.preview}
                          alt={image.name}
                          className="w-12 h-12 object-cover rounded border border-white/20"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {image.name}
                        </p>
                        <p className="text-white/60 text-sm">
                          {formatFileSize(image.size)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className="text-white/60 text-sm">
                          #{index + 1}
                        </span>
                        <button
                          onClick={() => removeImage(image.id)}
                          className="text-red-400 hover:text-red-300 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Settings Section */}
          <div className="space-y-6">
            {/* PDF Settings */}
            <div className="glass rounded-2xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4">PDF Settings</h3>
              
              <div className="space-y-4">
                {/* Page Size */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Page Size
                  </label>
                  <select
                    value={pdfSettings.pageSize}
                    onChange={(e) => setPdfSettings(prev => ({ ...prev, pageSize: e.target.value }))}
                    className="w-full bg-black/20 text-white rounded-lg px-4 py-2 border border-white/20 focus:border-primary-500 focus:outline-none"
                  >
                    <option value="A4">A4</option>
                    <option value="A3">A3</option>
                    <option value="A5">A5</option>
                    <option value="Letter">Letter</option>
                    <option value="Legal">Legal</option>
                  </select>
                </div>

                {/* Orientation */}
                <div>
                  <label className="block text-white/80 text-sm font-medium mb-2">
                    Orientation
                  </label>
                  <div className="flex space-x-4">
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value="portrait"
                        checked={pdfSettings.orientation === 'portrait'}
                        onChange={(e) => setPdfSettings(prev => ({ ...prev, orientation: e.target.value }))}
                        className="text-primary-500"
                      />
                      <span className="text-white text-sm">Portrait</span>
                    </label>
                    <label className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="radio"
                        value="landscape"
                        checked={pdfSettings.orientation === 'landscape'}
                        onChange={(e) => setPdfSettings(prev => ({ ...prev, orientation: e.target.value }))}
                        className="text-primary-500"
                      />
                      <span className="text-white text-sm">Landscape</span>
                    </label>
                  </div>
                </div>

                {/* Margin */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white/80 text-sm font-medium">
                      Margin
                    </label>
                    <span className="text-white/60 text-sm">
                      {pdfSettings.margin}px
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    value={pdfSettings.margin}
                    onChange={(e) => setPdfSettings(prev => ({ ...prev, margin: parseInt(e.target.value) }))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Quality */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-white/80 text-sm font-medium">
                      Image Quality
                    </label>
                    <span className="text-white/60 text-sm">
                      {Math.round(pdfSettings.quality * 100)}%
                    </span>
                  </div>
                  <input
                    type="range"
                    min="0.1"
                    max="1"
                    step="0.1"
                    value={pdfSettings.quality}
                    onChange={(e) => setPdfSettings(prev => ({ ...prev, quality: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Preserve Transparency */}
                <div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={pdfSettings.preserveTransparency}
                      onChange={(e) => setPdfSettings(prev => ({ ...prev, preserveTransparency: e.target.checked }))}
                      className="text-primary-500"
                    />
                    <span className="text-white text-sm">Preserve PNG transparency</span>
                  </label>
                  <p className="text-white/60 text-xs mt-1">
                    Keep transparent backgrounds in PNG images
                  </p>
                </div>
              </div>
            </div>

            {/* Create PDF Button */}
            <button
              onClick={handleCreatePDF}
              disabled={isProcessing || images.length === 0}
              className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isProcessing ? 'Creating PDF...' : 'Create PDF'}
            </button>

            {/* Info */}
            <div className="p-4 bg-pink-500/10 border border-pink-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <FileImage className="w-5 h-5 text-pink-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">PNG to PDF Info:</p>
                  <ul className="text-white/70 space-y-1">
                    <li>• Supports PNG, JPG, GIF, and WebP images</li>
                    <li>• Preserves PNG transparency when enabled</li>
                    <li>• Drag images to reorder them</li>
                    <li>• Each image becomes a separate PDF page</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PNGToPDF 