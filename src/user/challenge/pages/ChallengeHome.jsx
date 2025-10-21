// src/pages/ChallengeHome.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import apiClient from "../../../global/api/apiClient";

import { FiPlusCircle } from "react-icons/fi";
import { TbBulb } from "react-icons/tb";
import { BsChatDots } from "react-icons/bs";
import { HiOutlineChevronRight } from "react-icons/hi";
import { LuSparkles } from "react-icons/lu";

import "../styles/ChallengeHome.css";
import PopularCard from "../components/PopularCard";

import homeGoldNorigaeImage from "/src/assets/img/challenge/norigae/gold.png";
import homeSilverNorigaeImage from "/src/assets/img/challenge/norigae/silver.png";
import homeBronzeNorigaeImage from "/src/assets/img/challenge/norigae/bronze.png";

import quickTestImage from "/src/assets/img/challenge/home/survey.png";
import quickCreateImage from "/src/assets/img/challenge/home/clap.png";
import quickListImage from "/src/assets/img/challenge/home/stars.png";
import quickAIImage from "/src/assets/img/challenge/home/thumb.png";


const BACKEND_BASE_URL = "http://localhost:8080";

const mediaUrl = (p) => (p ? `${BACKEND_BASE_URL}${p}` : null);


/* =========================
   캐시/정규화/유틸
   ========================= */
const COOLDOWN_MS = 10 * 60 * 1000; // 10분
const recKey = (uid) => `ai.recs.v1:${uid}`;
const readCache = (uid) => {
  try {
    const raw = localStorage.getItem(recKey(uid));
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.recs)) return null;
    return parsed;
  } catch {
    return null;
  }
};
const saveCache = (uid, recs) => {
  try {
    localStorage.setItem(recKey(uid), JSON.stringify({ ts: Date.now(), recs }));
  } catch {}
};



/* ===== 인기 텍스트 캐러셀 (한 장씩, 자동 전환) ===== */
function PopularTicker({ items = [], onClick, intervalMs = 4000, idx, setIdx }) {
  const [descMap, setDescMap] = React.useState({});
  const detailApiUnavailableRef = React.useRef(false);
  const total = items.length;

  const colors = ["#FFE5B4", "#E0E6FF", "#E6F7FF", "#FDE8E8", "#E8F5E9", "#FFF5E1"];
  const bgColor = colors[idx % colors.length];

  // ✅ 이미지 배열
  const norigaeImages = [homeGoldNorigaeImage, homeSilverNorigaeImage, homeBronzeNorigaeImage];
  const norigaeImage = norigaeImages[idx % norigaeImages.length]; // 번갈아 선택

  React.useEffect(() => {
    if (total <= 1) return;
    const tm = setInterval(() => setIdx((i) => (i + 1) % total), intervalMs);
    return () => clearInterval(tm);
  }, [total, intervalMs, setIdx]);

  if (!total) return null;
  const it = items[idx];

  const currentDesc =
    it.description?.trim?.() ? it.description : (descMap[it.id] ?? "");

  // ✅ 상세 API 지연 로드
  React.useEffect(() => {
    let aborted = false;
    async function ensureDesc() {
      if (!it?.id) return;
      if (detailApiUnavailableRef.current) return;
      if (it.description?.trim?.() || descMap[it.id]) return;
      try {
        const { data } = await apiClient.get(`${BACKEND_BASE_URL}/api/challenge/${it.id}`);
        const desc =
          data?.challengeDescription ??
          data?.challenge_description ??
          data?.description ??
          "";
        if (!aborted && desc) setDescMap((m) => ({ ...m, [it.id]: desc }));
      } catch (e) {
        if (e?.response?.status === 404) {
          detailApiUnavailableRef.current = true;
        }
      }
    }
    ensureDesc();
    return () => {
      aborted = true;
    };
  }, [idx, it?.id]);

  return (
    <div
      className="chome-pop-ticker"
      aria-roledescription="carousel"
      aria-label="인기 수련"
    >
      <button
        type="button"
        className="ticker-card-with-img"
        style={{ backgroundColor: bgColor }}
        onClick={() => onClick?.(it)}
      >
        <div className="ticker-card-left">
          <div className="ticker-card-title">{it.title || "제목 없음"}</div>
          {currentDesc ? (
            <div className="ticker-card-desc">{currentDesc}</div>
          ) : null}
        </div>
        <div className="ticker-card-right">
          <img src={norigaeImage} alt="" className="ticker-card-img-lg" />
        </div>
      </button>
    </div>
  );
}





