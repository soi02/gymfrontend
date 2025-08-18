// src/user/challenge/pages/ChallengeMyRecordDetail.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

import ChallengeProgressDisplay from '../detail/components/ChallengeProgressDisplay';
import ChallengeAttendanceForm from '../detail/components/ChallengeAttendanceForm';
import NorigaeListModal from '../components/NorigaeListModal';

import '../styles/ChallengeMyRecordDetail.css';

import goldNorigae from '../../../assets/img/challenge/norigae/gold.png';
import silverNorigae from '../../../assets/img/challenge/norigae/silver.png';
import bronzeNorigae from '../../../assets/img/challenge/norigae/bronze.png';

const BACKEND_BASE_URL = "http://localhost:8080";

const norigaeImages = {
  '금': goldNorigae,
  '은': silverNorigae,
  '동': bronzeNorigae,
  'gold': goldNorigae,
  'silver': silverNorigae,
  'bronze': bronzeNorigae,
};

const ChallengeMyRecordDetail = () => {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const userId = useSelector(state => state.auth.id);

  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isNorigaeListModalOpen, setIsNorigaeListModalOpen] = useState(false);
  const [attendedTodayLocal, setAttendedTodayLocal] = useState(false);

  const fetchChallengeProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(
        `${BACKEND_BASE_URL}/api/challenge/getChallengeProgressProcess`,
        { params: { userId, challengeId } }
      );
      setProgressData(response.data);
    } catch (err) {
      console.error("챌린지 상세 진행 상황 조회 실패:", err);
      setError("챌린지 진행 상황을 불러오는 데 실패했습니다.");
      setProgressData(null);
    } finally {
      setLoading(false);
    }
  }, [userId, challengeId]);

  useEffect(() => {
    if (!userId) {
      alert("로그인이 필요한 페이지입니다.");
      navigate('/login', { state: { from: `/challenge/challengeMyRecordDetail/${challengeId}` } });
      return;
    }
    fetchChallengeProgress();
  }, [challengeId, userId, navigate, fetchChallengeProgress]);

  const handleOpenNorigaeListModal = () => setIsNorigaeListModalOpen(true);
  const handleCloseNorigaeListModal = () => setIsNorigaeListModalOpen(false);

  // useMemo 훅을 조건부 렌더링 위에 위치시킴
const awardedNorigaeIcon = useMemo(() => {
  if (progressData?.awardedNorigaeName) {
    const norigaeName = progressData.awardedNorigaeName.replace('노리개', '').trim().toLowerCase();
    
    // 로컬 이미지 맵에 키가 존재하는지 먼저 확인
    if (norigaeImages[norigaeName]) {
      return norigaeImages[norigaeName];
    }
  }
  // 로컬 이미지를 찾지 못하면 백엔드 경로 사용 (기존 로직 유지)
  return progressData?.awardedNorigaeIconPath || null;
}, [progressData]);

  // 로딩 중 또는 데이터가 없을 때 렌더링 중단
  if (loading) {
    return <div className="cmd-loading">로딩 중...</div>;
  }
  
  if (error || !progressData) {
    return <div className="cmd-error">{error || "챌린지 정보를 찾을 수 없습니다."}</div>;
  }

  // ===== 뷰 계산 =====
  // 이제 progressData가 null이 아님을 보장
  const total = Number(progressData.totalPeriod) || 0;
  const done = Number(progressData.myAchievement) || 0;
  const progressPct = total > 0 ? Math.round((done / total) * 100) : 0;

  const attendedTodayServer = progressData.challengeAttendanceStatus?.some(
    (status) => status.isToday && status.isAchieved
  );

  const attendedToday = attendedTodayServer || attendedTodayLocal;

  const handleAttendanceSuccess = async () => {
    setAttendedTodayLocal(true);
    await fetchChallengeProgress();
  };

  return (
    <div className="cmd-page">
      {/* ... (이하 JSX 코드 동일) ... */}
      <header className="cmd-hero">
        <button className="cmd-back" onClick={() => navigate(-1)} aria-label="뒤로 가기">←</button>

        <div className="cmd-hero-main">
          <h1 className="cmd-title">{progressData.challengeTitle}</h1>
          <p className="cmd-sub">총 {total}일 중 {done}회 달성 · 진행률 {progressPct}%</p>

          <div className="cmd-progress">
            <div className="cmd-progress-bar" style={{ width: `${progressPct}%` }} />
          </div>

          <div className="cmd-hero-actions">
            <button
              className={`cmd-cta ${attendedToday ? 'done' : ''}`}
              disabled={attendedToday}
              onClick={() => {
                document.querySelector('#cmd-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }}
            >
              {attendedToday ? '오늘 인증 완료' : '오늘 인증하기'}
            </button>

            <button className="cmd-ghost" onClick={handleOpenNorigaeListModal}>
              획득 뱃지 보기
            </button>
          </div>
        </div>

        {awardedNorigaeIcon && (
          <img
            src={awardedNorigaeIcon}
            alt={progressData.awardedNorigaeName || '노리개'}
            className="cmd-badge"
          />
        )}
      </header>

      <main className="cmd-body">
        <section className="cmd-section">
          <h2 className="cmd-sec-title">나의 수련 현황</h2>
          <div className="cmd-card">
            <ChallengeProgressDisplay statusList={progressData.challengeAttendanceStatus} />
          </div>
        </section>

        <section className="cmd-section" id="cmd-form">
          <h2 className="cmd-sec-title">오늘의 인증</h2>
          {attendedToday ? (
            <div className="cmd-card cmd-card-center">
              <div className="cmd-done-badge">오늘 인증을 완료했어요 👏</div>
              <button className="cmd-ghost" onClick={handleOpenNorigaeListModal}>
                내 노리개 확인
              </button>
            </div>
          ) : (
            <div className="cmd-card">
              <ChallengeAttendanceForm
                challengeId={challengeId}
                userId={userId}
                onAttendanceSuccess={handleAttendanceSuccess}
                hasAttendedToday={attendedToday}
              />
            </div>
          )}
        </section>
      </main>

  <NorigaeListModal
    isOpen={isNorigaeListModalOpen}
    onClose={handleCloseNorigaeListModal}
    norigaeList={progressData.awardedNorigaeList}
  />
    </div>
  );
};

export default ChallengeMyRecordDetail;