import { PDFDocument } from 'pdf-lib'
import { saveAs } from 'file-saver'
import * as pdfjsLib from 'pdfjs-dist'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { createWorker } from 'tesseract.js'

// Set up PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

// Merge multiple PDF files into one
export const mergePDFs = async (files) => {
  try {
    const mergedPdf = await PDFDocument.create()
    
    for (const file of files) {
      const arrayBuffer = await file.arrayBuffer()
      const pdf = await PDFDocument.load(arrayBuffer)
      const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
      copiedPages.forEach((page) => mergedPdf.addPage(page))
    }
    
    const pdfBytes = await mergedPdf.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    saveAs(blob, 'merged-document.pdf')
    
    return true
  } catch (error) {
    console.error('Error merging PDFs:', error)
    throw new Error('Failed to merge PDFs. Please check your files and try again.')
  }
}

// Split PDF into individual pages
export const splitPDF = async (file, pageRanges = []) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const totalPages = pdf.getPageCount()
    
    if (pageRanges.length === 0) {
      // Split into individual pages
      for (let i = 0; i < totalPages; i++) {
        const newPdf = await PDFDocument.create()
        const [copiedPage] = await newPdf.copyPages(pdf, [i])
        newPdf.addPage(copiedPage)
        
        const pdfBytes = await newPdf.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        saveAs(blob, `page-${i + 1}.pdf`)
      }
    } else {
      // Split based on page ranges
      for (const range of pageRanges) {
        const newPdf = await PDFDocument.create()
        const pages = range.pages || [range.start - 1, range.end - 1]
        const copiedPages = await newPdf.copyPages(pdf, pages)
        copiedPages.forEach((page) => newPdf.addPage(page))
        
        const pdfBytes = await newPdf.save()
        const blob = new Blob([pdfBytes], { type: 'application/pdf' })
        saveAs(blob, `${range.name || 'split-document'}.pdf`)
      }
    }
    
    return true
  } catch (error) {
    console.error('Error splitting PDF:', error)
    throw new Error('Failed to split PDF. Please check your file and try again.')
  }
}

// Compress PDF by reducing quality
export const compressPDF = async (file, quality = 0.7) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    
    // Basic compression by re-saving (more advanced compression would need additional libraries)
    const pdfBytes = await pdf.save({
      useObjectStreams: true,
      addDefaultPage: false,
      compress: true
    })
    
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    saveAs(blob, `compressed-${file.name}`)
    
    return true
  } catch (error) {
    console.error('Error compressing PDF:', error)
    throw new Error('Failed to compress PDF. Please check your file and try again.')
  }
}

// Add password protection to PDF
export const protectPDF = async (file, password) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    
    // Set password protection
    const pdfBytes = await pdf.save({
      userPassword: password,
      ownerPassword: password + '_owner'
    })
    
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    saveAs(blob, `protected-${file.name}`)
    
    return true
  } catch (error) {
    console.error('Error protecting PDF:', error)
    throw new Error('Failed to protect PDF. Please check your file and try again.')
  }
}

// OCR PDF to extract text
export const extractTextFromPDFWithOCR = async (file, options = {}) => {
  try {
    const {
      language = 'eng',
      quality = 1.0,
      scale = 2.0,
      outputFormat = 'text' // 'text' or 'pdf'
    } = options

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
    
    // Initialize Tesseract worker
    const worker = await createWorker(language)
    
    const extractedText = []
    let allText = ''
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: scale })
      
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      
      await page.render(renderContext).promise
      
      // Extract text from canvas using OCR
      const { data: { text } } = await worker.recognize(canvas)
      
      extractedText.push({
        page: pageNum,
        text: text.trim()
      })
      
      allText += `Page ${pageNum}:\n${text.trim()}\n\n`
    }
    
    await worker.terminate()
    
    if (outputFormat === 'text') {
      // Save as text file
      const blob = new Blob([allText], { type: 'text/plain' })
      saveAs(blob, `extracted-text-${file.name.replace('.pdf', '.txt')}`)
    } else if (outputFormat === 'pdf') {
      // Save as PDF with searchable text
      const newPdf = new jsPDF()
      const pageHeight = newPdf.internal.pageSize.height
      const pageWidth = newPdf.internal.pageSize.width
      const lineHeight = 10
      const margin = 20
      
      extractedText.forEach((pageData, index) => {
        if (index > 0) {
          newPdf.addPage()
        }
        
        const lines = newPdf.splitTextToSize(pageData.text, pageWidth - 2 * margin)
        let yPosition = margin
        
        lines.forEach(line => {
          if (yPosition + lineHeight > pageHeight - margin) {
            newPdf.addPage()
            yPosition = margin
          }
          
          newPdf.text(line, margin, yPosition)
          yPosition += lineHeight
        })
      })
      
      newPdf.save(`extracted-text-${file.name.replace('.pdf', '.pdf')}`)
    }
    
    return {
      success: true,
      pagesProcessed: pdf.numPages,
      extractedText: extractedText,
      fullText: allText
    }
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    throw new Error('Failed to extract text from PDF. Please check your file and try again.')
  }
}

