import React from 'react'
import ComingSoonPage from '../components/ComingSoonPage'

const PDFToExcel = () => {
  return (
    <ComingSoonPage
      title="PDF to Excel"
      description="Convert your PDF files to Excel spreadsheets. Extract tables and data for analysis."
      icon="📊"
      features={[
        "Extract tables from PDFs",
        "Convert to .xlsx format",
        "Preserve data structure",
        "Support for multiple sheets",
        "Custom formatting options"
      ]}
      comingSoon={true}
    />
  )
}

export default PDFToExcel 