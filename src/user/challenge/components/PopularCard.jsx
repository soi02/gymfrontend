// src/user/challenge/components/PopularCard.jsx
import React from "react";
import "../styles/PopularCard.css";

/* ✅ 안전 매핑: thumbnailPath도 지원 */
function normalize(item = {}) {
  return {
    id: item.id ?? item.challengeId,
    title: item.title ?? item.challengeTitle ?? "제목 없음",
    thumbnail:
      item.thumbnail ??
      item.thumbnailPath ??                     // ← 추가
      item.challengeThumbnailPath ??
      item.challengeThumnailPath ??             // 오타 대비
      null,
    participantCount:
      item.participantCount ?? item.challengeParticipantCount ?? 0,
    durationDays: item.durationDays ?? item.challengeDurationDays ?? null,
    keywords: Array.isArray(item.keywords)
      ? item.keywords
      : (item.keywordNamesString?.split(",").filter(Boolean) ?? []),
  };
}

/* ✅ 상대경로를 절대 URL로 */
function toAbsoluteUrl(src, backendBase) {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  return backendBase ? `${backendBase}${src}` : src;
}

export default function PopularCard({ item, backendBase, onClick }) {
  const c = normalize(item);
  const imgSrc = toAbsoluteUrl(c.thumbnail, backendBase);

  return (
    <button
      type="button"
      className="pcard"
      onClick={() => onClick?.(c)}       // ✅ 이벤트 대신 카드 데이터 전달
      aria-label={`${c.title} 카드 열기`}
    >
      <div className="pcard__thumb">
        {imgSrc ? (
          <img src={imgSrc} alt={c.title} className="pcard__img" loading="lazy" />
        ) : (
          <div className="pcard__img--placeholder">No Image</div>
        )}
        <div className="pcard__gradient" />
        <div className="pcard__badge">
          참여 {c.participantCount ?? 0}
          {c.durationDays ? ` · ${c.durationDays}일` : ""}
        </div>
      </div>

      <div className="pcard__body">
        <div className="pcard__title" title={c.title}>{c.title}</div>
        {c.keywords?.length ? (
          <div className="pcard__chips">
            {c.keywords.slice(0, 4).map((k) => (
              <span className="pcard__chip" key={k}>#{k.trim()}</span>
            ))}
            {c.keywords.length > 4 && (
              <span className="pcard__chip pcard__chip--more">+{c.keywords.length - 4}</span>
            )}
          </div>
        ) : (
          <div className="pcard__chips pcard__chips--empty">키워드 없음</div>
        )}
      </div>
    </button>
  );
}
