import { useState } from 'react';
import '../styles/ChallengeCreate.css';

export default function StepImage({ onNext, onBack, data }) {
  const [preview, setPreview] = useState(data.imagePreview || null);
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleNext = () => {
    if (!file) {
      alert('대표 이미지를 선택해주세요.');
      return;
    }

    onNext({
      challengeImage: file,
      imagePreview: preview,
    });
  };

  return (
    <div className="challenge-create-page">
      <button className="back-button" onClick={onBack}>←</button>

      <h3 className="challenge-step-title">챌린지 만들기</h3>
      <h2 className="challenge-step-question">
        <span className="highlight">대표 이미지를 선택해주세요.</span>
      </h2>

      <label className="step-image-upload-box">
        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleFileChange} />
        <div className="step-image-upload-content">
          <span className="step-image-plus">＋</span>
          <p className="step-image-text">챌린지를 한눈에 보여줄<br />대표 이미지를 등록하세요.</p>
        </div>
      </label>

      {preview && (
        <div className="step-image-preview">
          <p className="step-image-preview-title">이미지 미리보기</p>
          <img src={preview} alt="Preview" className="step-image-preview-img" />
        </div>
      )}

      <button className="next-button" onClick={handleNext}>다음</button>
    </div>
  );
}
