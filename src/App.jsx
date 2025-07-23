import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import './App.css'
import BottomNavigation from './global/BottomNavigation'
import TopHeader from './global/TopHeader'

function App() {


  return (
    <>
      <BrowserRouter>
       <div style={{ paddingBottom: '60px', maxWidth: '375px', margin: '0 auto' }}>
          <TopHeader />

          <Routes> 




          </Routes>

          <BottomNavigation />
      </div>

      </BrowserRouter>
    </>
  )
}

export default App