function getParticipantCount(item = {}) {
  return (
    item.challengeParticipantCount ?? // ChallengeListResponse
    item.participantCount ??          // ChallengeDetailResponse
    0
  );
}

function normalizeChallenge(item = {}) {
  return {
    id: item.challengeId ?? item.challenge_id ?? item.id,
    title: item.challengeTitle ?? item.challenge_title ?? item.title ?? "",
    description:
      item.challengeDescription ??  // DTO가 camelCase로 줄 때
      item.challenge_description ?? // snake_case로 줄 때
      item.description ??           // 백엔드가 이미 가공해서 줄 때
      "",                           // 없으면 빈값
    thumbnailPath:
      item.challengeThumbnailPath ??
      item.challenge_thumbnail_path ??
      item.thumbnailPath ?? "",
    keywords: Array.isArray(item.keywords)
      ? item.keywords
      : (item.keywordNamesString?.split(",").filter(Boolean) ?? []),
    participantCount: getParticipantCount(item),
    durationDays: item.challengeDurationDays ?? item.durationDays,
  };
}


/* =========================
   서버 어댑터 (실데이터)
   ========================= */

// 인기 수련(참가자수 desc) 백엔드 정렬 버전
async function fetchPopularServer(limit = 12) {
  const { data } = await apiClient.get(
    `${BACKEND_BASE_URL}/api/challenge/popular`,
    { params: { limit } }
  );
  return Array.isArray(data) ? data : [];
}

// 백엔드에 /popular가 아직 없거나 빈 배열일 때 대체: /list 받아 프론트에서 정렬
async function fetchPopularFallback(limit = 12) {
  const { data } = await apiClient.get(`${BACKEND_BASE_URL}/api/challenge/list`);
  const list = Array.isArray(data) ? data : [];
  return list
    .map(normalizeChallenge)
    .filter((x) => x.id != null)
    .sort((a, b) => (b.participantCount || 0) - (a.participantCount || 0))
    .slice(0, limit);
}

// 주간 요약 (이번 주 고유 출석일/7일)
async function fetchWeeklySummary(userId) {
  const { data } = await apiClient.get(
    `${BACKEND_BASE_URL}/api/challenge/weekly/summary`,
    { params: { userId } }
  );
  // 기대: { userId, totalDistinctDaysThisWeek, totalWeekDays:7, progressPercent }
  return data || { totalDistinctDaysThisWeek: 0, totalWeekDays: 7, progressPercent: 0 };
}

// 주간 랭킹
async function fetchWeeklyRanking(limit = 5) {
  try {
    const { data } = await apiClient.get(
      `${BACKEND_BASE_URL}/api/challenge/weekly/ranking`,
      { params: { limit } }
    );
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error("주간 랭킹 API 실패", e);
    return []; // ← 빈 배열로 처리
  }
}


/* ===== AI 추천 카드(세로형) 가로 스크롤 ===== */
function AiRecCardScroll({ items = [], onClick }) {
  const rows = items.slice(0, 3); // ✅ 최대 3개
  if (!rows.length) return null;

  return (
    <div className="ai-card-hwrap">
      <div className="ai-card-hscroll">
        {rows.map((it) => {
          const imageUrl = it.thumbnailPath
            ? `${BACKEND_BASE_URL}${it.thumbnailPath}`
            : "/images/default-thumbnail.png";
          return (
            <button
              key={it.id}
              className="ai-vert-card"
              onClick={() => onClick?.(it)}
              aria-label={it.title}
            >
              <div
                className="ai-vert-thumb"
                style={{ backgroundImage: `url(${imageUrl})` }}
              />
              <div className="ai-vert-title">{it.title}</div>
              {/* 설명을 카드 하단에 작게 2줄까지 */}
              {it.description ? (
                <div className="ai-vert-desc">{it.description}</div>
              ) : null}
            </button>
          );
        })}
      </div>
      <i className="ai-card-edge left" />
      <i className="ai-card-edge right" />
    </div>
  );
}




