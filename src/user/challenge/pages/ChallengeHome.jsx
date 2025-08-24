// src/pages/ChallengeHome.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import apiClient from "../../../global/api/apiClient";

import { FiPlusCircle } from "react-icons/fi";
import { TbBulb } from "react-icons/tb";
import { BsChatDots } from "react-icons/bs";
import { HiOutlineChevronRight } from "react-icons/hi";

import "../styles/ChallengeHome.css";

const BACKEND_BASE_URL = "http://localhost:8080";

/* 데이터 → 카드 표시용 안전 매핑 */
function normalizeChallenge(item = {}) {
  return {
    id:
      item.challengeId ??
      item.challenge_id ??
      item.id,
    title:
      item.challengeTitle ??
      item.challenge_title ??
      item.title ??
      "",
    thumbnailPath:
      item.challengeThumbnailPath ??
      item.challenge_thumbnail_path ??
      item.thumbnailPath ??
      "",
    keywords:
      item.keywords ??
      item.keywordList ??
      item.challengeKeywords ??
      [],
  };
}

/* 추천 카드 */
function RecommendCard({ item, onClick }) {
  const imageUrl = item.thumbnailPath
    ? `${BACKEND_BASE_URL}${item.thumbnailPath}`
    : "/images/default-thumbnail.png";

  return (
    <div className="challenge-home-rec-card" onClick={onClick}>
      <div
        className="challenge-home-rec-thumb"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <div className="challenge-home-rec-meta">
        <div className="challenge-home-rec-title">{item.title}</div>
        <div className="challenge-home-rec-sub">
          {(item.keywords || [])
            .slice(0, 3)
            .map((k) => `#${k.keywordName ?? k.name ?? k}`)
            .join(" ")}
        </div>
      </div>
    </div>
  );
}

export default function ChallengeHome() {
  const navigate = useNavigate();

  const userName = useSelector((s) => s.auth?.name) || "사용자";
  const isLoggedIn = useSelector((s) => Boolean(s.auth?.id));

  // 관심 키워드 (Redux 저장 가정: number[] 또는 string[])
  const interestKeywordIdsRaw = useSelector(
    (s) => s.profile?.interestKeywordIds
  );
  const interestKey = Array.isArray(interestKeywordIdsRaw)
    ? interestKeywordIdsRaw.join(",")
    : "";
  const interestKeywordIds = useMemo(
    () => (Array.isArray(interestKeywordIdsRaw) ? interestKeywordIdsRaw : []),
    [interestKey]
  );

  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  // 백엔드 스펙에 맞춘 호출
  useEffect(() => {
    let ignore = false;

    async function fetchRecommendedByKeywords(keywordIds) {
      // Spring List<Integer> 바인딩: keywordIds=1&keywordIds=2...
      const qs = new URLSearchParams();
      keywordIds.forEach((id) => qs.append("keywordIds", id));
      const url = `${BACKEND_BASE_URL}/api/challenge/getRecommendedChallengeListProcess?${qs.toString()}`;

      const { data } = await apiClient.get(url);
      const list = Array.isArray(data) ? data : [];
      return list.map(normalizeChallenge);
    }

    async function fetchFallbackList() {
      const { data } = await apiClient.get(
        `${BACKEND_BASE_URL}/api/challenge/list`
      );
      const list = Array.isArray(data) ? data : [];
      return list.slice(0, 10).map(normalizeChallenge);
    }

    async function run() {
      setLoading(true);
      setErrMsg("");
      try {
        const result =
          interestKeywordIds.length > 0
            ? await fetchRecommendedByKeywords(interestKeywordIds)
            : await fetchFallbackList();

        if (!ignore) setRecs(result);
      } catch (e) {
        console.error("추천/목록 불러오기 실패", e);
        if (!ignore) {
          setRecs([]);
          setErrMsg("추천 수련을 불러오지 못했습니다.");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    run();
    return () => {
      ignore = true;
    };
  }, [interestKey]);

  const titleText = useMemo(
    () => `${userName}님, 수련을 도전해볼까요?`,
    [userName]
  );

  return (
    <div className="challenge-home-container">
      {/* 헤더: ChallengeList와 동일 틀 */}
    <div className="challenge-home-header">
      <h1 className="challenge-home-title">
        {userName}님,<br />수련을 도전해 보겠소?
      </h1>
      <p className="challenge-home-subtitle">
        관심 키워드 기반 추천 수련과 기능들을 한 눈에 확인하시오
      </p>
    </div>

      {/* 스크롤 본문 */}
      <main className="challenge-home-main">
        {/* 추천 섹션 */}
        <section className="challenge-home-section">
          <div className="challenge-home-sec-head">
            <h2 className="challenge-home-sec-title">관심 키워드 추천 수련</h2>
            <button
              type="button"
              className="challenge-home-seeall"
              onClick={() => navigate("/challenges?tab=recommend")}
            >
              전체 보기 <HiOutlineChevronRight />
            </button>
          </div>

          <div className="challenge-home-rec-row">
            {loading ? (
              <>
                <div className="challenge-home-rec-skel" />
                <div className="challenge-home-rec-skel" />
                <div className="challenge-home-rec-skel" />
              </>
            ) : errMsg ? (
              <div className="challenge-home-empty">{errMsg}</div>
            ) : recs.length === 0 ? (
              <div className="challenge-home-empty">
                관심 키워드를 선택하면 추천 수련을 볼 수 있소
              </div>
            ) : (
              recs.map((item) => (
                <RecommendCard
                  key={item.id}
                  item={item}
                  onClick={() => navigate(`/challenge/${item.id}`)}
                />
              ))
            )}
          </div>
        </section>

        {/* 내 기능들 */}
        <section className="challenge-home-section">
          <div className="challenge-home-sec-head">
            <h2 className="challenge-home-sec-title">내 기능들</h2>
          </div>

          <div className="challenge-home-actions">
            <button
              type="button"
              className="challenge-home-action"
              onClick={() => navigate("/challenge/create")}
            >
              <span className="challenge-home-action-ico">
                <FiPlusCircle />
              </span>
              <span className="challenge-home-action-t1">수련 새로 생성하기</span>
              <span className="challenge-home-action-t2">
                나만의 챌린지를 만들어요
              </span>
            </button>

            <button
              type="button"
              className="challenge-home-action"
              onClick={() => navigate("/test")}
            >
              <span className="challenge-home-action-ico">
                <TbBulb />
              </span>
              <span className="challenge-home-action-t1">성향 테스트 하기</span>
              <span className="challenge-home-action-t2">
                추천 수련을 더 정확하게
              </span>
            </button>

            <button
              type="button"
              className="challenge-home-action"
              onClick={() => navigate("/group-chats")}
            >
              <span className="challenge-home-action-ico">
                <BsChatDots />
              </span>
              <span className="challenge-home-action-t1">내 그룹 채팅방 가기</span>
              <span className="challenge-home-action-t2">
                참여 중인 수련 대화방
              </span>
            </button>
          </div>
        </section>

        <div className="challenge-home-bottom-space" />
      </main>
    </div>
  );
}
