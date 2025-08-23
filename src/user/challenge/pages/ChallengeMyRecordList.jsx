// src/pages/ChallengeMyRecordList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import MyCategoryDonutPanel from '../components/MyCategoryDonutPanel';
import DailyCompletionLineChart from '../components/DailyCompletionLineChart';


/* 스타일 */
import '../styles/ChallengeList.css';
import '../styles/MyChallengeCard.css';
import '../styles/ChallengeMyRecordList.css';
import '../styles/ChallengeMyRecordListNew.css';

/* 아이콘 */
import { MdChevronRight } from 'react-icons/md';

const BACKEND_BASE_URL = 'http://localhost:8080';

export default function ChallengeMyRecordList() {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = useSelector((s) => s.auth?.id);
  const userName = useSelector((s) => s.auth?.name || '사용자');

  const [myChallengeList, setMyChallengeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasTried, setHasTried] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (userId == null) return;

    const fetchMyChallengeList = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get(
          `${BACKEND_BASE_URL}/api/challenge/getAllMyChallengeListProcess`,
          { params: { userId: Number(userId) } }
        );

        const data = res?.data || [];
        setMyChallengeList(data);

         console.log('챌린지 데이터:', data); 
      } catch (err) {
        console.error('[ChallengeMyRecordList] fetch error', err);
        setError('나의 챌린지 목록을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
        setHasTried(true);
      }
    };

    fetchMyChallengeList();
  }, [userId]);

  const thumbOf = (ch) => {
    const p = ch?.challengeThumbnailPath;
    return p ? `${BACKEND_BASE_URL}${p}` : '/images/default-thumbnail.png';
  };

  const stats = useMemo(() => {
    const total = myChallengeList.length;
    let inProgress = 0, completed = 0, todayDone = 0, sumRatio = 0;

    myChallengeList.forEach((ch) => {
      const dur = Number(ch.challengeDurationDays) || 0;
      const done = Number(ch.daysAttended) || 0;

      if (dur > 0 && done >= dur) completed += 1;
      else if (dur > 0) inProgress += 1;

      if (ch.todayAttended) todayDone += 1;
      if (dur > 0) sumRatio += Math.min(1, Math.max(0, done / dur));
    });

    const avgProgressPct = total ? Math.round((sumRatio / total) * 100) : 0;
    return { inProgress, completed, todayDone, avgProgressPct };
  }, [myChallengeList]);

  const kpiIconMap = {
    inProgress: '/src/assets/img/challenge/myChallengeIcon/play.png',
    completed: '/src/assets/img/challenge/myChallengeIcon/congrat.png',
    todayDone: '/src/assets/img/challenge/myChallengeIcon/today.png',
    avgProgressPct: '/src/assets/img/challenge/myChallengeIcon/progress.png',
  };

  if (userId == null) {
    return (
      <div className="cmrl-new-page cl-new-container">
        <div className="cmrl-new-loading">준비 중…</div>
      </div>
    );
  }

  return (
    <div className="cmrl-new-page cl-new-container">
      <header className="cmrl-new-header">
        <div className="cmrl-new-header-top">
          <h2 className="cmrl-new-title">{userName}님의 수련 기록</h2>

        </div>
        <p className="cmrl-new-sub">오늘 해야 할 일과 진행 상황을 한눈에 확인하시오</p>
      </header>

      <main className="cmrl-new-body">
        {loading ? (
          <div className="cmrl-new-loading">불러오는 중…</div>
        ) : error ? (
          <div className="cmrl-new-error">{error}</div>
        ) : (
          <>
            {myChallengeList.length === 0 && hasTried && (
              <div className="cmrl-new-section">
                <div className="cmrl-new-card">
                  <div className="cmrl-new-empty">
                    수련 데이터가 없소. 로그인 상태나 참여 중인 수련을 확인해 주시오.
                    <div style={{ marginTop: 10 }}>
                      <button
                        className="cmrl-new-btn-primary"
                        onClick={() =>
                          navigate('/login', { state: { from: location.pathname } })
                        }
                      >
                        로그인하기
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* KPI 타일 */}
            <section className="cmrl-new-grid4">
              <div className="cmrl-new-tile kpi kpi--progress">
                <div>
                  <div className="cmrl-new-tile-head">참여 중</div>
                  <div className="cmrl-new-tile-val">{stats.inProgress}</div>
                </div>
                {/* <img className="cmrl-new-tile-icon" src={kpiIconMap.inProgress} alt="" /> */}
              </div>

              <div className="cmrl-new-tile kpi kpi--done">
                <div>
                  <div className="cmrl-new-tile-head">참여 완료</div>
                  <div className="cmrl-new-tile-val">{stats.completed}</div>
                </div>
                {/* <img className="cmrl-new-tile-icon" src={kpiIconMap.completed} alt="" /> */}
              </div>

              <div className="cmrl-new-tile kpi kpi--today">
                <div>
                  <div className="cmrl-new-tile-head">오늘 인증</div>
                  <div className="cmrl-new-tile-val">
                    {stats.todayDone} <span className="cmrl-new-subtxt">/ {stats.inProgress}</span>
                  </div>
                </div>
                {/* <img className="cmrl-new-tile-icon" src={kpiIconMap.todayDone} alt="" /> */}
              </div>

              <div className="cmrl-new-tile kpi kpi--avg">
                <div>
                  <div className="cmrl-new-tile-head">평균 진행률</div>
                  <div className="cmrl-new-tile-val">{stats.avgProgressPct}%</div>
                </div>
                {/* <img className="cmrl-new-tile-icon" src={kpiIconMap.avgProgressPct} alt="" /> */}
              </div>
            </section>

            <div className="cmrl-new-cta">
              <button
                className="cmrl-new-btn-primary"
                onClick={() => navigate('/challenge/challengeMyList')}
              >
                오늘 인증하러 가기
              </button>
            </div>

            <MyCategoryDonutPanel
              myChallengeList={myChallengeList}
              navigate={navigate}
              thumbOf={thumbOf}
            />

            {/* 일별 인증 통계 그래프 추가 */}
    {myChallengeList.length > 0 && <DailyCompletionLineChart myChallengeList={myChallengeList} />}


          </>
        )}
      </main>
    </div>
  );
}
