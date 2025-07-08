import React from 'react'
import ComingSoonPage from '../components/ComingSoonPage'

const ExcelToPDF = () => {
  return (
    <ComingSoonPage
      title="Excel to PDF"
      description="Convert your Excel spreadsheets to PDF documents. Perfect for sharing and archiving."
      icon="📈"
      features={[
        "Convert .xlsx files to PDF",
        "Preserve formatting",
        "Multiple sheet support",
        "Custom page settings",
        "Professional layouts"
      ]}
      comingSoon={true}
    />
  )
}

export default ExcelToPDF 