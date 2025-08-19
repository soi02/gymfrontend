import { Link } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import "../styles/MainPage.css";
import mainImg from "../../assets/img/mainphoto_new.png";

export default function MainPage() {
  const containerRef = useRef(null);
  const [showGuide, setShowGuide] = useState(() => !localStorage.getItem("mainGuideSeen"));
  const [rect, setRect] = useState(null);

  // 대상 후보(기존 클릭 영역들)
  const targets = useMemo(
    () => [".link-area.routine", ".link-area.challenge", ".link-area.market", ".link-area.buddy"],
    []
  );

  // 랜덤 타겟 1개 선택해서 위치 계산
  useEffect(() => {
    if (!showGuide) return;

    const pick = () => {
      const container = containerRef.current;
      if (!container) return;

      const elements = targets
        .map(sel => container.querySelector(sel))
        .filter(Boolean);

      if (elements.length === 0) return;

      const el = elements[Math.floor(Math.random() * elements.length)];
      const r = el.getBoundingClientRect();
      const c = container.getBoundingClientRect();
      setRect({ x: r.left - c.left, y: r.top - c.top, w: r.width, h: r.height });
    };

    pick();

    const update = () => pick();
    const ro = new ResizeObserver(update);
    ro.observe(document.body);
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, [showGuide, targets]);

  const close = () => {
    localStorage.setItem("mainGuideSeen", "1");
    setShowGuide(false);
  };

  return (
    <div className="main-container" ref={containerRef}>
      <img src={mainImg} alt="메인맵" className="main-image" />

      {/* 클릭 영역들 */}
      <Link to="/routine" className="link-area routine" aria-label="운동기록으로 이동" />
      <Link to="/challenge/challengeHome" className="link-area challenge" aria-label="수련장으로 이동" />
      <Link to="/market" className="link-area market" aria-label="장터로 이동" />
      <Link to="/buddy" className="link-area buddy" aria-label="벗 찾기로 이동" />

      {/* 랜덤 가이드 오버레이 */}
{showGuide && rect && (
  <div className="guide-overlay" onClick={close} role="dialog" aria-live="polite">
    {/* 4면 가림막: 선택 영역을 제외한 부분만 어둡게 */}
    <div className="shade top"    style={{ top: 0, left: 0, width: "100%", height: rect.y }} />
    <div className="shade bottom" style={{ top: rect.y + rect.h, left: 0, width: "100%", bottom: 0, position: "absolute" }} />
    <div className="shade left"   style={{ top: rect.y, left: 0, width: rect.x, height: rect.h }} />
    <div className="shade right"  style={{ top: rect.y, left: rect.x + rect.w, right: 0, height: rect.h, position: "absolute" }} />

    {/* 안쪽만 살짝 밝게 + 테두리 펄스 */}
    <div className="guide-spot" style={{ top: rect.y, left: rect.x, width: rect.w, height: rect.h }} />
    <div className="guide-ring" style={{ top: rect.y, left: rect.x, width: rect.w, height: rect.h }} />

    {/* 중앙 안내 버블 */}
    <div className="guide-bubble" style={{ top: "40%", left: "50%", transform: "translateX(-50%)" }}>
      <p>마당의 곳곳을 짚으면 <br />원하는 장소로 <br />이동할 수 있소.</p>
    </div>
  </div>
)}

    </div>
  );
}
