import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { 
  FolderOpen, 
  Download, 
  RotateCcw, 
  Play, 
  ArrowLeft,
  Info,
  CheckCircle,
  FileText,
  Zap,
  RotateCw,
  Trash2,
  GripVertical,
  Eye
} from 'lucide-react'
import FileDropzone from '../components/FileDropzone'
import { 
  getPDFInfo, 
  downloadFile, 
  reorderPDFPages, 
  rotatePDFPages, 
  deletePagesFromPDF,
  getPDFThumbnail 
} from '../utils/pdfUtils'

const OrganizePDF = () => {
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [result, setResult] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [pages, setPages] = useState([])
  const [selectedPages, setSelectedPages] = useState(new Set())

  const handleFilesChange = async (newFiles) => {
    setFiles(newFiles)
    setResult(null)
    setProgress(0)
    setSelectedPages(new Set())
    
    if (newFiles.length > 0) {
      try {
        const info = await getPDFInfo(newFiles[0])
        setPdfInfo(info)
        
        // Initialize pages array with thumbnails
        const pagesData = []
        for (let i = 0; i < info.pageCount; i++) {
          try {
            const thumbnail = await getPDFThumbnail(newFiles[0], i + 1)
            pagesData.push({
              index: i,
              originalIndex: i,
              rotation: 0,
              thumbnail,
              selected: false
            })
          } catch (error) {
            pagesData.push({
              index: i,
              originalIndex: i,
              rotation: 0,
              thumbnail: null,
              selected: false
            })
          }
        }
        setPages(pagesData)
      } catch (error) {
        toast.error('Failed to read PDF information')
      }
    }
  }

  const handlePageSelect = (pageIndex) => {
    const newSelected = new Set(selectedPages)
    if (newSelected.has(pageIndex)) {
      newSelected.delete(pageIndex)
    } else {
      newSelected.add(pageIndex)
    }
    setSelectedPages(newSelected)
  }

  const handleSelectAll = () => {
    if (selectedPages.size === pages.length) {
      setSelectedPages(new Set())
    } else {
      setSelectedPages(new Set(pages.map((_, index) => index)))
    }
  }

  const handleRotatePage = (pageIndex, direction = 'right') => {
    setPages(prevPages => 
      prevPages.map((page, index) => 
        index === pageIndex 
          ? { ...page, rotation: (page.rotation + (direction === 'right' ? 90 : -90)) % 360 }
          : page
      )
    )
  }

  const handleDeletePages = () => {
    if (selectedPages.size === 0) {
      toast.error('Please select pages to delete')
      return
    }
    
    if (selectedPages.size === pages.length) {
      toast.error('Cannot delete all pages')
      return
    }

    setPages(prevPages => 
      prevPages.filter((_, index) => !selectedPages.has(index))
    )
    setSelectedPages(new Set())
    toast.success(`${selectedPages.size} page(s) marked for deletion`)
  }

  const handleReorderPages = (fromIndex, toIndex) => {
    const newPages = [...pages]
    const [removed] = newPages.splice(fromIndex, 1)
    newPages.splice(toIndex, 0, removed)
    setPages(newPages)
  }

  const handleApplyChanges = async () => {
    if (pages.length === 0) {
      toast.error('No pages to process')
      return
    }

    setIsProcessing(true)
    setProgress(0)
    setResult(null)

    try {
      let pdfBytes = null
      let currentProgress = 0

      // Step 1: Reorder pages if needed
      const newOrder = pages.map(page => page.originalIndex)
      const needsReordering = newOrder.some((order, index) => order !== index)
      
      if (needsReordering) {
        pdfBytes = await reorderPDFPages(files[0], newOrder, (progress) => {
          setProgress(currentProgress + (progress * 0.4))
        })
        currentProgress = 40
      }

      // Step 2: Apply rotations if needed
      const rotations = pages.reduce((acc, page, index) => {
        if (page.rotation !== 0) {
          acc[index] = page.rotation
        }
        return acc
      }, {})

      if (Object.keys(rotations).length > 0) {
        const inputFile = pdfBytes ? new Blob([pdfBytes], { type: 'application/pdf' }) : files[0]
        pdfBytes = await rotatePDFPages(inputFile, rotations, (progress) => {
          setProgress(currentProgress + (progress * 0.4))
        })
        currentProgress = 80
      }

      // If no changes were made, use original file
      if (!pdfBytes) {
        const arrayBuffer = await files[0].arrayBuffer()
        pdfBytes = arrayBuffer
      }

      setProgress(100)
      setResult({
        data: pdfBytes,
        filename: files[0].name.replace('.pdf', '_organized.pdf'),
        changes: {
          reordered: needsReordering,
          rotated: Object.keys(rotations).length > 0,
          totalPages: pages.length
        }
      })
      
      toast.success('PDF organized successfully!')
    } catch (error) {
      toast.error(`Failed to organize PDF: ${error.message}`)
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
    setPages([])
    setSelectedPages(new Set())
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
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
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center">
              <FolderOpen className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-white mb-4">Organize PDF</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Reorder, rotate, and delete pages from your PDF documents. 
            Reorganize your content exactly how you want it.
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
            <Info className="w-5 h-5 text-orange-400 mt-0.5" />
            <div>
              <h3 className="text-white font-semibold mb-2">How to organize your PDF</h3>
              <ul className="text-white/70 text-sm space-y-1">
                <li>• Upload a PDF file to see page thumbnails</li>
                <li>• Drag and drop pages to reorder them</li>
                <li>• Use rotation buttons to rotate individual pages</li>
                <li>• Select pages and delete unwanted content</li>
                <li>• Apply changes and download the organized PDF</li>
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

        {/* PDF Info & Controls */}
        {pdfInfo && (
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="glass rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-white font-semibold flex items-center">
                  <FileText className="w-5 h-5 mr-2" />
                  PDF Pages ({pages.length})
                </h3>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleSelectAll}
                    className="btn-secondary text-sm"
                  >
                    {selectedPages.size === pages.length ? 'Deselect All' : 'Select All'}
                  </button>
                  {selectedPages.size > 0 && (
                    <button
                      onClick={handleDeletePages}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete Selected ({selectedPages.size})</span>
                    </button>
                  )}
                </div>
              </div>
              
              {/* Page Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {pages.map((page, index) => (
                  <div
                    key={`page-${page.originalIndex}-${index}`}
                    className={`relative group border-2 rounded-lg overflow-hidden transition-all ${
                      selectedPages.has(index)
                        ? 'border-orange-500 bg-orange-500/10'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    {/* Page Thumbnail */}
                    <div 
                      className="aspect-[3/4] bg-white/10 flex items-center justify-center cursor-pointer"
                      onClick={() => handlePageSelect(index)}
                      style={{ transform: `rotate(${page.rotation}deg)` }}
                    >
                      {page.thumbnail ? (
                        <img
                          src={page.thumbnail}
                          alt={`Page ${page.originalIndex + 1}`}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <Eye className="w-8 h-8 text-white/50" />
                      )}
                    </div>
                    
                    {/* Page Controls */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => handleRotatePage(index, 'left')}
                          className="p-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                          title="Rotate Left"
                        >
                          <RotateCcw className="w-3 h-3 text-white" />
                        </button>
                        <button
                          onClick={() => handleRotatePage(index, 'right')}
                          className="p-1 bg-white/20 rounded hover:bg-white/30 transition-colors"
                          title="Rotate Right"
                        >
                          <RotateCw className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    </div>
                    
                    {/* Page Number */}
                    <div className="absolute top-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                      {index + 1}
                    </div>
                    
                    {/* Selection Indicator */}
                    {selectedPages.has(index) && (
                      <div className="absolute top-1 right-1 w-4 h-4 bg-orange-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-3 h-3 text-white" />
                      </div>
                    )}
                    
                    {/* Drag Handle */}
                    <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <GripVertical className="w-3 h-3 text-white cursor-move" />
                    </div>
                  </div>
                ))}
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
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Play className="w-4 h-4 text-white animate-pulse" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">Organizing PDF...</h3>
                  <p className="text-white/60 text-sm">Applying your changes to the document</p>
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
                  <h3 className="text-white font-semibold">Organization Complete!</h3>
                  <p className="text-white/60 text-sm">
                    Your PDF has been organized with {result.changes.totalPages} pages
                  </p>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mb-6 text-sm">
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60">Pages Reordered</p>
                  <p className="text-white font-medium">{result.changes.reordered ? 'Yes' : 'No'}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60">Pages Rotated</p>
                  <p className="text-white font-medium">{result.changes.rotated ? 'Yes' : 'No'}</p>
                </div>
                <div className="bg-white/5 rounded-lg p-3">
                  <p className="text-white/60">Final Page Count</p>
                  <p className="text-white font-medium">{result.changes.totalPages}</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleDownload}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Organized PDF</span>
                </button>
                <button
                  onClick={handleReset}
                  className="btn-secondary flex items-center space-x-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Organize Another PDF</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        {pages.length > 0 && !result && (
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleApplyChanges}
                disabled={isProcessing}
                className={`btn-primary flex items-center space-x-2 ${
                  isProcessing 
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:shadow-glow'
                }`}
              >
                <Zap className="w-4 h-4" />
                <span>
                  {isProcessing ? 'Organizing...' : 'Apply Changes'}
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

export default OrganizePDF 