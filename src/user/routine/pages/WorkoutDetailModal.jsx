// src/routine/components/WorkoutDetailModal.jsx
import "../styles/WorkoutDetailModal.css";
import "../styles/ResultPage.css";              // ✅ 카드 스타일 재활용
export default function WorkoutDetailModal({ open, onClose, rows = [] }) {
  if (!open) return null;

  // 세트 리스트(유연 매핑)
  const items = Array.isArray(rows) ? rows : [];

  return (
    <div className="wdm-backdrop" onClick={onClose}>
      <div className="wdm-modal" onClick={(e) => e.stopPropagation()}>
        <div className="wdm-header">
          <div className="wdm-title">운동 상세</div>
          <button className="wdm-close" onClick={onClose} aria-label="닫기">×</button>
        </div>

        {items.length === 0 ? (
          <div className="wdm-empty">세부 기록이 없소.</div>
        ) : (
          <div className="wdm-list">
            {items.map((s, i) => {
              const name = s.elementName ?? s.name ?? `운동 #${i+1}`;
              const kg = Number(s.kg ?? s.weight ?? 0);
              const reps = Number(s.reps ?? s.rep ?? 0);
              const setNo = s.setNo ?? s.setIndex ?? (i + 1);
              return (
                <div key={i} className="wdm-row">
                  <div className="wdm-name">{name}</div>
                  <div className="wdm-meta">
                    <span>세트 {setNo}</span>
                    <span>{kg} kg</span>
                    <span>{reps} reps</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
