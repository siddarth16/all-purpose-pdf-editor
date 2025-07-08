import React from 'react'
import ComingSoonPage from '../components/ComingSoonPage'

const PageNumbers = () => {
  return (
    <ComingSoonPage
      title="Add Page Numbers"
      description="Add page numbers to your PDF documents. Customize position, format, and style."
      icon="🔢"
      features={[
        "Custom page numbering",
        "Position control",
        "Format options",
        "Start page selection",
        "Professional styling"
      ]}
      comingSoon={true}
    />
  )
}

export default PageNumbers 