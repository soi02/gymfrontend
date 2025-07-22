import { Link, useLocation } from "react-router-dom";
// import './BottomNavigation.css'; // 커스텀 스타일 있을 경우

function BottomNavigationItem({ link, icon, label }) {
    const location = useLocation();
    const isActive = location.pathname === link;

    return (
        <div className="text-center col">
            <Link to={link} className={`text-decoration-none d-block ${isActive ? 'text-primary' : 'text-secondary'}`}>
                <i className={`bi ${icon} fs-4`}></i>
                <div style={{ fontSize: '0.75rem' }}>{label}</div>
            </Link>
        </div>
    );
}

export default function BottomNavigation() {
    return (
        <div className="row fixed-bottom border-top py-2 bg-white shadow-sm" style={{ maxWidth: "375px", margin: "0 auto" }}>
            <BottomNavigationItem link="/" icon="bi-house" label="홈" />
            <BottomNavigationItem link="/todo" icon="bi-check2-square" label="투두" />
            <BottomNavigationItem link="/routine" icon="bi-person-arms-up" label="루틴" />
            <BottomNavigationItem link="/community" icon="bi-people" label="어울림" />
            <BottomNavigationItem link="/challenge" icon="bi-award" label="챌린지" />
        </div>
    );
}
