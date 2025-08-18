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
import AutoJoinRoom from './user/buddy/pages/AutoJoinRoom';
import ChallengeStartPaymentSuccess from './user/challenge/pages/ChallengeStartPaymentSuccess';
import ChallengeCategoryPage from './user/challenge/pages/ChallengeCategoryPage';
import MarketTopTabs from './user/market/commons/MarketTopTabs';
import BuddyStart from './user/buddy/pages/BuddyStart';
import MarketUpdateArticlePage from './user/market/pages/marketUpdateArticle';
import ChallengeAllList from './user/challenge/pages/ChallengeAllList';
import ChallengeMyListPage from './user/challenge/pages/ChallengeMyListPage';

import { useState } from 'react';
import QRCodeSection from './global/pages/QRCodeSection';



// 이 부분은 따로 감싼 컴포넌트로 만들어야 useLocation을 쓸 수 있어!
function AppContent() {
  const dispatch = useDispatch();
  // 윈도우 크기 변경 시 isMobile 상태 업데이트
  // PC 화면에서 사이드 컨테이너를 보여줄지 결정하는 변수
  const [isPc, setIsPc] = useState(window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsPc(window.innerWidth >= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
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
    '/',
    '/login',
    '/register',
    '/challenge/challengeCreate',
    '/challenge/challengeTest/intro',
    // '/challenge/challengeTest/step/:stepId'와 같은 동적 경로는 startsWith로 처리
    '/challenge/challengeTest/result',
    '/challenge/challengeTest/recommend',
    // 이 부분을 추가하면 됩니다.
    '/buddy/buddyChat',
    '/buddy/register',
    // 루틴 추가 상세 페이지에서도 숨길 필요가 있다면 여기에 추가

  ];

  // TopHeader 숨길 조건들
  const shouldHideTop = hideHeaderFooterRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/challenge/challengeTest') ||
    location.pathname.startsWith('/buddy/buddyChat/') ||
    location.pathname.startsWith('/buddy/videoCall') ||
    location.pathname.startsWith('/challenge/detail') ||
    location.pathname.startsWith('/challenge/payment/success');

  // BottomNavigation 숨길 조건들 (TopHeader와 동일하게 적용)
  const shouldHideBottom = hideHeaderFooterRoutes.includes(location.pathname) ||
    location.pathname.startsWith('/challenge/challengeTest') ||
    location.pathname.startsWith('/buddy/buddyChat/') ||
    location.pathname.startsWith('/buddy/videoCall');

  const isChallengeSection = location.pathname.startsWith('/challenge') && !location.pathname.includes('challengeTest');
  const isBuddySection = location.pathname.startsWith('/buddy');
  const isMarketSection = location.pathname.startsWith('/market');

  const isChallengeIntro = location.pathname === '/challenge/challengeIntro'; // 강제 조건
  const isBuddyIntro = location.pathname === '/buddy'; // 강제 조건

  return (

    <div className="pc-layout-wrapper">
      {isPc && (
        <div className="side-container">
          <h2>짐마당</h2>
          <p>함께 운동할 벗을 찾아보세요!</p>
          <p>모바일 앱 QR 코드</p>
          {/* 여기에 QR 코드 이미지를 넣으세요. */}
          <img src="https://via.placeholder.com/150" alt="QR Code" style={{ width: '150px' }} />
        </div>
      )}
      <div className='app-shell'>
        {/* 탑헤더 조건 */}
        {!shouldHideTop && <TopHeader />}

        {/* ✅ 메인 컨텐츠 flex로 확장 */}
        <main className="app-content">


          {/* 챌린지 탭 메뉴 (상단 카테고리처럼) */}
          {isChallengeSection && !shouldHideTop && !isChallengeIntro && (
            <div style={{ borderBottom: '1px solid #eee' }}>
              <ChallengeTopTabs />
            </div>
          )}

          {/* 버디 탭 메뉴 (상단 카테고리처럼) */}
          {/* const isBuddyIntro = location.pathname === '/buddy'; // 강제 조건 */}
          {isBuddySection && !shouldHideTop && !isBuddyIntro && (
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
            <Route path='/' element={<WelcomePage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path="/notifications" element={<NotificationPage />} />
            <Route path="/home" element={<MainPage />} />
            <Route path="/mypage" element={<MyPage />} />
            <Route path="/routineCalendar" element={<MyPageRoutineCalendar />} />

            {/* 루틴 */}
            <Route path='/routine' element={<RoutineHomePage />} />
            <Route path='/routine/free' element={<RoutineFreePage />} />
            <Route path='/routine/add' element={<RoutineAddPage />} />
            <Route path='/routine/addDetail' element={<RoutineAddDetailPage />} />
            <Route path='/routine/myroutines' element={<MyRoutinePage />} />
            <Route path='/routine/list/:routineId' element={<MyRoutineListPage />} />
            <Route path='/routine/startWorkout/:routineId' element={<StartWorkoutPage />} />
            <Route path='/routine/startFreeWorkout' element={<StartFreeWorkoutPage />} />
            <Route path='/routine/workout' element={<WorkoutPage />} />
            <Route path='/routine/guide/:id' element={<GuidePage />} />
            <Route path='/routine/diary' element={<DiaryPage />} />
            <Route path='/routine/result/:workoutId' element={<ResultPage />} />

            {/* 벗 */}
            <Route path="/buddy" element={<BuddyStart />} />
            <Route path='/buddy/register' element={<BuddyRegister />} />
            <Route path='/buddy/buddyHome' element={<BuddyHome />} />
            <Route path='/buddy/buddyList' element={<BuddyChat />} />
            {/* <Route path='/buddy/buddyChat' element={<BuddyChatRoom />} /> */}
            <Route path='/buddy/buddyChat/:matchingId' element={<BuddyChatRoom />} />
            <Route path="/buddy/videoCall/:roomNumber" element={<AutoJoinRoom />} />
            <Route path='/buddy/buddyMy' element={<BuddyNotification />} />
            <Route path='/test' element={<SimpleWebSocketTest />} />
            {/* <Route path="/webrtc" element={<AutoJoinRoom />} /> */}

            {/* 수련장 */}
            <Route path="/challenge/challengeIntro" element={<ChallengeIntro />} />
            <Route path="/challenge/challengeHome" element={<ChallengeHome />} />
            <Route path="/challenge/challengeCreate" element={<ChallengeCreate />} />
            <Route path="/challenge/challengeMy" element={<ChallengeMyRecordList />} />
            <Route path="/challenge/challengeList" element={<ChallengeList />} />
            <Route path="/challenge/challengeAllList" element={<ChallengeAllList />} />
            <Route path="/challenge/category/:categoryId" element={<ChallengeCategoryPage />} />
            <Route path="/challenge/challengeMyRecordDetail/:challengeId" element={<ChallengeMyRecordDetail />} />
            <Route path="/challenge/challengeMyList" element={<ChallengeMyListPage />} />

            <Route path="/challenge/challengeTest/intro" element={<ChallengeTestIntro />} />
            <Route path="/challenge/challengeTest/step/:stepId" element={<ChallengeTestPage />} />
            <Route path="/challenge/challengeTest/result" element={<ChallengeTestResult />} />
            <Route path="/challenge/challengeTest/recommend" element={<ChallengeRecommendation />} />
            <Route path="/challenge/detail/:challengeId" element={<ChallengeDetail />} />
            <Route path="/challenge/payment/success" element={<ChallengeStartPaymentSuccess />} />

            <Route path="/challenge/groupchat/:challengeId" element={<GroupChatRoom />} />





            {/* 장터 관련 */}
            <Route path="/market" element={<MarketBoardPage />} />
            <Route path="/market/article/:id" element={<MarketArticlePage />} />
            <Route path="/market/user/:id" element={<MarketUserPage />} />
            <Route path="/market/writeArticle" element={<MarketWriteArticlePage />} />
            <Route path="/market/updateArticle/:id" element={<MarketUpdateArticlePage />} />
            <Route path="/market/myLikedProducts" element={<MarketMyLikedProductsPage />} />

            <Route path="*" element={<ErrorPage />} />
          </Routes>
        </main>

        {/* 바텀 네비게이션은 항상 표시 (단, 숨겨야 할 조건 제외) */}
        {/* 이제 BuddyBottomNavigation, ChallengeBottomNavigation 대신 공통 BottomNavigation만 사용합니다. */}
        {!shouldHideBottom && <BottomNavigation />}
      </div>
      {/* PC 화면일 때만 오른쪽 컨테이너를 렌더링합니다. */}
      {isPc && (
        <div className="side-container">
          {/* <h2>건강한 하루, 짐마당에서 시작하세요.</h2>
          <p>다양한 챌린지에 참여하고<br/>운동 기록을 공유해 보세요!</p> */}
          <QRCodeSection />
        </div>
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

export default App;