import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ChallengeCreate.css';
import '../styles/ChallengeCreateModal.css';

export default function StepLayout({ 
    onBack, 
    onNext, 
    children, 
    question, 
    subText, 
    nextButtonText, 
    isNextButtonDisabled = false 
}) {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleClose = () => {
        setIsModalOpen(true);
    };

    const handleConfirmExit = () => {
        setIsModalOpen(false);
        navigate('/gymmadang/challenge');
    };

    const handleCancelExit = () => {
        setIsModalOpen(false);
    };

    return (
        <div className="step-layout-container">
            {/* 뒤로가기 및 엑스 버튼 헤더 */}
            <div className="step-start-header">
                <button className="ch-create-back-button" onClick={onBack}>&lt;</button>
                <button className="ch-create-close-button" onClick={handleClose}>&times;</button>
            </div>

            {/* 페이지별 제목, 소제목, 콘텐츠 영역 */}
            <div className="step-content-wrapper">
                {/* 제목 */}
                {question && <h2 
                    className="step-start-question" 
                    dangerouslySetInnerHTML={{ __html: question }} 
                />}
                {/* 소제목 */}
                {subText && <p 
                    className="step-start-sub"
                    dangerouslySetInnerHTML={{ __html: subText }}
                />}
                
                {/* 각 스텝의 고유 내용 */}
                <div className="step-page-body">
                    {children}
                </div>

                {/* 다음 단계로 넘어가는 버튼 */}
                {nextButtonText && (
                    <button 
                        className="step-start-next-button" 
                        onClick={onNext}
                        disabled={isNextButtonDisabled}
                    >
                        {nextButtonText}
                    </button>
                )}
            </div>

            {/* 모달 */}
            {isModalOpen && (
                <div className="ch-create-stop-modal-overlay">
                    <div className="ch-create-stop-modal">
                        <div className="ch-create-stop-modal-content">
                            <p className="ch-create-stop-modal-message">신규 수련 생성을 중단하시겠소?</p>
                            <p className="ch-create-stop-modal-sub-message">입력한 내용은 저장되지 않소.</p>
                        </div>
                        <div className="ch-create-stop-modal-buttons">
                            <button className="ch-create-stop-modal-cancel-button" onClick={handleCancelExit}>계속하겠소</button>
                            <button className="ch-create-stop-modal-exit-button" onClick={handleConfirmExit}>나가겠소</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}