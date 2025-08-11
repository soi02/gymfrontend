import { useState } from 'react';
import StepLayout from './StepLayout';
import '../styles/ChallengeCreate.css';

export default function StepImage({ onNext, onBack, data }) {
  const [preview, setPreview] = useState(data.imagePreview || null);
  const [file, setFile] = useState(null);

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleNext = () => {
    if (!file) {
      alert('수련을 대표하는 그림을 선택해주시오.');
      return;
    }
    onNext({
      challengeThumbnailImage: file,
      imagePreview: preview,
    });
  };

  return (
    <StepLayout
      onBack={onBack}
      onNext={handleNext}
      question='<span class="highlight">수련을 대표할 사진을<br />골라주시오.</span>'
      subText="다른 이들에게 수련을 한눈에 보여줄 그림이오."
      nextButtonText="다음"
      isNextButtonDisabled={!file}
    >
      <label className="step-image-upload-box">
        <input
          type="file"
          name="challengeThumbnailImage"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleChange}
        />
        <div className="step-image-upload-content">
          <span className="step-image-plus">＋</span>
          <p className="step-image-text">
            수련을 한눈에 보여줄<br />대표 그림을 등록해주시오.
          </p>
        </div>
      </label>
      {preview && (
        <div className="step-image-preview">
          <p className="step-image-preview-title">그림 미리보기</p>
          <img src={preview} alt="Preview" className="step-image-preview-img" />
        </div>
      )}
    </StepLayout>
  );
}