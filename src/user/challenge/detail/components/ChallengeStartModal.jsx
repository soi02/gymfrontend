import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ChallengeStartModal.css';

export default function ChallengeStartModal({ onClose, challengeId }) {
  const userId = useSelector((state) => state.auth.id);
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false); // 중복 클릭 방지 상태

  const handleStart = async () => {
    if (isProcessing) return; // 이미 처리 중이면 함수 종료
    setIsProcessing(true); // 처리 시작

    try {
      await axios.post(`http://localhost:8080/api/challenge/startChallengeProcess`, {
        userId,
        challengeId,
      });

      alert("도전을 시작했어요! 이제부터 챌린지 페이지에서 진행 상황을 확인할 수 있습니다.");
      onClose();
      navigate('/my-challenges'); // 사용자가 참여한 챌린지 목록 페이지로 이동
    } catch (err) {
      console.error("도전 시작 실패", err);
      // HTTP 409 Conflict: 이미 참여 중인 경우
      if (err.response && err.response.status === 409) {
          alert("이미 이 챌린지에 참여 중입니다.");
      } else {
          alert("도전 시작에 실패했습니다. 다시 시도해 주세요.");
      }
    } finally {
        setIsProcessing(false); // 처리 종료
    }
  };

  return (
    <div className="challenge-start-modal-backdrop" onClick={onClose}>
      <div className="challenge-start-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="challenge-start-modal-header">
          <h3 className="challenge-start-modal-title">챌린지를 시작할까요?</h3>
        </div>
        <div className="challenge-start-modal-body">
          <p className="challenge-start-modal-description">
            도전에 참여하면 중간에 취소할 수 없습니다.<br />
            끝까지 함께할 준비가 되셨나요?
          </p>
          <div className="challenge-start-modal-buttons">
            <button className="challenge-start-modal-btn challenge-start-modal-btn-cancel" onClick={onClose} disabled={isProcessing}>취소</button>
            <button 
              className="challenge-start-modal-btn challenge-start-modal-btn-primary" 
              onClick={handleStart} 
              disabled={isProcessing}
            >
              {isProcessing ? '처리 중...' : '도전 시작하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}