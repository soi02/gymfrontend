import { useState } from 'react';
import '../styles/ChallengeCreate.css';
import agreementImage from '/src/assets/img/challenge/create/agreement.png';
import StepLayout from './StepLayout';


export default function StepAgreement({ onNext, onBack }) {
    const [agreements, setAgreements] = useState([false, false, false]);
    const allChecked = agreements.every(Boolean);

    const toggleCheck = (index) => {
        setAgreements((prev) => {
            const copy = [...prev];
            copy[index] = !copy[index];
            return copy;
        });
    };

    return (
        <StepLayout
            onBack={onBack}
            onNext={() => onNext({})}
            question="새로운 수련을 생성하기 전, <br />3가지를 약조해 주시오!"
            subText="우리의 다짐을 되새기며 약조에 동의해주시오."
            nextButtonText="만들기"
            isNextButtonDisabled={!allChecked}
        >
            {/* 이미지 및 콘텐츠는 children으로 전달 */}
            <div className="step-agreement-image-container">
                <img src={agreementImage} alt="약속 캐릭터" className="step-agreement-image" />
            </div>
            <ul className="step-agreement-list">
                <li className="step-agreement-item">
                    <input 
                        type="checkbox" 
                        id="agreement1"
                        checked={agreements[0]} 
                        onChange={() => toggleCheck(0)} 
                        className="step-agreement-checkbox"
                    />
                    <label htmlFor="agreement1" className="step-agreement-label">
                        만든 수련은 끝까지 책임질 것이오.
                    </label>
                    </li>
                    <li className="step-agreement-item">
                        <input 
                            type="checkbox" 
                            id="agreement2"
                            checked={agreements[1]} 
                            onChange={() => toggleCheck(1)} 
                            className="step-agreement-checkbox"
                        />
                        <label htmlFor="agreement2" className="step-agreement-label">
                            참가자들이 무리하지 않도록 목표를 정하겠소.
                        </label>
                    </li>
                    <li className="step-agreement-item">
                        <input 
                            type="checkbox" 
                            id="agreement3"
                            checked={agreements[2]} 
                            onChange={() => toggleCheck(2)} 
                            className="step-agreement-checkbox"
                        />
                        <label htmlFor="agreement3" className="step-agreement-label">
                            모두가 즐길 수 있는 수련을 만들겠소.
                        </label>
                    </li>
                </ul>
        </StepLayout>
    );
}