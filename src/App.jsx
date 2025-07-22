import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import './App.css'
import BottomNavigation from './global/BottomNavigation'

function App() {


  return (
    <>
      <BrowserRouter>
       <div style={{ paddingBottom: '60px', maxWidth: '375px', margin: '0 auto' }}>
            <Routes>

            </Routes>
          </div>

          <BottomNavigation />
      </BrowserRouter>
    </>
  )
}

export default App
