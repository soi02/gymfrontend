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
import BuddyRegister from './buddy/pages/BuddyRegister'
import BuddyBottomNavigation from './buddy/commons/BuddyBottomNavigation'
import ChallengeTestIntro from './user/challenge/pages/ChallengeTestIntro'
import ChallengeTestPage from './user/challenge/pages/ChallengeTestPage'
import ChallengeTestResult from './user/challenge/pages/ChallengeTestResult'
import ChallengeRecommendation from './user/challenge/pages/ChallengeRecommendation'


// 이 부분은 따로 감싼 컴포넌트로 만들어야 useLocation을 쓸 수 있어!
function AppContent() {
  const location = useLocation();

  // TopHeader를 숨길 경로들
  const hideHeaderFooterRoutes = ['/gymmadang', '/gymmadang/login', '/gymmadang/register']; // 숨길 경로들

  const isChallengeSection = location.pathname.startsWith('/challenge');
  const isTestSection = location.pathname.startsWith('/challengeTest');
  const isBuddySection = location.pathname.startsWith('/buddy');
  
  // TopHeader 숨길 조건들
  const shouldHideTop = hideHeaderFooterRoutes.includes(location.pathname) || isTestSection;


  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '375px', margin: '0 auto' }}>
      {/* 탑헤더 조건 */}
      {!shouldHideTop && <TopHeader />}

      <Routes>
        <Route path='/gymmadang' element={<WelcomePage />} />
        <Route path='/gymmadang/register' element={<RegisterPage />} />
        <Route path='/gymmadang/login' element={<LoginPage />} />
        <Route path="/gymmadang/notifications" element={<NotificationPage />} />

        {/* 루틴 */}
        <Route path='/gymmadang/routine' element={<RoutineHomePage />} />

        {/* 벗 */}
        <Route path='/gymmadang/buddy' element={<BuddyRegister />} />

        {/* 수련장 */}
        <Route path="/gymmadang/challenge" element={<ChallengeIntro />} />
        <Route path="/gymmadang/challengeHome" element={<ChallengeHome />} />
        <Route path="/gymmadang/challengeList" element={<ChallengeList />} />
        <Route path="/gymmadang/challengeMy" element={<ChallengeMy />} />


        <Route path="/gymmadang/challengeTestIntro" element={<ChallengeTestIntro />} />
        <Route path="/gymmadang/challengeTest/step/:stepId" element={<ChallengeTestPage />} />
        <Route path="/gymmadang/challengeTest/result" element={<ChallengeTestResult />} />
        <Route path="/gymmadang/challengeRecommend" element={<ChallengeRecommendation />} />




        <Route path="*" element={<ErrorPage />} />
      </Routes>


       {/* 바텀 네비게이션 조건 */}
      {!shouldHideTop && (
        isChallengeSection
          ? (location.pathname === '/challenge' 
            ? null 
            : <ChallengeBottomNavigation />)
          : isBuddySection
            ? <BuddyBottomNavigation />
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