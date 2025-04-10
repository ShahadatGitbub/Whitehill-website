import React from 'react'
import { Routes,Route } from 'react-router-dom'
import UnderConstructionPage from './components/UnderConstructionPage'

const App = () => {
  return (
    <div>
      <Routes>
        <Route path="*" element={<UnderConstructionPage />} />
      </Routes>
    </div>
  )
}

export default App