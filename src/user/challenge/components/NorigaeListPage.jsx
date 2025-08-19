import React, { useMemo, useState, useEffect } from 'react';
import { IoChevronBackOutline, IoShareOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import '../styles/NorigaeListPage.css';

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

export default function NorigaeListPage() {
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);
  const [norigaeList, setNorigaeList] = useState([]);
  const [loading, setLoading] = useState(true);

  // 컴포넌트 마운트 시 데이터 불러오기
  useEffect(() => {
    async function fetchNorigaeList() {
      try {
        if (!userId) {
          // 로그인 페이지로 리디렉션
          navigate('/login', { state: { from: '/norigae' } });
          return;
        }
        setLoading(true);
        const res = await axios.get(`${BACKEND_BASE_URL}/api/challenge/getAwardedNorigaeList`, {
          params: { userId },
        });
        setNorigaeList(res.data || []);
      } catch (e) {
        console.error("노리개 리스트를 불러오는 데 실패했습니다.", e);
        setNorigaeList([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNorigaeList();
  }, [userId, navigate]);

  const mapped = useMemo(() => {
    return (norigaeList || []).map(n => {
      const key = (n.name || '')
        .replace(/노리개/gi, '')
        .trim()
        .toLowerCase();
      const localImg =
        norigaeImages[key] ||
        (key.includes('금') ? goldNorigae : key.includes('은') ? silverNorigae : key.includes('동') ? bronzeNorigae : null);
      return {
        ...n,
        iconPath: localImg || toAbsUrl(n.iconPath),
        description: n.description,
        awardedDate: n.awardedDate,
      };
    });
  }, [norigaeList]);

  // 가장 최근 항목을 기본으로
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    setIdx(Math.max(0, (mapped.length || 1) - 1));
  }, [mapped.length]);

  if (loading) {
    return <div className="crd-loading">노리개 리스트를 불러오는 중입니다...</div>;
  }

  // 노리개 리스트가 비어 있을 때 처리
  if (mapped.length === 0) {
    return (
      <div className="nlm-page">
        <div className="nlm-topbar">
          <button className="nlm-top-btn" onClick={() => navigate(-1)} aria-label="뒤로 가기">
            <IoChevronBackOutline />
            <span className="nlm-top-label">나의 수련기록</span>
          </button>
        </div>
        <div className="nlm-sheet">
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
    <div className="nlm-page">
      <div className="nlm-topbar">
        <button className="nlm-top-btn" onClick={() => navigate(-1)} aria-label="뒤로 가기">
          <IoChevronBackOutline />
          <span className="nlm-top-label">나의 수련기록</span>
        </button>
        <button className="nlm-top-btn right" onClick={handleShare} aria-label="공유">
          <IoShareOutline />
        </button>
      </div>
      <div className="nlm-sheet">
        <div className="nlm-medal-wrap">
          {current?.iconPath && <img src={current.iconPath} alt={title} className="nlm-medal" />}
          <div className="nlm-medal-glow" />
        </div>
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