import React from 'react'
import { CFooter } from '@coreui/react'

const AppFooter = () => {
  return (
    <CFooter className="px-4">
      <div>
        <a href="https://www.daianaeantonino.it" target="_blank" rel="noopener noreferrer">
          A&D Weddings
        </a>
      </div>
      <div className="ms-auto">
        <span className="me-1">Lovely made by</span>
        <a href="https://www.daianaeantonino.it" target="_blank" rel="noopener noreferrer">
          Marco Smorti
        </a>
      </div>
    </CFooter>
  )
}

export default React.memo(AppFooter)
