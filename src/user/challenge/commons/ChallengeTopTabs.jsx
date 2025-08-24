import { Link, useLocation } from "react-router-dom";

function TabItem({ to, label }) {
    const location = useLocation();

    // ✅ 경로에 따라 isActive를 다르게 처리하는 로직 추가
    let isActive = false;
    
    if (to === "/challenge/challengeList") {
        isActive = location.pathname.startsWith("/challenge/challengeList") 
            || location.pathname.startsWith("/challenge/category") 
            || location.pathname.startsWith("/challenge/detail");
    } else if (to === "/challenge/groupchatList") { // ✅ 그룹채팅 탭 활성화 로직 추가
        isActive = location.pathname.startsWith("/challenge/groupchat");
    } else {
        isActive = location.pathname.startsWith(to);
    }

    return (
        <Link
            to={to}
            style={{
                display: 'inline-block',
                fontSize: '14px',
                fontWeight: isActive ? '700' : '500',
                color: isActive ? '#000' : '#aaa',
                borderBottom: isActive ? '2px solid #000' : 'none',
                padding: '10px 12px 8px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                lineHeight: '1',
                verticalAlign: 'bottom',
            }}
        >
            {label}
        </Link>
    );
}

export default function ChallengeTopTabs() {
  return (
<div style={{
      borderBottom: '0px solid transparent',
  marginBottom: '0',
  paddingBottom: '0',
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'flex-end',
  padding: '0 12px 0',
  margin: 0,
  overflowX: 'auto',
  border: 'none',
  boxShadow: 'none',
  outline: 'none',
  position: 'relative',
  zIndex: 1,
  backgroundColor: '#fff',
}}>

      <TabItem to="/challenge/challengeHome" label="수련장" />
      <TabItem to="/challenge/challengeList" label="수련 목록" />
      <TabItem to="/challenge/challengeMy" label="나의 수련기록" />
      <TabItem to="/challenge/groupchatList" label="수련 채팅" />
    </div>
  );
}

