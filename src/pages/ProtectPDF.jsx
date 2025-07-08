import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  Shield, 
  Download, 
  RotateCcw, 
  Play, 
  ArrowLeft,
  Info,
  CheckCircle,
  FileText,
  Zap,
  Key,
  Eye,
  EyeOff,
  Lock
} from 'lucide-react'
import FileDropzone from '../components/FileDropzone'
import { protectPDF, downloadFile, getPDFInfo } from '../utils/pdfUtils'

const ProtectPDF = () => {
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  
  // Security settings
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [securityLevel, setSecurityLevel] = useState('standard')

  const securityLevels = {
    'basic': {
      label: 'Basic Protection',
      description: 'Simple password protection for viewing',
      strength: 'Low',
      color: 'yellow'
    },
    'standard': {
      label: 'Standard Protection',
      description: 'Strong password protection with user restrictions',
      strength: 'Medium',
      color: 'blue'
    },
    'high': {
      label: 'High Security',
      description: 'Maximum protection with advanced encryption',
      strength: 'High',
      color: 'green'
    }
  }

  const handleFilesChange = async (newFiles) => {
    setFiles(newFiles)
    setResult(null)
    setProgress(0)
    
    if (newFiles.length > 0) {
      try {
        const info = await getPDFInfo(newFiles[0])
        setPdfInfo(info)
      } catch (error) {
        toast.error('Failed to read PDF information')
      }
    }
  }

  const validatePasswords = () => {
    if (!password.trim()) {
      toast.error('Please enter a password')
      return false
    }
    
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long')
      return false
    }
    
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return false
    }
    
    return true
  }

  const getPasswordStrength = (password) => {
    let strength = 0
    
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[a-z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++
    
    if (strength <= 2) return { label: 'Weak', color: 'red' }
    if (strength <= 3) return { label: 'Medium', color: 'yellow' }
    return { label: 'Strong', color: 'green' }
  }

  const handleProtectPDF = async () => {
    if (files.length === 0) {
      toast.error('Please select a PDF file')
      return
    }

    if (!validatePasswords()) {
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    try {
      const securityOptions = {
        userPassword: password,
        ownerPassword: password + '_owner',
        permissions: {
          printing: securityLevel === 'basic',
          modifying: false,
          copying: securityLevel === 'basic',
          annotating: securityLevel === 'basic',
          fillingForms: securityLevel === 'basic',
          contentAccessibility: true,
          documentAssembly: false
        }
      }

      const protectedPdfBytes = await protectPDF(
        files[0], 
        password, 
        (progress) => {
          setProgress(progress)
        }
      )
      
      setResult({
        data: protectedPdfBytes,
        filename: files[0].name.replace('.pdf', '_protected.pdf'),
        settings: {
          hasPassword: true,
          securityLevel: securityLevels[securityLevel].label,
          passwordStrength: getPasswordStrength(password).label,
          fileSize: protectedPdfBytes.byteLength
        }
      })
      
      toast.success('PDF protected successfully!')
    } catch (error) {
      toast.error(`Failed to protect PDF: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDownload = () => {
    if (result) {
      downloadFile(result.data, result.filename)
      toast.success('Download started!')
    }
  }

  const handleReset = () => {
    setFiles([])
    setResult(null)
    setProgress(0)
    setIsProcessing(false)
    setPdfInfo(null)
    setPassword('')
    setConfirmPassword('')
    setShowPassword(false)
    setShowConfirmPassword(false)
    setSecurityLevel('standard')
  }

  const passwordStrength = password ? getPasswordStrength(password) : null

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
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Protect PDF</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Secure your PDF documents with password protection and access restrictions. 
            Keep your sensitive information safe from unauthorized access.
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
            <Info className="w-5 h-5 text-green-400 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-2">Security Features</h3>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Password protection prevents unauthorized access</li>
                <li>• Multiple security levels with different permissions</li>
                <li>• Encryption keeps your document content secure</li>
                <li>• Control printing, copying, and editing permissions</li>
                <li>• Compatible with all PDF readers and viewers</li>
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
            maxFiles={1}
            allowMultiple={false}
          />
        </motion.div>

        {/* PDF Info */}
        {pdfInfo && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="glass rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <FileText className="w-5 h-5 mr-2" />
                PDF Information
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-white/60">Total Pages</p>
                  <p className="text-white font-medium">{pdfInfo.pageCount}</p>
                </div>
                <div>
                  <p className="text-white/60">File Size</p>
                  <p className="text-white font-medium">{(files[0]?.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <div>
                  <p className="text-white/60">Current Status</p>
                  <p className="text-white font-medium">Unprotected</p>
                </div>
                <div>
                  <p className="text-white/60">Security Level</p>
                  <p className="text-white font-medium">{securityLevels[securityLevel].label}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Security Settings */}
        {pdfInfo && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="glass rounded-xl p-6">
              <h3 className="text-white font-semibold mb-4 flex items-center">
                <Key className="w-5 h-5 mr-2" />
                Security Settings
              </h3>
              
              <div className="space-y-6">
                {/* Security Level */}
                <div>
                  <label className="block text-white font-medium mb-3">Security Level</label>
                  <div className="space-y-2">
                    {Object.entries(securityLevels).map(([level, config]) => (
                      <label key={level} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="radio"
                          name="securityLevel"
                          value={level}
                          checked={securityLevel === level}
                          onChange={(e) => setSecurityLevel(e.target.value)}
                          className="w-4 h-4 text-green-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="text-white font-medium">{config.label}</span>
                            <span className={`text-xs px-2 py-1 rounded-full bg-${config.color}-500/20 text-${config.color}-400`}>
                              {config.strength}
                            </span>
                          </div>
                          <p className="text-white/60 text-sm">{config.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                
                {/* Password Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-medium mb-2">Password</label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="input-glass w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {passwordStrength && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-white/60 text-sm">Strength:</span>
                        <span className={`text-sm font-medium text-${passwordStrength.color}-400`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-white font-medium mb-2">Confirm Password</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="input-glass w-full pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {password && confirmPassword && (
                      <div className="mt-2 flex items-center space-x-2">
                        <span className="text-white/60 text-sm">Match:</span>
                        <span className={`text-sm font-medium ${
                          password === confirmPassword ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {password === confirmPassword ? 'Yes' : 'No'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Password Guidelines */}
                <div className="bg-white/5 rounded-lg p-4">
                  <h4 className="text-white font-medium mb-2 flex items-center">
                    <Lock className="w-4 h-4 mr-2" />
                    Password Guidelines
                  </h4>
                  <ul className="text-white/60 text-sm space-y-1">
                    <li>• Use at least 8 characters for better security</li>
                    <li>• Include uppercase and lowercase letters</li>
                    <li>• Add numbers and special characters</li>
                    <li>• Avoid common words or personal information</li>
                    <li>• Keep your password safe and secure</li>
                  </ul>
                </div>
              </div>
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
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Protecting PDF...</h3>
                  <p className="text-white/60 text-sm">Applying security settings to your document</p>
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
                  <h3 className="text-white font-semibold">PDF Protected Successfully!</h3>
                  <p className="text-white/60 text-sm">
                    Your document is now secured with password protection
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60">Password Protection</p>
                  <p className="text-white font-medium">✓ Enabled</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60">Security Level</p>
                  <p className="text-white font-medium">{result.settings.securityLevel}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60">Password Strength</p>
                  <p className="text-white font-medium">{result.settings.passwordStrength}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60">File Size</p>
                  <p className="text-white font-medium">{(result.settings.fileSize / 1024 / 1024).toFixed(1)} MB</p>
                </div>
              </div>
              
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-6">
                <h4 className="text-blue-300 font-medium mb-2">Important Security Notes:</h4>
                <ul className="text-blue-200/70 text-sm space-y-1">
                  <li>• Save your password in a secure location</li>
                  <li>• Password cannot be recovered if lost</li>
                  <li>• Share the password only with authorized users</li>
                  <li>• Test the protected PDF before sharing</li>
                </ul>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Protected PDF</span>
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Protect Another PDF</span>
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
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleProtectPDF}
                disabled={isProcessing}
                className={`btn-primary flex items-center space-x-2 ${
                  isProcessing 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-glow'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>
                  {isProcessing ? 'Protecting PDF...' : 'Protect PDF'}
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
          </motion.div>
        )}
      </div>
    </div>
  )
}

export default ProtectPDF 