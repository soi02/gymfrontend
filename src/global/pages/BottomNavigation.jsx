// BottomNavigation.jsx
import { Link, useLocation } from "react-router-dom";

function BottomNavigationItem({ link, iconClass, label }) {
    const location = useLocation();
    const isActive = location.pathname === link;

    return (
        <div className="text-center col">
            <Link to={link} className="text-decoration-none d-block">
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
            </Link>
        </div>
    );
}

export default function BottomNavigation() {
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
            <BottomNavigationItem link="/routine" iconClass="ri-file-paper-2-fill" label="득근록" />
            <BottomNavigationItem link="/gymmadang/challenge/challengeHome" iconClass="ri-award-fill" label="수련장" />
            <BottomNavigationItem link="/buddy" iconClass="ri-wechat-fill" label="벗" />
            <BottomNavigationItem link="/market" iconClass="ri-store-3-fill" label="장터" />
            <BottomNavigationItem link="/mypage" iconClass="ri-user-3-fill" label="나의 처소" />
        </div>
    );
}
