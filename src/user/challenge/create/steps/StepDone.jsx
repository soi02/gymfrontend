import { useNavigate } from 'react-router-dom';
import StepLayout from './StepLayout';
import doneImage from '/src/assets/img/challenge/create/createComplete.png';
import '../styles/ChallengeCreate.css';

export default function StepDone() {
  const navigate = useNavigate();

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: '수련에 초대하오!',
          text: '이 수련에 함께 참여해보시오 💪',
          url: window.location.origin + '/gymmadang/challenge/challengeList',
        });
      } catch (err) {
        console.error('공유 실패:', err);
      }
    } else {
      alert('공유 기능을 지원하지 않는 브라우저이오.');
    }
  };

  const handleGoToList = () => {
    navigate('/gymmadang/challenge/challengeList');
  };

  return (
    <StepLayout
      onBack={null} // 뒤로가기 버튼을 숨깁니다.
      onNext={handleShare}
      question='<span class="highlight">수련이 성공적으로 등록되었소!</span>'
      subText="함께 수련하고 싶은 동료들에게<br />수련 정보를 공유해 보시오."
      nextButtonText="공유하기"
      isNextButtonDisabled={false}
      isFooterFixed={true}
    >
      <div className="step-done-image-container">
        <img src={doneImage} alt="수련 등록 완료" className="step-done-image" />
      </div>
      <div className="step-done-buttons">
        <button className="step-done-secondary-button" onClick={handleGoToList}>
          수련 목록 보기
        </button>
      </div>
    </StepLayout>
  );
}