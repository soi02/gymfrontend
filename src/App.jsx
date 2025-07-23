import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import BottomNavigation from './global/BottomNavigation'
import TopHeader from './global/TopHeader'
import WelcomePage from './global/WelcomePage'
import LoginPage from './global/LoginPage'
import RegisterPage from './global/RegisterPage'
import ErrorPage from './global/ErrorPage'

// 이 부분은 따로 감싼 컴포넌트로 만들어야 useLocation을 쓸 수 있어!
function AppContent() {
  const location = useLocation();
  const hideHeaderFooterRoutes = ['/', '/login', '/register']; // 숨길 경로들

  const shouldHide = hideHeaderFooterRoutes.includes(location.pathname);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '375px', margin: '0 auto' }}>
      {!shouldHide && <TopHeader />}

      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      {!shouldHide && <BottomNavigation />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App