import React from 'react';
import startImage from '/src/assets/img/challenge/create/createChallenge.png';
import '../styles/ChallengeCreate.css';
import StepLayout from './StepLayout';

export default function StepStart({ onNext, onBack }) {
    return (
        <StepLayout 
            onBack={onBack}
            onNext={() => onNext({})}
            question="새로운 수련을 만들어보시겠소?"
            subText="직접 수련을 만들고, 함께할 동료들을 모아보시오."
            nextButtonText="시작하기"
            isNextButtonDisabled={false} // 필요에 따라 상태에 따라 변경 가능
        >
            {/* 이미지 및 콘텐츠는 children으로 전달 */}
            <div className="step-start-image-container">
                <img src={startImage} alt="유저 5인" className="step-start-image" />
            </div>
        </StepLayout>
    );
}