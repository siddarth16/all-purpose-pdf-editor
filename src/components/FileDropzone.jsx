import React, { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion } from 'framer-motion'
import { 
  Upload, 
  File, 
  X, 
  FileText, 
  FileImage, 
  AlertCircle,
  CheckCircle,
  Image as ImageIcon
} from 'lucide-react'
import { validatePDF, getPDFThumbnail } from '../utils/pdfUtils'

const FileDropzone = ({ 
  onFilesChange, 
  acceptedFileTypes = ['.pdf'], 
  maxFiles = 1, 
  maxSize = 100 * 1024 * 1024, // 100MB
  allowMultiple = false,
  children
}) => {
  const [files, setFiles] = useState([])
  const [validationErrors, setValidationErrors] = useState({})
  const [thumbnails, setThumbnails] = useState({})

  const onDrop = useCallback(async (acceptedFiles, rejectedFiles) => {
    const errors = {}
    const validFiles = []
    const newThumbnails = {}

    // Handle rejected files
    rejectedFiles.forEach(({ file, errors: fileErrors }) => {
      errors[file.name] = fileErrors.map(error => error.message).join(', ')
    })

    // Validate accepted files
    for (const file of acceptedFiles) {
      if (acceptedFileTypes.includes('.pdf') && file.type === 'application/pdf') {
        const validation = await validatePDF(file)
        if (!validation.valid) {
          errors[file.name] = validation.error
          continue
        }
        
        // Generate thumbnail for PDF
        try {
          const thumbnail = await getPDFThumbnail(file)
          newThumbnails[file.name] = thumbnail
        } catch (error) {
          console.warn('Failed to generate thumbnail:', error)
        }
      }
      
      validFiles.push(file)
    }

    const updatedFiles = allowMultiple ? [...files, ...validFiles] : validFiles.slice(0, maxFiles)
    
    setFiles(updatedFiles)
    setValidationErrors(errors)
    setThumbnails(prev => ({ ...prev, ...newThumbnails }))
    
    if (onFilesChange) {
      onFilesChange(updatedFiles)
    }
  }, [files, acceptedFileTypes, maxFiles, allowMultiple, onFilesChange])

  const removeFile = (fileToRemove) => {
    const updatedFiles = files.filter(file => file !== fileToRemove)
    setFiles(updatedFiles)
    
    // Remove validation error if exists
    const updatedErrors = { ...validationErrors }
    delete updatedErrors[fileToRemove.name]
    setValidationErrors(updatedErrors)
    
    // Remove thumbnail if exists
    const updatedThumbnails = { ...thumbnails }
    delete updatedThumbnails[fileToRemove.name]
    setThumbnails(updatedThumbnails)
    
    if (onFilesChange) {
      onFilesChange(updatedFiles)
    }
  }

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: acceptedFileTypes.reduce((acc, type) => {
      if (type === '.pdf') acc['application/pdf'] = ['.pdf']
      if (type === '.jpg' || type === '.jpeg') acc['image/jpeg'] = ['.jpg', '.jpeg']
      if (type === '.png') acc['image/png'] = ['.png']
      if (type === '.docx') acc['application/vnd.openxmlformats-officedocument.wordprocessingml.document'] = ['.docx']
      if (type === '.xlsx') acc['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] = ['.xlsx']
      if (type === '.pptx') acc['application/vnd.openxmlformats-officedocument.presentationml.presentation'] = ['.pptx']
      return acc
    }, {}),
    maxFiles: allowMultiple ? undefined : maxFiles,
    maxSize,
    multiple: allowMultiple
  })

  const getFileIcon = (file) => {
    if (file.type === 'application/pdf') return FileText
    if (file.type.startsWith('image/')) return ImageIcon
    return File
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="w-full">
      {/* Dropzone */}
      <motion.div
        {...getRootProps()}
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
          transition-all duration-300 glass hover:bg-white/5
          ${isDragActive ? 'border-primary-500 bg-primary-500/10' : 'border-white/20'}
          ${isDragReject ? 'border-red-500 bg-red-500/10' : ''}
          ${files.length > 0 ? 'border-green-500 bg-green-500/10' : ''}
        `}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <input {...getInputProps()} />
        
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center">
              <Upload className="w-8 h-8 text-white" />
            </div>
            {files.length > 0 && (
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
            </h3>
            <p className="text-white/70 mb-2">
              or click to select files
            </p>
            <p className="text-white/50 text-sm">
              Supported formats: {acceptedFileTypes.join(', ')}
            </p>
            <p className="text-white/50 text-sm">
              Max file size: {formatFileSize(maxSize)}
            </p>
          </div>
        </div>
        
        {children}
      </motion.div>

      {/* File List */}
      {files.length > 0 && (
        <motion.div
          className="mt-6 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {files.map((file, index) => {
            const FileIcon = getFileIcon(file)
            const hasError = validationErrors[file.name]
            
            return (
              <motion.div
                key={file.name}
                className={`glass rounded-xl p-4 flex items-center space-x-4 ${
                  hasError ? 'border border-red-500/50' : 'border border-white/10'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
              >
                {/* File thumbnail or icon */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center flex-shrink-0">
                  {thumbnails[file.name] ? (
                    <img 
                      src={thumbnails[file.name]} 
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FileIcon className="w-6 h-6 text-white/70" />
                  )}
                </div>
                
                {/* File info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate">{file.name}</h4>
                  <p className="text-white/60 text-sm">{formatFileSize(file.size)}</p>
                  {hasError && (
                    <div className="flex items-center space-x-1 mt-1">
                      <AlertCircle className="w-4 h-4 text-red-500" />
                      <p className="text-red-500 text-sm">{hasError}</p>
                    </div>
                  )}
                </div>
                
                {/* Remove button */}
                <button
                  onClick={() => removeFile(file)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5 text-white/70 hover:text-white" />
                </button>
              </motion.div>
            )
          })}
        </motion.div>
      )}

      {/* Validation Errors */}
      {Object.keys(validationErrors).length > 0 && (
        <motion.div
          className="mt-4 p-4 bg-red-500/10 border border-red-500/50 rounded-xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h4 className="text-red-500 font-medium">Upload Errors</h4>
          </div>
          <ul className="text-red-400 text-sm space-y-1">
            {Object.entries(validationErrors).map(([filename, error]) => (
              <li key={filename}>
                <strong>{filename}:</strong> {error}
              </li>
            ))}
          </ul>
        </motion.div>
      )}
    </div>
  )
}

export default FileDropzone 