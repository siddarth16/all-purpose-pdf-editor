import React from 'react'
import { RotateCw, Combine, Scissors, Compress } from 'lucide-react'
import ComingSoonPage from '../components/ComingSoonPage'

const OrganizePDF = () => {
  const features = [
    {
      title: 'Page Reordering',
      description: 'Drag and drop to reorder PDF pages'
    },
    {
      title: 'Page Rotation',
      description: 'Rotate pages in 90-degree increments'
    },
    {
      title: 'Page Deletion',
      description: 'Remove unwanted pages from your PDF'
    },
    {
      title: 'Page Duplication',
      description: 'Duplicate pages within the document'
    },
    {
      title: 'Page Range Selection',
      description: 'Select multiple pages for bulk operations'
    },
    {
      title: 'Preview Mode',
      description: 'Preview changes before applying them'
    }
  ]

  const relatedTools = [
    {
      name: 'Merge PDF',
      description: 'Combine multiple PDFs',
      path: '/merge-pdf',
      icon: Combine
    },
    {
      name: 'Split PDF',
      description: 'Extract PDF pages',
      path: '/split-pdf',
      icon: Scissors
    },
    {
      name: 'Compress PDF',
      description: 'Reduce file size',
      path: '/compress-pdf',
      icon: Compress
    }
  ]

  return (
    <ComingSoonPage
      title="Organize PDF"
      description="Reorder, rotate, and delete pages in your PDF documents with an intuitive drag-and-drop interface."
      icon={RotateCw}
      gradient="from-lime-500 to-lime-600"
      features={features}
      relatedTools={relatedTools}
    />
  )
}

export default OrganizePDF 