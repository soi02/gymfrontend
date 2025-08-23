// src/pages/ChallengeMyListPage.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MdOutlineChevronLeft } from "react-icons/md";

import '../styles/ChallengeMyListPage.css';

const BACKEND_BASE_URL = 'http://localhost:8080';

const TABS = [
  { key: 'todo', label: '인증 미완료' },
  { key: 'done', label: '인증 완료' },
];

/* ---------- 날짜/진행 유틸 ---------- */
function toDateSafe(src) {
  if (!src) return null;
  if (src instanceof Date) return src;
  if (typeof src === 'string') {
    const s = /\d{4}-\d{2}-\d{2}$/.test(src) ? `${src}T00:00:00` : src;
    const d = new Date(s);
    return Number.isNaN(d) ? null : d;
  }
  const d = new Date(src);
  return Number.isNaN(d) ? null : d;
}
function addDays(d, n) {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}
function fmtYmd(d) {
  return d
    ? d.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.\s/g, '.')
    : null;
}
function ratioOf(ch) {
  const dur = Number(ch.challengeDurationDays) || 0;
  const done = Number(ch.daysAttended) || 0;
  return dur > 0 ? Math.min(1, Math.max(0, done / dur)) : 0;
}
function periodOf(ch) {
  const startRaw = ch.personalJoinDate || ch.challengeStartDate || ch.challengeRecruitStartDate || ch.createdAt;
  const start = toDateSafe(startRaw);
  const total = Number(ch.challengeDurationDays) || 0;
  if (!start || total <= 0) return null;
  const end = addDays(start, total - 1);
  const done = Math.min(Math.max(Number(ch.daysAttended) || 0, 0), total);
  return {
    startText: fmtYmd(start),
    endText: fmtYmd(end),
    remain: Math.max(total - done, 0),
    total,
  };
}

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
        const res = await axios.get(`${BACKEND_BASE_URL}/api/challenge/getAllMyChallengeListProcess`, {
          params: { userId },
        });
        const inProgressList = (res.data || []).filter((ch) => {
          const dur = Number(ch.challengeDurationDays) || 0;
          const done = Number(ch.daysAttended) || 0;
          return dur > 0 && done < dur;
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

  const { todoList, doneList } = useMemo(() => {
    const todo = [],
      done = [];
    for (const ch of myChallengeList) (ch.todayAttended ? done : todo).push(ch);
    return { todoList: todo, doneList: done };
  }, [myChallengeList]);

  const activeList = activeTab === 'done' ? doneList : todoList;

  return (
    <div className="cmlp-page">
      {/* ✅ 헤더 구조를 다시 변경하여 제목과 버튼을 같은 라인에 위치시킴 */}
      <header className="cmlp-header-main">
        <button className="cmlp-back-btn" onClick={() => navigate(-1)} aria-label="뒤로 가기">
          <MdOutlineChevronLeft size={24} />
        </button>
        <h2 className="cmlp-title">오늘의 수련 인증</h2>
      </header>
      {/* ✅ 부제목은 별도 p 태그로 분리 */}
      <p className="cmlp-sub">오늘 인증해야 할 챌린지를 한 눈에 확인하시오</p>

      <main className="cmlp-body">
        <section className="cmlp-section">
          <div className="cmlp-segmented">
            {TABS.map((t) => {
              const count = t.key === 'done' ? doneList.length : todoList.length;
              const isActive = activeTab === t.key;
              return (
                <button
                  key={t.key}
                  className={`cmlp-segmented-item ${isActive ? 'active' : ''}`}
                  onClick={() => setActiveTab(t.key)}
                  type="button"
                >
                  <span>{t.label}</span>
                  <span className="cmlp-seg-count">{count}</span>
                </button>
              );
            })}
          </div>
        </section>

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
          <ul className="cmlp-media-list">
            {activeList.map((ch) => {
              const p = periodOf(ch);
              const pct = Math.round(ratioOf(ch) * 100);
              return (
                <li
                  key={ch.challengeId}
                  className="cmlp-media"
                  role="button"
                  onClick={() => navigate(`/challenge/challengeMyRecordDetail/${ch.challengeId}`)}
                >
                  <div className="cmlp-media-thumb">
                    <img src={ch.challengeThumbnailPath} alt="" loading="lazy" decoding="async" />
                  </div>

                  <div className="cmlp-media-card">
                    <div className="cmlp-media-head">
                      <div className="cmlp-media-title">{ch.challengeTitle || '제목 없음'}</div>
                      <div className="cmlp-media-chevron" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="20" height="20">
                          <path
                            d="M9 6l6 6-6 6"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    <div className="cmlp-media-meta">
                      <span className="meta">{p ? `${p.startText} ~ ${p.endText}` : '기간 미정'}</span>
                      <span className="dot">·</span>
                      <span className="meta-strong">진행률 {pct}%</span>
                    </div>

                    <div className="cmlp-media-actions">
                      <button
                        className="cmlp-pill cmlp-pill-primary"
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/challenge/auth/${ch.challengeId}`);
                        }}
                      >
                        인증하기
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}