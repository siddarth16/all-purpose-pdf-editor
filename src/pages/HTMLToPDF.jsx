import React from 'react'
import ComingSoonPage from '../components/ComingSoonPage'

const HTMLToPDF = () => {
  return (
    <ComingSoonPage
      title="HTML to PDF"
      description="Convert HTML pages and web content to PDF documents. Perfect for archiving web pages."
      icon="🌐"
      features={[
        "HTML to PDF conversion",
        "Web page capture",
        "CSS styling support",
        "Responsive layouts",
        "URL input support"
      ]}
      comingSoon={true}
    />
  )
}

export default HTMLToPDF 