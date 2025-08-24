// src/global/pages/BottomNavigation.jsx
import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BasicLoginModal from "./BasicLoginModal"; 

function BottomNavigationItem({ link, iconClass, label, matchPrefix, onClick }) {
  const location = useLocation();
  const isActive = matchPrefix
    ? location.pathname.startsWith(matchPrefix)
    : location.pathname === link;

  return (
    <div className="text-center col">
      <button
        type="button"
        onClick={onClick}
        className="text-decoration-none d-block btn btn-link p-0"
      >
        <i
          className={iconClass}
          style={{ fontSize: "24px", color: isActive ? "#000000" : "#C4C4C4" }}
        />
        <div style={{ fontSize: "0.75rem", color: isActive ? "#000000" : "#C4C4C4" }}>
          {label}
        </div>
      </button>
    </div>
  );
}


export default function BottomNavigation() {
  const navigate = useNavigate();
  // Redux에서 userId와 token을 모두 가져옵니다.
  const { id: userId, token } = useSelector((state) => state.auth);

  // 로그인 모달 상태
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState("/");

  // 공통 인증 체크
  const requireAuth = (nextPath) => {
    // Redux 상태의 userId와 token만 사용
    const authed = !!userId && !!token;
    if (!authed) {
      setRedirectAfterLogin(nextPath);
      setShowLoginModal(true);
      return false; 
    }
    return true;
  };

  const handleRoutineTabClick = (e) => {
    e.preventDefault();
    if (!requireAuth("/routine")) {
      return; 
    }
    navigate("/routine");
  };

  const handleChallengeTabClick = (e) => {
    e.preventDefault();
    if (!requireAuth("/challenge/challengeIntro")) {
      return; 
    }
    navigate("/challenge/challengeIntro");
  };

  const handleBuddyTabClick = async (e) => {
    e.preventDefault();
    // Redux 상태에 토큰이 없으면 여기서 바로 종료하고 모달 띄움
    if (!requireAuth("/buddy")) {
      return;
    }

    try {
      // apiClient를 사용하여 요청 보냄 (자동으로 Redux 토큰 사용)
      const res = await apiClient.get(`/buddy/is-buddy`, {
        params: { userId },
      });
      const isBuddy = res?.data?.is_buddy;
      navigate(isBuddy ? "/buddy/buddyHome" : "/buddy");
    } catch (error) {
      console.error("is_buddy 상태 확인 실패:", error);
      // catch 블록은 더 이상 모달을 띄우지 않고,
      // 401은 이미 apiClient.js에서 처리하므로
      // 다른 에러일 경우에만 기본 경로로 이동
      if (error.response?.status !== 401) {
          navigate("/buddy");
      }
    }
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
    if (!userId) { try { localStorage.removeItem("token"); } catch {} }
    navigate("/login", { state: { from: redirectAfterLogin } });
  };

  return (
    <>
      <div
        className="row py-2 shadow-sm bottom-nav-debug"
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          margin: "0 auto",
          maxWidth: "425px",
          borderTopLeftRadius: "1.1rem",
          borderTopRightRadius: "1.1rem",
          overflow: "hidden",
          backgroundColor: "#ffffff",
          border: "1px solid #e2e2e2ff",
          zIndex: 1000,
        }}
      >
        <BottomNavigationItem
          link="/routine"
          matchPrefix="/routine"
          iconClass="ri-file-paper-2-fill"
          label="운동기록"
          onClick={handleRoutineTabClick}
        />
        <BottomNavigationItem
          link="/challenge"
          matchPrefix="/challenge"
          iconClass="ri-award-fill"
          label="수련장"
          onClick={handleChallengeTabClick}
        />
        <BottomNavigationItem
          link="/buddy"
          matchPrefix="/buddy"
          iconClass="ri-wechat-fill"
          label="벗"
          onClick={handleBuddyTabClick}
        />
        <BottomNavigationItem
          link="/market"
          matchPrefix="/market"
          iconClass="ri-store-3-fill"
          label="장터"
          onClick={() => navigate("/market")}
        />
        <BottomNavigationItem
          link="/mypage"
          matchPrefix="/mypage"
          iconClass="ri-user-3-fill"
          label="나의 처소"
          onClick={() => navigate("/mypage")}
        />
      </div>

      <BasicLoginModal
        open={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onConfirm={handleLoginConfirm}
      />
    </>
  );
}
