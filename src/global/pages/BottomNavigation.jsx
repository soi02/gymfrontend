// BottomNavigation.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import BasicLoginModal from "./BasicLoginModal";
import apiClient from "../api/apiClient";

function BottomNavigationItem({ link, iconClass, label, matchPrefix, onClick }) {
  const location = useLocation();
  const isActive = matchPrefix
    ? location.pathname.startsWith(matchPrefix)
    : location.pathname === link;

  return (
    <div className="text-center col">
      <button type="button" onClick={onClick} className="text-decoration-none d-block btn btn-link p-0">
        <i className={iconClass} style={{ fontSize: 24, color: isActive ? "#000000" : "#C4C4C4" }} />
        <div style={{ fontSize: "0.75rem", color: isActive ? "#000000" : "#C4C4C4" }}>{label}</div>
      </button>
    </div>
  );
}

export default function BottomNavigation() {
  const navigate = useNavigate();
  const { id: userId, token } = useSelector((state) => state.auth);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState("/");

  // ✅ 단일 소스가 아니면 OR로 합치고, id는 0도 허용
  const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const authed = useMemo(() => (userId != null) || Boolean(token || localToken), [userId, token, localToken]);

  // ✅ 인증이 되면 모달 강제 닫기 (혹시 열려있을 수 있으니)
  useEffect(() => {
    if (authed && showLoginModal) setShowLoginModal(false);
  }, [authed, showLoginModal]);

  const handleProtectedNavigation = (e, path) => {
    e.preventDefault(); // 버튼이라 필수는 아니지만 그냥 둬도 무방
    if (!authed) {
      setRedirectAfterLogin(path);
      setShowLoginModal(true);
      return;
    }
    if (path === "/buddy") {
      handleBuddyTabLogic();
    } else {
      navigate(path);
    }
  };

  const handleBuddyTabLogic = async () => {
    try {
      console.log("버디 탭 클릭 - userId:", userId); // userId 값 확인
      const res = await apiClient.get(`/buddy/is-buddy`, { params: { userId } });
      console.log("서버 응답:", res.data); // 응답 데이터 확인
      const isBuddy = res?.data?.is_buddy;
      console.log("isBuddy 값:", isBuddy); // is_buddy 값 확인
      navigate(isBuddy ? "/buddy/buddyHome" : "/buddy");
    } catch (error) {
      console.error("is_buddy 상태 확인 실패:", error);
      console.log("에러 응답:", error.response?.data); // 에러 응답 데이터 확인
      console.log("에러 상태 코드:", error.response?.status); // HTTP 상태 코드 확인
      // 에러가 발생하더라도 기본적으로 /buddy 페이지로 이동
      navigate("/buddy");
    }
  };

  const handleLoginConfirm = () => {
    setShowLoginModal(false);
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
          onClick={(e) => handleProtectedNavigation(e, "/routine")}
        />
        <BottomNavigationItem
          link="/challenge"
          matchPrefix="/challenge"
          iconClass="ri-award-fill"
          label="수련장"
          onClick={(e) => handleProtectedNavigation(e, "/challenge/challengeIntro")}
        />
        <BottomNavigationItem
          link="/buddy"
          matchPrefix="/buddy"
          iconClass="ri-wechat-fill"
          label="벗"
          onClick={(e) => handleProtectedNavigation(e, "/buddy")}
        />
        <BottomNavigationItem
          link="/market"
          matchPrefix="/market"
          iconClass="ri-store-3-fill"
          label="장터"
          onClick={(e) => handleProtectedNavigation(e, "/market")}
        />
        <BottomNavigationItem
          link="/mypage"
          matchPrefix="/mypage"
          iconClass="ri-user-3-fill"
          label="나의 처소"
          onClick={(e) => handleProtectedNavigation(e, "/mypage")}
        />
      </div>

      {/* ✅ 인증된 상태에선 모달이 절대 안 열리도록 더블가드 */}
      <BasicLoginModal
        open={showLoginModal && !authed}
        onClose={() => setShowLoginModal(false)}
        onConfirm={handleLoginConfirm}
      />
    </>
  );
}
