// BottomNavigation.jsx
import { Link, useLocation } from "react-router-dom";

function ChallengeBottomNavigationItem({ link, iconClass, label }) {
    const location = useLocation();
    const isActive = location.pathname === link;

    return (
        <div className="text-center col">
            <Link to={link} className="text-decoration-none d-block">
                <i
                    className={iconClass}
                    style={{
                        fontSize: '24px',
                        color: isActive ? "#d8ff4bff" : "#C4C4C4"
                    }}
                ></i>
                <div
                    style={{
                        fontSize: '0.75rem',
                        color: isActive ? "#d8ff4bff" : "#C4C4C4"
                    }}
                >
                    {label}
                </div>
            </Link>
        </div>
    );
}

export default function ChallengeBottomNavigation() {
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
                backgroundColor: '#1f1f1fff',
                border: '1px solid #e2e2e2ff', 
                zIndex: 1000,
            }}
        >
            <ChallengeBottomNavigationItem link="/challengeHome" iconClass="ri-home-5-fill" label="수련장 홈" />
            <ChallengeBottomNavigationItem link="/challengeList" iconClass="ri-wechat-fill" label="챌린지" />
            <ChallengeBottomNavigationItem link="/challengeMy" iconClass="ri-store-3-fill" label="나의 수련기록" />
        </div>
    );
}
