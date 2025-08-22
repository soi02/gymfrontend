// src/pages/ChallengeMyRecordList.jsx
import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

import MyCategoryDonutPanel from '../components/MyCategoryDonutPanel';

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

  // ⚠️ 실제 auth 구조에 맞게 확인: state.auth.id / state.auth.user?.id 등
  const userId = useSelector((s) => s.auth?.id);
  const userName = useSelector((s) => s.auth?.name || '사용자');

  // 실제 데이터
  const [myChallengeList, setMyChallengeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasTried, setHasTried] = useState(false);
  const [error, setError] = useState(null);

  // ── fetch: userId가 준비된 뒤에만 호출
  useEffect(() => {
    console.log('[DEBUG] userId from redux =', userId);

    if (userId == null) {
      // 아직 auth 미세팅 상태: 로딩 유지
      return;
    }

    const fetchMyChallengeList = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('[DEBUG] fetching my challenge list with userId =', userId);

        const res = await axios.get(
          `${BACKEND_BASE_URL}/api/challenge/getAllMyChallengeListProcess`,
          { params: { userId: Number(userId) } }
        );

        const data = res?.data || [];
        console.log('[DEBUG] response length =', data.length);
        if (data.length > 0) console.table(data.slice(0, 5));

        setMyChallengeList(data);
      } catch (err) {
        console.error('[DEBUG] fetch error', err);
        setError('나의 챌린지 목록을 불러오는 데 실패했습니다.');
      } finally {
        setLoading(false);
        setHasTried(true);
      }
    };

    fetchMyChallengeList();
  }, [userId]);

  // ── 유틸
  const ratioOf = (ch) => {
    const dur = Number(ch.challengeDurationDays) || 0;
    const done = Number(ch.daysAttended) || 0;
    return dur > 0 ? Math.min(1, Math.max(0, done / dur)) : 0;
  };

  const thumbOf = (ch) => {
    const p = ch?.challengeThumbnailPath;
    return p ? `${BACKEND_BASE_URL}${p}` : '/images/default-thumbnail.png';
  };

  // ── KPI 요약(실데이터 기반)
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

  // ── auth 아직 모를 때: 네트워크 호출 대기
  if (userId == null) {
    return (
      <div className="cmrl-new-page cl-new-container">
        <div className="cmrl-new-loading">준비 중…</div>
      </div>
    );
  }

  return (
    <div className="cmrl-new-page cl-new-container">
      {/* Header */}
      <header className="cmrl-new-header">
        <div className="cmrl-new-header-top">
          <h2 className="cmrl-new-title">{userName}님의 수련 기록</h2>
          <button
            className="cmrl-new-link-btn"
            onClick={() => navigate('/challenge/create')}
          >
            새 수련 만들기 <MdChevronRight />
          </button>
        </div>
        <p className="cmrl-new-sub">오늘 해야 할 일과 진행 상황을 한눈에 확인하세요</p>
      </header>

      {/* Body */}
      <main className="cmrl-new-body">
        {loading ? (
          <div className="cmrl-new-loading">불러오는 중…</div>
        ) : error ? (
          <div className="cmrl-new-error">{error}</div>
        ) : (
          <>
            {/* 로그인 안 했거나 데이터가 정말 없을 때 안내 */}
            {myChallengeList.length === 0 && hasTried && (
              <div className="cmrl-new-section">
                <div className="cmrl-new-card">
                  <div className="cmrl-new-empty">
                    수련 데이터가 없습니다. 로그인 상태나 참여 중인 수련을 확인해 주세요.
                    <div style={{ marginTop: 10 }}>
                      <button
                        className="cmrl-new-btn-primary"
                        onClick={() => navigate('/login', { state: { from: location.pathname } })}
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
              <div className="cmrl-new-tile">
                <div className="cmrl-new-tile-head">참여 중</div>
                <div className="cmrl-new-tile-val">{stats.inProgress}</div>
              </div>
              <div className="cmrl-new-tile">
                <div className="cmrl-new-tile-head">참여 완료</div>
                <div className="cmrl-new-tile-val">{stats.completed}</div>
              </div>
              <div className="cmrl-new-tile">
                <div className="cmrl-new-tile-head">오늘 인증</div>
                <div className="cmrl-new-tile-val">
                  {stats.todayDone} <span className="cmrl-new-subtxt">/ {stats.inProgress}</span>
                </div>
              </div>
              <div className="cmrl-new-tile">
                <div className="cmrl-new-tile-head">평균 진행률</div>
                <div className="cmrl-new-tile-val">{stats.avgProgressPct}%</div>
              </div>
            </section>

            {/* CTA */}
            <div className="cmrl-new-cta">
              <button
                className="cmrl-new-btn-primary"
                onClick={() => navigate('/challenge/challengeMyList')}
              >
                오늘 인증하러 가기
              </button>
            </div>

            {/* ★ 카테고리 미니 도넛 + 8개 레전드 + 클릭 시 리스트(실데이터) */}
            <MyCategoryDonutPanel
              myChallengeList={myChallengeList}
              navigate={navigate}
              thumbOf={thumbOf}
            />
          </>
        )}
      </main>
    </div>
  );
}
