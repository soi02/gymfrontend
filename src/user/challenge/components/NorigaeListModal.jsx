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
      };
    });
  }, [norigaeList]);

  // 가장 최근(마지막) 항목을 기본으로
  const [idx, setIdx] = useState(Math.max(0, mapped.length - 1));
  useEffect(() => {
    setIdx(Math.max(0, (norigaeList?.length || 1) - 1));
  }, [isOpen, norigaeList]);

  if (!isOpen) return null;

  const current = mapped[idx] || null;
  const title = current?.name || '노리개';
  // 설명문구: 서버에 설명/날짜가 없을 수 있으니 기본 문구 제공
  const desc = '꾸준한 수련으로 획득하셨습니다. 계속 이어가 보세요!';

  const handleShare = () => {
    // 실제 공유 로직은 앱 정책에 맞춰 연결하세요.
    // 여기서는 단순히 이미지 주소를 클립보드에 복사.
    if (!current?.iconPath) return;
    navigator.clipboard?.writeText(current.iconPath).catch(() => {});
  };

  return (
    <div className="nlm-overlay" onClick={onClose}>
      <div className="nlm-sheet" onClick={(e) => e.stopPropagation()}>
        {/* 상단 바 */}
        <div className="nlm-topbar">
          <button className="nlm-top-btn" onClick={onClose} aria-label="닫기">
            <IoChevronBackOutline />
            <span className="nlm-top-label">뒤로</span>
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
          <p className="nlm-desc">{desc}</p>
        </div>
      </div>
    </div>
  );
}
