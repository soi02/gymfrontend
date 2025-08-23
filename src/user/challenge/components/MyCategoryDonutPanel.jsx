import React, { useMemo, useState } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

import '../styles/MyCategoryDonutPanel.css';

ChartJS.register(ArcElement, Tooltip, Legend);

/** 앱 고정 8카테고리 (백엔드 categoryName이 이 라벨로 온다고 가정) */
const CATS = ['루틴', '회복', '소통', '정보', '습관', '동기부여', '자기관리', '분위기'];

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
    '#789396', // 기본 색상
    '#5C787A', // 조금 더 진하게
    '#A0B8BC', // 조금 더 밝게
    '#4E6466', // 더 진하게
    '#B8D1D3', // 더 밝게
    '#87A2A5', // 중간 톤
    '#688285', // 중간에서 진하게
    '#C4DADC'  // 가장 밝게
  ];
  /** 집계: 백엔드가 주는 categoryName/Id 사용 */
  const { counts, total, listByCat } = useMemo(() => {
    const counts = new Map(CATS.map((c) => [c, 0]));
    const listByCat = new Map(CATS.map((c) => [c, []]));

    (myChallengeList || []).forEach((ch) => {
      const label = ch?.categoryName ? String(ch.categoryName).trim() : null;
      if (!label || !CATS.includes(label)) return; // 미정/기타는 제외
      counts.set(label, (counts.get(label) || 0) + 1);
      listByCat.get(label).push(ch);
    });

    const total = Array.from(counts.values()).reduce((a, b) => a + b, 0);
    return { counts, total, listByCat };
  }, [myChallengeList]);

  /** 도넛 */
  const donut = useMemo(() => {
    const labels = CATS;
    const values = labels.map((l) => counts.get(l) || 0);
    return {
      data: {
        labels,
        datasets: [{
          data: values,
          backgroundColor: labels.map((_, i) => palette[i % palette.length]),
          borderWidth: 0,
          cutout: '72%',
        }],
      },
      options: {
        plugins: { legend: { display: false }, tooltip: { enabled: false } },
        events: [], // 클릭은 오른쪽 레전드에서만 처리
        responsive: true,
        maintainAspectRatio: false,
      },
    };
  }, [counts]);

  const selectedList = active ? (listByCat.get(active) || []) : [];
  const onLegendClick = (label) => setActive((prev) => (prev === label ? null : label));

  return (
    <section className="cmrl-new-section">
      <div className="cmrl-new-section-head">
        <h4>카테고리 분석</h4>
      </div>

      {total === 0 ? (
        <div className="cmrl-new-card">
          <div className="cmrl-new-empty">카테고리 데이터가 없소.</div>
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
                const pct = total ? Math.round((value / total) * 100) : 0;
                return (
<button
  key={label}
  className={`cat-legend-item ${active === label ? 'on' : ''}`}
  onClick={() => onLegendClick(label)}
  title={`${label} (${value}개)`}
  style={{ '--c': palette[i % palette.length] }}
>
  <span className="legend-dot" />
  <span className="legend-label">{label}</span>
  <span className="legend-pct">{pct}%</span>
</button>
                );
              })}
            </div>
          </div>

          {/* 리스트 섹션 헤더: 카드 밖, 위로 분리 */}
          <div className="cmrl-new-list-head">
            <div className="cmrl-new-chart-title">
              {active ? `${active} 카테고리 수련(${selectedList.length})` : `모든 수련(${total})`}
            </div>
          </div>

          {/* 리스트: 각 아이템은 좌측 스탬프 + 우측 카드 */}
          <ul className="cmrl-slice-list">
            {(active ? selectedList : myChallengeList).length === 0 ? (
              <div className="cmrl-new-empty">
                {active ? '해당 카테고리에 참여 중인 수련이 없소.' : '참여 중인 수련이 없소.'}
              </div>
            ) : (
              (active ? selectedList : myChallengeList).map((ch) => {
                const r = ratioOf(ch);
                const pct = Math.round(r * 100);

                const start = ch.challengeRecruitStartDate || ch.challengeStartDate || ch.createdAt;
                const dt = start ? new Date(start) : null;
                const y = dt ? dt.getFullYear() : '';
                const mm = dt ? String(dt.getMonth() + 1).padStart(2, '0') : '';
                const dd = dt ? String(dt.getDate()).padStart(2, '0') : '';

                // 카테고리 컬러 (없으면 0번)
                const catColor = palette[CATS.indexOf(ch.categoryName)] ?? palette[0];

                return (
                  <li
                    key={ch.challengeId}
                    className="cmrl-media"
                    role="button"
                    aria-label={`${ch.challengeTitle} 상세로 이동`}
                    onClick={() => navigate?.(`/challenge/detail/${ch.challengeId}`)}
                  >
                    {/* 왼쪽: 사진(라운드 사각) */}
                    <div className="cmrl-media-thumb">
                      <img
                        src={thumbOf ? thumbOf(ch) : ch.challengeThumbnailPath}
                        alt=""
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    {/* 오른쪽: 카드(내부에 체브론 포함) */}
                    <div className="cmrl-media-card">
                      <div className="cmrl-media-head">
                        <div className="cmrl-media-title">{ch.challengeTitle || '제목 없음'}</div>
                        <div className="cmrl-media-chevron" aria-hidden="true">
                          <svg viewBox="0 0 24 24" width="20" height="20">
                            <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        </div>
                      </div>

                      {/* 메타 라인: “오늘 오후 7시 · LIVE” 같은 느낌 → 우리 데이터로 매핑 */}
                      <div className="cmrl-media-meta">
                        <span className="meta">{(ch.challengeStartDate && new Date(ch.challengeStartDate).toLocaleDateString()) || '날짜 미정'}</span>
                        <span className="dot">·</span>
                        <span className="meta-strong">진행률 {Math.round(ratioOf(ch) * 100)}%</span>
                      </div>

                      {/* 액션 & 보조정보 라인: 라이트 필 버튼 */}
                      <div className="cmrl-media-actions">
                        <button
                          className="cmrl-pill cmrl-pill-primary"
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            // 👉 인증 페이지 라우트에 맞게 경로만 필요시 변경하세요
                            navigate?.(`/challenge/auth/${ch.challengeId}`);
                          }}
                        >
                          {/* 카메라 아이콘 (인증 느낌) */}
                          {/* <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
                            <path d="M9 4l1.2 2H14a2 2 0 012 2v8a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2h.8L9 4zm3 4a5 5 0 100 10 5 5 0 000-10zm0 2.2a2.8 2.8 0 110 5.6 2.8 2.8 0 010-5.6z"
                              fill="currentColor" />
                          </svg> */}
                          인증하기
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </>
      )}
    </section>
  );
}