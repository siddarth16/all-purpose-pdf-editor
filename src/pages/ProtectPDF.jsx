import React from 'react'
import ComingSoonPage from '../components/ComingSoonPage'

const ProtectPDF = () => {
  return (
    <ComingSoonPage
      title="Protect PDF"
      description="Add password protection and security to your PDF documents. Control access and permissions."
      icon="🔒"
      features={[
        "Password protection",
        "Encryption options",
        "Access permissions",
        "Print restrictions",
        "Copy protection"
      ]}
      comingSoon={true}
    />
  )
}

export default ProtectPDF 