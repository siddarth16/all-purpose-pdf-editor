import React, { useState } from 'react'
import { toast } from 'react-hot-toast'
import { mergePDFs, downloadFile } from '../utils/pdfUtils'

const MergePDF = () => {
  const [files, setFiles] = useState([])
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files)
    setFiles(selectedFiles)
    console.log('Files selected:', selectedFiles.length)
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      alert('Please select at least 2 PDF files')
      return
    }

    setIsProcessing(true)
    setProgress(0)

    try {
      console.log('Starting merge...')
      const mergedPdfBytes = await mergePDFs(files, (progress) => {
        setProgress(progress)
        console.log('Progress:', progress)
      })
      
      console.log('Merge complete, downloading...')
      const filename = `merged_${Date.now()}.pdf`
      downloadFile(mergedPdfBytes, filename)
      toast.success('PDFs merged successfully!')
    } catch (error) {
      console.error('Merge error:', error)
      alert(`Failed to merge PDFs: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Merge PDF</h1>
      <p>Select multiple PDF files to merge them into one.</p>
      
      <div style={{ marginBottom: '20px' }}>
        <input
          type="file"
          multiple
          accept=".pdf"
          onChange={handleFileChange}
          style={{ marginBottom: '10px' }}
        />
      </div>

      {files.length > 0 && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Selected Files ({files.length}):</h3>
          <ul>
            {files.map((file, index) => (
              <li key={index} style={{ marginBottom: '5px' }}>
                {file.name} ({(file.size / 1024 / 1024).toFixed(2)} MB)
                <button 
                  onClick={() => removeFile(index)}
                  style={{ marginLeft: '10px', color: 'red' }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={handleMerge}
          disabled={files.length < 2 || isProcessing}
          style={{
            padding: '10px 20px',
            backgroundColor: files.length >= 2 && !isProcessing ? '#007bff' : '#ccc',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: files.length >= 2 && !isProcessing ? 'pointer' : 'not-allowed'
          }}
        >
          {isProcessing ? `Merging... ${progress.toFixed(0)}%` : 'Merge PDFs'}
        </button>
      </div>

      {isProcessing && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{
            width: '100%',
            height: '20px',
            backgroundColor: '#f0f0f0',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: '#007bff',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
          <p>Progress: {progress.toFixed(1)}%</p>
        </div>
      )}
    </div>
  )
}

export default MergePDF 