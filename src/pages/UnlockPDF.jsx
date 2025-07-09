import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Unlock, Upload, FileText, Lock, Shield, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { unlockPDF, checkPDFPasswordProtection, removePDFRestrictions, getPDFInfo } from '../utils/pdfUtils'

const UnlockPDF = () => {
  const [file, setFile] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [isProtected, setIsProtected] = useState(false)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isChecking, setIsChecking] = useState(false)
  const [unlockType, setUnlockType] = useState('password') // 'password' or 'restrictions'

  const onDrop = async (acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf')
    if (!pdfFile) {
      toast.error('Please select a PDF file')
      return
    }

    setFile(pdfFile)
    setPassword('')
    setIsProtected(false)
    setPdfInfo(null)
    
    // Check if PDF is password protected
    setIsChecking(true)
    try {
      const protectionStatus = await checkPDFPasswordProtection(pdfFile)
      setIsProtected(protectionStatus.isProtected)
      
      if (!protectionStatus.isProtected) {
        // If not protected, get PDF info
        const info = await getPDFInfo(pdfFile)
        setPdfInfo(info)
        toast.success('PDF is not password protected')
      } else {
        toast.info('PDF is password protected')
      }
    } catch (error) {
      toast.error('Failed to check PDF protection status')
      console.error('Error checking protection:', error)
    } finally {
      setIsChecking(false)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf']
    },
    multiple: false
  })

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleUnlockPassword = async () => {
    if (!file) {
      toast.error('Please select a PDF file')
      return
    }

    if (!password.trim()) {
      toast.error('Please enter the password')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('Unlocking PDF...')

    try {
      const result = await unlockPDF(file, password)
      
      if (result.success) {
        toast.dismiss(loadingToast)
        toast.success(`PDF unlocked successfully! ${result.pageCount} pages processed. Download started.`)
        
        // Reset form
        setFile(null)
        setPassword('')
        setIsProtected(false)
        setPdfInfo(null)
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to unlock PDF')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemoveRestrictions = async () => {
    if (!file) {
      toast.error('Please select a PDF file')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('Removing restrictions...')

    try {
      const result = await removePDFRestrictions(file, password)
      
      if (result.success) {
        toast.dismiss(loadingToast)
        toast.success(`Restrictions removed successfully! ${result.pageCount} pages processed. Download started.`)
        
        // Reset form
        setFile(null)
        setPassword('')
        setIsProtected(false)
        setPdfInfo(null)
      }
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to remove restrictions')
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (unlockType === 'password') {
      handleUnlockPassword()
    } else {
      handleRemoveRestrictions()
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Unlock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Unlock PDF
          </h1>
          <p className="text-lg text-white/80">
            Remove password protection and restrictions from PDF documents
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
              {isDragActive ? 'Drop PDF file here' : 'Drag & drop PDF file here'}
            </p>
            <p className="text-white/60">
              or click to select file
            </p>
          </div>
        </div>

        {/* File Info & Unlock Options */}
        {file && (
          <div className="mt-8 glass rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">{file.name}</h3>
                <p className="text-white/60">
                  {formatFileSize(file.size)}
                  {pdfInfo && ` • ${pdfInfo.pageCount} pages`}
                </p>
              </div>
            </div>

            {/* Checking Status */}
            {isChecking && (
              <div className="flex items-center space-x-3 mb-6">
                <div className="animate-spin w-5 h-5 border-2 border-primary-500 border-t-transparent rounded-full"></div>
                <span className="text-white">Checking PDF protection status...</span>
              </div>
            )}

            {/* Protection Status */}
            {!isChecking && (
              <div className="mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  {isProtected ? (
                    <Lock className="w-5 h-5 text-red-400" />
                  ) : (
                    <Shield className="w-5 h-5 text-green-400" />
                  )}
                  <span className="text-white font-medium">
                    {isProtected ? 'PDF is password protected' : 'PDF is not password protected'}
                  </span>
                </div>
              </div>
            )}

            {/* Unlock Type Selection */}
            <div className="mb-6">
              <h4 className="text-white font-medium mb-3">Unlock Type</h4>
              <div className="space-y-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="password"
                    checked={unlockType === 'password'}
                    onChange={(e) => setUnlockType(e.target.value)}
                    className="text-primary-500"
                  />
                  <div>
                    <span className="text-white">Remove Password Protection</span>
                    <p className="text-white/60 text-sm">Remove password requirement to open the PDF</p>
                  </div>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="radio"
                    value="restrictions"
                    checked={unlockType === 'restrictions'}
                    onChange={(e) => setUnlockType(e.target.value)}
                    className="text-primary-500"
                  />
                  <div>
                    <span className="text-white">Remove Restrictions</span>
                    <p className="text-white/60 text-sm">Remove printing, copying, and editing restrictions</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Password Input */}
            {(isProtected || unlockType === 'restrictions') && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-2">
                    {unlockType === 'password' ? 'PDF Password' : 'PDF Password (if required)'}
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter PDF password"
                      className="w-full bg-black/20 text-white placeholder-white/50 rounded-lg px-4 py-3 pr-12 border border-white/20 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                      required={unlockType === 'password' && isProtected}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {unlockType === 'password' && (
                    <p className="text-white/60 text-sm mt-2">
                      This password will be used to open the protected PDF
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center space-x-4">
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null)
                      setPassword('')
                      setIsProtected(false)
                      setPdfInfo(null)
                    }}
                    className="btn-secondary"
                  >
                    Remove File
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing || (unlockType === 'password' && isProtected && !password.trim())}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 
                     unlockType === 'password' ? 'Unlock PDF' : 'Remove Restrictions'}
                  </button>
                </div>
              </form>
            )}

            {/* No Password Required */}
            {!isProtected && unlockType === 'password' && (
              <div className="text-center">
                <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg mb-4">
                  <div className="flex items-center justify-center space-x-2">
                    <Shield className="w-5 h-5 text-green-400" />
                    <span className="text-green-400">This PDF is not password protected</span>
                  </div>
                  <p className="text-white/60 text-sm mt-2">
                    No password removal needed
                  </p>
                </div>
              </div>
            )}

            {/* Info */}
            <div className="mt-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Unlock className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">Unlock Information:</p>
                  <ul className="text-white/70 space-y-1">
                    <li>• Password protection prevents opening the PDF</li>
                    <li>• Restrictions prevent printing, copying, or editing</li>
                    <li>• Unlocking creates a new PDF without protection</li>
                    <li>• Original file remains unchanged</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UnlockPDF 