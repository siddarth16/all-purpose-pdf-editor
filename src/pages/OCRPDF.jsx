import React from 'react'
import ComingSoonPage from '../components/ComingSoonPage'

const OCRPDF = () => {
  return (
    <ComingSoonPage
      title="OCR PDF"
      description="Convert scanned PDFs to searchable text. Extract text from images using OCR technology."
      icon="👁️"
      features={[
        "Text recognition",
        "Searchable PDFs",
        "Multiple languages",
        "High accuracy",
        "Batch processing"
      ]}
      comingSoon={true}
    />
  )
}

export default OCRPDF 