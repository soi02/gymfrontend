import { useNavigate } from 'react-router-dom';
import testIntroImg from '../../../assets/img/challenge/test/testIntroImg.png';
import '../styles/TestIntro.css';
import { useState } from 'react';
import { useSelector } from 'react-redux'; // Redux 훅 임포트

export default function ChallengeTestIntro() {
  const navigate = useNavigate();
  const [selectedChoice, setSelectedChoice] = useState(null);

  // Redux state에서 사용자 이름 가져오기
  // 실제 Redux state 구조에 맞게 'auth.name' 부분을 수정해주세요.
  const userName = useSelector(state => state.auth.name) || '헬스인'; 

  // 버튼 2개 핸들링 관련
  const handleChoiceClick = (choice) => {
    setSelectedChoice(choice);
    if (choice === 'testStart') {
      navigate('/gymmadang/challenge/challengeTest/step/1');
    } else if (choice === 'testEnd') {
      navigate('/gymmadang/challenge/challengeHome');
    }
  };

  return (
    <div className="test-intro-body">
      <div className="test-intro-container">
        {/* 뒤로 가기 버튼 추가 */}
        <button className="ch-test-back-button" onClick={() => navigate(-1)}>
          &lt;
        </button>

        <div className="test-intro-title">
          <h2>반가워요 {userName}님!</h2>
          <p>
            간단한 테스트로 {userName}님에게
            <br />
            딱 맞는 콘텐츠를 추천해드릴게요.
          </p>
        </div>

        <img src={testIntroImg} alt="성향테스트 인트로" className="test-intro-image" />

        <div className="test-intro-start-btn-group">
          {/* 이전으로 버튼 삭제, 시작하기 버튼만 남김 */}
          <button
            className={`test-intro-start-btn ${selectedChoice === 'testStart' ? 'active' : ''}`}
            onClick={() => handleChoiceClick('testStart')}
          >
            시작하기
          </button>
        </div>
      </div>
    </div>
  );
}