/* 로딩 오버레이 (AI 생성 중) */
function LoadingOverlay({ visible }) {
  if (!visible) return null;
  return (
    <div className="chome-loading" aria-live="polite" aria-busy="true">
      <div className="chome-loading-core">
        <div className="chome-orb-spin" aria-hidden />
        <div className="chome-orb-glow" aria-hidden />
        <div className="chome-loading-text">
          <div className="chome-loading-badge">
            <LuSparkles />
            AI 추천 생성 중
          </div>
          <div className="chome-loading-steps">
            <span className="step step-1">성향 분석 중...</span>
            <span className="step step-2">참여 이력 매칭 중...</span>
            <span className="step step-3">추천 점수 계산 중...</span>
          </div>
          <div className="chome-progress-bar"><i /></div>
          <p className="chome-loading-sub">현대의 신문물 짐마당 AI가 취향에 꼭 맞는 수련을 고르고 있소</p>
        </div>
      </div>
      <div className="chome-loading-mask chome-left" />
      <div className="chome-loading-mask chome-right" />
    </div>
  );
}


// /* ===== 랭킹 스트립 (Top3 카드 + 리스트 - 기존) ===== */
// function RankingStrip({ items = [], onMore }) {
//   if (!items?.length) return null;
//   const rows = items.slice(0, 8);

//   return (
//     <div className="rankv3-wrap">
//       <div className="rankv3-head">
//         <h3 className="rankv3-title">금주의 수련 순위</h3>
//       </div>

//       <ol className="rankv3-list">
//         {rows.map((u, i) => (
//           <li key={u.id ?? i} className="rankv3-row">
//             {/* ← 카드 바깥의 순위 숫자 */}
//             <span className={`rankv3-no ${i < 3 ? "is-top" : ""}`}>{i + 1}</span>

//             {/* ← 카드 본문 */}
//             <div className="rankv3-item">
//               <div className="rankv3-left">
//                 <div className="rankv3-avatar">
//                   <img src={u.profile} alt={u.name} />
//                 </div>
//                 <span className="rankv3-name">{u.name}</span>
//               </div>
//               <div className="rankv3-right">
//                 <span className="rankv3-count">{u.days}회</span>
//               </div>
//             </div>
//           </li>
//         ))}
//       </ol>
//     </div>
//   );
// }


/* ===== 랭킹 스트립 (Top3 카드 + 리스트 - 수정) ===== */
// 통일: 개발/배포 모두 여기만 바꾸면 됨
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || BACKEND_BASE_URL;
// const PLACEHOLDER = "https://placehold.co/100x100?text=No+Image";

// function toAbsUrl(path) {
//   if (!path) return PLACEHOLDER;
//   if (/^https?:\/\//i.test(path) || /^data:image\//i.test(path)) return path;
//   if (path.startsWith("/")) return `${API_BASE_URL}${path}`;
//   return `${API_BASE_URL}/uploadFiles/${path}`;
// }

// function RankingStrip({ items = [], onMore }) {
//   if (!items?.length) return null;
//   const rows = items.slice(0, 8);

//   return (
//     <div className="rankv3-wrap">
//       <div className="rankv3-head">
//         <h3 className="rankv3-title">금주의 수련 순위</h3>
//       </div>

//       <ol className="rankv3-list">
//         {rows.map((u, i) => {
//           const raw = u.profile ?? u.profileImage ?? u.profileImagePath ?? null;
//           const src = toAbsUrl(raw);

//           return (
//             <li key={u.id ?? i} className="rankv3-row">
//               <span className={`rankv3-no ${i < 3 ? "is-top" : ""}`}>{i + 1}</span>

//               <div className="rankv3-item">
//                 <div className="rankv3-left">
//                   <div className="rankv3-avatar">
//                     <img
//                       src={src}
//                       alt={u.name ?? "user"}
//                       onError={(e) => (e.currentTarget.src = PLACEHOLDER)}
//                     />
//                   </div>
//                   <span className="rankv3-name">{u.name}</span>
//                 </div>
//                 <div className="rankv3-right">
//                   <span className="rankv3-count">{u.days}회</span>
//                 </div>
//               </div>
//             </li>
//           );
//         })}
//       </ol>

//       {/* {onMore && (
//         <button type="button" className="rankv3-more" onClick={onMore}>
//           더 보기
//         </button>
//       )} */}
//     </div>
//   );
// }



/* =========================
   메인 컴포넌트
   ========================= */
