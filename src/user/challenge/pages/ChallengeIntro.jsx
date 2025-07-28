import { useNavigate } from 'react-router-dom';
import '../styles/ChallengeIntro.css';

import challengeImg from "../../../assets/img/challenge/challenge_char.png";
import { useEffect, useRef, useState } from 'react';


export default function ChallengeIntro() {
  const navigate = useNavigate();

  // 말풍선
  const challengeFullText = `수련장에 발을 들이신 것을 환영하오.\n혼자서도, 여럿이도 좋으니 도전해보겠소?`;
  const [challengeDisplayedText, setChallengeDisplayedText] = useState('');
  const indexRef = useRef(0);

  // 버튼 선택
  const [selectedChoice, setSelectedChoice] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentIndex = indexRef.current;
      const nextChar = challengeFullText[currentIndex];

      if (nextChar !== undefined) {
        setChallengeDisplayedText((prev) => prev + nextChar);
        indexRef.current += 1;
      } else {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, [challengeFullText]);
  


  // 버튼 2개 핸들링 관련
  const handleChoiceClick = (choice) => {
    setSelectedChoice(choice);
    if(choice === 'test') {
      navigate('/gymmadang/challenge/challengeTest/intro');
    } else if(choice === 'lookAround') {
      navigate('/gymmadang/challenge/challengeHome');
    }
  }


  return (
    <div className="challenge-intro-body">
      <div className="challenge-intro-welcome-container">
        <div className="challenge-intro-content">
          <h6 className="challenge-intro-title">수련장</h6>

          <div className="challenge-intro-character-with-speech">

            <img
              src={challengeImg}
              alt="챌린지 이미지"
              className="challenge-intro-character-img"
            />

            <div className="challenge-intro-speech-bubble">
              <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{challengeDisplayedText}</p>
              <div className='challenge-intro-speech-arrow'></div>
            </div>


            <div className="challenge-intro-gap-helper">
              <p className="challenge-intro-helper-text">수련을 시작하려면 아래 중 하나를 선택해보시오</p>
            </div>

          </div>

        </div>
      </div>


<div className="challenge-choice-group">
  <button
    className={`challenge-choice-btn ${selectedChoice === 'test' ? 'active' : ''}`}
    onClick={() => handleChoiceClick('test')}
  >
    성향을 알아보고<br />수련을 추천받겠소
  </button>

  <button
    className={`challenge-choice-btn ${selectedChoice === 'lookAround' ? 'active' : ''}`}
    onClick={() => handleChoiceClick('lookAround')}
  >
    곧장 수련장을<br />둘러보겠소
  </button>
</div>

    </div>

  );
}

