import { useMemo } from "react";
import "../styles/WorkoutDetailModal.css";

export default function WorkoutDetailModal({ open, onClose, rows = [] }) {
  if (!open) return null;

  const items = Array.isArray(rows) ? rows : [];

  // 운동별 그룹핑
  const groups = useMemo(() => {
    const map = new Map();
    items.forEach((s, i) => {
      const key = s.elementId ?? s.element_id ?? s.detailId ?? s.detail_id ?? i;
      const name = s.elementName ?? s.name ?? `운동 #${i + 1}`;
      const thumb =
        s.imageUrl ?? s.image_url ?? s.thumbUrl ?? s.thumbnail ?? null;

      if (!map.has(key)) map.set(key, { name, thumb, sets: [] });
      map.get(key).sets.push({
        kg: Number(s.kg ?? s.weight ?? 0),
        reps: Number(s.reps ?? s.rep ?? 0),
      });
    });
    return Array.from(map.values());
  }, [items]);

  // 상단 메트릭
  const totalSets = items.length;
  const calories = Number(items?.[0]?.calories ?? items?.[0]?.kcal ?? 0);
  const exerciseCount = groups.length; // ✅ 운동 개수(운동 종류 수)

  // 요약행: "12kg x 10회 x 5세트" (가중치/불일치 시엔 "n세트"만)
  function buildSummary(sets) {
    if (!sets?.length) return "0세트";
    const kgSet = new Set(sets.map((s) => s.kg));
    const repSet = new Set(sets.map((s) => s.reps));
    const n = sets.length;
    if (kgSet.size === 1 && repSet.size === 1) {
      const kg = sets[0].kg;
      const reps = sets[0].reps;
      return `${kg}kg × ${reps}회 × ${n}세트`;
    }
    return `${n}세트`;
  }

  return (
    <div className="wdm-backdrop" onClick={onClose}>
      <div className="wdm-modal" onClick={(e) => e.stopPropagation()}>
        {/* 헤더 */}
        <div className="wdm-header">
          <h3 className="wdm-title">운동 상세보기</h3>
          <button className="wdm-close" onClick={onClose} aria-label="닫기">
            ×
          </button>
        </div>

        {/* 요약 카드 */}
        <div className="wdm-summary">
          <div className="wdm-summary-body">
            {groups.map((g, i) => (
              <div className="wdm-summary-row" key={i}>
                <div className="wdm-summary-name">{g.name}</div>
                <div className="wdm-summary-right">{buildSummary(g.sets)}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="wdm-metrics">
          <div className="wdm-metric">
            <span className="wdm-metric-ico">💪</span>
            <span className="wdm-metric-text">{exerciseCount}운동</span>
          </div>
          <div className="wdm-metric">
            <span className="wdm-metric-ico">🏋️</span>
            <span className="wdm-metric-text">{totalSets}세트</span>
          </div>
          <div className="wdm-metric">
            <span className="wdm-metric-ico">🔥</span>
            <span className="wdm-metric-text">
              {calories ? `${calories}kcal` : "—"}
            </span>
          </div>
        </div>

        <hr className="wdm-divider" />

        {/* 자세히 보기 */}
        <h5 className="wdm-section-title">자세히 보기</h5>
        <div className="wdm-details">
          {groups.map((g, gi) => (
            <div className="wdm-exbox" key={g.key ?? gi}>
              {/* 상단 제목 필 */}
              <div className="wdm-exbox-head">
                <span className="wdm-exbox-title">
                  {/* {gi + 1} {g.name} */}
                  ✗ {g.name}
                </span>
              </div>

              {/* 세트 2×2 그리드 */}
              <div className="wdm-setgrid-2">
                {g.sets.map((s, si) => (
                  <div className="wdm-setpill" key={si}>
                    {s.kg}kg × {s.reps}회
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
