import React, { useState } from 'react';
import { format } from 'date-fns';
import '../styles/ChallengeProgressDisplay.css';

const BACKEND_BASE_URL = 'http://localhost:8080';
const toAbsUrl = (p) => (!p ? null : (/^https?:\/\//i.test(p) ? p : `${BACKEND_BASE_URL}${p}`));

// 7/14/20/30 중 유효한 일수로 고정
const CANDIDATES = [7, 14, 20, 30];
function normalizeDays(totalDays, listLen) {
  const n = Number(totalDays);
  if (CANDIDATES.includes(n)) return n;

  // totalDays가 없거나 이상하면 listLen으로 추정하되, 가장 가까운 '아래쪽' 후보로 내림
  if (CANDIDATES.includes(listLen)) return listLen;
  const le = CANDIDATES.filter((c) => c <= listLen);
  if (le.length) return le[le.length - 1];

  // 그래도 못 정하면 최소 7일로 시작
  return 7;
}

/**
 * N일 챌린지 보드
 * props:
 *  - statusList: [{ status:'인증완료'|'결석'|'미래', photoUrl?, recordDate? }, ...]
 *  - totalDays: 7|14|20|30  (오면 무조건 우선)
 *  - shape: 'round'|'square'  (낙관 모양)
 */
export default function ChallengeProgressDisplay({
  statusList = [],
  totalDays,
  shape = 'round',
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalPhotoUrl, setModalPhotoUrl] = useState('');

  const N = normalizeDays(totalDays, statusList.length);

  // N개로 정확히 맞추기: 초과는 버리고, 부족하면 '미래'로 채움
  const items = Array.from({ length: N }, (_, i) => {
    const s = statusList[i] || {};
    const status =
      s.status ||
      (typeof s.attended === 'boolean' ? (s.attended ? '인증완료' : '결석') : '미래');

    return {
      day: i + 1,
      status,
      photoUrl: s.photoUrl,
      recordDate: s.recordDate,
    };
  });

  const doneCount = items.filter((x) => x.status === '인증완료').length;

  const openPhoto = (u) => {
    const abs = toAbsUrl(u);
    if (!abs) return;
    setModalPhotoUrl(abs);
    setIsModalOpen(true);
  };
  const closePhoto = () => {
    setIsModalOpen(false);
    setModalPhotoUrl('');
  };

  return (
    <div className="cpd-board">
      {/* 헤더 */}
      <div className="cpd-head">
        <div className="cpd-title">{N}일 챌린지 출석판</div>
        <div className="cpd-stat"><i className="cpd-dot" /> {doneCount}/{N}</div>
      </div>

      {/* 7열 그리드: 정확히 N칸만 */}
      <div className="cpd-grid">
        {items.map((it, idx) => {
          const isDone = it.status === '인증완료';
          const isMiss = it.status === '결석';
          const isFuture = it.status === '미래';
          const clickable = !!it.photoUrl;

          return (
            <button
              key={idx}
              type="button"
              className={[
                'cpd-cell',
                isDone && 'on',
                isMiss && 'miss',
                isFuture && 'future',
                shape === 'square' && 'sq',
                clickable && 'clickable',
              ].filter(Boolean).join(' ')}
              aria-label={`${it.day}일차 ${it.status}`}
              onClick={() => clickable && openPhoto(it.photoUrl)}
              title={
                it.recordDate
                  ? `${format(new Date(it.recordDate), 'M/d')} · ${it.status}`
                  : `${it.day}일차 · ${it.status}`
              }
            >
              <span className="cpd-stamp" />
              <span className="cpd-day">{it.day}</span>
            </button>
          );
        })}
      </div>

      {/* 사진 모달 */}
      {isModalOpen && (
        <div className="cpd-modal" onClick={closePhoto}>
          <div className="cpd-modal-sheet" onClick={(e) => e.stopPropagation()}>
            <img src={modalPhotoUrl} alt="인증 사진" />
            <button className="cpd-close" onClick={closePhoto}>닫기</button>
          </div>
        </div>
      )}
    </div>
  );
}
