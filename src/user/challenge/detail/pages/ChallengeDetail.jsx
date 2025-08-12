// ChallengeDetail.jsx (수정본)
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import apiClient from '../../../../global/api/apiClient';
import ChallengeStartModal from '../components/ChallengeStartModal';
import '../styles/ChallengeDetail.css';
import { BsCalendarEvent, BsPeople, BsWallet2 } from 'react-icons/bs';

export default function ChallengeDetail() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null); // ⬅️ 시/분/초 포함 D-Day

  const userId = useSelector(state => state.auth.id);
  const BACKEND_BASE_URL = "http://localhost:8080";

  // 상세 불러오기 (항상 같은 위치에서 호출)
  useEffect(() => {
    if (!challengeId) {
      alert("잘못된 접근입니다.");
      navigate('/challenge/challengeHome');
      return;
    }
    (async () => {
      try {
        const params = { challengeId };
        if (userId) params.userId = userId;
        const res = await apiClient.get('/challenge/detail', { params });
        setChallenge(res.data);
      } catch (err) {
        console.error("챌린지 상세 실패", err);
        alert("챌린지를 불러올 수 없습니다.");
        navigate('/challenge/challengeHome');
      }
    })();
  }, [challengeId, userId, navigate]);

  // D-Day 타이머 (항상 같은 위치에서 호출; 내부에서 guard)
  useEffect(() => {
    if (!challenge) { setTimeLeft(null); return; }

    const start = new Date(challenge.challengeRecruitStartDate);
    const endRaw = new Date(challenge.challengeRecruitEndDate);
    if (isNaN(start) || isNaN(endRaw)) { setTimeLeft(null); return; }

    const end = new Date(endRaw);
    end.setHours(23, 59, 59, 999); // 날짜만 온 경우 당일 23:59:59

    const inRecruit = Date.now() >= start.getTime() && Date.now() <= end.getTime();
    if (!inRecruit) { setTimeLeft(null); return; }

    const calc = () => {
      const diff = Math.max(0, end.getTime() - Date.now());
      const DAY = 86400000, H = 3600000, M = 60000, S = 1000;
      const days = Math.floor(diff / DAY);
      const hours = Math.floor((diff % DAY) / H);
      const minutes = Math.floor((diff % H) / M);
      const seconds = Math.floor((diff % M) / S);
      setTimeLeft({ days, hours, minutes, seconds });
    };
    calc();
    const t = setInterval(calc, 1000);
    return () => clearInterval(t);
  }, [challenge]);

  // 여기서부터는 로딩 처리 (hook 선언 이후에 배치!)
  if (!challenge) return <div className="cdp-loading">로딩 중...</div>;

  // ── 파생값들 ─────────────────────────────────────────
  const {
    challengeTitle,
    challengeDescription,
    challengeRecruitStartDate,
    challengeRecruitEndDate,
    challengeDurationDays,
    participantCount = 0,
    challengeThumbnailPath,
    keywords = [],
    challengeDepositAmount = 0,
    userParticipating = false,
    challengeMaxMembers = 0
  } = challenge;

  const cap = Number(challengeMaxMembers) || 0;

  const imageUrl = challengeThumbnailPath
    ? `${BACKEND_BASE_URL}${challengeThumbnailPath}`
    : '/images/default-thumbnail.png';

  const fmt = (d) => {
    if (!d) return '-';
    const dt = new Date(d);
    if (isNaN(dt)) return d;
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, '0');
    const da = String(dt.getDate()).padStart(2, '0');
    return `${y}.${m}.${da}`;
  };
  const pad2 = (n) => String(n).padStart(2, '0');

  const now = new Date();
  const recruitStart = new Date(challengeRecruitStartDate);
  const recruitEnd = new Date(challengeRecruitEndDate); recruitEnd.setHours(23,59,59,999);

  let status = '모집 종료';
  if (now < recruitStart) status = '모집 예정';
  else if (now >= recruitStart && now <= recruitEnd) status = '모집 중';

  const isJoinable = status === '모집 중' && !userParticipating;
  const buttonText = userParticipating ? '도전 중' : (status === '모집 중' ? '도전하기' : status);

  const navigateToChat = () => navigate(`/challenge/groupchat/${challengeId}`);
