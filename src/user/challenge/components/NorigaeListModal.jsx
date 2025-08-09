// src/user/challenge/components/NorigaeListModal.jsx

import React from 'react';
import '../styles/NorigaeListModal.css'; // 별도 CSS 파일 생성

const NorigaeListModal = ({ isOpen, onClose, norigaeList }) => {
    if (!isOpen) {
        return null;
    }

    // 획득한 노리개 목록이 없으면 다른 메시지를 보여줍니다.
    const hasNorigae = norigaeList && norigaeList.length > 0;

    return (
        <div className="norigae-list-modal-overlay">
            <div className="norigae-list-modal-content">
                <h2>획득한 노리개</h2>
                <div className="norigae-list-container">
                    {hasNorigae ? (
                        norigaeList.map((norigae, index) => (
                            <div key={index} className="norigae-item">
                                <img src={norigae.iconPath} alt={norigae.name} className="norigae-list-icon" />
                                <p>{norigae.name}</p>
                            </div>
                        ))
                    ) : (
                        <p>아직 획득한 노리개가 없습니다.</p>
                    )}
                </div>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default NorigaeListModal;