import React from 'react';
import '../styles/NorigaeAwardModal.css';

const NorigaeAwardModal = ({ isOpen, onClose, awardedTierId }) => {
    if (!isOpen || !awardedTierId) {
        return null;
    }

    let norigaeImage, norigaeName;
    switch (awardedTierId) {
        case 1:
            norigaeImage = 'http://googleusercontent.com/file_content/2'; // Bronze image URL
            norigaeName = 'Bronze';
            break;
        case 2:
            norigaeImage = 'http://googleusercontent.com/file_content/3'; // Silver image URL
            norigaeName = 'Silver';
            break;
        case 3:
            norigaeImage = 'http://googleusercontent.com/file_content/1'; // Gold image URL
            norigaeName = 'Gold';
            break;
        default:
            return null;
    }

    return (
        <div className="norigae-modal-overlay">
            <div className="norigae-modal-content">
                <h2>축하합니다!</h2>
                <p>
                    <span className="norigae-name">{norigaeName}</span> 노리개를 획득했습니다!
                </p>
                <img src={norigaeImage} alt={`${norigaeName} 노리개`} className="norigae-badge" />
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
};

export default NorigaeAwardModal;