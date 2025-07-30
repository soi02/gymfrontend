import { useState } from 'react';
import '../styles/ChallengeCreate.css';

export default function StepImage({ onNext, onBack, data }) {
  const [preview, setPreview] = useState(data.imagePreview || null);
  const [file, setFile] = useState(null);

const handleChange = (e) => {
  const { name, type, value, checked, files } = e.target;

  if (type === "file") {
    const selectedFile = files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  } else {
    // 다른 input은 무시하거나 이후 확장 가능
  }
};

//   const handleFileChange = (e) => {
//     const selectedFile = e.target.files[0];
//     if (selectedFile) {
//       setFile(selectedFile);
//       setPreview(URL.createObjectURL(selectedFile));
//     }
//   };


//  const handleChange = (e) => {
//         const { name, value, type, checked } = e.target;
//         // setFormData({
//         //     ...formData,
//         //     [name]: type === "checkbox" ? checked : value
//         // });
//         if (type === "file") {
//             // 파일 입력인 경우에만 e.target.files에 접근합니다.
//             setFormData({
//                 ...formData,
//                 [name]: e.target.files[0] // 선택된 첫 번째 파일 (File 객체)을 저장합니다.
//             });
//         } else {
//             // 그 외의 입력 (텍스트, 체크박스 등)은 기존 방식대로 처리합니다.
//             setFormData({
//                 ...formData,
//                 [name]: type === "checkbox" ? checked : value
//             });
//         }
//     };

  const handleNext = () => {
    if (!file) {
      alert('대표 이미지를 선택해주세요.');
      return;
    }

    onNext({
      challengeThumnailImage: file
      // imagePreview: preview, // onNext 활용해서 이미지랑, 이미지 미리보기를 폼데이터에 전달
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
        <input type="file" name='challengeThumnailImage' accept="image/*" style={{ display: 'none' }} onChange={handleChange} />
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
