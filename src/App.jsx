import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import BottomNavigation from './global/BottomNavigation'
import TopHeader from './global/TopHeader'
import WelcomePage from './global/WelcomePage'
import LoginPage from './global/LoginPage'
import RegisterPage from './global/RegisterPage'

function App() {
  return (
    <BrowserRouter>
      <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: '60px', maxWidth: '375px', margin: '0 auto' }}>
        
        {/* ✅ Routes 바깥에 공통 컴포넌트 */}
        <TopHeader />

        {/* ✅ 올바른 Route 구성 */}
        <Routes>
          <Route path='/welcome' element={<WelcomePage />} />
          <Route path='/register' element={<RegisterPage />} />
          <Route path='/login' element={<LoginPage />} />
        </Routes>

        {/* ✅ 하단 네비도 Routes 밖에 */}
        <BottomNavigation />
      </div>
    </BrowserRouter>
  )
}

export default App
