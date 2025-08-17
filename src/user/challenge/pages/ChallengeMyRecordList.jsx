// src/pages/ChallengeMyRecordList.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MyChallengeCard from '../components/MyChallengeCard';
import '../styles/ChallengeList.css';
import '../styles/MyChallengeCard.css';

import goldImg from '/src/assets/img/challenge/norigae/gold.png';
import silverImg from '/src/assets/img/challenge/norigae/silver.png';
import bronzeImg from '/src/assets/img/challenge/norigae/bronze.png';

import { 
  FaFire, // 불꽃 아이콘
  FaUsers, // 사람 아이콘
  FaMapMarkedAlt, // 지도 아이콘
  FaLightbulb // 전구 아이콘
} from 'react-icons/fa';



const BACKEND_BASE_URL = "http://localhost:8080";

const ChallengeMyRecordList = () => {
  const [myChallengeList, setMyChallengeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();
  const userId = useSelector(state => state.auth.id);
  const userName = useSelector(state => state.auth.name) || '사용자';

  const listRef = useRef(null);                    // ⬅️ 목록 섹션 참조
  const goToList = () => {
    listRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };


  useEffect(() => {
    if (!userId) {
      alert("이곳은 짐마당의 백성들만 들어올 수 있소. 장부에 이름을 등록해주시오.");
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    const fetchMyChallengeList = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(
          `${BACKEND_BASE_URL}/api/challenge/getAllMyChallengeListProcess`,
          { params: { userId } }
        );
        setMyChallengeList(res.data || []);
      } catch (err) {
        console.error(err);
        setError("나의 챌린지 목록을 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchMyChallengeList();
  }, [userId, navigate, location.pathname]);

  if (!userId) return null;






// ---- 통계 계산 ----
const stats = useMemo(() => {
  const total = myChallengeList.length;
  if (total === 0) {
    return {
      total,
      avgProgressPct: 0,
      todayDone: 0,
      todayTodo: 0,
      completed: 0,
      nearestEndD: null,
      categories: [],
      topCategory: null,
      norigae: { gold: 0, silver: 0, bronze: 0 },
      sumAttended: 0,
      inProgress: 0,     // ✅ 추가
    };
  }

  let sumRatio = 0, todayDone = 0, completed = 0, nearestEndD = null;
  const catCount = new Map();
  let gold = 0, silver = 0, bronze = 0;
  let sumAttended = 0;

  myChallengeList.forEach(ch => {
    const dur  = Number(ch.challengeDurationDays) || 0;
    const done = Number(ch.daysAttended) || 0;

    if (dur > 0) sumRatio += Math.min(1, Math.max(0, done / dur));
    if (ch.todayAttended) todayDone += 1;
    if (dur > 0 && done >= dur) completed += 1;

    const start = ch.personalJoinDate ? new Date(ch.personalJoinDate) : null;
    if (start && dur > 0) {
      const end = new Date(start); end.setDate(end.getDate() + dur - 1);
      const now = new Date();
      const dLeft = Math.ceil((end.getTime() - now.getTime()) / (1000*60*60*24));
      if (nearestEndD === null || dLeft < nearestEndD) nearestEndD = dLeft;
    }



    const tier = Number(ch.awardedTierId);
    if (tier === 3) gold += 1;
    else if (tier === 2) silver += 1;
    else if (tier === 1) bronze += 1;

    sumAttended += done;
  });

  const avgProgressPct = Math.round((sumRatio / total) * 100);
  const todayTodo = total - todayDone;
  const categories = Array.from(catCount.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
  const topCategory = categories[0]?.name || null;

  return {
    total, avgProgressPct, todayDone, todayTodo, completed, nearestEndD,
    categories, topCategory, norigae: { gold, silver, bronze },
    sumAttended,
    inProgress: Math.max(0, total - completed),   // ✅ 참여 중 = 전체 - 완료
  };
}, [myChallengeList]);


// ---- 게이지 정의 ----
const gauge = useMemo(() => {
  const size = 90;              // 원형 게이지 크기 (px)
  const stroke = 8;             // 선 두께
  const r = (size - stroke) / 2; 
  const c = 2 * Math.PI * r;    // 원 둘레
  const pct = stats.avgProgressPct || 0; 
  const dash = (pct / 100) * c;

  return { size, stroke, r, c, pct, dash };
}, [stats.avgProgressPct]);


// ---- 헬퍼: D-Day/비율/썸네일 ----
const ddayOf = (ch) => {
  const dur = Number(ch.challengeDurationDays) || 0;
  const start = ch.personalJoinDate ? new Date(ch.personalJoinDate) : null;
  if (!start || dur <= 0) return null;
  const end = new Date(start); end.setDate(end.getDate() + dur - 1);
  const now = new Date();
  return Math.ceil((end - now) / (1000*60*60*24));
};
const ratioOf = (ch) => {
  const dur = Number(ch.challengeDurationDays) || 0;
  const done = Number(ch.daysAttended) || 0;
  return dur > 0 ? Math.min(1, Math.max(0, done / dur)) : 0;
};
const thumbOf = (ch) => {
  const p = ch?.challengeThumbnailPath;
  return p ? `${BACKEND_BASE_URL}${p}` : '/images/default-thumbnail.png';
};

// ---- 목록 계산 ----
const inProgressList = useMemo(
  () => myChallengeList.filter(ch => {
    const dur = Number(ch.challengeDurationDays)||0;
    const done = Number(ch.daysAttended)||0;
    return dur > 0 && done < dur;
  }),
  [myChallengeList]
);

const todayPendingList = useMemo(
  () => inProgressList.filter(ch => !ch.todayAttended).slice(0, 3),
  [inProgressList]
);

const nearestDeadlineList = useMemo(
  () => inProgressList
        .map(ch => ({ ch, d: ddayOf(ch) }))
        .filter(x => x.d !== null)
        .sort((a, b) => a.d - b.d)
        .slice(0, 3)
        .map(x => x.ch),
  [inProgressList]
);







return (
  <div className="ccp-page">
    {/* ===== Header ===== */}
    <div className="ccp-header">
      <h2 className="ccp-title">나의 수련 기록</h2>
      <p className="ccp-sub">참여 현황과 오늘 인증을 한눈에 확인하시오</p>
    </div>

    {/* ccp-body를 스크롤 가능한 콘텐츠 영역으로 사용 */}
    <div className="ccp-body">

      {/* ===== 카드 그룹 1: 3개 ===== */}
      <section className="grid3">
        {/* 1. 참여 중 */}
        <div className="tile dark center">
          <div className="tile-head">참여 중</div>
          <div className="tile-body" style={{ flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
            <span className="big">{stats.inProgress}</span>
          </div>
        </div>

        {/* 2. 참여 완료 */}
        <div className="tile dark center">
          <div className="tile-head">참여 완료</div>
          <div className="tile-body" style={{ flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
            <span className="big">{stats.completed}</span>
          </div>
        </div>

      {/* 3. 오늘 인증 */}
      <div className="tile dark center">
        <div className="tile-head">오늘 인증</div>
        <div className="tile-body" style={{ flexDirection: 'column', gap: '4px', marginTop: '6px' }}>
          <div>
            <span className="big">{stats.todayDone}</span>
            <span className="sub"> / {stats.inProgress}</span>
          </div>
        </div>
      </div>

      </section>

      {/* CTA: 오늘 인증하기 (폭 100%, 좌우 20px 여백 안에서 꽉 차게) */}
      <button
        className="t-cta primary full"
        onClick={() => navigate('/challenge/challengeMyList')}
      >
        오늘의 수련을 인증하겠소
      </button>

      {/* === 노리개 월릿 카드 (기존 섹션 감싸기만 변경) === */}
      <div className="section-card wallet">
        <div className="section-head">
          <h4>보유 노리개 현황</h4>
          <button className="link-btn" onClick={() => navigate('/challenge/norigae')}>자세히</button>
        </div>
        <div className="wallet-row">
          <div className="wallet-cell">
            <img src={goldImg} alt="금 노리개" />
            <div className="wc-title">금</div>
            <div className="wc-val">{stats.norigae.gold}</div>
          </div>
          <div className="wallet-cell">
            <img src={silverImg} alt="은 노리개" />
            <div className="wc-title">은</div>
            <div className="wc-val">{stats.norigae.silver}</div>
          </div>
          <div className="wallet-cell">
            <img src={bronzeImg} alt="동 노리개" />
            <div className="wc-title">동</div>
            <div className="wc-val">{stats.norigae.bronze}</div>
          </div>
        </div>
      </div>

      {/* === 섹션: 오늘 인증 가능한 수련 === */}
      <div className="section-card">
        <div className="section-head">
          <h4>오늘 인증 가능한 수련</h4>
          <button className="link-btn" onClick={() => navigate('/challenge/challengeMyList')}>전체 보기</button>
        </div>
        {todayPendingList.length === 0 ? (
          <div className="empty-row">오늘 인증을 모두 완료했소. 👏</div>
        ) : (
          <div className="mini-list">
            {todayPendingList.map(ch => {
              const r = ratioOf(ch);
              const d = ddayOf(ch);
              return (
                <button key={ch.challengeId} className="mini-item" onClick={() => navigate(`/challenge/detail/${ch.challengeId}`)}>
                  <img className="mini-thumb" src={thumbOf(ch)} alt="" />
                  <div className="mini-main">
                    <div className="mini-title">{ch.challengeTitle}</div>

                    <div className="mini-bar"><div style={{ width: `${Math.round(r*100)}%` }} /></div>
                  </div>
                  <div className="mini-cta">인증</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* === 섹션: 마감 임박 === */}
      <div className="section-card">
        <div className="section-head">
          <h4>이 수련들은 고지가 눈 앞이오!</h4>
        </div>
        {nearestDeadlineList.length === 0 ? (
          <div className="empty-row">마감 임박인 수련이 없소.</div>
        ) : (
          <div className="mini-list">
            {nearestDeadlineList.map(ch => {
              const r = ratioOf(ch);
              const d = ddayOf(ch);
              return (
                <button key={ch.challengeId} className="mini-item" onClick={() => navigate(`/challenge/detail/${ch.challengeId}`)}>
                  <img className="mini-thumb" src={thumbOf(ch)} alt="" />
                  <div className="mini-main">
                    <div className="mini-title">{ch.challengeTitle}</div>

                    <div className="mini-bar"><div style={{ width: `${Math.round(r*100)}%` }} /></div>
                  </div>
                  <div className="mini-meta">D-{d}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>


      {/* === 섹션: 사용 꿀팁(고정) === */}
      <div className="section-card">
        <div className="section-head">
              <h4>수련자들을 위한 조언</h4>
            </div>
            <div className="tip-grid">
              <div className="tip-card">
                <div className="tip-emoji"><FaFire /></div>
                <div>
                  <div className="tip-title">연속 출석을 유지하시오</div>
                  <div className="tip-desc">꾸준한 인증으로 연속 출석을 이어가면 뱃지뿐 아니라 자신감도 쌓을 수 있소. 멈추지 마시오!</div>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-emoji"><FaUsers /></div>
                <div>
                  <div className="tip-title">함께하면 더 즐거운 수련</div>
                  <div className="tip-desc">다른 수련자들의 기록을 보며 서로 격려하고 응원해보시오. 커뮤니티에서 새로운 영감을 얻을 수 있소.</div>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-emoji"><FaMapMarkedAlt /></div>
                <div>
                  <div className="tip-title">다음 목표를 설정하시오</div>
                  <div className="tip-desc">완주한 챌린지가 있소? 이제 새로운 카테고리에 도전해 보시오! 짐마당에는 다양한 길이 열려있소.</div>
                </div>
              </div>
              <div className="tip-card">
                <div className="tip-emoji"><FaLightbulb /></div>
                <div>
                  <div className="tip-title">노리개의 비밀</div>
                  <div className="tip-desc">노리개 뱃지는 당신의 꾸준함에 대한 증표요. 더 높은 등급의 노리개를 모아보시오!</div>
                </div>
              </div>
            </div>
      </div>

      {/* === 섹션: 자주 묻는 질문 (FAQ) === */}
      <div className="section-card">
        <div className="section-head">
          <h4>수련에 관한 질문과 답변</h4>
        </div>
        <div className="faq-list">
          <div className="faq-item">
            <div className="faq-q">Q. 수련 인증은 어떻게 하오?</div>
            <div className="faq-a">
              <p>매일 정해진 수련을 완료하고, 인증 버튼을 눌러 사진을 등록해주시오. 당일 자정(24시)까지 업로드해야 인정되오.</p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Q. 챌린지를 완주하면 어떤 것이 좋소?</div>
            <div className="faq-a">
              <p>챌린지를 완주하면 '참여 완료' 챌린지로 이동하고, 꾸준함에 대한 증표로 노리개 뱃지를 받을 수 있소. 다음 목표를 향해 나아가시오!</p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Q. 진행률이 100%인데 왜 '참여 중'으로 나타나오?</div>
            <div className="faq-a">
              <p>챌린지 진행률이 100%를 넘어도, 정해진 챌린지 기간이 끝나야 '참여 완료'로 자동 변경되오. 기간을 끝까지 채워주시오.</p>
            </div>
          </div>
          <div className="faq-item">
            <div className="faq-q">Q. 문의/피드백은 어떻게 전달하오?</div>
            <div className="faq-a">
              <p>앱 내 '설정 → 문의하기' 메뉴를 통해 보내주시면, 빠르게 답변해 드리겠소. 여러분의 목소리는 짐마당을 더욱 성장시키오!</p>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-note">© 짐마당 — 꾸준함이 실력입니다.</div>


    </div>
  </div>


  );
};

export default ChallengeMyRecordList;
