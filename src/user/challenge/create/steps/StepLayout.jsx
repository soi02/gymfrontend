// StepLayout.jsx (수정)
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

  const handleClose = () => setIsModalOpen(true);
  
  // 엑스 버튼 클릭 시 이동 경로를 /challenge/challengeList 로 변경
  const handleConfirmExit = () => { setIsModalOpen(false); navigate('/challenge/challengeList'); };
  
  const handleCancelExit = () => setIsModalOpen(false);

  return (
    <div className="step-layout-container">
      {/* 헤더 */}
      <div className="step-start-header">
        {/* onBack 프롭스가 있을 때만 뒤로 가기 버튼 렌더링 */}
        {onBack && <button className="ch-create-back-button" onClick={onBack}>&lt;</button>}
        <button className="ch-create-close-button" onClick={handleClose}>&times;</button>
      </div>

      {/* 본문(가운데만 스크롤) */}
      <div className="step-content-wrapper">
        {question && (
          <h2
            className="step-start-question"
            dangerouslySetInnerHTML={{ __html: question }}
          />
        )}
        {subText && (
          <p
            className="step-start-sub"
            dangerouslySetInnerHTML={{ __html: subText }}
          />
        )}

        <div className="step-page-body">
          {children}
        </div>
      </div>

      {/* 푸터(스크롤 밖) */}
      {nextButtonText && (
        <footer className="step-footer">
          <button
            className="step-start-next-button"
            onClick={onNext}
            disabled={isNextButtonDisabled}
          >
            {nextButtonText}
          </button>
        </footer>
      )}

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