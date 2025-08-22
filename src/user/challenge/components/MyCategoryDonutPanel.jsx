// src/components/MyCategoryDonutPanel.jsx
import React, { useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

/** 앱 고정 8카테고리 (백엔드 categoryName이 이 라벨로 온다고 가정) */
const CATS = ['루틴','회복','소통','정보','습관','동기부여','자기관리','분위기'];

/** 진행률 */
function ratioOf(ch) {
  const dur = Number(ch.challengeDurationDays) || 0;
  const done = Number(ch.daysAttended) || 0;
  return dur > 0 ? Math.min(1, Math.max(0, done / dur)) : 0;
}

export default function MyCategoryDonutPanel({
  myChallengeList = [],
  navigate,
  thumbOf,
}) {
  const [active, setActive] = useState(null);

  // 파레트 (차분+선명 8색)
  const palette = [
    '#4C7FFF', // cobalt
    '#33B679', // jade
    '#F6BF26', // amber
    '#E67C73', // coral
    '#A142F4', // violet
    '#4285F4', // blue
    '#F4511E', // orange-red
    '#9AA0A6'  // gray
  ];

  /** 집계: 백엔드가 주는 categoryName/Id 사용 */
  const { counts, total, listByCat } = useMemo(() => {
    const counts = new Map(CATS.map((c)=>[c,0]));
    const listByCat = new Map(CATS.map((c)=>[c,[]]));

    (myChallengeList || []).forEach(ch => {
      const label = ch?.categoryName ? String(ch.categoryName).trim() : null;
      if (!label || !CATS.includes(label)) return; // 미정/기타는 제외
      counts.set(label, (counts.get(label) || 0) + 1);
      listByCat.get(label).push(ch);
    });

    const total = Array.from(counts.values()).reduce((a,b)=>a+b,0);
    return { counts, total, listByCat };
  }, [myChallengeList]);

  /** 도넛 */
  const donut = useMemo(() => {
    const labels = CATS;
    const values = labels.map(l => counts.get(l) || 0);
    return {
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: labels.map((_,i)=>palette[i%palette.length]),
          borderWidth: 0,
          cutout: '72%',
        }]
      },
      options: {
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        events: [], // 클릭은 오른쪽 레전드에서만 처리
        responsive: true, maintainAspectRatio: false
      }
    };
  }, [counts]);

  const onLegendClick = (label) => setActive(prev => prev === label ? null : label);
  const selectedList = active ? (listByCat.get(active) || []) : [];

  return (
    <section className="cmrl-new-section">
      <div className="cmrl-new-section-head">
        <h4>카테고리 분석</h4>
      </div>

      {total === 0 ? (
        <div className="cmrl-new-card">
          <div className="cmrl-new-empty">카테고리 데이터가 없습니다.</div>
        </div>
      ) : (
        <>
          {/* 도넛 + 8개 레전드(4×2) */}
          <div className="cat-mini-wrap cmrl-new-card">
            <div className="cat-mini-donut">
              <Doughnut {...donut} />
            </div>

            <div className="cat-mini-legend">
              {CATS.map((label, i) => {
                const value = counts.get(label) || 0;
                const pct = total ? Math.round((value/total)*100) : 0;
                return (
                  <button
                    key={label}
                    className={`cat-legend-item ${active === label ? 'on' : ''}`}
                    onClick={()=>onLegendClick(label)}
                    title={`${label} (${value}개)`}
                  >
                    <span className="legend-dot" style={{ background: palette[i%palette.length] }} />
                    <span className="legend-label">{label}</span>
                    <span className="legend-pct">{pct}%</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 선택된 카테고리의 수련 리스트 */}
          {active && (
            <div className="cmrl-new-card" style={{ marginTop: 10 }}>
              <div className="cmrl-new-chart-title">
                {active} 카테고리 수련({selectedList.length})
              </div>
              {selectedList.length === 0 ? (
                <div className="cmrl-new-empty">해당 카테고리에 참여 중인 수련이 없습니다.</div>
              ) : (
                <ul className="cmrl-new-card-list">
                  {selectedList.map(ch=>{
                    const r = ratioOf(ch);
                    return (
                      <li
                        key={ch.challengeId}
                        className="cmrl-new-card"
                        onClick={() => navigate?.(`/challenge/detail/${ch.challengeId}`)}
                      >
                        <div
                          className="cmrl-new-card-thumb"
                          style={{ backgroundImage: `url(${thumbOf ? thumbOf(ch) : ch.challengeThumbnailPath})` }}
                        />
                        <div className="cmrl-new-card-main">
                          <div className="cmrl-new-card-title">{ch.challengeTitle}</div>
                          <div className="cmrl-new-card-sub">진행률 {Math.round(r*100)}%</div>
                          <div className="cmrl-new-card-bar">
                            <div style={{ width: `${Math.round(r*100)}%` }} />
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}
        </>
      )}
    </section>
  );
}
