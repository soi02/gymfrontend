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
                // right: '49%',
                transform: 'translateX(-46.9%)',      // ✅ 중앙 정렬
                width: '100%',                      // ✅ 화면보다 넓게 (라운드 보이도록)
                maxWidth: '500px',                  // ✅ 너무 커지는 것 방지
                borderTopLeftRadius: '1.1rem',
                borderTopRightRadius: '1.1rem',
                overflow: 'hidden',
                backgroundColor: '#ffffff',
                border: '1px solid #e2e2e2ff',     // ✅ 위쪽 선만
                zIndex: 1000,
            }}
        >
            <BottomNavigationItem link="/" iconClass="ri-home-5-fill" label="홈" />
            <BottomNavigationItem link="/community" iconClass="ri-wechat-fill" label="벗" />
            <BottomNavigationItem link="/routine" iconClass="ri-store-3-fill" label="장터" />
            <BottomNavigationItem link="/challenge" iconClass="ri-award-fill" label="수련장" />
            <BottomNavigationItem link="/mypage" iconClass="ri-user-3-fill" label="마이" />
        </div>
    );
}