// Simple text extraction from PDF (non-OCR)
export const extractTextFromPDF = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
    
    let allText = ''
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const textContent = await page.getTextContent()
      
      const pageText = textContent.items.map(item => item.str).join(' ')
      allText += `Page ${pageNum}:\n${pageText}\n\n`
    }
    
    // Save as text file
    const blob = new Blob([allText], { type: 'text/plain' })
    saveAs(blob, `extracted-text-${file.name.replace('.pdf', '.txt')}`)
    
    return {
      success: true,
      pagesProcessed: pdf.numPages,
      fullText: allText
    }
  } catch (error) {
    console.error('Error extracting text from PDF:', error)
    throw new Error('Failed to extract text from PDF. Please check your file and try again.')
  }
}

// Get PDF metadata
export const getPDFInfo = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    
    return {
      pageCount: pdf.getPageCount(),
      title: pdf.getTitle() || 'Untitled',
      author: pdf.getAuthor() || 'Unknown',
      subject: pdf.getSubject() || '',
      creator: pdf.getCreator() || 'Unknown',
      producer: pdf.getProducer() || 'Unknown',
      creationDate: pdf.getCreationDate(),
      modificationDate: pdf.getModificationDate()
    }
  } catch (error) {
    console.error('Error getting PDF info:', error)
    throw new Error('Failed to get PDF information.')
  }
}

// Rotate PDF pages
export const rotatePDF = async (file, rotation = 90) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await PDFDocument.load(arrayBuffer)
    const pages = pdf.getPages()
    
    pages.forEach(page => {
      page.setRotation({ angle: rotation })
    })
    
    const pdfBytes = await pdf.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    saveAs(blob, `rotated-${file.name}`)
    
    return true
  } catch (error) {
    console.error('Error rotating PDF:', error)
    throw new Error('Failed to rotate PDF. Please check your file and try again.')
  }
}

// Create PDF from images
export const createPDFFromImages = async (imageFiles) => {
  try {
    const pdf = await PDFDocument.create()
    
    for (const imageFile of imageFiles) {
      const arrayBuffer = await imageFile.arrayBuffer()
      const image = imageFile.type === 'image/png' 
        ? await pdf.embedPng(arrayBuffer)
        : await pdf.embedJpg(arrayBuffer)
      
      const page = pdf.addPage([image.width, image.height])
      page.drawImage(image, {
        x: 0,
        y: 0,
        width: image.width,
        height: image.height
      })
    }
    
    const pdfBytes = await pdf.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    saveAs(blob, 'images-to-pdf.pdf')
    
    return true
  } catch (error) {
    console.error('Error creating PDF from images:', error)
    throw new Error('Failed to create PDF from images. Please check your files and try again.')
  }
}

// Convert PDF pages to images
export const convertPDFToImages = async (file, format = 'png', quality = 1.0) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
    
    const images = []
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: 2.0 })
      
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport
      }
      
      await page.render(renderContext).promise
      
      // Convert to blob
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, `image/${format}`, quality)
      })
      
      images.push({
        blob,
        filename: `page-${pageNum}.${format}`
      })
    }
    
    // Download all images
    images.forEach(image => {
      saveAs(image.blob, image.filename)
    })
    
    return images.length
  } catch (error) {
    console.error('Error converting PDF to images:', error)
    throw new Error('Failed to convert PDF to images. Please check your file and try again.')
  }
}

