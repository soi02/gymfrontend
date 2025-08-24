import React, { useState } from 'react';
import '../styles/ShareModal.css';

const ShareModal = ({ isOpen, onClose, shareUrl }) => {
    const [copied, setCopied] = useState(false);

    if (!isOpen) return null;

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('클립보드 복사 실패:', err);
        }
    };

    const handleShare = () => {
        alert('준비 중인 기능입니다.');
    };

    return (
        <div className="share-modal-backdrop" onClick={onClose}>
            <div className="share-modal-content" onClick={e => e.stopPropagation()}>
                <h2>공유하기</h2>
                <div className="share-buttons">
                    <button className="share-button kakao" onClick={handleShare}>
                        <div className="kakao-icon">
                            <img src="/images/kakao.svg" alt="카카오톡" />
                        </div>
                        <span>카카오톡</span>
                    </button>
                    <button className="share-button twitter" onClick={handleShare}>
                        <i className="bi bi-twitter"></i>
                        <span>트위터</span>
                    </button>
                    <button className="share-button instagram" onClick={handleShare}>
                        <i className="bi bi-instagram"></i>
                        <span>인스타그램</span>
                    </button>
                </div>
                <div className="share-link-container">
                    <input 
                        type="text" 
                        value={shareUrl} 
                        readOnly 
                        className="share-link-input"
                    />
                    <button 
                        className="copy-link-button"
                        onClick={handleCopyLink}
                    >
                        {copied ? '복사됨!' : '링크 복사'}
                    </button>
                </div>
                <button className="close-button" onClick={onClose}>
                    <i className="bi bi-x"></i>
                </button>
            </div>
        </div>
    );
};

export default ShareModal;
