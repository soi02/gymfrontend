import React, { useState, useEffect, useRef } from "react";
import "../styles/Information.css";

const teamMembers = [
  { name: "강소이" },
  { name: "김지은" },
  { name: "문정혁" },
  { name: "진윤수" },
];

const BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) ||
  process.env.PUBLIC_URL ||
  "/";

// 팀 사진 매핑 (예시 경로)
const memberPhotos = {
  "강소이": `${BASE}images/member/soi.png`,
  "김지은": `${BASE}images/member/jinny.png`,
  "문정혁": `${BASE}images/member/hyuk.png`,
  "진윤수": `${BASE}images/member/su.png`,
};

const icon = (file) => `${BASE}images/skil_icon/${file}`;

const localIcons = {
  frontend: [
    { alt: "HTML5", src: icon("icon_HTML.svg") },
    { alt: "CSS3", src: icon("icon_CSS.svg") },
    { alt: "JavaScript", src: icon("icon_JavaScript.svg") },
    { alt: "React", src: icon("icon_React.svg") },
    { alt: "Bootstrap", src: icon("icon_Bootstrap.svg") },
    { alt: "Java", src: icon("icon_Java-Dark.svg") },
    { alt: "Spring", src: icon("icon_Spring-Dark.svg") },
    { alt: "MariaDB", src: icon("icon_mariaDB.png") },
    { alt: "Linux", src: icon("icon_Linux.svg") },
    { alt: "Docker", src: icon("icon_Docker.svg") },
    { alt: "Git", src: icon("icon_Git.svg") },
    { alt: "GitHub", src: icon("icon_Github-Dark.svg") },
    { alt: "Gradle", src: icon("icon_Gradle-Dark.svg") },
    { alt: "Notion", src: icon("icon_notion.svg") },
  ],
};

function TechBadge({ alt, src }) {
  const [fail, setFail] = useState(false);
  if (fail) {
    return (
      <span className="stack-chip" title={alt}>
        <i className="ri-checkbox-blank-circle-fill" /> {alt}
      </span>
    );
  }
  return (
    <img
      className="stack-badge"
      src={src}
      alt={alt}
      loading="lazy"
      referrerPolicy="no-referrer"
      onError={() => setFail(true)}
    />
  );
}
const Information = () => {
  const [openMember, setOpenMember] = useState(null); // { name, src, anchor:{x,y} } | null
  const rowRef = useRef(null);

  const openModal = (name) => {
    const src = memberPhotos[name];
    if (!src || !rowRef.current) return;

    const row = rowRef.current.getBoundingClientRect();
    const anchorX = row.left + row.width / 2; // 마패 줄의 중앙 X
    const anchorY = row.top;                  // 마패 줄의 "위" Y

    setOpenMember({ name, src, anchor: { x: anchorX, y: anchorY } });
  };

  const closeModal = () => setOpenMember(null);

  useEffect(() => {
    if (!openMember) return;
    const onKey = (e) => e.key === "Escape" && closeModal();
    const onScrollOrResize = () => closeModal(); // 스크롤/리사이즈 시 닫음(깜빡임 방지)
    window.addEventListener("keydown", onKey);
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
    };
  }, [openMember]);
  return (
    <div className="info-page-container">
      {/* ===== Intro (Clean) ===== */}


      <section className="info-section intro-clean">
        <h1 className="app-title">짐마당</h1>
        <p className="app-sub">
          매일의 운동을 습관으로 바꾸는 헬스 커뮤니티<br />
          혼자가 아닌 우리기에, 오늘도 한 걸음 더.
        </p>

        <h2 className="section-title">짐마당에서는</h2>

        <div className="app-callout app-callout--stripe">
          <p className="app-body">
            운동기록으로 작은 성장을 남기고, <br />
            수련장에서 한계를 넘어보고, <br />
            벗찾기로 마음 맞는 동료를 만나며, <br />
            장터에서 장비와 마음을 나눕니다.<br />
          </p>
        </div>
      </section>

<section className="info-section">
  <h2 className="section-title">마당지기</h2>
  <ul className="hopae-row" ref={rowRef}>
    {teamMembers.map((m, i) => (
      <li
        key={m.name}
        className={`hopae hopae--paper hopae--vertical hopae--v${(i % 4) + 1} hopae--ring-thin`}
        title={m.name}
          onClick={(e) => openModal(m.name)}

        aria-label={m.name}
      >
        <button
          type="button"
          className="hopae-btn"
          // onClick={(e) => openModal(m.name)}
          aria-haspopup="dialog"
          aria-controls="member-photo-popover"
        >
          <span className="hopae-hole" aria-hidden="true" />
          <span className="hopae-string" aria-hidden="true" />
          <span className="hopae-name">{m.name}</span>
          <span className="hopae-seal" aria-hidden="true">印</span>
        </button>
      </li>
    ))}
  </ul>
</section>


      <section className="info-section">
        <h2 className="section-title">기술 스택</h2>
        <div className="stack-badge-grid">
          {localIcons.frontend.map((b) => (
            <img
              key={b.alt}
              className="stack-badge-img"
              src={b.src}
              alt={b.alt}
              loading="lazy"
            />
          ))}
        </div>
      </section>

{openMember && (
  <>
    <button className="pic-pop-overlay" onClick={closeModal} aria-label="닫기 배경" />
    <div
      id="member-photo-popover"
      role="dialog"
      aria-modal="true"
      aria-labelledby="member-photo-title"
      className="pic-pop-card"
      style={{
        left: `${openMember.anchor.x}px`,
        top: `${openMember.anchor.y}px`,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="pic-pop-header">
        <h3 id="member-photo-title">{openMember.name}</h3>
        <button type="button" className="pic-pop-close" onClick={closeModal} aria-label="닫기">×</button>
      </div>
      <div className="pic-pop-body">
        <img src={openMember.src} alt={`${openMember.name} 사진`} />
      </div>
      {/* <span className="pic-pop-arrow" aria-hidden="true" /> */}
    </div>
  </>
)}

    </div>
  );
};

export default Information;
