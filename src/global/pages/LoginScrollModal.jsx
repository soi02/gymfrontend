// src/common/components/LoginScrollModal.jsx
import "../styles/LoginScrollModal.css"; // 아래 CSS 파일
// src/global/pages/LoginScrollModal.jsx  (경로는 네 프로젝트에 맞게)
import React, { useEffect } from "react";

export default function LoginScrollModal({
  show,
  onClose,
  onLoginClick,
  theme = "jade", // "jade" | "ink"
  topBg,
  bottomBg,
}) {
  // ESC + 스크롤 락
  useEffect(() => {
    if (!show) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev || "";
    };
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="scroll-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className={`scroll-card theme-${theme}`} onClick={(e) => e.stopPropagation()}>
        <div className="scroll-hanger" />
        <div className="scroll-rod scroll-rod--top" />
        <div className="scroll-panel">
          <div
            className={`scroll-top ${topBg ? "with-img" : ""}`}
            style={topBg ? { backgroundImage: `url(${topBg})` } : undefined}
          />
          <div className="scroll-paper">
            <p className="scroll-text">
              신분을 밝혀야 마당을 거닐 수 있소<br />지금 신분을 밝히겠소?
            </p>
            <button className="scroll-btn" onClick={onLoginClick}>신분 밝히기</button>
          </div>
          <div
            className={`scroll-bottom ${bottomBg ? "with-img" : ""}`}
            style={bottomBg ? { backgroundImage: `url(${bottomBg})` } : undefined}
          />
        </div>
        <div className="scroll-rod scroll-rod--bottom" />
      </div>
    </div>
  );
}
