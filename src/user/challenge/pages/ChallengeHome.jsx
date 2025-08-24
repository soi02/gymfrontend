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

const BACKEND_BASE_URL = "http://localhost:8080";

/* === 비용 절감용: 로컬 캐시 + 쿨다운 설정 === */
const COOLDOWN_MS = 10 * 60 * 1000; // 10분 (원하면 30분/1시간 등으로 올려도 됨)
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
    localStorage.setItem(
      recKey(uid),
      JSON.stringify({ ts: Date.now(), recs })
    );
  } catch {}
};

/* 안전 매핑 */
function normalizeChallenge(item = {}) {
  return {
    id: item.challengeId ?? item.challenge_id ?? item.id,
    title: item.challengeTitle ?? item.challenge_title ?? item.title ?? "",
    thumbnailPath:
      item.challengeThumbnailPath ??
      item.challenge_thumbnail_path ??
      item.thumbnailPath ??
      "",
    keywords: Array.isArray(item.keywords) ? item.keywords : [],
  };
}

/* 가로 캐러셀 카드 (세로 구성, 가로 스냅) */
function RecommendCard({ item, onClick }) {
  const imageUrl = item.thumbnailPath
    ? `${BACKEND_BASE_URL}${item.thumbnailPath}`
    : "/images/default-thumbnail.png";

  return (
    <button className="chome-hcard" onClick={onClick} aria-label={item.title}>
      <div
        className="chome-hcard-thumb"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="chome-hcard-body">
        <div className="chome-hcard-title">{item.title}</div>
        {item.keywords?.length > 0 && (
          <div className="chome-hcard-tags">
            {item.keywords.slice(0, 3).map((k) => (
              <span key={k} className="chome-tag">
                #{k}
              </span>
            ))}
          </div>
        )}
      </div>
    </button>
  );
}

/* 로딩 오버레이 (AI 분석중 느낌) */
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
            <span className="step step-1">성향 프로파일 분석…</span>
            <span className="step step-2">참여 이력 매칭…</span>
            <span className="step step-3">추천 점수 계산…</span>
          </div>
          <div className="chome-progress-bar">
            <i />
          </div>
          <p className="chome-loading-sub">취향에 꼭 맞는 수련을 고르고 있어요</p>
        </div>
      </div>
      <div className="chome-loading-mask chome-left" />
      <div className="chome-loading-mask chome-right" />
    </div>
  );
}

