import { Link, useLocation } from "react-router-dom";

function BottomNavigationItem({ link, icon, activeIcon, label }) {
    const location = useLocation();
    const isActive = location.pathname === link;

    return (
        <div className="text-center col">
            <Link
                to={link}
                className="text-decoration-none d-block"
            >
                <i className={`bi ${isActive ? activeIcon : icon} fs-4`} style={{ color: isActive ? "#000000" : "#C4C4C4" }}></i>
                <div style={{
                    fontSize: '0.75rem',
                    color: isActive ? "#000000" : "#C4C4C4"
                }}>{label}</div>
            </Link>
        </div>
    );
}

export default function BottomNavigation() {
    return (
        <div
            className="row fixed-bottom py-2 shadow-sm px-2"
            style={{
                borderTopLeftRadius: '1rem',
                borderTopRightRadius: '1rem',
                maxWidth: '375px',
                margin: '0 auto',
                overflow: 'hidden',
                // backgroundColor: '#555555',
                border: '0.5px solid #ff0000ff',
            }}
        >
            <BottomNavigationItem link="/" icon="bi-house" activeIcon="bi-house-fill" label="홈" />
            <BottomNavigationItem link="/routine" icon="bi-person-arms-up" activeIcon="bi-person-arms-up" label="루틴" />
            <BottomNavigationItem link="/community" icon="bi-people" activeIcon="bi-people-fill" label="벗" />
            <BottomNavigationItem link="/challenge" icon="bi-award" activeIcon="bi-award-fill" label="챌린지" />
            <BottomNavigationItem link="/mypage" icon="bi-person" activeIcon="bi-person-fill" label="마이페이지" />
        </div>
    );
}
