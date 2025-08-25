import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import "../styles/MainPage.css";
import mainImg from "../../assets/img/mainphoto_new.png";
import BasicLoginModal from "../../global/pages/BasicLoginModal";

export default function MainPage() {
  const containerRef = useRef(null);
  const [showGuide, setShowGuide] = useState(true);
  const [rect, setRect] = useState(null);
const [activeTarget, setActiveTarget] = useState(null);

  const [showLoginModal, setShowLoginModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { id: userId, token } = useSelector((state) => state.auth);
  const localToken = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const authed = useMemo(
    () => (userId != null) || Boolean(token || localToken),
    [userId, token, localToken]
  );

  useEffect(() => {
    if (authed && showLoginModal) setShowLoginModal(false);
  }, [authed, showLoginModal]);

  const targets = useMemo(
    () => [".link-area.routine", ".link-area.challenge", ".link-area.market", ".link-area.buddy"],
    []
  );

const pick = useCallback(() => {
  const container = containerRef.current;
  if (!container) return;

  const elements = targets.map(sel => container.querySelector(sel)).filter(Boolean);
  if (elements.length === 0) return;

  const el = elements[Math.floor(Math.random() * elements.length)];
  const r = el.getBoundingClientRect();

  // ✅ 선택된 Link 저장
  setActiveTarget(el);

  const vv = window.visualViewport;
  const scale = vv?.scale ?? 1;
  const offX = vv?.offsetLeft ?? 0;
  const offY = vv?.offsetTop ?? 0;

  const x = (r.left - offX) / scale;
  const y = (r.top  - offY)  / scale;
  const w = r.width / scale;
  const h = r.height/ scale;

  setRect({
    x: Math.max(0, x - 2),
    y: Math.max(0, y - 2),
    w: w + 4,
    h: h + 4,
  });
}, [targets]);

  const close = useCallback(() => setShowGuide(false), []);
const handleShadeClick = () => {
  if (activeTarget) {
    const to = activeTarget.getAttribute("href");
    setShowGuide(false);
    navigate(to);
  } else {
    setShowGuide(false);
  }
};
  // 📌 가이드 표시/뷰포트 변화에 따라 계속 동기화
  useEffect(() => {
    if (!showGuide) return;

    const update = () => requestAnimationFrame(pick);
    update();

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
  }, [showGuide, pick]);

  // 🚧 비로그인 클릭 가로채기
  const handleProtectedClick = (e) => {
    if (!authed) {
      e.preventDefault();
      setShowLoginModal(true);
    }
  };

  const goLoginFromModal = () => {
    const backTo = location.pathname || "/";
    setShowLoginModal(false);
    navigate("/login", { state: { from: backTo } });
  };

  return (
    <div className="main-container" ref={containerRef}>
      <img
        src={mainImg}
        alt="메인맵"
        className="main-image"
        onLoad={() => requestAnimationFrame(pick)}
      />

      {/* 클릭 영역들 */}
      <Link to="/routine"               className="link-area routine"   aria-label="운동기록으로 이동"       onClick={handleProtectedClick} />
      <Link to="/challenge/challengeHome" className="link-area challenge" aria-label="수련장으로 이동"         onClick={handleProtectedClick} />
      <Link to="/market"                className="link-area market"    aria-label="장터로 이동"             onClick={handleProtectedClick} />
      <Link to="/buddy/buddyHome"       className="link-area buddy"     aria-label="벗 찾기로 이동"           onClick={handleProtectedClick} />

      {/* 가이드 오버레이 */}
      {showGuide && rect && (
        <div className="guide-overlay" role="dialog" aria-live="polite">
          <div className="shade top" onClick={close}    style={{ top: 0, left: 0, width: "100%", height: rect.y }} />
          <div className="shade bottom" onClick={close} style={{ top: rect.y + rect.h, left: 0, width: "100%", bottom: 0, position: "absolute" }} />
          <div className="shade left" onClick={close}   style={{ top: rect.y, left: 0, width: rect.x, height: rect.h }} />
          <div className="shade right" onClick={close}  style={{ top: rect.y, left: rect.x + rect.w, right: 0, height: rect.h, position: "absolute" }} />

          <div className="guide-spot" style={{ top: rect.y, left: rect.x, width: rect.w, height: rect.h }} />
          <div className="guide-ring" style={{ top: rect.y, left: rect.x, width: rect.w, height: rect.h }} />

          <div className="guide-bubble" onClick={close} style={{ top: "40%", left: "50%", transform: "translateX(-50%)" }}>
            <p>마당의 곳곳을 짚으면 <br/>원하는 장소로 <br/>이동할 수 있소.</p>
          </div>
        </div>
      )}

      <BasicLoginModal
        open={showLoginModal && !authed}
        onClose={() => setShowLoginModal(false)}
        onConfirm={goLoginFromModal}
      />
    </div>
  );
}
