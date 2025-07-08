import React from 'react'
import ComingSoonPage from '../components/ComingSoonPage'

const UnlockPDF = () => {
  return (
    <ComingSoonPage
      title="Unlock PDF"
      description="Remove password protection from your PDF documents. Regain access to locked files."
      icon="🔓"
      features={[
        "Remove passwords",
        "Unlock restrictions",
        "Restore access",
        "Batch unlock",
        "Security removal"
      ]}
      comingSoon={true}
    />
  )
}

export default UnlockPDF 