// Convert HTML to PDF
export const convertHTMLToPDF = async (htmlContent, options = {}) => {
  try {
    const {
      filename = 'converted-webpage.pdf',
      format = 'a4',
      orientation = 'portrait',
      quality = 1,
      scale = 1
    } = options

    // Create a temporary div to hold the HTML content
    const tempDiv = document.createElement('div')
    tempDiv.innerHTML = htmlContent
    tempDiv.style.width = '800px'
    tempDiv.style.padding = '20px'
    tempDiv.style.fontFamily = 'Arial, sans-serif'
    tempDiv.style.backgroundColor = 'white'
    tempDiv.style.color = 'black'
    
    // Append to body temporarily
    document.body.appendChild(tempDiv)
    
    // Convert to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      quality: quality
    })
    
    // Remove temp div
    document.body.removeChild(tempDiv)
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format
    })
    
    const imgWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    pdf.save(filename)
    return true
  } catch (error) {
    console.error('Error converting HTML to PDF:', error)
    throw new Error('Failed to convert HTML to PDF. Please check your content and try again.')
  }
}

// Convert URL to PDF
export const convertURLToPDF = async (url, options = {}) => {
  try {
    const {
      filename = 'webpage.pdf',
      format = 'a4',
      orientation = 'portrait',
      quality = 1,
      scale = 1
    } = options

    // Create iframe to load the URL
    const iframe = document.createElement('iframe')
    iframe.src = url
    iframe.style.width = '800px'
    iframe.style.height = '600px'
    iframe.style.border = 'none'
    iframe.style.position = 'absolute'
    iframe.style.left = '-9999px'
    
    document.body.appendChild(iframe)
    
    // Wait for iframe to load
    await new Promise((resolve, reject) => {
      iframe.onload = resolve
      iframe.onerror = reject
      setTimeout(reject, 10000) // 10 second timeout
    })
    
    // Convert iframe content to canvas
    const canvas = await html2canvas(iframe.contentDocument.body, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      quality: quality
    })
    
    // Remove iframe
    document.body.removeChild(iframe)
    
    // Create PDF
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: format
    })
    
    const imgWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    
    let position = 0
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }
    
    pdf.save(filename)
    return true
  } catch (error) {
    console.error('Error converting URL to PDF:', error)
    throw new Error('Failed to convert URL to PDF. Please check the URL and try again.')
  }
}

// Add watermark to PDF
export const addWatermarkToPDF = async (file, watermarkText, options = {}) => {
  try {
    const {
      fontSize = 50,
      opacity = 0.5,
      rotation = 45,
      color = [0.5, 0.5, 0.5], // RGB values between 0-1
      position = 'center' // 'center', 'top', 'bottom'
    } = options

    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const pages = pdfDoc.getPages()

    // Add watermark to each page
    for (const page of pages) {
      const { width, height } = page.getSize()
      
      let x, y
      
      // Calculate position
      switch (position) {
        case 'top':
          x = width / 2
          y = height - 100
          break
        case 'bottom':
          x = width / 2
          y = 100
          break
        case 'center':
        default:
          x = width / 2
          y = height / 2
          break
      }

      // Add watermark text
      page.drawText(watermarkText, {
        x: x,
        y: y,
        size: fontSize,
        color: {
          type: 'RGB',
          red: color[0],
          green: color[1],
          blue: color[2]
        },
        opacity: opacity,
        rotate: {
          type: 'degrees',
          angle: rotation
        }
      })
    }

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    saveAs(blob, `watermarked-${file.name}`)
    
    return true
  } catch (error) {
    console.error('Error adding watermark to PDF:', error)
    throw new Error('Failed to add watermark to PDF. Please check your file and try again.')
  }
}

// Add page numbers to PDF
export const addPageNumbersToPDF = async (file, options = {}) => {
  try {
    const {
      fontSize = 12,
      position = 'bottom-right', // 'bottom-right', 'bottom-left', 'bottom-center', 'top-right', 'top-left', 'top-center'
      startPage = 1,
      format = 'Page {n} of {total}', // {n} = current page, {total} = total pages
      margin = 20
    } = options

    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const pages = pdfDoc.getPages()
    const totalPages = pages.length

    // Add page numbers to each page
    pages.forEach((page, index) => {
      const { width, height } = page.getSize()
      const pageNumber = index + startPage
      
      // Format the text
      const pageText = format
        .replace('{n}', pageNumber.toString())
        .replace('{total}', totalPages.toString())
      
      let x, y
      
      // Calculate position
      switch (position) {
        case 'top-left':
          x = margin
          y = height - margin
          break
        case 'top-center':
          x = width / 2
          y = height - margin
          break
        case 'top-right':
          x = width - margin
          y = height - margin
          break
        case 'bottom-left':
          x = margin
          y = margin
          break
        case 'bottom-center':
          x = width / 2
          y = margin
          break
        case 'bottom-right':
        default:
          x = width - margin
          y = margin
          break
      }

      // Add page number
      page.drawText(pageText, {
        x: x,
        y: y,
        size: fontSize,
        color: {
          type: 'RGB',
          red: 0,
          green: 0,
          blue: 0
        }
      })
    })

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    saveAs(blob, `numbered-${file.name}`)
    
    return true
  } catch (error) {
    console.error('Error adding page numbers to PDF:', error)
    throw new Error('Failed to add page numbers to PDF. Please check your file and try again.')
  }
}

