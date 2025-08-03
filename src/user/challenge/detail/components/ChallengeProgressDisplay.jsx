import React, { useState } from 'react';
import { format } from 'date-fns';
import '../styles/ChallengeProgressDisplay.css';

// 상태에 따른 아이콘 이미지 URL
const statusIcons = {
    // 여기에 이미지 URL을 넣어주세요. (예: require('../assets/icons/check.png'))
    // 또는 이모지를 그대로 사용해도 됩니다.
    '인증완료': '✅', 
    '결석': '❌',
    '미래': '🗓️'
};

const ChallengeProgressDisplay = ({ statusList }) => {
    // 모달 상태 관리를 위한 state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalPhotoUrl, setModalPhotoUrl] = useState('');
    const BACKEND_BASE_URL = "http://localhost:8080";

    const formatDate = (date) => {
        const d = new Date(date);
        return format(d, 'M/d');
    };

    // 스티커 클릭 시 사진 모달을 여는 함수
    const handleItemClick = (photoUrl) => {
        if (photoUrl) {
            // 백엔드에서 제공하는 URL이 상대경로이므로, 전체 URL로 만들어줍니다.
            const fullUrl = `${BACKEND_BASE_URL}${photoUrl}`;
            setModalPhotoUrl(fullUrl);
            setIsModalOpen(true);
        }
    };

    // 모달을 닫는 함수
    const closeModal = () => {
        setIsModalOpen(false);
        setModalPhotoUrl('');
    };

    if (!statusList || statusList.length === 0) {
        return <div>챌린지 진행 상황 정보가 없습니다.</div>;
    }

    return (
        <div className="progress-display-container">
            <h3>진행 상황 (스티커판)</h3>
            <div className="progress-grid">
                {statusList.map((statusItem, index) => (
                    <div 
                        key={index} 
                        className={`progress-item status-${statusItem.status} ${statusItem.photoUrl ? 'clickable' : ''}`}
                        onClick={() => handleItemClick(statusItem.photoUrl)}
                    >
                        <div className="item-date">{formatDate(statusItem.recordDate)}</div>
                        <div className="item-content">
                            {/* 상태에 따라 아이콘만 렌더링 */}
                            <div className="status-icon">
                                {statusIcons[statusItem.status]}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* 인증 사진 모달 */}
            {isModalOpen && (
                <div className="photo-modal-overlay" onClick={closeModal}>
                    <div className="photo-modal-content" onClick={e => e.stopPropagation()}>
                        <img src={modalPhotoUrl} alt="인증 상세 사진" />
                        <button className="close-modal-btn" onClick={closeModal}>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ChallengeProgressDisplay;