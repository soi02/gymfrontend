import { useNavigate } from 'react-router-dom';
import '../styles/ChallengeCreate.css';

export default function StepDone() {
  const navigate = useNavigate();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '챌린지에 초대합니다!',
          text: '이 챌린지에 함께 참여해보세요 💪',
          url: window.location.origin + '/challengeList', // 예: http://localhost:5173/challengeList
        });
      } catch (err) {
        console.error('공유 실패:', err);
      }
    } else {
      alert('공유 기능을 지원하지 않는 브라우저입니다.');
    }
  };

  const handleGoToList = () => {
    navigate('/gymmadang/challenge/challengeList'); // 각 스텝에서 onNext(data) → formData에 데이터가 누적됨. → Stepper 에서 이어서 처리
  };

  return (
    <div className="challenge-create-page step-done">
      <button className="close-button" onClick={handleGoToList}>✕</button>

      <h2 className="challenge-step-question">챌린지를 만들었어요!</h2>
      <p className="challenge-step-sub">
        함께하고 싶은 친구들에게<br />크루를 공유해 보세요.
      </p>

      <button className="next-button" onClick={handleShare}>공유하기</button>
      <button className="step-done-secondary-button" onClick={handleGoToList}>전체 챌린지 목록으로</button>
    </div>
  );
}
