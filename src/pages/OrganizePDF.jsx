import React, { useState, useEffect } from 'react'
import { useDropzone } from 'react-dropzone'
import { Settings, Upload, FileText, RotateCw, Trash2, ArrowUp, ArrowDown, Download, Eye } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { organizePDF, getPDFPageThumbnails, getPDFInfo } from '../utils/pdfUtils'

const OrganizePDF = () => {
  const [file, setFile] = useState(null)
  const [pdfInfo, setPdfInfo] = useState(null)
  const [thumbnails, setThumbnails] = useState([])
  const [pages, setPages] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [isLoadingThumbnails, setIsLoadingThumbnails] = useState(false)
  const [selectedPages, setSelectedPages] = useState(new Set())

  const onDrop = async (acceptedFiles) => {
    const pdfFile = acceptedFiles.find(file => file.type === 'application/pdf')
    if (!pdfFile) {
      toast.error('Please select a PDF file')
      return
    }

    setFile(pdfFile)
    setThumbnails([])
    setPages([])
    setSelectedPages(new Set())
    
    // Get PDF info
    try {
      const info = await getPDFInfo(pdfFile)
      setPdfInfo(info)
      
      // Generate thumbnails
      setIsLoadingThumbnails(true)
      const thumbs = await getPDFPageThumbnails(pdfFile, 0.3)
      setThumbnails(thumbs)
      
      // Initialize pages state
      const initialPages = thumbs.map((thumb, index) => ({
        id: index,
        pageNumber: thumb.pageNumber,
        thumbnail: thumb.thumbnail,
        rotation: 0,
        deleted: false,
        originalIndex: index
      }))
      setPages(initialPages)
    } catch (error) {
      toast.error('Failed to process PDF file')
    } finally {
      setIsLoadingThumbnails(false)
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

  const rotatePage = (pageId, degrees) => {
    setPages(prev => prev.map(page => 
      page.id === pageId 
        ? { ...page, rotation: (page.rotation + degrees) % 360 }
        : page
    ))
  }

  const togglePageSelection = (pageId) => {
    setSelectedPages(prev => {
      const newSelection = new Set(prev)
      if (newSelection.has(pageId)) {
        newSelection.delete(pageId)
      } else {
        newSelection.add(pageId)
      }
      return newSelection
    })
  }

  const deleteSelectedPages = () => {
    if (selectedPages.size === 0) {
      toast.error('Please select pages to delete')
      return
    }
    
    const activePages = pages.filter(page => !page.deleted)
    if (selectedPages.size >= activePages.length) {
      toast.error('Cannot delete all pages')
      return
    }

    setPages(prev => prev.map(page => 
      selectedPages.has(page.id) 
        ? { ...page, deleted: true }
        : page
    ))
    setSelectedPages(new Set())
    toast.success(`${selectedPages.size} page(s) marked for deletion`)
  }

  const restoreDeletedPages = () => {
    setPages(prev => prev.map(page => ({ ...page, deleted: false })))
    setSelectedPages(new Set())
    toast.success('All deleted pages restored')
  }

  const movePage = (pageId, direction) => {
    setPages(prev => {
      const activePages = prev.filter(page => !page.deleted)
      const currentIndex = activePages.findIndex(page => page.id === pageId)
      
      if (currentIndex === -1) return prev
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1
      if (newIndex < 0 || newIndex >= activePages.length) return prev
      
      const newActivePages = [...activePages]
      ;[newActivePages[currentIndex], newActivePages[newIndex]] = [newActivePages[newIndex], newActivePages[currentIndex]]
      
      // Merge back with deleted pages
      const deletedPages = prev.filter(page => page.deleted)
      return [...newActivePages, ...deletedPages]
    })
  }

  const selectAll = () => {
    const activePageIds = pages.filter(page => !page.deleted).map(page => page.id)
    setSelectedPages(new Set(activePageIds))
  }

  const deselectAll = () => {
    setSelectedPages(new Set())
  }

  const handleOrganizePDF = async () => {
    if (!file) {
      toast.error('Please select a PDF file')
      return
    }

    const activePages = pages.filter(page => !page.deleted)
    if (activePages.length === 0) {
      toast.error('No pages to include in the organized PDF')
      return
    }

    setIsProcessing(true)
    const loadingToast = toast.loading('Organizing PDF...')

    try {
      // Create page operations array
      const pageOperations = activePages.map(page => ({
        pageIndex: page.originalIndex,
        action: 'include',
        rotation: page.rotation
      }))

      await organizePDF(file, pageOperations)
      toast.dismiss(loadingToast)
      toast.success('PDF organized successfully! Download started.')
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error(error.message || 'Failed to organize PDF')
    } finally {
      setIsProcessing(false)
    }
  }

  const activePages = pages.filter(page => !page.deleted)
  const deletedPages = pages.filter(page => page.deleted)

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Settings className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Organize PDF
          </h1>
          <p className="text-lg text-white/80">
            Reorder, rotate, and delete pages in your PDF document
          </p>
        </div>

        {/* File Upload */}
        <div
          {...getRootProps()}
          className={`glass rounded-2xl p-8 border-2 border-dashed transition-all duration-300 cursor-pointer mb-8 ${
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

        {/* File Info */}
        {file && pdfInfo && (
          <div className="glass rounded-2xl p-6 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-red-400" />
                <div>
                  <h3 className="text-lg font-semibold text-white">{file.name}</h3>
                  <p className="text-white/60">
                    {formatFileSize(file.size)} • {pdfInfo.pageCount} pages
                  </p>
                </div>
              </div>
              
              {activePages.length > 0 && (
                <div className="flex items-center space-x-4">
                  <span className="text-white/60">
                    {activePages.length} of {pdfInfo.pageCount} pages
                  </span>
                  <button
                    onClick={handleOrganizePDF}
                    disabled={isProcessing}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? 'Processing...' : 'Apply Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Controls */}
        {activePages.length > 0 && (
          <div className="glass rounded-2xl p-4 mb-6">
            <div className="flex flex-wrap items-center gap-4">
              <button
                onClick={selectAll}
                className="btn-secondary text-sm py-2 px-4"
              >
                Select All
              </button>
              <button
                onClick={deselectAll}
                className="btn-secondary text-sm py-2 px-4"
              >
                Deselect All
              </button>
              <button
                onClick={deleteSelectedPages}
                disabled={selectedPages.size === 0}
                className="btn-secondary text-sm py-2 px-4 disabled:opacity-50"
              >
                <Trash2 className="w-4 h-4 inline mr-1" />
                Delete Selected ({selectedPages.size})
              </button>
              {deletedPages.length > 0 && (
                <button
                  onClick={restoreDeletedPages}
                  className="btn-secondary text-sm py-2 px-4"
                >
                  Restore Deleted ({deletedPages.length})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoadingThumbnails && (
          <div className="glass rounded-2xl p-8 text-center">
            <div className="animate-spin w-8 h-8 border-2 border-primary-500 border-t-transparent rounded-full mx-auto mb-4"></div>
            <p className="text-white">Generating page thumbnails...</p>
          </div>
        )}

        {/* Page Thumbnails */}
        {activePages.length > 0 && (
          <div className="glass rounded-2xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-white mb-4">Pages</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {activePages.map((page, index) => (
                <div
                  key={page.id}
                  className={`relative group cursor-pointer transition-all duration-200 ${
                    selectedPages.has(page.id) 
                      ? 'ring-2 ring-primary-500 bg-primary-500/20' 
                      : 'hover:bg-white/10'
                  } p-3 rounded-lg`}
                  onClick={() => togglePageSelection(page.id)}
                >
                  {/* Page Number */}
                  <div className="text-center text-white/60 text-sm mb-2">
                    Page {index + 1}
                  </div>
                  
                  {/* Thumbnail */}
                  <div className="relative">
                    <img
                      src={page.thumbnail}
                      alt={`Page ${page.pageNumber}`}
                      className="w-full h-auto border border-white/20 rounded shadow-lg"
                      style={{
                        transform: `rotate(${page.rotation}deg)`,
                        transition: 'transform 0.2s ease'
                      }}
                    />
                    
                    {/* Selection Indicator */}
                    {selectedPages.has(page.id) && (
                      <div className="absolute inset-0 bg-primary-500/30 rounded flex items-center justify-center">
                        <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Controls */}
                  <div className="flex items-center justify-center space-x-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        movePage(page.id, 'up')
                      }}
                      disabled={index === 0}
                      className="p-1 rounded bg-black/20 hover:bg-black/40 disabled:opacity-50"
                      title="Move up"
                    >
                      <ArrowUp className="w-3 h-3 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        movePage(page.id, 'down')
                      }}
                      disabled={index === activePages.length - 1}
                      className="p-1 rounded bg-black/20 hover:bg-black/40 disabled:opacity-50"
                      title="Move down"
                    >
                      <ArrowDown className="w-3 h-3 text-white" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        rotatePage(page.id, 90)
                      }}
                      className="p-1 rounded bg-black/20 hover:bg-black/40"
                      title="Rotate"
                    >
                      <RotateCw className="w-3 h-3 text-white" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deleted Pages */}
        {deletedPages.length > 0 && (
          <div className="glass rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4 text-red-400">
              Deleted Pages ({deletedPages.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {deletedPages.map((page) => (
                <div
                  key={page.id}
                  className="relative p-3 rounded-lg opacity-50"
                >
                  <div className="text-center text-white/60 text-sm mb-2">
                    Page {page.pageNumber}
                  </div>
                  <img
                    src={page.thumbnail}
                    alt={`Deleted page ${page.pageNumber}`}
                    className="w-full h-auto border border-red-400/50 rounded shadow-lg"
                    style={{
                      transform: `rotate(${page.rotation}deg)`,
                      filter: 'grayscale(100%)'
                    }}
                  />
                  <div className="absolute inset-0 bg-red-500/30 rounded flex items-center justify-center">
                    <Trash2 className="w-6 h-6 text-red-400" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrganizePDF 