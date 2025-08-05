import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import BottomNavigation from './global/pages/BottomNavigation'; // 공통 바텀바
import TopHeader from './global/pages/TopHeader';
import LoginPage from './auth/pages/LoginPage';
import ErrorPage from './global/pages/ErrorPage';
import NotificationPage from './global/pages/NotificationsPage';

import ChallengeHome from './user/challenge/pages/ChallengeHome';
import ChallengeList from './user/challenge/pages/ChallengeList';


// ChallengeBottomNavigation 임포트는 이제 필요 없으므로 제거 또는 주석 처리
// import ChallengeBottomNavigation from './user/challenge/commons/ChallengeBottomNavigation';
import ChallengeIntro from './user/challenge/pages/ChallengeIntro';
import ChallengeCreate from './user/challenge/create/pages/ChallengeCreate';

import WelcomePage from './global/pages/WelcomePage';
import RegisterPage from './auth/pages/RegisterPage';

import RoutineHomePage from './user/routine/pages/RoutineHomePage';
import BuddyRegister from './user/buddy/pages/BuddyRegister';
// BuddyBottomNavigation 임포트도 이제 필요 없으므로 제거 또는 주석 처리
// import BuddyBottomNavigation from './user/buddy/commons/BuddyBottomNavigation';
import ChallengeTestIntro from './user/challenge/pages/ChallengeTestIntro';
import ChallengeTestPage from './user/challenge/pages/ChallengeTestPage';
import ChallengeTestResult from './user/challenge/pages/ChallengeTestResult';
import ChallengeRecommendation from './user/challenge/pages/ChallengeRecommendation';
import BuddyHome from './user/buddy/pages/BuddyHome';
import ChallengeTopTabs from './user/challenge/commons/ChallengeTopTabs';
import RoutineAddPage from './user/routine/pages/RoutineAddPage';
import RoutineFreePage from './user/routine/pages/RoutineFreePage';
import MyPage from './user/mypage/pages/MyPage';
import MyRoutinePage from './user/routine/pages/MyRoutinePage';
import WorkoutPage from './user/routine/pages/WorkoutPage';
import GuidePage from './user/routine/pages/GuidePage';
import DiaryPage from './user/routine/pages/DiaryPage.Jsx';
import SummaryPage from './user/routine/pages/SummaryPage';
import ResultPage from './user/routine/pages/ResultPage';
import BuddyTopTabs from './user/buddy/commons/BuddyTopTabs';
import { useEffect } from 'react';
import MarketArticlePage from './user/market/pages/MarketArticle';
import MarketBoardPage from './user/market/pages/MarketBoard';
import MarketUserPage from './user/market/pages/MarketUser';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { loginAction } from './redux/authSlice';
import MarketWriteArticlePage from './user/market/pages/MarketWriteArticle';
import MarketMyLikedProductsPage from './user/market/pages/MarketMyLikedProducts';
import MainPage from './global/pages/MainPage';
import MarketTopTabs from './user/market/commons/marketTopTabs';
import BuddyChat from './user/buddy/pages/BuddyChat';
import BuddyNotification from './user/buddy/pages/BuddyNotification';
import ChallengeDetail from './user/challenge/detail/pages/ChallengeDetail';
import RoutineAddDetailPage from './user/routine/pages/RoutineAddDetailPage';
import BuddyChatRoom from './user/buddy/pages/BuddyChatRoom';
import ChallengeMyRecordList from './user/challenge/pages/ChallengeMyRecordList';
import ChallengeMyRecordDetail from './user/challenge/pages/ChallengeMyRecordDetail';
import MyRoutineListPage from './user/routine/pages/MyRoutineListPage';
import StartWorkoutPage from './user/routine/pages/StartWorkoutPage';
import StartFreeWorkoutPage from './user/routine/pages/StartFreeWorkoutPage';
import MyPageRoutineCalendar from './user/mypage/pages/MyPageRoutineCalendar';
import SimpleWebSocketTest from './user/buddy/pages/SimpleWebSocketTest';
import GroupChatRoom from './user/challenge/groupchat/pages/GroupChatRoom';


// 이 부분은 따로 감싼 컴포넌트로 만들어야 useLocation을 쓸 수 있어!
function AppContent() {
  const dispatch = useDispatch();

  // verify token 관련 (새로고침해도 로그인 유지)
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.post(
          "http://localhost:8080/api/user/verify-token",
          {},
          { headers: { Authorization: `Bearer ${token}` } }
        );
        console.log("토큰 검증 응답:", res.data);
        if (res.data.success) {
          dispatch(loginAction({ name: res.data.name, id: res.data.id }));
          console.log("로그인 유지됨:", res.data);
        }
      } catch (err) {
        console.error("토큰 만료 또는 검증 실패:", err);
        localStorage.removeItem("token");
      }
    };

    checkAuth();
  }, []);

  const location = useLocation();

  // TopHeader와 BottomNavigation을 숨길 경로들
  // 'challengeTest' 경로들도 모두 포함되도록 수정했습니다.
  const hideHeaderFooterRoutes = [
    '/gymmadang',
    '/gymmadang/login',
    '/gymmadang/register',
    '/gymmadang/challenge/challengeCreate',
    '/gymmadang/challenge/challengeTest/intro',
    // '/gymmadang/challenge/challengeTest/step/:stepId'와 같은 동적 경로는 startsWith로 처리
    '/gymmadang/challenge/challengeTest/result',
    '/gymmadang/challenge/challengeTest/recommend',
    // 이 부분을 추가하면 됩니다.
    '/gymmadang/buddy/buddyChat'
    // 루틴 추가 상세 페이지에서도 숨길 필요가 있다면 여기에 추가
    
  ];

  // TopHeader 숨길 조건들
  const shouldHideTop = hideHeaderFooterRoutes.includes(location.pathname) || 
                        location.pathname.startsWith('/gymmadang/challenge/challengeTest') ||
                        location.pathname.startsWith('/gymmadang/buddy/buddyChat/');

  // BottomNavigation 숨길 조건들 (TopHeader와 동일하게 적용)
  const shouldHideBottom = hideHeaderFooterRoutes.includes(location.pathname) || 
                           location.pathname.startsWith('/gymmadang/challenge/challengeTest') ||
                           location.pathname.startsWith('/gymmadang/buddy/buddyChat/');

  const isChallengeSection = location.pathname.startsWith('/gymmadang/challenge') && !location.pathname.includes('challengeTest');
  const isBuddySection = location.pathname.startsWith('/gymmadang/buddy');
  const isMarketSection = location.pathname.startsWith('/gymmadang/market');

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

      {/* 버디 탭 메뉴 (상단 카테고리처럼) */}
      {isBuddySection && !shouldHideTop && (
        <div style={{ borderBottom: '1px solid #eee' }}>
          <BuddyTopTabs />
        </div>
      )}

      {/* 장터 탭 메뉴 (상단 카테고리처럼) */}
      {isMarketSection && !shouldHideTop && (
        <div style={{ borderBottom: '1px solid #eee' }}>
          <MarketTopTabs />
        </div>
      )}

      <Routes>
        <Route path='/gymmadang' element={<WelcomePage />} />
        <Route path='/gymmadang/register' element={<RegisterPage />} />
        <Route path='/gymmadang/login' element={<LoginPage />} />
        <Route path="/gymmadang/notifications" element={<NotificationPage />} />
        <Route path="/gymmadang/mainpage" element={<MainPage />} />
        <Route path="/gymmadang/mypage" element={<MyPage />} />
        <Route path="/gymmadang/routineCalendar" element={<MyPageRoutineCalendar />} />

        {/* 루틴 */}
        <Route path='/gymmadang/routine' element={<RoutineHomePage />} />
        <Route path='/gymmadang/routine/free' element={<RoutineFreePage />} />
        <Route path='/gymmadang/routine/add' element={<RoutineAddPage />} />
        <Route path='/gymmadang/routine/addDetail' element={<RoutineAddDetailPage />} />
        {/* <Route path='/gymmadang/routine/myroutine' element={<MyRoutineListPage />} /> */}
        <Route path='/gymmadang/routine/list/:routineId' element={<MyRoutineListPage />} />
        <Route path='/gymmadang/routine/startWorkout/:routineId' element={<StartWorkoutPage />} />
        <Route path='/gymmadang/routine/startFreeWorkout' element={<StartFreeWorkoutPage />} />
        <Route path='/gymmadang/routine/workout' element={<WorkoutPage />} />
        <Route path='/gymmadang/routine/guide/:id' element={<GuidePage />} />
        <Route path='/gymmadang/routine/summary' element={<SummaryPage />} />
        <Route path='/gymmadang/routine/diary' element={<DiaryPage />} />
        <Route path='/gymmadang/routine/result/:workoutId' element={<ResultPage />} />

        {/* 벗 */}
        <Route path='/gymmadang/buddy' element={<BuddyRegister />} />
        <Route path='/gymmadang/buddy/buddyHome' element={<BuddyHome />} />
        <Route path='/gymmadang/buddy/buddyList' element={<BuddyChat />} />
        {/* <Route path='/gymmadang/buddy/buddyChat' element={<BuddyChatRoom />} /> */}
        <Route path='/gymmadang/buddy/buddyChat/:matchingId' element={<BuddyChatRoom />} />
        <Route path='/gymmadang/buddy/buddyMy' element={<BuddyNotification />} />
        <Route path='/test' element={<SimpleWebSocketTest />} />

        {/* 수련장 */}
        <Route path="/gymmadang/challenge/challengeIntro" element={<ChallengeIntro />} />
        <Route path="/gymmadang/challenge/challengeHome" element={<ChallengeHome />} />
        <Route path="/gymmadang/challenge/challengeList" element={<ChallengeList />} />
        <Route path="/gymmadang/challenge/challengeCreate" element={<ChallengeCreate />} />
        <Route path="/gymmadang/challenge/challengeMy" element={<ChallengeMyRecordList />} />
        <Route path="/gymmadang/challenge/challengeMyRecordDetail/:challengeId" element={<ChallengeMyRecordDetail />} />

        <Route path="/gymmadang/challenge/challengeTest/intro" element={<ChallengeTestIntro />} />
        <Route path="/gymmadang/challenge/challengeTest/step/:stepId" element={<ChallengeTestPage />} />
        <Route path="/gymmadang/challenge/challengeTest/result" element={<ChallengeTestResult />} />
        <Route path="/gymmadang/challenge/challengeTest/recommend" element={<ChallengeRecommendation />} />
        <Route path="/gymmadang/challenge/detail/:challengeId" element={<ChallengeDetail />} />

        <Route path="/gymmadang/challenge/groupchat/:challengeId" element={<GroupChatRoom />} />




        {/* **기존에 중복되었던 수련장 관련 경로들은 제거했습니다.** `/gymmadang` 접두사를 사용하는 경로들로 통일하여 관리하는 것이 좋습니다.
           혹시 필요하다면 다시 추가할 수 있습니다.
        */}
        {/*
        <Route path="/challenge" element={<ChallengeIntro />} />
        <Route path="/challengeHome" element={<ChallengeHome />} />
        <Route path="/challengeList" element={<ChallengeList />} />
        <Route path="/challengeMy" element={<ChallengeMy />} />
        */}
        
        {/* 장터 관련 */}
        <Route path="/gymmadang/market" element={<MarketBoardPage />} />
        <Route path="/gymmadang/market/article/:id" element={<MarketArticlePage />} />
        <Route path="/gymmadang/market/user/:id" element={<MarketUserPage />} />
        <Route path="/gymmadang/market/writeArticle" element={<MarketWriteArticlePage />} />
        <Route path="/gymmadang/market/myLikedProducts" element={<MarketMyLikedProductsPage />} />

        <Route path="*" element={<ErrorPage />} />
      </Routes>

      {/* 바텀 네비게이션은 항상 표시 (단, 숨겨야 할 조건 제외) */}
      {/* 이제 BuddyBottomNavigation, ChallengeBottomNavigation 대신 공통 BottomNavigation만 사용합니다. */}
      {!shouldHideBottom && <BottomNavigation />}
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

export default App;