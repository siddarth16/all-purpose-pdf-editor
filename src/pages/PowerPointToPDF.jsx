import React from 'react'
import ComingSoonPage from '../components/ComingSoonPage'

const PowerPointToPDF = () => {
  return (
    <ComingSoonPage
      title="PowerPoint to PDF"
      description="Convert your PowerPoint presentations to PDF format. Share slides professionally."
      icon="📊"
      features={[
        "Convert .pptx to PDF",
        "Preserve animations",
        "Custom page layouts",
        "Professional quality",
        "Batch conversion"
      ]}
      comingSoon={true}
    />
  )
}

export default PowerPointToPDF 