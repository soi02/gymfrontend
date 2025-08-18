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

const BACKEND_BASE_URL = 'http://localhost:8080';

const norigaeImages = {
  금: goldNorigae,
  은: silverNorigae,
  동: bronzeNorigae,
  gold: goldNorigae,
  silver: silverNorigae,
  bronze: bronzeNorigae,
};

export default function ChallengeMyRecordDetail() {
  const { challengeId } = useParams();
  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);

  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isNorigaeListModalOpen, setIsNorigaeListModalOpen] = useState(false);
  const [attendedTodayLocal, setAttendedTodayLocal] = useState(false);

  const fetchChallengeProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BACKEND_BASE_URL}/api/challenge/getChallengeProgressProcess`, {
        params: { userId, challengeId },
      });
      setProgressData(res.data);
    } catch (e) {
      console.error(e);
      setError('챌린지 진행 상황을 불러오는 데 실패했습니다.');
      setProgressData(null);
    } finally {
      setLoading(false);
    }
  }, [userId, challengeId]);

  useEffect(() => {
    if (!userId) {
      alert('로그인이 필요한 페이지입니다.');
      navigate('/login', { state: { from: `/challenge/challengeMyRecordDetail/${challengeId}` } });
      return;
    }
    fetchChallengeProgress();
  }, [challengeId, userId, navigate, fetchChallengeProgress]);

  const handleOpenNorigaeListModal = () => setIsNorigaeListModalOpen(true);
  const handleCloseNorigaeListModal = () => setIsNorigaeListModalOpen(false);

  // 노리개 아이콘: 로컬 리소스 우선, 없으면 서버 경로 사용
  const awardedNorigaeIcon = useMemo(() => {
    if (progressData?.awardedNorigaeName) {
      const key = progressData.awardedNorigaeName.replace('노리개', '').trim().toLowerCase();
      if (norigaeImages[key]) return norigaeImages[key];
    }
    return progressData?.awardedNorigaeIconPath || null;
  }, [progressData]);

  if (loading) return <div className="crd-loading">불러오는 중…</div>;
  if (error || !progressData) return <div className="crd-error">{error || '챌린지 정보를 찾을 수 없습니다.'}</div>;

  // ===== Derived =====
  const total = Number(progressData.totalPeriod) || 0;
  const done = Number(progressData.myAchievement) || 0;
  const progressPct = total > 0 ? Math.round((done / total) * 100) : 0;

  const attendedTodayServer = progressData.challengeAttendanceStatus?.some(
    (s) => s.isToday && s.isAchieved
  );
  const attendedToday = attendedTodayServer || attendedTodayLocal;

  const handleAttendanceSuccess = async () => {
    setAttendedTodayLocal(true); // 즉시 잠금
    await fetchChallengeProgress();
  };

  return (
    <div className="crd-page">
      {/* ===== Top Bar ===== */}
      <div className="crd-topbar">
        <button className="crd-back" onClick={() => navigate(-1)} aria-label="뒤로 가기">&lt;</button>
        <div className="crd-top-title">나의 수련기록</div>
        <div className="crd-top-spacer" />
      </div>

      {/* ===== Hero ===== */}
      <header className="crd-hero">
        <h1 className="crd-title">{progressData.challengeTitle}</h1>
        <p className="crd-sub">총 {total}일 중 {done}회 달성 · 진행률 {progressPct}%</p>

        {/* Progress */}
        {/* <div className="crd-progress">
          <div className="crd-progress-bar" style={{ width: `${progressPct}%` }} />
        </div> */}

        {/* Quick facts & Norigae */}
        {/* <div className="crd-quick">
          <div className="crd-chip"><span className="crd-k">기간</span><span className="crd-v">{total}일</span></div>
          <div className="crd-chip"><span className="crd-k">달성</span><span className="crd-v">{done}회</span></div>
          <div className="crd-chip"><span className="crd-k">진행률</span><span className="crd-v">{progressPct}%</span></div>

          {awardedNorigaeIcon && (
            <button className="crd-chip crd-chip-pill" onClick={handleOpenNorigaeListModal} aria-label="획득 노리개 보기">
              <img className="crd-chip-img" src={awardedNorigaeIcon} alt="" />
              <span className="crd-v">{progressData.awardedNorigaeName || '노리개'}</span>
            </button>
          )}
        </div> */}

        {/* Actions */}
        <div className="crd-actions">
          <button
            className={`crd-cta ${attendedToday ? 'done' : ''}`}
            disabled={attendedToday}
            onClick={() => document.querySelector('#crd-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
          >
            {attendedToday ? '오늘 인증 완료' : '오늘 인증하기'}
          </button>

          <button className="crd-ghost" onClick={handleOpenNorigaeListModal}>
            획득 뱃지 보기
          </button>
        </div>
      </header>

      {/* ===== Body ===== */}
      <main className="crd-body">
        <section className="crd-section">
          {/* <h2 className="crd-sec-title">나의 수련 현황</h2> */}
          <div className="crd-card">
            {/* N일 보드(7/14/20/30)에 맞추고 싶으면 totalDays 전달 */}
            <ChallengeProgressDisplay
              statusList={progressData.challengeAttendanceStatus}
              totalDays={total || undefined}
            />
          </div>
        </section>

        <section className="crd-section" id="crd-form">
          {/* <h2 className="crd-sec-title">오늘의 인증</h2> */}
          {attendedToday ? (
            <div className="crd-card crd-card-center">
              <div className="crd-done-badge">오늘의 수련 인증 완료!</div>
                  <p className="crd-help-text">
                        달력의 날짜를 누르면 사진을 확인할 수 있소.
                    </p>
            </div>
          ) : (
            <div className="crd-card">
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

      {/* Norigae Modal */}
      <NorigaeListModal
        isOpen={isNorigaeListModalOpen}
        onClose={handleCloseNorigaeListModal}
        norigaeList={progressData.awardedNorigaeList}
      />
    </div>
  );
}
