import React from 'react';
import '../styles/Information.css';

const teamMembers = [
  {
    name: "강소이",
    role: "백엔드 개발, 데이터베이스 설계",
    tasks: "사용자 인증, 챌린지 시스템, 버디 매칭 로직 구현"
  },
  {
    name: "김지은",
    role: "프론트엔드 개발, UI/UX 디자인",
    tasks: "메인 페이지, 루틴 기록 기능, 탭 바 및 헤더 UI 개발"
  },
  {
    name: "문정혁",
    role: "프론트엔드 개발, 웹RTC",
    tasks: "버디 채팅 및 화상 통화 기능, 마이페이지 구현"
  },
  {
    name: "진윤수",
    role: "백엔드 개발, 서버 관리",
    tasks: "장터 기능, 알림 시스템, 결제 연동"
  }
];

const Information = () => {
    const techStackIcons = [
    { name: 'React', icon: <i className="ri-reactjs-fill"></i>, bgColor: '#61DAFB' },
    { name: 'JavaScript', icon: <i className="ri-file-js-line"></i>, bgColor: '#F7DF1E' },
    { name: 'Java', icon: <i className="ri-java-fill"></i>, bgColor: '#007396' },
    { name: 'Spring', icon: <i className="ri-leaf-fill"></i>, bgColor: '#6DB33F' }, // Spring 아이콘 변경
    { name: 'MariaDB', icon: <i className="ri-database-2-line"></i>, bgColor: '#003545' },
    { name: 'WebSocket', icon: <i className="ri-websocket-line"></i>, bgColor: '#68B0AB' },
    { name: 'Docker', icon: <i className="ri-docker-fill"></i>, bgColor: '#2496ED' },
    { name: 'Git', icon: <i className="ri-git-branch-line"></i>, bgColor: '#F05032' },
  ];
  return (
    <div className="info-page-container">
      <h1 className="info-title">짐마당</h1>
      <p className="info-subtitle">함께 성장하는 운동의 동반자</p>
      
      <section className="info-section intro-section">
        <p className="section-content">
          혼자 하는 운동은 쉽고 빠르게 지칩니다. '짐마당'은 조선 시대의 '마당'처럼, 모두가 함께 모여 운동하고 성장하는 커뮤니티입니다. 
          서로에게 동기부여를 얻고, 즐겁게 운동을 지속할 수 있는 새로운 경험을 선사합니다.
        </p>
      </section>

     <section className="info-section">
        <h2 className="section-title">핵심 기술 스택</h2>
        <div className="tech-stack-container">
          {techStackIcons.map((tech, index) => (
            <div 
              key={index} 
              className="tech-icon-wrapper" 
              style={{ backgroundColor: tech.bgColor }}
            >
              {tech.icon}
            </div>
          ))}
        </div>
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
    </div>
  );
};

export default Information;