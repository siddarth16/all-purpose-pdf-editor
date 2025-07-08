import React from 'react'
import ComingSoonPage from '../components/ComingSoonPage'

const SignPDF = () => {
  return (
    <ComingSoonPage
      title="Sign PDF"
      description="Add digital signatures to your PDF documents. Create legally binding signatures."
      icon="✍️"
      features={[
        "Digital signatures",
        "Handwritten signatures",
        "Legal compliance",
        "Batch signing",
        "Signature verification"
      ]}
      comingSoon={true}
    />
  )
}

export default SignPDF 