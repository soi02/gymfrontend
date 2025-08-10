import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import challengeImg from "../../../assets/img/challenge/challenge_char.png";
import '../styles/ChallengeIntro.css';

export default function ChallengeIntro() {
  const navigate = useNavigate();

  const challengeFullText = `수련장에 발을 들이신 것을 환영하오.\n혼자서도, 여럿이도 좋으니 도전해보겠소?`;
  const [challengeDisplayedText, setChallengeDisplayedText] = useState('');
  const indexRef = useRef(0);

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

  const handleChoiceClick = (choice) => {
    setSelectedChoice(choice);
    if(choice === 'test') {
      navigate('/gymmadang/challenge/challengeTest/intro');
    } else if(choice === 'lookAround') {
      navigate('/gymmadang/challenge/challengeHome');
    }
  }

  return (
    <>
      <div className="ch-main-content">
        <div className="ch-intro-body">
          <div className="ch-intro-container">
            <div className="ch-intro-content">

              <div className="ch-divider-line"></div>
              <div className="ch-intro-title">수련장</div>

              {/* 캐릭터와 말풍선을 세로로 배치하는 새로운 컨테이너 */}
              <div className="ch-character-and-bubble-container">
                <img
                  src={challengeImg}
                  alt="챌린지 이미지"
                  className="ch-intro-character-img"
                />
                <div className="ch-speech-bubble">
                  <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{challengeDisplayedText}</p>
                  <div className='ch-speech-arrow'></div>
                </div>
              </div>

              <div className="ch-helper-text-container">
                <p className="ch-helper-text">수련을 시작하려면 아래 중 하나를 선택해보시오</p>
              </div>

            </div>
          </div>
        </div>
      </div>

      <div className="ch-bottom-buttons">
        <button
          className={`ch-choice-btn ${selectedChoice === 'test' ? 'active' : ''}`}
          onClick={() => handleChoiceClick('test')}
        >
          성향을 알아보고<br />수련을 추천받겠소
        </button>
        <button
          className={`ch-choice-btn-2 ${selectedChoice === 'lookAround' ? 'active' : ''}`}
          onClick={() => handleChoiceClick('lookAround')}
        >
          곧장 수련장을<br />둘러보겠소
        </button>
      </div>
    </>
  );
}