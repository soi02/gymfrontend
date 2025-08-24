import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import "../styles/MainPage.css";
import mainImg from "../../assets/img/mainphoto_new.png";
import BasicLoginModal from "../../global/pages/BasicLoginModal";

export default function MainPage() {
  const containerRef = useRef(null);
  const [showGuide, setShowGuide] = useState(() => !localStorage.getItem("mainGuideSeen"));
  const [rect, setRect] = useState(null);

  // ✅ 로그인 모달 상태 + 리다이렉트 목적지(현재 페이지로 고정)
  const [showLoginModal, setShowLoginModal] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { id: userId, token } = useSelector((state) => state.auth);
  const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  // ✅ id=0도 허용, 토큰은 Redux OR localStorage 중 하나만 있어도 OK
  const authed = useMemo(
    () => (userId != null) || Boolean(token || localToken),
    [userId, token, localToken]
  );

  // 인증되면 혹시 켜져있을 모달 닫기
  useEffect(() => {
    if (authed && showLoginModal) setShowLoginModal(false);
  }, [authed, showLoginModal]);

  // 기존 클릭 영역들
  const targets = useMemo(
    () => [".link-area.routine", ".link-area.challenge", ".link-area.market", ".link-area.buddy"],
    []
  );

  useEffect(() => {
    if (!showGuide) return;

    const pick = () => {
      const container = containerRef.current;
      if (!container) return;

      const elements = targets
        .map((sel) => container.querySelector(sel))
        .filter(Boolean);

      if (elements.length === 0) return;

      const el = elements[Math.floor(Math.random() * elements.length)];
      const r = el.getBoundingClientRect(); // viewport 기준
      setRect({ x: r.left, y: r.top, w: r.width, h: r.height });
    };

    const update = () => pick();

    pick();

    const ro = new ResizeObserver(update);
    ro.observe(document.body);

    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    window.addEventListener("scroll", update, { passive: true });

    const vv = window.visualViewport;
    if (vv) {
      vv.addEventListener("resize", update);
      vv.addEventListener("scroll", update, { passive: true });
    }

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
      window.removeEventListener("scroll", update);
      if (vv) {
        vv.removeEventListener("resize", update);
        vv.removeEventListener("scroll", update);
      }
    };
  }, [showGuide, targets]);

  const close = () => {
    localStorage.setItem("mainGuideSeen", "1");
    setShowGuide(false);
  };

  // ✅ 보호된 네비: 비로그인 시 모달, 로그인 시 정상 이동
  const handleProtectedClick = (e, to) => {
    if (!authed) {
      e.preventDefault();
      setShowLoginModal(true);
      return;
    }
    // 로그인 상태면 Link 기본 동작으로 이동 (prevent 안 함)
  };

  const goLoginFromModal = () => {
    // 로그인 완료 후 메인으로 돌아오게
    const backTo = location.pathname || "/";
    setShowLoginModal(false);
    navigate("/login", { state: { from: backTo } });
  };

  return (
    <div className="main-container" ref={containerRef}>
      <img src={mainImg} alt="메인맵" className="main-image" />

      {/* 클릭 영역들 (비로그인 시 클릭 가로채기) */}
      <Link
        to="/routine"
        className="link-area routine"
        aria-label="운동기록으로 이동"
        onClick={(e) => handleProtectedClick(e, "/routine")}
      />
      <Link
        to="/challenge/challengeHome"
        className="link-area challenge"
        aria-label="수련장으로 이동"
        onClick={(e) => handleProtectedClick(e, "/challenge/challengeHome")}
      />
      <Link
        to="/market"
        className="link-area market"
        aria-label="장터로 이동"
        onClick={(e) => handleProtectedClick(e, "/market")}
      />
      <Link
        to="/buddy/buddyHome"
        className="link-area buddy"
        aria-label="벗 찾기로 이동"
        onClick={(e) => handleProtectedClick(e, "/buddy/buddyHome")}
      />

      {/* 랜덤 가이드 오버레이 */}
      {showGuide && rect && (
        <div className="guide-overlay" role="dialog" aria-live="polite">
          <div className="shade top" onClick={close}
               style={{ top: 0, left: 0, width: "100%", height: rect.y }} />
          <div className="shade bottom" onClick={close}
               style={{ top: rect.y + rect.h, left: 0, width: "100%", bottom: 0, position: "absolute" }} />
          <div className="shade left" onClick={close}
               style={{ top: rect.y, left: 0, width: rect.x, height: rect.h }} />
          <div className="shade right" onClick={close}
               style={{ top: rect.y, left: rect.x + rect.w, right: 0, height: rect.h, position: "absolute" }} />

          <div className="guide-spot" style={{ top: rect.y, left: rect.x, width: rect.w, height: rect.h }} />
          <div className="guide-ring" style={{ top: rect.y, left: rect.x, width: rect.w, height: rect.h }} />

          <div className="guide-bubble" onClick={close}
               style={{ top: "40%", left: "50%", transform: "translateX(-50%)" }}>
            <p>마당의 곳곳을 짚으면 <br />원하는 장소로 <br />이동할 수 있소.</p>
          </div>
        </div>
      )}

      {/* ✅ 인증된 상태에선 모달이 절대 안 열리도록 더블가드 */}
      <BasicLoginModal
        open={showLoginModal && !authed}
        onClose={() => setShowLoginModal(false)}
        onConfirm={goLoginFromModal}
        // title, message 커스텀도 가능
      />
    </div>
  );
}