const handlePaymentStart = async () => {
  if (!userId) { alert("로그인 후 이용 가능합니다."); navigate('/login'); return; }
  try {
    const res = await apiClient.post(`/challenge/join/payment`, null, {
      params: { userId, challengeId, redirectUrl: `${window.location.origin}/challenge/payment/success` },
    });
    if (res.data?.redirectUrl) {
      window.location.href = res.data.redirectUrl;
      // 🌟 여기에 결제 성공 후 페이지를 새로고침하는 로직을 추가
      // 결제 성공 후 리디렉션 로직은 백엔드에서 처리되므로,
      // 백엔드가 프론트엔드로 다시 리다이렉션할 때, userParticipating을 업데이트하는 로직이 필요.
      // 이 로직은 백엔드에서 결제 승인 후 성공 페이지로 리다이렉션할 때 함께 처리해야 합니다.

    } else {
      alert("결제 준비에 실패했습니다.");
    }
  } catch (err) {
    console.error("결제 실패", err);
    alert("결제 과정 중 오류가 발생했습니다: " + (err.response?.data || err.message));
  }
};

  

  return (
    <div className="cdp">
      <div className="cdp-hero">
        <img src={imageUrl} alt="챌린지 이미지" />
        <div className="cdp-hero-badges">
          {status === '모집 중' ? (
            <span className="pill pill-dday" style={{fontVariantNumeric:'tabular-nums'}}>
              마감 D-{timeLeft?.days ?? 0} {pad2(timeLeft?.hours ?? 0)}:{pad2(timeLeft?.minutes ?? 0)}:{pad2(timeLeft?.seconds ?? 0)}
            </span>
          ) : (
            <span className={`pill ${status === '모집 예정' ? 'pill-upcoming' : 'pill-closed'}`}>{status}</span>
          )}
          <span className="pill">{challengeDurationDays ?? '-'}일 수련</span>
        </div>
      </div>

      <div className="cdp-body">
        <h1 className="cdp-title">{challengeTitle}</h1>

        {keywords.length > 0 && (
          <div className="cdp-chips">
            {keywords.slice(0, 3).map((k, i) => <span className="chip" key={`k-${i}`}>#{k}</span>)}
            {keywords.length > 3 && <span className="chip more">+{keywords.length - 3}</span>}
          </div>
        )}

    <div className="cdp-info-card">
      <div className="info-item">
        <span className="ico-soft"><BsCalendarEvent aria-hidden /></span>
        <div className="info-text">
          <span className="label">모집 기간</span>
          <span className="value">{fmt(challengeRecruitStartDate)} ~ {fmt(challengeRecruitEndDate)}</span>
        </div>
      </div>

      <div className="info-item">
        <span className="ico-soft"><BsPeople aria-hidden /></span>
        <div className="info-text">
          <span className="label">참가</span>
          <span className="value">
            <strong>{participantCount}</strong>
            <span className="muted"> / {cap}</span>
          </span>
        </div>
      </div>

      <div className="info-item">
        <span className="ico-soft"><BsWallet2 aria-hidden /></span>
        <div className="info-text">
          <span className="label">보증금</span>
          <span className="value money">{Number(challengeDepositAmount || 0).toLocaleString()}원</span>
        </div>
      </div>
    </div>


{/* 설명 카드 톤 */}
{challengeDescription && (
  <div className="cdp-desc-card">
    <p>{challengeDescription}</p>
  </div>
)}


        {userParticipating && <button className="cdp-secondary" onClick={navigateToChat}>채팅방 입장</button>}
      </div>

      <div className="cdp-footer">
        <button
          className={`cdp-cta ${isJoinable ? '' : 'disabled'}`}
          disabled={!isJoinable}
          onClick={() => isJoinable && setShowModal(true)}
        >
          {buttonText}
        </button>
      </div>

      {showModal && (
        <ChallengeStartModal
          onClose={() => setShowModal(false)}
          challengeId={challengeId}
          challengeTitle={challengeTitle}
          challengeDepositAmount={challengeDepositAmount}
          onPaymentStart={handlePaymentStart}
        />
      )}
    </div>
  );
}
