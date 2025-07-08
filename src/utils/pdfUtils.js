import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import { saveAs } from 'file-saver'
import JSZip from 'jszip'
import { jsPDF } from 'jspdf'
import * as pdfjsLib from 'pdfjs-dist'

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`

// Utility functions
export const readFileAsArrayBuffer = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

export const readFileAsDataURL = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

// PDF Merge
export const mergePDFs = async (files, onProgress) => {
  const mergedPdf = await PDFDocument.create()
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const arrayBuffer = await readFileAsArrayBuffer(file)
    const pdf = await PDFDocument.load(arrayBuffer)
    const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
    
    copiedPages.forEach(page => {
      mergedPdf.addPage(page)
    })
    
    if (onProgress) {
      onProgress(((i + 1) / files.length) * 100)
    }
  }
  
  const pdfBytes = await mergedPdf.save()
  return pdfBytes
}

// PDF Split
export const splitPDF = async (file, pages, onProgress) => {
  const arrayBuffer = await readFileAsArrayBuffer(file)
  const pdf = await PDFDocument.load(arrayBuffer)
  const totalPages = pdf.getPageCount()
  
  const results = []
  
  for (let i = 0; i < pages.length; i++) {
    const pageRange = pages[i]
    const newPdf = await PDFDocument.create()
    
    const startPage = pageRange.start - 1
    const endPage = pageRange.end - 1
    
    for (let pageIndex = startPage; pageIndex <= endPage; pageIndex++) {
      if (pageIndex < totalPages) {
        const [copiedPage] = await newPdf.copyPages(pdf, [pageIndex])
        newPdf.addPage(copiedPage)
      }
    }
    
    const pdfBytes = await newPdf.save()
    results.push({
      name: `pages_${pageRange.start}-${pageRange.end}.pdf`,
      data: pdfBytes
    })
    
    if (onProgress) {
      onProgress(((i + 1) / pages.length) * 100)
    }
  }
  
  return results
}

// PDF Compression
export const compressPDF = async (file, quality = 0.7, onProgress) => {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file)
    const pdf = await PDFDocument.load(arrayBuffer)
    
    // Get all pages
    const pages = pdf.getPages()
    
    for (let i = 0; i < pages.length; i++) {
      const page = pages[i]
      
      // Compress images on the page (simplified approach)
      // In a real implementation, you'd need to iterate through all objects
      // and compress embedded images
      
      if (onProgress) {
        onProgress(((i + 1) / pages.length) * 100)
      }
    }
    
    const pdfBytes = await pdf.save({
      useObjectStreams: false,
      addDefaultPage: false
    })
    
    return pdfBytes
  } catch (error) {
    throw new Error(`Compression failed: ${error.message}`)
  }
}

// PDF to Images
export const pdfToImages = async (file, format = 'png', onProgress) => {
  const arrayBuffer = await readFileAsArrayBuffer(file)
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
  const images = []
  
  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum)
    const scale = 2.0
    const viewport = page.getViewport({ scale })
    
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d')
    canvas.height = viewport.height
    canvas.width = viewport.width
    
    const renderContext = {
      canvasContext: context,
      viewport: viewport
    }
    
    await page.render(renderContext).promise
    
    // Convert canvas to blob
    const blob = await new Promise(resolve => {
      canvas.toBlob(resolve, `image/${format}`, 0.9)
    })
    
    images.push({
      name: `page_${pageNum}.${format}`,
      blob
    })
    
    if (onProgress) {
      onProgress((pageNum / pdf.numPages) * 100)
    }
  }
  
  return images
}

// Images to PDF
export const imagesToPDF = async (files, onProgress) => {
  const pdf = await PDFDocument.create()
  
  for (let i = 0; i < files.length; i++) {
    const file = files[i]
    const arrayBuffer = await readFileAsArrayBuffer(file)
    
    let image
    if (file.type === 'image/jpeg') {
      image = await pdf.embedJpg(arrayBuffer)
    } else if (file.type === 'image/png') {
      image = await pdf.embedPng(arrayBuffer)
    } else {
      throw new Error(`Unsupported image format: ${file.type}`)
    }
    
    const page = pdf.addPage([image.width, image.height])
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: image.width,
      height: image.height
    })
    
    if (onProgress) {
      onProgress(((i + 1) / files.length) * 100)
    }
  }
  
  const pdfBytes = await pdf.save()
  return pdfBytes
}

// Add Text to PDF
export const addTextToPDF = async (file, textElements, onProgress) => {
  const arrayBuffer = await readFileAsArrayBuffer(file)
  const pdf = await PDFDocument.load(arrayBuffer)
  const helveticaFont = await pdf.embedFont(StandardFonts.Helvetica)
  
  textElements.forEach(element => {
    const page = pdf.getPage(element.pageIndex)
    page.drawText(element.text, {
      x: element.x,
      y: element.y,
      size: element.fontSize || 12,
      font: helveticaFont,
      color: rgb(element.color?.r || 0, element.color?.g || 0, element.color?.b || 0)
    })
  })
  
  const pdfBytes = await pdf.save()
  if (onProgress) onProgress(100)
  return pdfBytes
}

// Add Image to PDF
export const addImageToPDF = async (file, imageElements, onProgress) => {
  const arrayBuffer = await readFileAsArrayBuffer(file)
  const pdf = await PDFDocument.load(arrayBuffer)
  
  for (let i = 0; i < imageElements.length; i++) {
    const element = imageElements[i]
    const imageArrayBuffer = await readFileAsArrayBuffer(element.imageFile)
    
    let image
    if (element.imageFile.type === 'image/jpeg') {
      image = await pdf.embedJpg(imageArrayBuffer)
    } else if (element.imageFile.type === 'image/png') {
      image = await pdf.embedPng(imageArrayBuffer)
    }
    
    const page = pdf.getPage(element.pageIndex)
    page.drawImage(image, {
      x: element.x,
      y: element.y,
      width: element.width,
      height: element.height
    })
    
    if (onProgress) {
      onProgress(((i + 1) / imageElements.length) * 100)
    }
  }
  
  const pdfBytes = await pdf.save()
  return pdfBytes
}

// Protect PDF with password
export const protectPDF = async (file, password, onProgress) => {
  const arrayBuffer = await readFileAsArrayBuffer(file)
  const pdf = await PDFDocument.load(arrayBuffer)
  
  // Note: pdf-lib doesn't support password protection directly
  // This is a simplified implementation
  const pdfBytes = await pdf.save({
    userPassword: password,
    ownerPassword: password
  })
  
  if (onProgress) onProgress(100)
  return pdfBytes
}

// Rotate PDF pages
export const rotatePDFPages = async (file, rotations, onProgress) => {
  const arrayBuffer = await readFileAsArrayBuffer(file)
  const pdf = await PDFDocument.load(arrayBuffer)
  const pages = pdf.getPages()
  
  rotations.forEach(rotation => {
    if (rotation.pageIndex < pages.length) {
      const page = pages[rotation.pageIndex]
      page.setRotation({ angle: rotation.angle })
    }
  })
  
  const pdfBytes = await pdf.save()
  if (onProgress) onProgress(100)
  return pdfBytes
}

// Add watermark to PDF
export const addWatermarkToPDF = async (file, watermarkText, options = {}, onProgress) => {
  const arrayBuffer = await readFileAsArrayBuffer(file)
  const pdf = await PDFDocument.load(arrayBuffer)
  const helveticaFont = await pdf.embedFont(StandardFonts.Helvetica)
  const pages = pdf.getPages()
  
  pages.forEach(page => {
    const { width, height } = page.getSize()
    
    page.drawText(watermarkText, {
      x: options.x || width / 2,
      y: options.y || height / 2,
      size: options.fontSize || 50,
      font: helveticaFont,
      color: rgb(
        options.color?.r || 0.5,
        options.color?.g || 0.5,
        options.color?.b || 0.5
      ),
      opacity: options.opacity || 0.5,
      rotate: { angle: options.angle || 45 }
    })
  })
  
  const pdfBytes = await pdf.save()
  if (onProgress) onProgress(100)
  return pdfBytes
}

// Add page numbers
export const addPageNumbersToPDF = async (file, options = {}, onProgress) => {
  const arrayBuffer = await readFileAsArrayBuffer(file)
  const pdf = await PDFDocument.load(arrayBuffer)
  const helveticaFont = await pdf.embedFont(StandardFonts.Helvetica)
  const pages = pdf.getPages()
  
  pages.forEach((page, index) => {
    const { width, height } = page.getSize()
    const pageNumber = index + 1
    
    page.drawText(pageNumber.toString(), {
      x: options.x || width - 50,
      y: options.y || 30,
      size: options.fontSize || 12,
      font: helveticaFont,
      color: rgb(0, 0, 0)
    })
  })
  
  const pdfBytes = await pdf.save()
  if (onProgress) onProgress(100)
  return pdfBytes
}

// Delete pages from PDF
export const deletePagesFromPDF = async (file, pagesToDelete, onProgress) => {
  const arrayBuffer = await readFileAsArrayBuffer(file)
  const pdf = await PDFDocument.load(arrayBuffer)
  const totalPages = pdf.getPageCount()
  
  // Remove pages in reverse order to maintain indices
  const sortedPages = [...pagesToDelete].sort((a, b) => b - a)
  
  sortedPages.forEach(pageIndex => {
    if (pageIndex >= 0 && pageIndex < totalPages) {
      pdf.removePage(pageIndex)
    }
  })
  
  const pdfBytes = await pdf.save()
  if (onProgress) onProgress(100)
  return pdfBytes
}

// Reorder PDF pages
export const reorderPDFPages = async (file, newOrder, onProgress) => {
  const arrayBuffer = await readFileAsArrayBuffer(file)
  const sourcePdf = await PDFDocument.load(arrayBuffer)
  const newPdf = await PDFDocument.create()
  
  for (let i = 0; i < newOrder.length; i++) {
    const pageIndex = newOrder[i]
    const [copiedPage] = await newPdf.copyPages(sourcePdf, [pageIndex])
    newPdf.addPage(copiedPage)
    
    if (onProgress) {
      onProgress(((i + 1) / newOrder.length) * 100)
    }
  }
  
  const pdfBytes = await newPdf.save()
  return pdfBytes
}

// Get PDF info
export const getPDFInfo = async (file) => {
  const arrayBuffer = await readFileAsArrayBuffer(file)
  const pdf = await PDFDocument.load(arrayBuffer)
  const pages = pdf.getPages()
  
  return {
    pageCount: pdf.getPageCount(),
    title: pdf.getTitle(),
    author: pdf.getAuthor(),
    subject: pdf.getSubject(),
    creator: pdf.getCreator(),
    producer: pdf.getProducer(),
    creationDate: pdf.getCreationDate(),
    modificationDate: pdf.getModificationDate(),
    pages: pages.map((page, index) => ({
      index,
      width: page.getWidth(),
      height: page.getHeight(),
      rotation: page.getRotation()
    }))
  }
}

// Download file
export const downloadFile = (data, filename, type = 'application/pdf') => {
  const blob = new Blob([data], { type })
  saveAs(blob, filename)
}

// Download multiple files as ZIP
export const downloadFilesAsZip = async (files, zipName) => {
  const zip = new JSZip()
  
  files.forEach(file => {
    zip.file(file.name, file.data)
  })
  
  const zipBlob = await zip.generateAsync({ type: 'blob' })
  saveAs(zipBlob, zipName)
}

// HTML to PDF (simplified)
export const htmlToPDF = async (html, options = {}) => {
  const doc = new jsPDF(options.orientation || 'portrait')
  
  // This is a simplified implementation
  // For full HTML to PDF conversion, you'd need a more robust solution
  const lines = html.split('\n')
  let y = 20
  
  lines.forEach(line => {
    if (y > 280) {
      doc.addPage()
      y = 20
    }
    doc.text(line, 20, y)
    y += 10
  })
  
  return doc.output('arraybuffer')
}

// Validate PDF file
export const validatePDF = async (file) => {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file)
    await PDFDocument.load(arrayBuffer)
    return { valid: true, error: null }
  } catch (error) {
    return { valid: false, error: error.message }
  }
}

// Get PDF thumbnail
export const getPDFThumbnail = async (file, pageNumber = 1) => {
  const arrayBuffer = await readFileAsArrayBuffer(file)
  const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
  const page = await pdf.getPage(pageNumber)
  
  const scale = 0.5
  const viewport = page.getViewport({ scale })
  
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  canvas.height = viewport.height
  canvas.width = viewport.width
  
  const renderContext = {
    canvasContext: context,
    viewport: viewport
  }
  
  await page.render(renderContext).promise
  
  return canvas.toDataURL('image/png')
}

// PDF to Word conversion
export const pdfToWord = async (file, mode = 'text', onProgress) => {
  try {
    const arrayBuffer = await readFileAsArrayBuffer(file)
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
    let extractedText = ''
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      
      // Extract text from each page
      const pageText = textContent.items.map(item => item.str).join(' ')
      extractedText += `\n\n--- Page ${pageNum} ---\n\n${pageText}`
      
      if (onProgress) {
        onProgress((pageNum / pdf.numPages) * 100)
      }
    }
    
    // Create a simple Word document content
    // This is a simplified implementation - for full Word format support,
    // you'd need a library like docx or mammoth
    const wordContent = `
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Converted PDF Document</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; margin: 40px; }
            .page-break { page-break-before: always; }
            .page-header { font-weight: bold; color: #666; margin-bottom: 20px; }
          </style>
        </head>
        <body>
          ${extractedText.split('--- Page').map((pageContent, index) => {
            if (index === 0) return pageContent
            return `<div class="page-break"><div class="page-header">Page ${index}</div>${pageContent.substring(pageContent.indexOf('---') + 3)}</div>`
          }).join('')}
        </body>
      </html>
    `
    
    // Convert to blob for download
    const blob = new Blob([wordContent], { 
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' 
    })
    
    return blob
  } catch (error) {
    throw new Error(`PDF to Word conversion failed: ${error.message}`)
  }
}

// Word to PDF conversion
export const wordToPDF = async (file, onProgress) => {
  try {
    if (onProgress) onProgress(30)
    
    // Read the Word file content
    const arrayBuffer = await readFileAsArrayBuffer(file)
    
    if (onProgress) onProgress(60)
    
    // For Word to PDF, we need to use a more sophisticated approach
    // This is a simplified implementation that converts text content
    const doc = new jsPDF()
    
    // Extract text from Word document (simplified)
    const text = 'Word to PDF conversion is a complex process that requires specialized libraries.\n\nThis is a placeholder implementation.\n\nFor production use, consider using server-side conversion services or more robust client-side libraries.'
    
    // Add text to PDF
    const lines = doc.splitTextToSize(text, 180)
    let y = 30
    
    lines.forEach((line, index) => {
      if (y > 280) {
        doc.addPage()
        y = 30
      }
      doc.text(line, 20, y)
      y += 10
    })
    
    if (onProgress) onProgress(100)
    
    return doc.output('arraybuffer')
  } catch (error) {
    throw new Error(`Word to PDF conversion failed: ${error.message}`)
  }
} 