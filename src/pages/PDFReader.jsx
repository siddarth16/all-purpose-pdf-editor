import React from 'react'
import ComingSoonPage from '../components/ComingSoonPage'

const PDFReader = () => {
  return (
    <ComingSoonPage
      title="PDF Reader"
      description="Read and view PDF documents in your browser. No downloads required."
      icon="📖"
      features={[
        "In-browser PDF viewing",
        "Zoom and navigation",
        "Search functionality",
        "Bookmarks support",
        "Print options"
      ]}
      comingSoon={true}
    />
  )
}

export default PDFReader 