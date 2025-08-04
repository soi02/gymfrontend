import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/ChallengeCreate.css';
import startImage from '/src/assets/img/challenge/test/createChallenge.png';


export default function StepStart({ onNext, onBack }) {
    const navigate = useNavigate();
    
    return (
        <div className="step-start-page">
            <div className="step-start-back-button-container">
                {/* CSS 파일의 back-button 클래스 적용 */}
                <button 
                    className="back-button" 
                    onClick={onBack}
                >
                    ←
                </button>
            </div>
            
            <h2 className="step-start-question">새로운 수련을 만들어보시겠소?</h2>
            <p className="step-start-sub">
                직접 수련을 만들고, 함께할 동료들을 모아보시오.
            </p>
            
            <div className="step-start-image-container">
                <img src={startImage} alt="유저 5인" className="step-start-image" />
            </div>

            <button 
                className="step-start-next-button" 
                onClick={() => onNext({})}
            >
                시작하기
            </button>
        </div>
    );
}