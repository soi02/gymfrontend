// BottomNavigation.jsx
import axios from "axios";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

function BottomNavigationItem({ link, iconClass, label, matchPrefix, onClick }) {
  const location = useLocation();
  const isActive = matchPrefix
    ? location.pathname.startsWith(matchPrefix)
    : location.pathname === link;

  return (
    <div className="text-center col">
      {/* onClick 핸들러를 추가하여 클릭 이벤트 처리 */}
      <a href="#" onClick={onClick} className="text-decoration-none d-block">
        <i
          className={iconClass}
          style={{
            fontSize: '24px',
            color: isActive ? "#000000" : "#C4C4C4"
          }}
        ></i>
        <div
          style={{
            fontSize: '0.75rem',
            color: isActive ? "#000000" : "#C4C4C4"
          }}
        >
          {label}
        </div>
      </a>
    </div>
  );
}

export default function BottomNavigation() {
    const navigate = useNavigate();
    const userId = useSelector(state => state.auth.id);
    // Redux에서 토큰을 가져오는 대신, localStorage에서 직접 가져옵니다.
    // Redux 상태가 업데이트되기 전에 함수가 실행될 수 있기 때문입니다.
    // const token = useSelector(state => state.auth.token);

    const handleRoutineTabClick = async (e) => {
      e.preventDefault();

      const token = localStorage.getItem('token');

      if (!userId || !token) {
        alert("로그인이 필요합니다.")
        navigate('/login');
        return;
      }
  
      navigate('/routine');

    };



    const handleChallengeTabClick = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        console.log("handleChallengeTabClick 함수 실행 시점의 토큰:", token);


        // 로그인 상태 확인
        if (!userId || !token) {
            alert("로그인이 필요합니다.");
            navigate('/login');
            return;
        }

        // 항상 challengeIntro 페이지로 이동하도록 수정
        navigate('/challenge/challengeIntro');
    };

    // '벗' 탭을 위한 새로운 핸들러 함수
    const handleBuddyTabClick = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token');
  
      // 로그인 상태 확인
      if (!userId || !token) {
          alert("로그인이 필요합니다.");
          navigate('/login');
          return;
      }
  
      try {
          // 백엔드에서 만든 API 엔드포인트 호출
          const response = await axios.get(`/api/buddy/is-buddy`, {
              params: { userId: userId },
              headers: {
                  'Authorization': `Bearer ${token}`
              }
          });
  
          // 응답 데이터에서 is_buddy 상태를 추출
          const isBuddy = response.data.is_buddy;
          
          if (isBuddy) {
              // is_buddy가 true일 경우 BuddyHome 페이지로 이동
              navigate('/buddy/buddyHome');
          } else {
              // is_buddy가 false일 경우 버디 등록 페이지로 이동
              navigate('/buddy');
          }
  
      } catch (error) {
          console.error("is_buddy 상태 확인 실패:", error);
          if (error.response && error.response.status === 401) {
              alert("세션이 만료되었습니다. 다시 로그인해주세요.");
              navigate('/login');
          } else {
              // 기타 오류 발생 시 기본 페이지로 이동
              navigate('/buddy');
          }
      }
    };


  return (
    <div
      className="row py-2 shadow-sm bottom-nav-debug"
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0, // 화면 하단에 고정
        margin: '0 auto',
        maxWidth: '425px',
        borderTopLeftRadius: '1.1rem',
        borderTopRightRadius: '1.1rem',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e2e2ff',
        zIndex: 1000,
      }}
    >
      <BottomNavigationItem
        link="/routine"
        matchPrefix="/routine"
        iconClass="ri-file-paper-2-fill"
        label="운동기록"
        onClick={handleRoutineTabClick}
      />
      <BottomNavigationItem
        link="/challenge"
        matchPrefix="/challenge"
        iconClass="ri-award-fill"
        label="수련장"
        onClick={handleChallengeTabClick}
      />
      <BottomNavigationItem
        link="/buddy"
        matchPrefix="/buddy"
        iconClass="ri-wechat-fill"
        label="벗"
        onClick={handleBuddyTabClick} // 새로 만든 핸들러 함수로 변경
      />
      <BottomNavigationItem
        link="/market"
        matchPrefix="/market"
        iconClass="ri-store-3-fill"
        label="장터"
        onClick={() => navigate('/market')}
      />
      <BottomNavigationItem
        link="/mypage"
        matchPrefix="/mypage"
        iconClass="ri-user-3-fill"
        label="나의 처소"
        onClick={() => navigate('/mypage')}
      />
    </div>
  );
}