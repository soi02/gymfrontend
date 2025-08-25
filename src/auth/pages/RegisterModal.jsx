import React from 'react';
import './RegisterModal.css';

const RegisterModal = ({ isOpen, onConfirm }) => {
    if (!isOpen) return null;

    return (
        <div className="register-modal-overlay">
            <div className="register-modal">
                <div className="register-modal-content">
                    <p className="register-modal-message">짐마당에 오신걸 환영합니다.</p>
                    <button className="register-modal-button" onClick={onConfirm}>
                        로그인하러 가기
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RegisterModal;
