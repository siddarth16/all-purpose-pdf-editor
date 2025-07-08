import React from 'react'
import ComingSoonPage from '../components/ComingSoonPage'

const WatermarkPDF = () => {
  return (
    <ComingSoonPage
      title="Watermark PDF"
      description="Add text or image watermarks to your PDF documents. Brand and protect your content."
      icon="🏷️"
      features={[
        "Text watermarks",
        "Image watermarks",
        "Custom positioning",
        "Opacity controls",
        "Batch watermarking"
      ]}
      comingSoon={true}
    />
  )
}

export default WatermarkPDF 