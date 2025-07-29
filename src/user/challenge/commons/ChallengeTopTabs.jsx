import { Link, useLocation } from "react-router-dom";

function TabItem({ to, label }) {
  const location = useLocation();
  const isActive = location.pathname === to;

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

      <TabItem to="/gymmadang/challenge/challengeHome" label="수련장 홈" />
      <TabItem to="/gymmadang/challenge/challengeList" label="수련 목록" />
      <TabItem to="/gymmadang/challenge/challengeMy" label="나의 수련기록" />
    </div>
  );
}

