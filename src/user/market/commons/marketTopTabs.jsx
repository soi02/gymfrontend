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

export default function MarketTopTabs() {
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

      <TabItem to="/market" label="장터 홈" />
      <TabItem to="/market/myLikedProducts" label="탐나는 물품" />
      <TabItem to="/market/user/1004" label="나의 장터 정보함" />
    </div>
  );
}