// Organize PDF pages (reorder, rotate, delete)
export const organizePDF = async (file, pageOperations) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const pages = pdfDoc.getPages()
    
    // Create new document
    const newPdfDoc = await PDFDocument.create()
    
    // Process each operation
    for (const operation of pageOperations) {
      const { pageIndex, action, rotation = 0 } = operation
      
      if (action === 'include') {
        // Copy page to new document
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex])
        
        // Apply rotation if specified
        if (rotation !== 0) {
          copiedPage.setRotation({ angle: rotation })
        }
        
        newPdfDoc.addPage(copiedPage)
      }
      // 'delete' action means we simply don't include the page
    }
    
    const pdfBytes = await newPdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    saveAs(blob, `organized-${file.name}`)
    
    return true
  } catch (error) {
    console.error('Error organizing PDF:', error)
    throw new Error('Failed to organize PDF. Please check your file and try again.')
  }
}

// Get PDF page thumbnails for preview
export const getPDFPageThumbnails = async (file, scale = 0.5) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
    
    const thumbnails = []
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
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
      
      thumbnails.push({
        pageNumber: pageNum,
        thumbnail: canvas.toDataURL(),
        width: viewport.width,
        height: viewport.height
      })
    }
    
    return thumbnails
  } catch (error) {
    console.error('Error generating PDF thumbnails:', error)
    throw new Error('Failed to generate PDF thumbnails.')
  }
}

// Reorder PDF pages
export const reorderPDFPages = async (file, newOrder) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    
    // Create new document
    const newPdfDoc = await PDFDocument.create()
    
    // Copy pages in new order
    for (const pageIndex of newOrder) {
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [pageIndex])
      newPdfDoc.addPage(copiedPage)
    }
    
    const pdfBytes = await newPdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    saveAs(blob, `reordered-${file.name}`)
    
    return true
  } catch (error) {
    console.error('Error reordering PDF pages:', error)
    throw new Error('Failed to reorder PDF pages. Please check your file and try again.')
  }
}

// Delete specific pages from PDF
export const deletePDFPages = async (file, pagesToDelete) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const pdfDoc = await PDFDocument.load(arrayBuffer)
    const totalPages = pdfDoc.getPageCount()
    
    // Create new document
    const newPdfDoc = await PDFDocument.create()
    
    // Copy all pages except the ones to delete
    for (let i = 0; i < totalPages; i++) {
      if (!pagesToDelete.includes(i)) {
        const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [i])
        newPdfDoc.addPage(copiedPage)
      }
    }
    
    const pdfBytes = await newPdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    saveAs(blob, `pages-deleted-${file.name}`)
    
    return true
  } catch (error) {
    console.error('Error deleting PDF pages:', error)
    throw new Error('Failed to delete PDF pages. Please check your file and try again.')
  }
}

// Unlock PDF by removing password protection
export const unlockPDF = async (file, password) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    
    // Try to load PDF with password
    const pdfDoc = await PDFDocument.load(arrayBuffer, { password })
    
    // Create a new PDF without password protection
    const newPdfDoc = await PDFDocument.create()
    
    // Copy all pages from the original PDF
    const pageCount = pdfDoc.getPageCount()
    const pageIndices = Array.from({ length: pageCount }, (_, i) => i)
    const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices)
    
    // Add all pages to the new document
    copiedPages.forEach(page => newPdfDoc.addPage(page))
    
    // Save the unlocked PDF
    const pdfBytes = await newPdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    saveAs(blob, `unlocked-${file.name}`)
    
    return {
      success: true,
      pageCount: pageCount
    }
  } catch (error) {
    console.error('Error unlocking PDF:', error)
    
    if (error.message.includes('password') || error.message.includes('encrypted')) {
      throw new Error('Incorrect password. Please check your password and try again.')
    }
    
    throw new Error('Failed to unlock PDF. The file may be corrupted or use unsupported encryption.')
  }
}

