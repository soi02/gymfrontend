import { useNavigate } from 'react-router-dom';
import targetIntroImg from '../../../assets/img/challenge/target_img.png'; // ← 실제 경로에 맞게 수정
import '../styles/TestIntro.css';
import { useState } from 'react';

export default function ChallengeTestIntro({ userName = '윤수' }) {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice]= useState(null);


  // 버튼 2개 핸들링 관련
  const handleChoiceClick = (choice) => {
    setSelectedChoice(choice);
    if(choice === 'testStart') {
      navigate('/gymmadang/challenge/challengeTest/step/1');
    } else if(choice === 'testEnd') {
      navigate('/gymmadang/challenge/challengeHome');
    }
  }

  return (
    <div className="test-intro-body">
      <div className="test-intro-container">
        <div className="test-intro-title">
          <h2>반가워요 {userName}님!</h2>
          <p>
            간단한 테스트로 {userName}님에게<br />
            딱 맞는 콘텐츠를 추천해드릴게요.
          </p>
        </div>

        <img src={targetIntroImg} alt="성향테스트 인트로" className="test-intro-image" />

        <div className="test-intro-start-btn-group">
            <button className={`test-intro-start-btn ${selectedChoice === 'testStart' ? 'active' : ''}`}
                    onClick={() => handleChoiceClick('testStart')}>
                시작하기
            </button>
            <button className={`test-intro-start-btn ${selectedChoice === 'testEnd' ? 'active' : ''}`}
                    onClick={() => handleChoiceClick('testEnd')}>
                이전으로
            </button>
        </div>

      </div>
    </div>
  );
}