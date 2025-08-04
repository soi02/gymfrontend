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

    const handleChallengeTabClick = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem('token');
        console.log("handleChallengeTabClick 함수 실행 시점의 토큰:", token);

        // 토큰과 userId 유효성 확인
        if (!userId || !token) {
            alert("로그인이 필요합니다.");
            navigate('/gymmadang/login');
            return;
        }

        try {
            const response = await axios.get(`/api/challenge/tendency-test/status`, {
                params: { userId: userId },
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            const hasCompleted = JSON.parse(response.data);

            if (hasCompleted) {
                navigate('/gymmadang/challenge/challengeHome');
            } else {
                navigate('/gymmadang/challenge/challengeIntro');
            }
        } catch (error) {
            console.error("성향 테스트 상태 확인 실패:", error);
            if (error.response && error.response.status === 401) {
                alert("세션이 만료되었습니다. 다시 로그인해주세요.");
                navigate('/gymmadang/login');
            } else {
                navigate('/gymmadang/challenge/challengeIntro');
            }
        }
    };



  return (
    <div
      className="row fixed-bottom py-2 shadow-sm"
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-46.9%)',
        width: '100%',
        maxWidth: '500px',
        borderTopLeftRadius: '1.1rem',
        borderTopRightRadius: '1.1rem',
        overflow: 'hidden',
        backgroundColor: '#ffffff',
        border: '1px solid #e2e2e2ff',
        zIndex: 1000,
      }}
    >
      <BottomNavigationItem
        link="/gymmadang/routine"
        matchPrefix="/gymmadang/routine"
        iconClass="ri-file-paper-2-fill"
        label="득근록"
        onClick={() => navigate('/gymmadang/routine')}
      />
      <BottomNavigationItem
        link="/gymmadang/challenge"
        matchPrefix="/gymmadang/challenge"
        iconClass="ri-award-fill"
        label="수련장"
        onClick={handleChallengeTabClick}
      />
      <BottomNavigationItem
        link="/gymmadang/buddy"
        matchPrefix="/gymmadang/buddy"
        iconClass="ri-wechat-fill"
        label="벗"
        onClick={() => navigate('/gymmadang/buddy')}
      />
      <BottomNavigationItem
        link="/gymmadang/market"
        matchPrefix="/gymmadang/market"
        iconClass="ri-store-3-fill"
        label="장터"
        onClick={() => navigate('/gymmadang/market')}
      />
      <BottomNavigationItem
        link="/gymmadang/mypage"
        matchPrefix="/gymmadang/mypage"
        iconClass="ri-user-3-fill"
        label="나의 처소"
        onClick={() => navigate('/gymmadang/mypage')}
      />
    </div>
  );
}