export default function ChallengeHome() {
  const navigate = useNavigate();

  const userName = useSelector((s) => s.auth?.name) || "사용자";
  const userId = useSelector((s) => s.auth?.id);
  const isLoggedIn = Boolean(userId);

  /* 인기 */
  const [popular, setPopular] = useState([]);
  const [popularLoading, setPopularLoading] = useState(true);
  const [popularErr, setPopularErr] = useState("");

  const [idx, setIdx] = useState(0);

  /* AI 추천 */
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  /* 주간 요약/랭킹 */
//   const [weekly, setWeekly] = useState({ days: 0, totalDays: 7, percent: 0 });
//   const [weeklyLoading, setWeeklyLoading] = useState(true);
//   const [ranking, setRanking] = useState([]);
//   const [rankingLoading, setRankingLoading] = useState(true);

  /* 인기 수련 로드 (서버 → 실패 시 프론트 정렬) */
useEffect(() => {
  (async () => {
    setPopularLoading(true);
    setPopularErr("");
    try {
      let raw = await fetchPopularServer(4); // /popular
      if (!raw.length) {
        raw = await fetchPopularFallback(4); // /list → 클라 정렬
      } else {
        raw = raw.map(normalizeChallenge).filter(x => x.id != null);
      }
      setPopular(raw);
    } catch (e) {
      console.error("인기 수련 실패 → fallback 실행", e);
      const raw = await fetchPopularFallback(12);
      setPopular(raw);
    } finally {
      setPopularLoading(false);
    }
  })();
}, []);

  /* AI 캐시 즉시 반영 */
  useEffect(() => {
    if (!isLoggedIn) return;
    const cached = readCache(userId);
    if (cached?.recs?.length) setRecs(cached.recs.map(normalizeChallenge));
  }, [isLoggedIn, userId]);

  /* 주간 요약/랭킹 로드 (실데이터) */
  useEffect(() => {
    if (!isLoggedIn) { setWeeklyLoading(false); setRankingLoading(false); return; }
    (async () => {
      try {
        const [sum, ranks] = await Promise.all([
          fetchWeeklySummary(userId),
          fetchWeeklyRanking(5),
        ]);
        setWeekly({
          days: sum.totalDistinctDaysThisWeek ?? 0,
          totalDays: sum.totalWeekDays ?? 7,
          percent: sum.progressPercent ?? 0,
        });
setRanking(
  (Array.isArray(ranks) ? ranks : []).map((r) => ({
    id: r.userId,
    name: r.userName,
   // 원본만 넘기고, 절대경로 조립은 RankingStrip에서 일원화
   profile: r.profileImagePath ?? r.profileImage ?? r.profile ?? null,
    days: r.distinctDaysThisWeek,
    percent: r.progressPercent,
    rank: r.rank,
  }))
);
      } finally {
        setWeeklyLoading(false);
        setRankingLoading(false);
      }
    })();
  }, [isLoggedIn, userId]);

  /* AI 추천 호출 */
const handleFetchAIRecs = async () => {
  if (!isLoggedIn) {
    setErrMsg("로그인 후 추천을 받을 수 있습니다.");
    return;
  }
  const cached = readCache(userId);
  const freshEnough =
    cached && Array.isArray(cached.recs) && Date.now() - cached.ts < COOLDOWN_MS;

  if (freshEnough) {
    setRecs(cached.recs.map(normalizeChallenge).slice(0, 3)); // ✅ 캐시도 3개
    setErrMsg("최근 추천을 재사용했어요.");
    return;
  }

  setLoading(true);
  setErrMsg("");
  try {
    const { data } = await apiClient.get(
      `${BACKEND_BASE_URL}/api/challenge/recommend/ai`,
      { params: { userId, topN: 3 } } // ✅ 서버에 3개 요청
    );
    const list = Array.isArray(data) ? data : [];
    const normalized = list
      .map(normalizeChallenge)
      .filter((x) => x.id != null)
      .slice(0, 3); // ✅ 안전하게 3개로
    setRecs(normalized);
    saveCache(userId, normalized);
  } catch (e) {
    console.error("AI 추천 실패, 기본 목록으로 대체 시도", e);
    try {
      const { data } = await apiClient.get(`${BACKEND_BASE_URL}/api/challenge/list`);
      const list = Array.isArray(data) ? data : [];
      const normalized = list
        .map(normalizeChallenge)
        .filter((x) => x.id != null)
        .slice(0, 3); // ✅ 대체도 3개
      setRecs(normalized);
      setErrMsg("AI 추천이 잠시 불안정하여 기본 목록을 보여드립니다.");
      saveCache(userId, normalized);
    } catch (e2) {
      console.error("기본 목록도 실패", e2);
      setRecs([]);
      setErrMsg("추천 수련을 불러오지 못했습니다.");
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="challenge-home-container">
      {/* 헤더: 대제목/소제목 유지 */}
      <header className="chome-header">
        <h1 className="chome-title">
          {userName}님, <br />
          어떤 수련을 도전하겠소?
        </h1>
        <p className="chome-subtitle">그대에게 딱 맞는 수련을 추천해드리오</p>
      </header>

      <main className="chome-main">
        {/* 1) 인기 수련 (상단) */}
<section className="chome-section">
  <div className="chome-sec-head only-dots">
    {/* 제목은 제거 */}
    <div />  {/* 🔹 왼쪽에 비어있는 flex 아이템 하나 넣어서 균형 유지 */}
    <div className="ticker-dots">
      {popular.map((_, i) => (
        <button
          key={i}
          type="button"
          className={`ticker-dot ${i === idx ? "is-active" : ""}`}
          aria-label={`${i + 1} / ${popular.length}`}
          onClick={() => setIdx(i)}
        />
      ))}
    </div>
  </div>

  {popularLoading ? (
    <div className="chome-block-skel">
      <div className="chome-skel-line" />
    </div>
  ) : !popular.length ? (
    <div className="chome-empty-block">
      {popularErr || "지금은 노출할 인기 수련이 없어요."}
    </div>
  ) : (
    <PopularTicker
      items={popular}
      onClick={(it) => navigate(`/challenge/detail/${it.id}`)}
      intervalMs={4000}
      idx={idx}
      setIdx={setIdx}
    />
  )}
</section>





{/* 2) 서비스/액션 카드 2열×2줄 */}
<section className="chome-section">
  <div className="quickcard-grid-2">
    {/* 성향 테스트 */}
    <button
      type="button"
      className="quickcard"
      onClick={() => navigate("/challenge/challengeTest/intro")}
    >
      <div className="quickcard-text">
        <div className="quickcard-title">성향 검사</div>
        <div className="quickcard-sub">나의 성향 파악하기</div>
      </div>
      <img src={quickTestImage} alt="" className="quickcard-illust" />
    </button>

    {/* 새 챌린지 */}
    <button
      type="button"
      className="quickcard"
      onClick={() => navigate("/challenge/challengeCreate")}
    >
      <div className="quickcard-text">
        <div className="quickcard-title">새 수련 창설</div>
        <div className="quickcard-sub">직접 수련 만들기</div>
      </div>
      <img src={quickCreateImage} alt="" className="quickcard-illust" />
    </button>

    {/* 전체 보기 */}
    <button
      type="button"
      className="quickcard"
      onClick={() => navigate("/challenge/challengeList")}
    >
      <div className="quickcard-text">
        <div className="quickcard-title">전체 보기</div>
        <div className="quickcard-sub">수련 목록 둘러보기</div>
      </div>
      <img src={quickListImage} alt="" className="quickcard-illust" />
    </button>

    {/* AI 추천 */}
    <button
      type="button"
      className="quickcard"
      onClick={handleFetchAIRecs}
      disabled={loading || !isLoggedIn}
      title={!isLoggedIn ? "로그인 필요" : "AI 추천 받기"}
    >
      <div className="quickcard-text">
        <div className="quickcard-title">AI 수련 추천</div>
        <div className="quickcard-sub">
          {loading ? "추천 생성 중…" : "취향 따라 추천받기"}
        </div>
      </div>
      <img src={quickAIImage} alt="" className="quickcard-illust" />
    </button>
  </div>

  {errMsg && <div className="chome-inline-notice">{errMsg}</div>}
</section>

{/* 6) AI 추천 결과 */}
<section className="chome-section">
  <div className="chome-sec-head">
    <h2 className="chome-sec-title">AI 추천 수련</h2>
  </div>

  {loading ? (
    <div className="chome-block-skel"><div className="chome-skel-line" /></div>
  ) : !recs.length ? (
    <div className="chome-empty-block">AI 추천을 받으면 이 영역에 카드가 나타나요.</div>
  ) : (
    <AiRecCardScroll
      items={recs}
      onClick={(it) => navigate(`/challenge/detail/${it.id}`)}
    />
  )}
</section>




        {/* 4) 랭킹 */}
          {/* <section className="chome-section">
            {rankingLoading ? (
              <div className="chome-block-skel"><div className="chome-skel-line" /></div>
            ) : ranking.length === 0 ? null : (
              <RankingStrip items={ranking} onMore={() => navigate("/challenge/ranking")} />
            )}
          </section>
        <div className="chome-bottom-space" /> */}
      </main>

      {/* AI 로딩 오버레이 */}
      <LoadingOverlay visible={loading} />
    </div>
  );
}