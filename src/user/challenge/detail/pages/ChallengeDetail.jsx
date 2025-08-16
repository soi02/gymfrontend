// ChallengeDetail.jsx (수정)
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import apiClient from '../../../../global/api/apiClient';
import ChallengeStartModal from '../components/ChallengeStartModal';
import '../styles/ChallengeDetail.css';
import {
  BsArrowLeft,
  BsShare,
  BsFillCalendarEventFill,
  BsFillPeopleFill,
  BsCashStack,
  BsFillCameraFill,
} from 'react-icons/bs';
import { MdCheckCircleOutline, MdOutlineCancel } from "react-icons/md";
import {
  MdSavings,           // 보증금 환급
  MdSchedule,          // 인증 마감 시각
  MdLogout,            // 중도 포기
  MdReportGmailerrorred// 부정/부적절 인증
} from "react-icons/md";



export default function ChallengeDetail() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const [challenge, setChallenge] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isHeaderVisible, setIsHeaderVisible] = useState(false);
  const scrollRef = useRef(null);
  const userId = useSelector(state => state.auth.id);
  const BACKEND_BASE_URL = "http://localhost:8080";

    // 공유 기능을 위한 함수
  const handleShare = async () => {
    if (!challenge) {
      alert("공유 정보를 불러오는 중이오.");
      return;
    }

    const shareData = {
      title: `${challenge.challengeTitle} | 노리개 수련`,
      text: `${challenge.challengeTitle}에 함께 참여하여 목표를 달성해 보시오!`,
      url: window.location.href, // 현재 페이지 URL
    };

    try {
      if (navigator.share && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert("이 주소는 공유할 수 없어 클립보드에 복사했소. 원하는 곳에 붙여넣으시오.");
      }
    } catch (err) {
      console.error("공유 기능에 문제가 발생했소.", err);
      alert("공유 기능에 문제가 발생했소. 직접 URL을 복사해 주시오.");
    }
  };

  useEffect(() => {
    if (!challengeId) {
      alert("잘못된 접근이오. 고이 돌아가시오.");
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
        console.error("수련의 상세 내용을 불러오지 못하였소.", err);
        alert("수련 내용을 불러오지 못했소.");
        navigate('/challenge/challengeHome');
      }
    })();
  }, [challengeId, userId, navigate]);

  useEffect(() => {
    if (!challenge) { setTimeLeft(null); return; }
    const start = new Date(challenge.challengeRecruitStartDate);
    const endRaw = new Date(challenge.challengeRecruitEndDate);
    if (isNaN(start) || isNaN(endRaw)) { setTimeLeft(null); return; }
    const end = new Date(endRaw);
    end.setHours(23, 59, 59, 999);
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

  const handleScroll = useMemo(() => {
    let lastScrollY = 0;
    return () => {
      if (!scrollRef.current) return;
      const currentScrollY = scrollRef.current.scrollTop;
      if (currentScrollY > 100 && currentScrollY > lastScrollY) {
        setIsHeaderVisible(true);
      } else if (currentScrollY <= 100) {
        setIsHeaderVisible(false);
      }
      lastScrollY = currentScrollY;
    };
  }, []);

  if (!challenge) return <div className="cdp-loading">짐작하는 중이오...</div>;

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
    challengeMaxMembers = 0,
    challengeCreator,
    profileImage
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
  const recruitEnd = new Date(challengeRecruitEndDate); recruitEnd.setHours(23, 59, 59, 999);
  let status = '모집이 끝났소';
  if (now < recruitStart) status = '모집 예정이오';
  else if (now >= recruitStart && now <= recruitEnd) status = '모집 중이오';
  const isJoinable = status === '모집 중이오' && !userParticipating;
  const buttonText = userParticipating ? '참여하는 중이오' : (status === '모집 중이오' ? '참여하기' : status);
  const navigateToChat = () => navigate(`/challenge/groupchat/${challengeId}`);
  
  const handlePaymentStart = async () => {
    if (!userId) { alert("로그인(인증) 후 이용 가능하오."); navigate('/login'); return; }
    try {
      const res = await apiClient.post(`/challenge/join/payment`, null, {
        params: { userId, challengeId, redirectUrl: `${window.location.origin}/challenge/payment/success` },
      });
      if (res.data?.redirectUrl) {
        window.location.href = res.data.redirectUrl;
      } else {
        alert("납부를 준비하는 데 실패했소.");
      }
    } catch (err) {
      console.error("결제 실패", err);
      alert("납부 과정 중에 오류가 났소: " + (err.response?.data || err.message));
    }
  };
  
  return (
    <div className="cdp-page-layout">
      <header className={`cdp-header ${isHeaderVisible ? 'visible' : ''}`}>
        <button onClick={() => navigate(-1)} className="cdp-header-btn">
          <BsArrowLeft size={24} />
        </button>
        <div className="cdp-header-actions">
          {/* 공유 버튼에 onClick 이벤트 추가 */}
          <button onClick={handleShare} className="cdp-header-btn">
            <BsShare size={20} />
          </button>
        </div>
      </header>
      
      <div className="cdp-content-scrollable" ref={scrollRef} onScroll={handleScroll}>
        <div className="cdp-hero-image-wrapper">
          <img src={imageUrl} alt="수련의 그림" className="cdp-hero-image" />
          <div className="cdp-hero-overlay"></div>
          <div className="cdp-hero-content">
            <div className="cdp-hero-badges">
              {status === '모집 중이오' ? (
                <span className="cdp-badge cdp-badge-dday" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  마감 {timeLeft?.days ?? 0}일 {pad2(timeLeft?.hours ?? 0)}시 {pad2(timeLeft?.minutes ?? 0)}분 {pad2(timeLeft?.seconds ?? 0)}초
                </span>
              ) : (
                <span className={`cdp-badge ${status === '모집 예정이오' ? 'cdp-badge-upcoming' : 'cdp-badge-closed'}`}>{status}</span>
              )}
              <span className="cdp-badge">{challengeDurationDays ?? '-'}일 동안의 수련</span>
            </div>
          </div>
        </div>

        <div className="cdp-content">
          <div className="cdp-info-section">
            <div className="cdp-tags">
              {keywords.length > 0 && (
                keywords.map((k, i) => <span className="tag" key={`k-${i}`}>#{k}</span>)
              )}
            </div>
            <div className="cdp-title-creator">
              <h1 className="cdp-title">{challengeTitle}</h1>
              <div className="cdp-creator">
                <img 
                  src={profileImage || '/src/assets/img/default_profile_img.svg'}
                  alt={`${challengeCreator}님의 프로필 사진`}
                  className="cdp-creator-avatar"
                />
                <span className="text-sm">수련 리더 {challengeCreator}</span>
              </div>
            </div>
            <div className="cdp-stats">
              <div className="cdp-stat-item">
                <BsFillPeopleFill />
                <span className="text-sm">현재 {participantCount} / {challengeMaxMembers}명 참여</span>
              </div>
              <div className="cdp-stat-item">
                <BsCashStack />
                <span className="text-sm">보증금 {challengeDepositAmount.toLocaleString()}원</span>
              </div>
              <div className="cdp-stat-item">
                <BsFillCalendarEventFill />
                <span className="text-sm">{challengeDurationDays}일간 진행</span>
              </div>
            </div>
          </div>

          {challengeDescription && (
            <div className="cdp-detail-section">
              <h2>수련 설명</h2>
              <p className="cdp-description">{challengeDescription}</p>
            </div>
          )}

{/* Norigae – Large Visual + Brief formula under images (사극 말투) */}
<section className="ngx" aria-labelledby="ngx-title">
  <header className="ngx-head">
    <h2 id="ngx-title">노리개 보상 규정</h2>
    <p className="ngx-sub">출석률에 따라 등급이 정해지오.<br /> 날마다 수련을 인증하여 노리개를 거두시오.</p>
  </header>

  {/* 큰 이미지 3개 – 항상 3-up */}
  <div className="ngx-grid">
    <figure className="ngx-item gold" role="group" aria-label="금 노리개 · 100%">
      <img src="/src/assets/img/challenge/norigae/gold.png" alt="금 노리개" loading="lazy" />
      <figcaption>금 · 100% 달성</figcaption>
    </figure>

    <figure className="ngx-item silver" role="group" aria-label="은 노리개 · 80% 이상">
      <img src="/src/assets/img/challenge/norigae/silver.png" alt="은 노리개" loading="lazy" />
      <figcaption>은 · 80% 이상</figcaption>
    </figure>

    <figure className="ngx-item bronze" role="group" aria-label="동 노리개 · 50% 이상">
      <img src="/src/assets/img/challenge/norigae/bronze.png" alt="동 노리개" loading="lazy" />
      <figcaption>동 · 50% 이상</figcaption>
    </figure>
  </div>

  {/* 출석률 계산: 이미지 바로 밑, 얇은 안내문 */}
  <div className="ngx-brief" role="note" aria-label="출석률 계산식">
    {/* <span className="fx">출석률 = (성공 인증 일수 ÷ 전체 인증 가능 일수) × 100</span> */}
    <span className="hint"> 출석률 = (성공 인증 일수 ÷ 전체 인증 가능 일수) × 100 <br /> 출석률은 수련 기간을 바탕으로 헤아리오.</span>
  </div>

  {/* 상세 안내 */}
  <div className="ngx-detail">
    <div className="ngx-block">
      <h3>노리개 지급 규정</h3>
      <p>
        출석률이 <b>50% 이상</b>이면 동, <b>80% 이상</b>이면 은, <b>100%</b>이면 금 노리개를 내어 드리오.
      </p>
    </div>

    <div className="ngx-block">
      <h3>예시</h3>
      <p>30일 중 15일 성공 → <b>50%</b> → <b>동</b> 노리개</p>
      <p>30일 중 24일 성공 → <b>80%</b> → <b>은</b> 노리개</p>
      <p>30일 중 30일 성공 → <b>100%</b> → <b>금</b> 노리개</p>
    </div>

    <div className="ngx-block">
      <h3>유의하시오</h3>
      <p>
        늦은 인증, 수련과 무관한 그림, 도용 인증 등 규정을 어기면 실패로 처리하며,
        중도 포기하거나 실격되면 노리개는 지급되지 않소.
      </p>
    </div>
  </div>
</section>





          
{/* === Verification (Apple/Toss) === */}
<section className="vs-section" aria-labelledby="vs-title">
  <div className="vs-head">
    <h2 id="vs-title" className="vs-title">인증 방식</h2>
    <p className="vs-sub">올바른 인증의 본보기와 규칙을 한눈에 확인하시오</p>
  </div>

  {/* 예시 이미지 2개 */}
  <div className="vs-row">
    <figure className="vs-card bad" role="group" aria-label="잘못된 인증">
      <div className="vs-media">
        <img src="/src/assets/img/challenge/attendance/bad_exam.png" alt="잘못된 인증 예시" />
        <span className="vs-pill bad">
          <MdOutlineCancel className="vs-pill-ic" />
          
        </span>
      </div>
      <figcaption className="vs-caption">수련과 무관 / 시간 미표시</figcaption>
    </figure>

    <figure className="vs-card good" role="group" aria-label="올바른 인증">
      <div className="vs-media">
        <img src="/src/assets/img/challenge/attendance/good_exam.png" alt="올바른 인증 예시" />
        <span className="vs-pill good">
          <MdCheckCircleOutline className="vs-pill-ic" />
          {/* 올바른 방식 */}
        </span>
      </div>
      <figcaption className="vs-caption">수련 물품 + 날짜·시간 표시</figcaption>
    </figure>
  </div>
  
  {/* 규칙: UL, LI 제거하고 div와 span으로 대체 */}
  <div className="vs-rules-list" aria-label="인증 규칙">
    <div className="vs-rule ok">
      <MdCheckCircleOutline className="vs-rule-ic" />
      <span>수련 관련 물품과 함께 촬영</span>
    </div>
    <div className="vs-rule ok">
      <MdCheckCircleOutline className="vs-rule-ic" />
      <span>스마트폰 화면에 <b>날짜·시간</b>이 또렷하게 보이도록</span>
    </div>
    <div className="vs-rule no">
      <MdOutlineCancel className="vs-rule-ic" />
      <span>수련과 무관한 셀카·사물만 찍은 사진</span>
    </div>
    <div className="vs-rule no">
      <MdOutlineCancel className="vs-rule-ic" />
      <span>타인 사진·캡처 등 도용, 혹은 날짜·시간 미표시</span>
    </div>
  </div>
</section>

<section className="memo-section" aria-labelledby="memo-title">
  <h2 id="memo-title" className="memo-title">수련 참여 시 명심해 주시오!</h2>

  <div className="memo-list">
    {/* 환급 */}
    <div className="memo-item">
      <div className="mi-ic bg-mint" aria-hidden="true"><MdSavings size={20} /></div>
      <div className="mi-body">
        <div className="mi-head">보증금 환급</div>
        <p className="mi-text">
          수련을 달성하면 보증금의 전액을 돌려드리오. 다만 수련을 온전히 달성치 못하면 보증금의 50%는
          <b> 대한장애인체육회</b>에 기부되고 있소.
        </p>
      </div>
    </div>

    {/* 마감 시각 */}
    <div className="memo-item">
      <div className="mi-ic bg-sky" aria-hidden="true"><MdSchedule size={20} /></div>
      <div className="mi-body">
        <div className="mi-head">인증 마감 시각</div>
        <p className="mi-text">
          매일 23:59:59 까지 <b>‘나의 수련기록’</b> 페이지에서 인증 사진을 올리고 출석을 인증하시오.
        </p>
      </div>
    </div>

    {/* 중도 포기 */}
    <div className="memo-item">
      <div className="mi-ic bg-violet" aria-hidden="true"><MdLogout size={20} /></div>
      <div className="mi-body">
        <div className="mi-head">중도 포기</div>
        <p className="mi-text">
          수련을 도중에 그만두면 보증금은 반환되지 않소. 뜻을 굳게 세운 뒤 신중히 참여하시오.
        </p>
      </div>
    </div>

    {/* 부적절한 인증 */}
    <div className="memo-item">
      <div className="mi-ic bg-rose" aria-hidden="true"><MdReportGmailerrorred size={20} /></div>
      <div className="mi-body">
        <div className="mi-head">부정 인증 금지</div>
        <p className="mi-text">
          타인의 사진 도용, 수련과 무관한 사진 등은 무효 처리되며 경우에 따라 참여가 제한될 수 있소.
        </p>
      </div>
    </div>
  </div>
</section>

          
          <div className="cdp-detail-section">
            <h2>기부금 안내</h2>
            <ul className="cdp-rules">
              <li>
                <h3 className="rule-title">1. 기부금 책정 기준</h3>
                <p>수련을 성공하지 못하여 환급받지 못하는 보증금의 일부는 기부금으로 사용되오. 기부금의 규모는 수련에 참여한 인원에 따라 결정될 것이오.</p>
              </li>
              <li>
                <h3 className="rule-title">2. 기부 대상</h3>
                <p>수련을 통해 모인 소중한 기부금은 대한장애인체육회에 전달되어, 우리 사회의 귀한 벗들을 돕는 데 쓰일 것이오.</p>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <button
        className={`cdp-cta-btn ${isJoinable ? '' : 'disabled'}`}
        disabled={!isJoinable}
        onClick={() => isJoinable && setShowModal(true)}
      >
        {buttonText}
      </button>

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