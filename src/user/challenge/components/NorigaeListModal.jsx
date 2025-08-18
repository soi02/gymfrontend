import React, { useMemo, useState, useEffect } from 'react';
import { IoChevronBackOutline, IoShareOutline } from 'react-icons/io5';
import '../styles/NorigaeListModal.css';

// 로컬 이미지
import goldNorigae from '../../../assets/img/challenge/norigae/gold.png';
import silverNorigae from '../../../assets/img/challenge/norigae/silver.png';
import bronzeNorigae from '../../../assets/img/challenge/norigae/bronze.png';

const BACKEND_BASE_URL = 'http://localhost:8080';

const norigaeImages = {
  '금': goldNorigae,
  '은': silverNorigae,
  '동': bronzeNorigae,
  gold: goldNorigae,
  silver: silverNorigae,
  bronze: bronzeNorigae,
};

function toAbsUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${BACKEND_BASE_URL}${path}`;
}

export default function NorigaeListModal({ isOpen, onClose, norigaeList = [] }) {
  const mapped = useMemo(() => {
    return (norigaeList || []).map(n => {
      const key = (n.name || '')
        .replace(/노리개/gi, '')
        .trim()
        .toLowerCase(); // gold/silver/bronze 대응

      const localImg =
        norigaeImages[key] ||
        (key.includes('금') ? goldNorigae : key.includes('은') ? silverNorigae : key.includes('동') ? bronzeNorigae : null);

        return {
        ...n,
        iconPath: localImg || toAbsUrl(n.iconPath),
        description: n.description, // 백엔드에서 제공하는 설명 필드
        awardedDate: n.awardedDate, // 백엔드에서 제공하는 날짜 필드
      };
    });
  }, [norigaeList]);

  // 가장 최근(마지막) 항목을 기본으로
  const [idx, setIdx] = useState(Math.max(0, mapped.length - 1));
  useEffect(() => {
    setIdx(Math.max(0, (norigaeList?.length || 1) - 1));
  }, [isOpen, norigaeList]);

  if (!isOpen) return null;

  // ⭐️ 노리개 리스트가 비어 있을 때 처리
  if (norigaeList.length === 0) {
    return (
      <div className="nlm-overlay" onClick={onClose}>
        <div className="nlm-sheet" onClick={(e) => e.stopPropagation()}>
          {/* 상단 바는 동일하게 유지 */}
          <div className="nlm-topbar">
            <button className="nlm-top-btn" onClick={onClose} aria-label="닫기">
              <IoChevronBackOutline />
              <span className="nlm-top-label">나의 수련기록</span>
            </button>
          </div>

          {/* ⭐️ 획득한 노리개가 없을 때 표시할 내용 */}
          <div className="nlm-empty-state">
            <h2 className="nlm-empty-title">아직 획득한 노리개가 없습니다.</h2>
            <p className="nlm-empty-desc">
              챌린지에 참여하고 첫 노리개를 획득해 보세요!
            </p>
          </div>
        </div>
      </div>
    );
  }

  // ⭐️ 노리개가 있을 때 기존 UI 렌더링
  const current = mapped[idx] || null;
  const title = current?.name || '노리개';
  const description = current?.description || '꾸준한 수련으로 획득하셨습니다. 계속 이어가 보세요!';
  const awardedDate = current?.awardedDate || null;
  const formattedDate = awardedDate ? `${new Date(awardedDate).getFullYear()}/${new Date(awardedDate).getMonth() + 1}/${new Date(awardedDate).getDate()}` : '';

  const handleShare = async () => {
    if (!current?.iconPath) return;
    try {
      if (navigator.share) {
        await navigator.share({ title, url: current.iconPath });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(current.iconPath);
      }
    } catch (_) {}
  };

  return (
    <div className="nlm-overlay" onClick={onClose}>
      <div className="nlm-sheet" onClick={(e) => e.stopPropagation()}>
        {/* 상단 바 */}
        <div className="nlm-topbar">
          <button className="nlm-top-btn" onClick={onClose} aria-label="닫기">
            <IoChevronBackOutline />
            <span className="nlm-top-label">나의 수련기록</span>
          </button>
          <button className="nlm-top-btn right" onClick={handleShare} aria-label="공유">
            <IoShareOutline />
          </button>
        </div>

        {/* 메달(중앙 크게) */}
        <div className="nlm-medal-wrap">
          {current?.iconPath && <img src={current.iconPath} alt={title} className="nlm-medal" />}
          <div className="nlm-medal-glow" />
        </div>

        {/* 타이틀/설명 */}
        <div className="nlm-text">
          <h2 className="nlm-title">{title}</h2>
          <p className="nlm-desc">
            {description}
            <br />
            <span className="nlm-date">{formattedDate}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
