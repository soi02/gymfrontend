// src/pages/NoticePage.js

import React, { useState } from 'react';
import '../styles/MypageNoticePage.css';
import { useNavigate } from 'react-router-dom';

const dummyNotices = [
    {
        id: 1,
        title: '정진! 신규 업데이트 안내 (v1.1.0)',
        date: '2025.08.20',
        content: `
            안녕하세요, 정진 팀입니다. 
            정진! 앱의 새로운 업데이트가 적용되었습니다. 주요 변경사항은 다음과 같습니다.
            - **운동 기록 기능 개선**: 캘린더 UI를 더 직관적으로 개선하고, 운동 루틴 기록 방식을 간소화했습니다.
            - **마이페이지 UI 개편**: 사용자의 운동 현황을 한눈에 볼 수 있도록 마이페이지 디자인을 전면 개편했습니다.
            - **버그 수정 및 성능 최적화**: 앱 사용 중 발생했던 오류들을 수정하고 전반적인 성능을 향상시켰습니다.
            더 나은 서비스를 제공하기 위해 항상 노력하겠습니다. 감사합니다.
        `,
    },
    {
        id: 2,
        title: '추석 연휴 고객센터 휴무 안내',
        date: '2025.08.15',
        content: `
            안녕하세요, 정진! 입니다.
            추석 연휴(2025년 9월 17일 ~ 9월 19일) 동안 고객센터 운영이 임시 중단됩니다.
            해당 기간 동안 문의사항은 앱 내 1:1 문의를 통해 남겨주시면,
            연휴가 끝난 후 순차적으로 답변 드리겠습니다.
            풍요로운 한가위 보내시기 바랍니다.
        `,
    },
    {
        id: 3,
        title: '서비스 점검 안내: 8월 10일',
        date: '2025.08.09',
        content: `
            안녕하세요. 원활한 서비스 제공을 위해 아래와 같이 정기 점검을 실시합니다.
            - **점검 일시**: 2025년 8월 10일 (토) 02:00 ~ 04:00 (2시간)
            - **내용**: 시스템 안정화 및 서버 업데이트
            점검 시간 동안에는 서비스 이용이 불가능하오니 양해 부탁드립니다.
        `,
    },
];

const MypageNoticePage = () => {
    const [openNoticeId, setOpenNoticeId] = useState(null);
    const navigate = useNavigate();

    const handleNoticeClick = (id) => {
        setOpenNoticeId(openNoticeId === id ? null : id);
    };

    return (
        <div className="notice-container">
            <header className="notice-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                </button>
                <h1>공지사항</h1>
            </header>
            <div className="notice-list">
                {dummyNotices.map((notice) => (
                    <div
                        key={notice.id}
                        className="notice-item"
                    >
                        <div className="notice-summary" onClick={() => handleNoticeClick(notice.id)}>
                            <div className="notice-title-date">
                                <span className="notice-title">{notice.title}</span>
                                <span className="notice-date">{notice.date}</span>
                            </div>
                            <span className="notice-arrow">
                                {openNoticeId === notice.id ? '▲' : '▼'}
                            </span>
                        </div>
                        {openNoticeId === notice.id && (
                            <div className="notice-content">
                                {notice.content.trim().split('\n').map((line, index) => (
                                    <p key={index} dangerouslySetInnerHTML={{ __html: line.trim() }} />
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MypageNoticePage;