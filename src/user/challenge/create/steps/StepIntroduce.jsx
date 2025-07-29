import { useState } from 'react';
import '../styles/ChallengeCreate.css';

export default function StepIntroduce({ onNext, onBack, data }) {
  const [title, setTitle] = useState(data.challengeTitle || '');
  const [recommendation, setRecommendation] = useState(data.recommendation || '');
  const [description, setDescription] = useState(data.challengeDescription || '');

  const handleNext = () => {
    if (title.length < 5 || title.length > 20) {
      alert('챌린지 명은 5~20자 이내로 입력해주세요.');
      return;
    }
    onNext({
      challengeTitle: title,
      recommendation,
      challengeDescription: description, // onNext 활용해서 챌린지 정보를 폼데이터에 전달
    });
  };

  return (
    <div className="challenge-create-page">
      <button className="back-button" onClick={onBack}>←</button>

      <h3 className="challenge-step-title">챌린지 만들기</h3>
      <h2 className="challenge-step-question">
        <span className="highlight">챌린지를 소개해 주세요.</span>
      </h2>

      <div className="step-introduce-group">
        <label className="step-introduce-label">챌린지 명</label>
        <input
          className="step-introduce-input"
          placeholder="예: 매일 10분 걷기 인증"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={20}
        />
        <p className="step-introduce-caption">5~20자 이내로 입력해주세요.</p>
      </div>

      <div className="step-introduce-group">
        <label className="step-introduce-label">이런 분들께 추천해요.</label>
        <textarea
          className="step-introduce-textarea"
          placeholder="예) 퇴근 후 30분이라도 운동하고 싶은 당신! 저희의 동료가 되어주세요!"
          value={recommendation}
          onChange={(e) => setRecommendation(e.target.value)}
          maxLength={100}
        />
        <p className="step-introduce-caption">{recommendation.length}/100</p>
      </div>

      <div className="step-introduce-group">
        <label className="step-introduce-label">챌린지 소개</label>
        <textarea
          className="step-introduce-textarea"
          placeholder="챌린지를 소개하는 글을 적어주세요. 어떤 목표를 향해 함께 달려가게 될까요?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={300}
        />
        <p className="step-introduce-caption">{description.length}/300</p>
      </div>

      <button className="next-button" onClick={handleNext}>다음</button>
    </div>
  );
}
