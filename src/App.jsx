import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import BottomNavigation from './global/pages/BottomNavigation'
import TopHeader from './global/pages/TopHeader'
import LoginPage from './auth/pages/LoginPage'
import ErrorPage from './global/pages/ErrorPage'
import NotificationPage from './global/pages/NotificationsPage'

import ChallengeHome from './user/challenge/pages/ChallengeHome'
import ChallengeList from './user/challenge/pages/ChallengeList'
import ChallengeMy from './user/challenge/pages/ChallengeMy'

import ChallengeBottomNavigation from './user/challenge/commons/ChallengeBottomNavigation'
import ChallengeIntro from './user/challenge/pages/ChallengeIntro'
import WelcomePage from './global/pages/WelcomePage'
import RegisterPage from './auth/pages/RegisterPage'
import RoutineHomePage from './user/routine/pages/RoutineHomePage'

// 이 부분은 따로 감싼 컴포넌트로 만들어야 useLocation을 쓸 수 있어!
function AppContent() {
  const location = useLocation();
  const hideHeaderFooterRoutes = ['/', '/login', '/register']; // 숨길 경로들
  const shouldHide = hideHeaderFooterRoutes.includes(location.pathname);

  // 수련장 관련
  const shouldHideChallengeBottom = location.pathname === '/challenge';
  const isChallengeSection = location.pathname.startsWith('/challenge');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '375px', margin: '0 auto' }}>
      {!shouldHide && <TopHeader />}

      <Routes>
        <Route path='/' element={<WelcomePage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path="/notifications" element={<NotificationPage />} />

        {/* 루틴 */}
        <Route path='/routine' element={<RoutineHomePage />} />


        {/* 수련장 관련 */}
        <Route path="/challenge" element={<ChallengeIntro />} />
        <Route path="/challengeHome" element={<ChallengeHome />} />
        <Route path="/challengeList" element={<ChallengeList />} />
        <Route path="/challengeMy" element={<ChallengeMy />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>

      {/* 수련장 관련 */}
      {!shouldHide && (
        location.pathname === '/challenge'
          ? null
          : isChallengeSection
            ? <ChallengeBottomNavigation />
            : <BottomNavigation />
      )}





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