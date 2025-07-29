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
import ChallengeCreate from './user/challenge/create/pages/ChallengeCreate'

import WelcomePage from './global/pages/WelcomePage'
import RegisterPage from './auth/pages/RegisterPage'


import RoutineHomePage from './user/routine/pages/RoutineHomePage'
import BuddyRegister from './user/buddy/pages/BuddyRegister'
import BuddyBottomNavigation from './user/buddy/commons/BuddyBottomNavigation'
import ChallengeTestIntro from './user/challenge/pages/ChallengeTestIntro'
import ChallengeTestPage from './user/challenge/pages/ChallengeTestPage'
import ChallengeTestResult from './user/challenge/pages/ChallengeTestResult'
import ChallengeRecommendation from './user/challenge/pages/ChallengeRecommendation'
import BuddyHome from './user/buddy/pages/BuddyHome'
import ChallengeTopTabs from './user/challenge/commons/ChallengeTopTabs'
import RoutineAddPage from './user/routine/pages/RoutineAddPage'
import RoutineFreePage from './user/routine/pages/RoutineFreePage'
import MyPage from './user/mypage/pages/MyPage'
import MyRoutinePage from './user/routine/pages/MyRoutinePage'
import WorkoutPage from './user/routine/pages/WorkoutPage'
import GuidePage from './user/routine/pages/GuidePage'
import DiaryPage from './user/routine/pages/DiaryPage.Jsx'
import SummaryPage from './user/routine/pages/SummaryPage'
import ResultPage from './user/routine/pages/ResultPage'


// 이 부분은 따로 감싼 컴포넌트로 만들어야 useLocation을 쓸 수 있어!
function AppContent() {
  const location = useLocation();

  // TopHeader를 숨길 경로들
  const hideHeaderFooterRoutes = ['/gymmadang', '/gymmadang/login', '/gymmadang/register', '/gymmadang/challenge/challengeCreate']; // 숨길 경로들

  const isChallengeSection = location.pathname.startsWith('/gymmadang/challenge') && !location.pathname.includes('challengeTest');
  const isTestSection = location.pathname.startsWith('/gymmadang/challenge/challengeTest');
  const isBuddySection = location.pathname.startsWith('/gymmadang/buddy');

  
  // TopHeader 숨길 조건들
  const shouldHideTop = hideHeaderFooterRoutes.includes(location.pathname) || isTestSection;

  // Bottom 숨길 조건들
  const shouldHideBottom = hideHeaderFooterRoutes.includes(location.pathname) || isTestSection;

  const isChallengeIntro = location.pathname === '/gymmadang/challenge/challengeIntro'; // 강제 조건



  return (
    <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '375px', margin: '0 auto' }}>
      {/* 탑헤더 조건 */}
      {!shouldHideTop && <TopHeader />}


      {/* 챌린지 탭 메뉴 (상단 카테고리처럼) */}
      {isChallengeSection && !shouldHideTop && !isChallengeIntro && (
        <div style={{ borderBottom: '1px solid #eee' }}>
          <ChallengeTopTabs />
        </div>
      )}



      <Routes>
        <Route path='/gymmadang' element={<WelcomePage />} />
        <Route path='/gymmadang/register' element={<RegisterPage />} />
        <Route path='/gymmadang/login' element={<LoginPage />} />
        <Route path="/gymmadang/notifications" element={<NotificationPage />} />
        <Route path="/gymmadang/mypage" element={<MyPage />} />

        {/* 루틴 */}
        <Route path='/gymmadang/routine' element={<RoutineHomePage />} />
        <Route path='/gymmadang/routine/free' element={<RoutineFreePage />} />
        <Route path='/gymmadang/routine/add' element={<RoutineAddPage />} />
        <Route path='/gymmadang/routine/myroutine' element={<MyRoutinePage />} />
        <Route path='/gymmadang/routine/workout' element={<WorkoutPage />} />
        <Route path='/gymmadang/routine/guide' element={<GuidePage />} />
        <Route path='/gymmadang/routine/summary' element={<SummaryPage />} />
        <Route path='/gymmadang/routine/diary' element={<DiaryPage />} />
        <Route path='/gymmadang/routine/result' element={<ResultPage />} />

        {/* 벗 */}
        <Route path='/gymmadang/buddy' element={<BuddyRegister />} />
        <Route path='/gymmadang/buddyhome' element={<BuddyHome />} /> 

        {/* 수련장 */}
        <Route path="/gymmadang/challenge/challengeIntro" element={<ChallengeIntro />} />
        <Route path="/gymmadang/challenge/challengeHome" element={<ChallengeHome />} />

        <Route path="/gymmadang/challenge/challengeList" element={<ChallengeList />} />
        <Route path="/gymmadang/challenge/challengeCreate" element={<ChallengeCreate />} />

        <Route path="/gymmadang/challenge/challengeMy" element={<ChallengeMy />} />


        <Route path="/gymmadang/challenge/challengeTest/intro" element={<ChallengeTestIntro />} />
        <Route path="/gymmadang/challenge/challengeTest/step/:stepId" element={<ChallengeTestPage />} />
        <Route path="/gymmadang/challenge/challengeTest/result" element={<ChallengeTestResult />} />
        <Route path="/gymmadang/challenge/challengeTest/recommend" element={<ChallengeRecommendation />} />





        <Route path="*" element={<ErrorPage />} />
      </Routes>


       {/* 탑 네비게이션 조건 */}
      {!shouldHideTop && (
        isChallengeSection
          ? (location.pathname === '/challenge' 
            ? null 
            : <ChallengeBottomNavigation />)
          : isBuddySection
            ? <BuddyBottomNavigation />
            : <BottomNavigation />
      )}

      {/* 바텀 네비게이션은 항상 표시 (단, 테스트 중은 제외) */}
      {!shouldHideBottom && (
        isBuddySection
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