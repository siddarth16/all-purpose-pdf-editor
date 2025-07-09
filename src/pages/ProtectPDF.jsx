import React, { useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Shield, Upload, FileText, Lock, Eye, EyeOff } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { protectPDF, getPDFInfo } from '../utils/pdfUtils'

const ProtectPDF = () => {
  const [file, setFile] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const onDrop = async (acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf')
    if (!pdfFile) {
      toast.error('Please select a PDF file')
      return
    }

    setFile(pdfFile)
    
    // Get PDF info
    try {
      const info = await getPDFInfo(pdfFile)
      setPdfInfo(info)
    } catch (error) {
      toast.error('Failed to read PDF file')
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

  const validatePassword = () => {
    if (!password) {
      toast.error('Please enter a password')
      return false
    }
    if (password.length < 4) {
      toast.error('Password must be at least 4 characters long')
      return false
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    return true
  }

  const handleProtectPDF = async () => {
    if (!file) {
      toast.error('Please select a PDF file')
      return
    }

    if (!validatePassword()) {
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('Adding password protection...')

    try {
      await protectPDF(file, password)
      toast.dismiss(loadingToast)
      toast.success('PDF protected successfully! Download started.')
      
      // Clear form after success
      setFile(null)
      setPdfInfo(null)
      setPassword('')
      setConfirmPassword('')
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to protect PDF')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Protect PDF
          </h1>
          <p className="text-lg text-white/80">
            Add password protection to your PDF documents
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

        {/* File Info & Password Settings */}
        {file && pdfInfo && (
          <div className="mt-8 glass rounded-2xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <FileText className="w-6 h-6 text-red-400" />
              <div>
                <h3 className="text-lg font-semibold text-white">{file.name}</h3>
                <p className="text-white/60">
                  {formatFileSize(file.size)} • {pdfInfo.pageCount} pages
                </p>
              </div>
            </div>

            {/* Password Settings */}
            <div className="space-y-4">
              <h4 className="text-white font-medium">Password Protection</h4>
              
              {/* Password Input */}
              <div className="space-y-2">
                <label className="block text-white/80 text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full bg-black/20 text-white placeholder-white/50 rounded-lg px-4 py-3 pr-12 border border-white/20 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-2">
                <label className="block text-white/80 text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="w-full bg-black/20 text-white placeholder-white/50 rounded-lg px-4 py-3 pr-12 border border-white/20 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Password Strength Indicator */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Lock className="w-4 h-4 text-white/60" />
                  <span className="text-white/60 text-sm">Password Strength:</span>
                  <span className={`text-sm font-medium ${
                    password.length === 0 ? 'text-white/40' :
                    password.length < 4 ? 'text-red-400' :
                    password.length < 8 ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    {password.length === 0 ? 'Enter password' :
                     password.length < 4 ? 'Too short' :
                     password.length < 8 ? 'Good' :
                     'Strong'}
                  </span>
                </div>
              </div>
            </div>

            {/* Security Info */}
            <div className="mt-6 p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Shield className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="text-white font-medium mb-1">Security Information:</p>
                  <ul className="text-white/70 space-y-1">
                    <li>• The password will be required to open the PDF</li>
                    <li>• Use a strong password with at least 8 characters</li>
                    <li>• Remember your password - it cannot be recovered</li>
                    <li>• The password is processed locally and never sent to servers</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-center space-x-4">
              <button
                onClick={() => {
                  setFile(null)
                  setPdfInfo(null)
                  setPassword('')
                  setConfirmPassword('')
                }}
                className="btn-secondary"
              >
                Remove File
              </button>
              <button
                onClick={handleProtectPDF}
                disabled={isProcessing || !password || !confirmPassword}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? 'Processing...' : 'Protect PDF'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProtectPDF 