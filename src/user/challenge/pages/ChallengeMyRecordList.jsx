// src/pages/ChallengeMyRecordList.jsx
import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import MyChallengeCard from '../components/MyChallengeCard';
import '../styles/ChallengeList.css';
import '../styles/MyChallengeCard.css';
import '../styles/ChallengeMyRecordList.css';

import '../styles/ChallengeMyRecordListNew.css';

import goldImg from '/src/assets/img/challenge/norigae/gold.png';
import silverImg from '/src/assets/img/challenge/norigae/silver.png';
import bronzeImg from '/src/assets/img/challenge/norigae/bronze.png';

import { MdChevronRight } from 'react-icons/md';
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
<div className="cmrl-new-page">
  {/* Header */}
  <div className="cmrl-new-header">
    <h2 className="cmrl-new-title">나의 수련 기록</h2>
    <p className="cmrl-new-sub">참여 현황과 오늘 인증을 한눈에 확인하시오</p>
  </div>

  {/* Body (스크롤 영역) */}
  <div className="cmrl-new-body">

    {/* 3그리드 */}
    <section className="cmrl-new-grid3">
      <div className="cmrl-new-tile">
        <div className="cmrl-new-tile-head">참여 중</div>
        <div><span className="cmrl-new-big">{stats.inProgress}</span></div>
      </div>

      <div className="cmrl-new-tile">
        <div className="cmrl-new-tile-head">참여 완료</div>
        <div><span className="cmrl-new-big">{stats.completed}</span></div>
      </div>

      <div className="cmrl-new-tile">
        <div className="cmrl-new-tile-head">오늘 인증</div>
        <div>
          <span className="cmrl-new-big">{stats.todayDone}</span>
          <span className="cmrl-new-subtxt"> / {stats.inProgress}</span>
        </div>
      </div>
    </section>

    {/* CTA */}
    <div className="cmrl-new-cta">
      <button className="cmrl-new-btn-primary" onClick={() => navigate('/challenge/challengeMyList')}>
        오늘의 수련을 인증하겠소
      </button>
    </div>

    {/* 노리개 월릿 */}
    <div className="cmrl-new-section">
      <div className="cmrl-new-section-head">
        <h4>보유 노리개 현황</h4>
        <button className="cmrl-new-link-btn" onClick={() => navigate('/challenge/norigae')}>자세히</button>
      </div>
      <div className="cmrl-new-wallet">
        <div className="cmrl-new-wallet-cell">
          <img src={goldImg} alt="금 노리개" />
          <div className="cmrl-new-wc-title">금</div>
          <div className="cmrl-new-wc-val">{stats.norigae.gold}</div>
        </div>
        <div className="cmrl-new-wallet-cell">
          <img src={silverImg} alt="은 노리개" />
          <div className="cmrl-new-wc-title">은</div>
          <div className="cmrl-new-wc-val">{stats.norigae.silver}</div>
        </div>
        <div className="cmrl-new-wallet-cell">
          <img src={bronzeImg} alt="동 노리개" />
          <div className="cmrl-new-wc-title">동</div>
          <div className="cmrl-new-wc-val">{stats.norigae.bronze}</div>
        </div>
      </div>
    </div>

    {/* 오늘 인증 가능한 수련 */}
    <div className="cmrl-new-section">
      <div className="cmrl-new-section-head">
        <h4>오늘 인증 가능한 수련</h4>
        <button className="cmrl-new-link-btn" onClick={() => navigate('/challenge/challengeMyList')}>전체 보기</button>
      </div>

      {todayPendingList.length === 0 ? (
        <div className="cmrl-new-empty">오늘 인증을 모두 완료했소. 👏</div>
      ) : (
        <div className="cmrl-new-mini-list">
          {todayPendingList.map(ch => {
            const r = ratioOf(ch);
            return (
              <button
                key={ch.challengeId}
                className="cmrl-new-mini-item"
                onClick={() => navigate(`/challenge/detail/${ch.challengeId}`)}
              >
                <img className="cmrl-new-mini-thumb" src={thumbOf(ch)} alt="" />
                <div className="cmrl-new-mini-main">
                  <div className="cmrl-new-mini-title">{ch.challengeTitle}</div>
                  <div className="cmrl-new-mini-bar">
                    <div style={{ width: `${Math.round(r * 100)}%` }} />
                  </div>
                </div>
                <div className="cmrl-new-mini-cta">인증</div>
              </button>
            );
          })}
        </div>
      )}
    </div>

    {/* 마감 임박 */}
    <div className="cmrl-new-section">
      <div className="cmrl-new-section-head">
        <h4>이 수련들은 고지가 눈 앞이오!</h4>
      </div>

      {nearestDeadlineList.length === 0 ? (
        <div className="cmrl-new-empty">마감 임박인 수련이 없소.</div>
      ) : (
        <div className="cmrl-new-mini-list">
          {nearestDeadlineList.map(ch => {
            const r = ratioOf(ch);
            const d = ddayOf(ch);
            return (
              <button
                key={ch.challengeId}
                className="cmrl-new-mini-item"
                onClick={() => navigate(`/challenge/detail/${ch.challengeId}`)}
              >
                <img className="cmrl-new-mini-thumb" src={thumbOf(ch)} alt="" />
                <div className="cmrl-new-mini-main">
                  <div className="cmrl-new-mini-title">{ch.challengeTitle}</div>
                  <div className="cmrl-new-mini-bar">
                    <div style={{ width: `${Math.round(r * 100)}%` }} />
                  </div>
                </div>
                <div className="cmrl-new-mini-meta">D-{d}</div>
              </button>
            );
          })}
        </div>
      )}
    </div>

    {/* 팁 */}
    <div className="cmrl-new-section">
      <div className="cmrl-new-section-head">
        <h4>수련자들을 위한 조언</h4>
      </div>
      <div className="cmrl-new-tip-grid">
        {/* 기존 아이콘 로직 그대로, 클래스만 매핑 */}
        <div className="cmrl-new-tip">
          <div className="cmrl-new-tip-emoji"><FaFire /></div>
          <div>
            <div className="cmrl-new-tip-title">연속 출석을 유지하시오</div>
            <div className="cmrl-new-tip-desc">꾸준한 인증으로 연속 출석을 이어가면 뱃지뿐 아니라 자신감도 쌓을 수 있소. 멈추지 마시오!</div>
          </div>
        </div>
        <div className="cmrl-new-tip">
          <div className="cmrl-new-tip-emoji"><FaUsers /></div>
          <div>
            <div className="cmrl-new-tip-title">함께하면 더 즐거운 수련</div>
            <div className="cmrl-new-tip-desc">다른 수련자들의 기록을 보며 서로 격려하고 응원해보시오. 커뮤니티에서 새로운 영감을 얻을 수 있소.</div>
          </div>
        </div>
        <div className="cmrl-new-tip">
          <div className="cmrl-new-tip-emoji"><FaMapMarkedAlt /></div>
          <div>
            <div className="cmrl-new-tip-title">다음 목표를 설정하시오</div>
            <div className="cmrl-new-tip-desc">완주한 챌린지가 있소? 이제 새로운 카테고리에 도전해 보시오! 짐마당에는 다양한 길이 열려있소.</div>
          </div>
        </div>
        <div className="cmrl-new-tip">
          <div className="cmrl-new-tip-emoji"><FaLightbulb /></div>
          <div>
            <div className="cmrl-new-tip-title">노리개의 비밀</div>
            <div className="cmrl-new-tip-desc">노리개 뱃지는 당신의 꾸준함에 대한 증표요. 더 높은 등급의 노리개를 모아보시오!</div>
          </div>
        </div>
      </div>
    </div>

    {/* FAQ */}
    <div className="cmrl-new-section">
      <div className="cmrl-new-section-head">
        <h4>수련에 관한 질문과 답변</h4>
      </div>
      <div className="cmrl-new-faq">
        <div className="cmrl-new-faq-item">
          <div className="cmrl-new-faq-q">Q. 수련 인증은 어떻게 하오?</div>
          <div className="cmrl-new-faq-a">
            <p>매일 정해진 수련을 완료하고, 인증 버튼을 눌러 사진을 등록해주시오. 당일 자정(24시)까지 업로드해야 인정되오.</p>
          </div>
        </div>
        <div className="cmrl-new-faq-item">
          <div className="cmrl-new-faq-q">Q. 챌린지를 완주하면 어떤 것이 좋소?</div>
          <div className="cmrl-new-faq-a">
            <p>완주하면 '참여 완료'로 이동하고, 노리개 뱃지를 받을 수 있소. 다음 목표를 향해 나아가시오!</p>
          </div>
        </div>
        <div className="cmrl-new-faq-item">
          <div className="cmrl-new-faq-q">Q. 진행률이 100%인데 왜 '참여 중'인가?</div>
          <div className="cmrl-new-faq-a">
            <p>정해진 기간이 끝나야 '참여 완료'로 전환되오. 기간을 끝까지 채워주시오.</p>
          </div>
        </div>
        <div className="cmrl-new-faq-item">
          <div className="cmrl-new-faq-q">Q. 문의/피드백은?</div>
          <div className="cmrl-new-faq-a">
            <p>앱 내 '설정 → 문의하기'로 보내주시오. 빠르게 답변드리겠소.</p>
          </div>
        </div>
      </div>
    </div>

    {/* Footer */}
    <div className="cmrl-new-footer">© 짐마당 — 꾸준함이 실력입니다.</div>
  </div>
</div>


  );
};

export default ChallengeMyRecordList;