// Check if PDF is password protected
export const checkPDFPasswordProtection = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    
    try {
      // Try to load without password
      await PDFDocument.load(arrayBuffer)
      return { isProtected: false }
    } catch (error) {
      // If loading fails, it's likely password protected
      if (error.message.includes('password') || error.message.includes('encrypted')) {
        return { isProtected: true }
      }
      throw error
    }
  } catch (error) {
    console.error('Error checking PDF protection:', error)
    throw new Error('Failed to check PDF protection status.')
  }
}

// Remove all restrictions from PDF (if possible)
export const removePDFRestrictions = async (file, password = '') => {
  try {
    const arrayBuffer = await file.arrayBuffer()
    
    // Load PDF with password if provided
    const pdfDoc = await PDFDocument.load(arrayBuffer, password ? { password } : undefined)
    
    // Create a new PDF without restrictions
    const newPdfDoc = await PDFDocument.create()
    
    // Copy all pages
    const pageCount = pdfDoc.getPageCount()
    const pageIndices = Array.from({ length: pageCount }, (_, i) => i)
    const copiedPages = await newPdfDoc.copyPages(pdfDoc, pageIndices)
    
    // Add all pages to the new document
    copiedPages.forEach(page => newPdfDoc.addPage(page))
    
    // Save without any restrictions
    const pdfBytes = await newPdfDoc.save()
    const blob = new Blob([pdfBytes], { type: 'application/pdf' })
    saveAs(blob, `unrestricted-${file.name}`)
    
    return {
      success: true,
      pageCount: pageCount
    }
  } catch (error) {
    console.error('Error removing PDF restrictions:', error)
    
    if (error.message.includes('password') || error.message.includes('encrypted')) {
      throw new Error('This PDF requires a password to remove restrictions.')
    }
    
    throw new Error('Failed to remove PDF restrictions. The file may be corrupted or use unsupported encryption.')
  }
}

// Convert PDF pages to PNG with transparency support
export const convertPDFToPNG = async (file, options = {}) => {
  try {
    const {
      scale = 2.0,
      preserveTransparency = true,
      backgroundColor = null // null for transparent, or hex color like '#ffffff'
    } = options

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
    
    const images = []
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: scale })
      
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width
      
      // Set background for transparency support
      if (!preserveTransparency && backgroundColor) {
        context.fillStyle = backgroundColor
        context.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        background: preserveTransparency ? null : backgroundColor
      }
      
      await page.render(renderContext).promise
      
      // Convert to PNG blob with transparency
      const blob = await new Promise(resolve => {
        canvas.toBlob(resolve, 'image/png')
      })
      
      images.push({
        blob,
        filename: `page-${pageNum}.png`
      })
    }
    
    // Download all PNG images
    images.forEach(image => {
      saveAs(image.blob, image.filename)
    })
    
    return {
      success: true,
      imageCount: images.length,
      format: 'PNG'
    }
  } catch (error) {
    console.error('Error converting PDF to PNG:', error)
    throw new Error('Failed to convert PDF to PNG. Please check your file and try again.')
  }
}

// Convert PDF to multiple image formats
export const convertPDFToMultipleFormats = async (file, formats = ['png'], options = {}) => {
  try {
    const {
      scale = 2.0,
      quality = 0.9,
      preserveTransparency = true,
      backgroundColor = '#ffffff'
    } = options

    const arrayBuffer = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise
    
    const results = []
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum)
      const viewport = page.getViewport({ scale: scale })
      
      const canvas = document.createElement('canvas')
      const context = canvas.getContext('2d')
      canvas.height = viewport.height
      canvas.width = viewport.width
      
      // Set background if not preserving transparency
      if (!preserveTransparency) {
        context.fillStyle = backgroundColor
        context.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        background: preserveTransparency ? null : backgroundColor
      }
      
      await page.render(renderContext).promise
      
      // Convert to each requested format
      for (const format of formats) {
        const mimeType = format === 'jpg' ? 'image/jpeg' : `image/${format}`
        const qualityParam = format === 'png' ? undefined : quality
        
        const blob = await new Promise(resolve => {
          canvas.toBlob(resolve, mimeType, qualityParam)
        })
        
        results.push({
          blob,
          filename: `page-${pageNum}.${format}`,
          format: format.toUpperCase(),
          page: pageNum
        })
      }
    }
    
    // Download all images
    results.forEach(image => {
      saveAs(image.blob, image.filename)
    })
    
    return {
      success: true,
      imageCount: results.length,
      formats: formats,
      pagesProcessed: pdf.numPages
    }
  } catch (error) {
    console.error('Error converting PDF to multiple formats:', error)
    throw new Error('Failed to convert PDF to images. Please check your file and try again.')
  }
} 