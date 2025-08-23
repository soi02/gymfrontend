// src/common/components/BasicLoginModal.jsx
import { useEffect } from "react";

export default function BasicLoginModal({
  open,
  onClose,
  onConfirm,
  title = "신분을 밝혀야 마당을 거닐 수 있소",
  message = "지금 신분을 밝히겠소?",
}) {
  // ESC + 스크롤 락
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev || "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 2000,
        padding: "16px",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 330,
          background: "#fff",
          borderRadius: 16,
          boxShadow: "0 10px 30px rgba(0,0,0,.18)",
          padding: "25px 18px",
          textAlign: "center",
        }}
      >
        <h2 style={{ fontSize: "1.05rem", margin: 0, fontWeight: 800 }}>{title}</h2>
        <p style={{ color: "#666", margin: "10px 0 18px" }}>{message}</p>

        <div style={{ display: "flex", gap: 8, marginLeft: "5rem",  marginRight: "5rem"}}>

          <button
            type="button"
            onClick={onConfirm}
            className="btn btn-dark flex-fill"
            style={{ flex: 1, borderRadius: 12 }}
          >
            신분 밝히기
          </button>
        </div>
      </div>
    </div>
  );
}
