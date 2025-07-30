import './ChallengeStartModal.css';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function ChallengeStartModal({ onClose, challengeId }) {
  const userId = useSelector((state) => state.auth.id);
  const navigate = useNavigate();

  const handleStart = async () => {
    try {
      await axios.post(`http://localhost:8080/api/userChallenge/start`, {
        userId,
        challengeId,
      });

      alert("도전을 시작했어요!");
      onClose();
      navigate('/gymmadang/myChallenge'); // 마이페이지로 이동 (원하면 변경 가능)
    } catch (err) {
      console.error("도전 시작 실패", err);
      alert("도전 시작에 실패했습니다.");
    }
  };

  return (
    <div className="challenge-modal-overlay" onClick={onClose}>
      <div className="challenge-modal-sheet" onClick={(e) => e.stopPropagation()}>
        <div className="modal-icon">🔥</div>
        <h3 className="modal-title">챌린지를 시작할까요?</h3>
        <p className="modal-description">
          도전에 참여하면 <strong>도중에 취소할 수 없어요</strong>.<br />
          끝까지 함께할 준비 되셨나요?
        </p>

        <div className="modal-buttons">
          <button className="cancel-button" onClick={onClose}>취소</button>
          <button className="start-button" onClick={handleStart}>도전 시작하기</button>
        </div>
      </div>
    </div>
  );
}
