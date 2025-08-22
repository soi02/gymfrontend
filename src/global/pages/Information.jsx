import React from "react";
import "../styles/Information.css";

const teamMembers = [
  { name: "강소이" }, { name: "김지은" }, { name: "문정혁" }, { name: "진윤수" },
];

const BASE =
  (typeof import.meta !== "undefined" && import.meta.env?.BASE_URL) ||
  process.env.PUBLIC_URL ||
  "/";

const icon = (file) => `${BASE}images/skil_icon/${file}`;

const localIcons = {
  frontend: [
    { alt: "HTML5", src: icon("icon_HTML.svg") },
    { alt: "CSS3", src: icon("icon_CSS.svg") },
    { alt: "JavaScript", src: icon("icon_JavaScript.svg") },
    { alt: "React", src: icon("icon_React.svg") }, // 예시: 로컬에 React 없으면 VSCode로 임시
    { alt: "Bootstrap", src: icon("icon_Bootstrap.svg") },
    { alt: "Java", src: icon("icon_Java-Dark.svg") },
    { alt: "Spring", src: icon("icon_Spring-Dark.svg") },
    { alt: "MariaDB", src: icon("icon_mariaDB.png") }, 
    { alt: "Linux", src: icon("icon_Linux.svg") }, 
    { alt: "Docker", src: icon("icon_Docker.svg") },
    { alt: "Git", src: icon("icon_Git.svg") },
    { alt: "GitHub", src: icon("icon_Github-Dark.svg") },
    { alt: "Gradle", src: icon("icon_Gradle-Dark.svg") },
    { alt: "Gradle", src: icon("icon_notion.svg") },
    
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

  return (
    <div className="info-page-container">
      <h1 className="info-title">짐마당</h1>
      <p className="info-subtitle">
        매일의 운동을 습관으로 바꾸는 헬스 커뮤니티.
        <br />
        <br />
      </p>
      {/* 꾸준함은 마당에서 자랍니다. */}

      <section className="info-section intro-section">
        <p className="section-content">
          운동기록으로 작은 성장을 남기고, <br /> 수련장에서 한계를 넘어보고,{" "}
          <br />
          벗찾기로 마음 맞는 동료를 만나며,
          <br />
          장터에서 장비와 마음을 나눕니다.
          <br />
          <br />
          {/* 우리는 누군가의 포기가 지속으로 바뀌는 순간을 위해 이 서비스를 만들었습니다.<br /> */}
          혼자가 아니라 우리라서, 오늘도 한 걸음 더.
          <br />
        </p>
      </section>

      <section className="info-section">
        <h2 className="section-title">팀원 소개</h2>
        <div className="team-members-container">
          {teamMembers.map((member, index) => (
            <div key={index} className="member-card">
              <h3>{member.name}</h3>
              <p className="member-role">{member.role}</p>
              <p className="member-tasks">{member.tasks}</p>
            </div>
          ))}
        </div>
      </section>



      <section className="info-section">
        <h2 className="section-title">기술 스택</h2>

        <div className="stack-badge-grid">
          {localIcons.frontend.map((b) => (
            <img key={b.alt} className="stack-badge-img" src={b.src} alt={b.alt} loading="lazy" />
          ))}
        </div>

      </section>



    </div>
  );
};

export default Information;
