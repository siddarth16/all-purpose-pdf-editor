import React from 'react'
import ComingSoonPage from '../components/ComingSoonPage'

const PDFToPowerPoint = () => {
  return (
    <ComingSoonPage
      title="PDF to PowerPoint"
      description="Convert your PDF files to PowerPoint presentations. Edit and enhance your slides."
      icon="🎯"
      features={[
        "Convert PDF to .pptx",
        "Page-to-slide conversion",
        "Editable presentations",
        "Preserve layouts",
        "Custom slide settings"
      ]}
      comingSoon={true}
    />
  )
}

export default PDFToPowerPoint 