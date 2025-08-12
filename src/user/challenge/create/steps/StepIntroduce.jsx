import { useState } from 'react';
import StepLayout from './StepLayout';
import '../styles/ChallengeCreate.css';

export default function StepIntroduce({ onNext, onBack, data }) {
  const [title, setTitle] = useState(data.challengeTitle || '');
  const [recommendation, setRecommendation] = useState(data.recommendation || '');
  const [description, setDescription] = useState(data.challengeDescription || '');

  const handleNext = () => {
    if (title.length < 5 || title.length > 20) {
      alert('수련원 이름은 5~20자 이내로 입력해주시오.');
      return;
    }
    onNext({
      challengeTitle: title,
      recommendation,
      challengeDescription: description,
    });
  };

  return (
    <StepLayout
      onBack={onBack}
      onNext={handleNext}
      question='<span class="highlight">수련에 대해 소개해 주시오.</span>'
      subText="어떤 사람들과 어떤 활동을 함께하고 싶소?"
      nextButtonText="다음"
      isNextButtonDisabled={title.length < 5}
    >
      <div className="step-introduce">
        {/* 1) 제목 */}
        <div className="field">
          <label className="field-label">수련 제목</label>
          <input
            className="field-control field-input"
            placeholder="예: 매일 헬스장 출석 인증!"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={20}
          />
          <p className="field-caption">5~20자 이내로 입력해주시오.</p>
        </div>

        {/* 2) 이런 이에게 권하오. */}
        <div className="field">
          <label className="field-label">이런 이에게 권하오.</label>
          <textarea
            className="field-control field-textarea"
            placeholder="예: 해가 진 후에도 몸을 단련하고자 하는 그대! 우리 수련의 동료가 되어주시오!"
            value={recommendation}
            onChange={(e) => setRecommendation(e.target.value)}
            maxLength={100}
          />
          <p className="field-caption">{recommendation.length}/100</p>
        </div>

        {/* 3) 수련 내용 */}
        <div className="field">
          <label className="field-label">수련 내용</label>
          <textarea
            className="field-control field-textarea"
            placeholder="수련의 목표와 진행 방식을 간단히 적어주시오."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={300}
          />
          <p className="field-caption">{description.length}/300</p>
        </div>
      </div>
    </StepLayout>
  );
}