export default function ChallengeHome() {
  const navigate = useNavigate();

  const userName = useSelector((s) => s.auth?.name) || "사용자";
  const userId = useSelector((s) => s.auth?.id);
  const isLoggedIn = Boolean(userId);

  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  /* 첫 진입 시 캐시가 있으면 바로 뿌려줌 (호출 0회) */
  useEffect(() => {
    if (!isLoggedIn) return;
    const cached = readCache(userId);
    if (cached?.recs?.length) setRecs(cached.recs.map(normalizeChallenge));
  }, [isLoggedIn, userId]);

  const handleFetchAIRecs = async () => {
    if (!isLoggedIn) {
      setErrMsg("로그인 후 추천을 받을 수 있습니다.");
      return;
    }

    // 최근 호출이 있으면 서버 호출 없이 캐시 사용
    const cached = readCache(userId);
    const freshEnough =
      cached && Array.isArray(cached.recs) && Date.now() - cached.ts < COOLDOWN_MS;

    if (freshEnough) {
      setRecs(cached.recs.map(normalizeChallenge));
      setErrMsg("최근 추천을 재사용했어요.");
      return;
    }

    setLoading(true);
    setErrMsg("");
    try {
      const { data } = await apiClient.get(
        `${BACKEND_BASE_URL}/api/challenge/recommend/ai`,
        { params: { userId, topN: 8 } }
      );
      const list = Array.isArray(data) ? data : [];
      const normalized = list
        .map(normalizeChallenge)
        .filter((x) => x.id != null);

      setRecs(normalized);
      saveCache(userId, normalized); // ★ 성공 시 캐시에 저장
    } catch (e) {
      console.error("AI 추천 실패, 기본 목록으로 대체 시도", e);
      try {
        const { data } = await apiClient.get(
          `${BACKEND_BASE_URL}/api/challenge/list`
        );
        const list = Array.isArray(data) ? data : [];
        const normalized = list
          .slice(0, 10)
          .map(normalizeChallenge)
          .filter((x) => x.id != null);

        setRecs(normalized);
        setErrMsg("AI 추천이 잠시 불안정하여 기본 목록을 보여드립니다.");
        // 기본 목록도 캐시에 넣어두면 다음 클릭 비용 절감
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
      {/* 헤더 */}
      <header className="chome-header">
        <h1 className="chome-title">
          {userName}님, <br />
          오늘은 어떤 수련을 도전해볼까요?
        </h1>
        <p className="chome-subtitle">
          성향/이력 기반으로 딱 맞는 수련을 추천해드려요.
        </p>

        <div className="chome-actions">
          <button
            type="button"
            className="chome-btn chome-btn-primary"
            onClick={handleFetchAIRecs}
            disabled={loading || !isLoggedIn}
            title={!isLoggedIn ? "로그인 필요" : "AI 추천 받기"}
          >
            <LuSparkles />
            <span>{loading ? "추천 생성 중…" : "AI에게 추천 받기"}</span>
          </button>

          <button
            type="button"
            className="chome-btn chome-btn-ghost"
            onClick={() => navigate("/challenges?tab=recommend")}
          >
            <span>전체 수련 보기</span>
            <HiOutlineChevronRight />
          </button>
        </div>

        {errMsg && <div className="chome-inline-notice">{errMsg}</div>}
      </header>

      {/* 본문 */}
      <main className="chome-main">
        {/* AI 추천 섹션 */}
        <section className="chome-section">
          <div className="chome-sec-head">
            <h2 className="chome-sec-title">AI 추천 수련</h2>
          </div>

          {/* 가로 캐러셀 */}
          <div className="chome-hscroll-wrapper">
            <div className="chome-hscroll-edge left" />
            <div className="chome-hscroll-edge right" />
            <div className="chome-hscroll" role="list">
              {loading && (
                <>
                  <div className="chome-hskel" />
                  <div className="chome-hskel" />
                  <div className="chome-hskel" />
                </>
              )}

              {!loading && recs.length === 0 && (
                <div className="chome-empty-inline">
                  AI 추천을 받으면 이 영역에 카드가 나타나요.
                </div>
              )}

              {!loading &&
                recs.map((item) => (
                  <div role="listitem" key={item.id} className="chome-hcell">
                    <RecommendCard
                      item={item}
                      onClick={() => navigate(`/challenge/${item.id}`)}
                    />
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* 내 기능들 */}
        <section className="chome-section">
          <div className="chome-sec-head">
            <h2 className="chome-sec-title">내 기능들</h2>
          </div>

        <div className="chome-grid-actions">
            <button
              type="button"
              className="chome-action"
              onClick={() => navigate("/challenge/create")}
            >
              <span className="chome-action-ico">
                <FiPlusCircle />
              </span>
              <span className="chome-action-texts">
                <span className="chome-action-t1">수련 새로 생성하기</span>
                <span className="chome-action-t2">나만의 챌린지를 만들어요</span>
              </span>
            </button>

            <button
              type="button"
              className="chome-action"
              onClick={() => navigate("/test")}
            >
              <span className="chome-action-ico">
                <TbBulb />
              </span>
              <span className="chome-action-texts">
                <span className="chome-action-t1">성향 테스트 하기</span>
                <span className="chome-action-t2">추천 수련을 더 정확하게</span>
              </span>
            </button>

            <button
              type="button"
              className="chome-action"
              onClick={() => navigate("/group-chats")}
            >
              <span className="chome-action-ico">
                <BsChatDots />
              </span>
              <span className="chome-action-texts">
                <span className="chome-action-t1">내 그룹 채팅방 가기</span>
                <span className="chome-action-t2">참여 중인 수련 대화방</span>
              </span>
            </button>
          </div>
        </section>

        <div className="chome-bottom-space" />
      </main>

      {/* AI 로딩 오버레이 */}
      <LoadingOverlay visible={loading} />
    </div>
  );
}
