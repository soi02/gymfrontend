// import React from 'react';
import { Link, useLocation } from 'react-router-dom'; // Link와 useLocation 임포트
// import 'bootstrap-icons/font/bootstrap-icons.css'; // Bootstrap Icons CSS 임포트
// import './BottomNavigation.css'; // 커스텀 스타일 시트

// BottomNavigationItem 컴포넌트: 각 내비게이션 항목을 렌더링
// useLocation을 사용하여 현재 경로를 확인하고, Link를 사용합니다.
function BottomNavigationItem({ to, children, iconClass, activeIconClass }) {
    const location = useLocation();
    const isActive = location.pathname === to; // 현재 경로와 to prop이 일치하는지 확인

    // 활성화 상태에 따라 다른 아이콘 클래스 적용 (선택 사항: 채워진 아이콘)
    const currentIconClass = isActive && activeIconClass ? activeIconClass : iconClass;

    return (
        <div className="col bottom-nav-item-col">
            <Link
                to={to}
                className={`bottom-nav-link ${isActive ? 'active' : ''}`} // isActive에 따라 active 클래스 추가
            >
                <i className={`${currentIconClass} bottom-nav-icon`}></i> {/* 아이콘 클래스 적용 */}
                <span className="bottom-nav-text">{children}</span> {/* 텍스트는 children으로 */}
            </Link>
        </div>
    );
}

// BottomNavigation 컴포넌트: 전체 바텀 내비게이션을 구성
export default function BottomNavigation() {
    return (
        <div className="row fixed-bottom border-top py-2 bg-white text-dark bottom-navigation-container">
            {/* 홈 메뉴 */}
            <BottomNavigationItem
                to="/"
                iconClass="bi-house-door"
                activeIconClass="bi-house-door-fill" // 활성화 시 채워진 아이콘
            >
                홈
            </BottomNavigationItem>

            {/* 챌린지 메뉴 */}
            <BottomNavigationItem
                to="/challenge"
                iconClass="bi-award"
                activeIconClass="bi-award-fill"
            >
                챌린지
            </BottomNavigationItem>

            {/* 채팅 메뉴 */}
            <BottomNavigationItem
                to="/chat"
                iconClass="bi-chat-dots"
                activeIconClass="bi-chat-dots-fill"
            >
                채팅
            </BottomNavigationItem>

            {/* 마켓 메뉴 */}
            <BottomNavigationItem
                to="/market"
                iconClass="bi-shop"
                activeIconClass="bi-shop-fill"
            >
                마켓
            </BottomNavigationItem>

            {/* 마이페이지 메뉴 */}
            <BottomNavigationItem
                to="/mypage"
                iconClass="bi-person"
                activeIconClass="bi-person-fill"
            >
                마이페이지
            </BottomNavigationItem>
        </div>
    );
}