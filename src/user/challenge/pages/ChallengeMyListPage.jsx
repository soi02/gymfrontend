import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MyChallengeCard from '../components/MyChallengeCard';

import '../styles/ChallengeMyListPage.css';
import '../styles/MyChallengeCard.css';

const BACKEND_BASE_URL = 'http://localhost:8080';

const TABS = [
  { key: 'todo', label: '인증 미완료' },
  { key: 'done', label: '인증 완료' },
];

export default function ChallengeMyListPage() {
  const [myChallengeList, setMyChallengeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('todo');

  const navigate = useNavigate();
  const userId = useSelector((state) => state.auth.id);

  useEffect(() => {
    const fetchMyChallengeList = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BACKEND_BASE_URL}/api/challenge/getAllMyChallengeListProcess`,
          { params: { userId } }
        );

        // 진행 중인 챌린지(기간 내 & 아직 전체 완료 전)
        const inProgressList = (res.data || []).filter((ch) => {
          const dur = Number(ch.challengeDurationDays) || 0;
          const doneDays = Number(ch.daysAttended) || 0;
          return dur > 0 && doneDays < dur;
        });

        setMyChallengeList(inProgressList);
      } catch (e) {
        console.error(e);
        setError('참여중 챌린지를 불러오지 못했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchMyChallengeList();
  }, [userId]);

  // 탭별 필터링 (todayAttended: true = 완료, false = 미완료)
  const { todoList, doneList } = useMemo(() => {
    const todo = [];
    const done = [];
    for (const ch of myChallengeList) {
      if (ch.todayAttended) done.push(ch);
      else todo.push(ch);
    }
    return { todoList: todo, doneList: done };
  }, [myChallengeList]);

  const activeList = activeTab === 'done' ? doneList : todoList;

  return (
    <div className="cmlp-page">
      {/* 고정 헤더 */}
      <header className="cmlp-sticky-header">
        <button
          className="ch-my-back-button"
          aria-label="뒤로가기"
          onClick={() => navigate(-1)}
        >
          &lt;
        </button>

        <div className="cmlp-header-title-wrap">
          <h2 className="cmlp-title">오늘의 수련 인증</h2>
          <p className="cmlp-sub">오늘 인증해야 할 챌린지를 한 눈에 확인하시오.</p>
        </div>
      </header>

      {/* 고정 필터(세그먼티드 컨트롤) */}
      <div className="cmlp-sticky-filter">
        <div className="segmented">
          {TABS.map((t) => {
            const count = t.key === 'done' ? doneList.length : todoList.length;
            const isActive = activeTab === t.key;
            return (
              <button
                key={t.key}
                className={`segmented-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(t.key)}
                type="button"
              >
                <span>{t.label}</span>
                <span className="seg-count">{count}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 본문 */}
      <main className="cmlp-body">
        {loading && <p className="cmlp-empty-text">불러오는 중...</p>}
        {!loading && error && <p className="cmlp-empty-text">{error}</p>}

        {!loading && !error && activeList.length === 0 && (
          <p className="cmlp-empty-text">
            {activeTab === 'done'
              ? '오늘 인증을 완료한 챌린지가 없소.'
              : '오늘 인증해야 할 챌린지가 없소.'}
          </p>
        )}

        {!loading && !error && activeList.length > 0 && (
          <section className="cmlp-card-list-container">
            {activeList.map((ch) => (
              <MyChallengeCard
                key={ch.challengeId}
                challenge={ch}
                isTodayAttended={ch.todayAttended}
                onClick={() =>
                  navigate(`/challenge/challengeMyRecordDetail/${ch.challengeId}`)
                }
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
