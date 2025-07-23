import { BrowserRouter, Link, Route, Router, Routes } from 'react-router-dom'
import './App.css'
import BottomNavigation from './global/BottomNavigation'
import TopHeader from './global/TopHeader'
import WelcomePage from './global/WelcomePage'
import LoginPage from './global/LoginPage'
import RegisterPage from './global/RegisterPage'

function App() {


  return (
    <>
      <BrowserRouter>

       <div style={{  display: 'flex', flexDirection: 'column' , paddingBottom: '10px', maxWidth: '375px', margin: '0 auto' }}>
              <TopHeader />
            <Routes>
              <Route>
                <Route path='/welcome' element={<WelcomePage />} />
                <Route path='/register' element={<RegisterPage/>}/>
                <Route path='/login' element={<LoginPage/>}/>
              </Route>
            </Routes>

          <BottomNavigation />
        </div>

      </BrowserRouter>
    </>
  )
}

export default App
