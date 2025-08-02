// src/user/challenge/components/ChallengeAttendanceForm.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
// import { showToast } from '../../../redux/actions/toastActions'; // Toast 알림을 위한 Redux 액션 (예시)
import '../styles/ChallengeAttendanceForm.css'; // 필요 시 CSS 파일 생성

const BACKEND_BASE_URL = "http://localhost:8080";

const ChallengeAttendanceForm = ({ challengeId, userId, onAttendanceSuccess }) => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const dispatch = useDispatch(); // Toast 알림을 위해 Redux dispatch 사용 (예시)

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!photo) {
      alert("사진을 선택해주세요.");
      return;
    }

    if (!userId || !challengeId) {
      setError("사용자 정보 또는 챌린지 정보가 누락되었습니다.");
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('challengeId', challengeId);
    formData.append('photo', photo);

    try {
      // 백엔드 API 호출
      const response = await axios.post(`${BACKEND_BASE_URL}/api/challenge/attendChallengeProcess`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log("인증 성공:", response.data);
      alert("챌린지 인증 완료!");
      
      // 성공 시 부모 컴포넌트(ChallengeMyRecordDetail)에 알림
      onAttendanceSuccess();

      // 상태 초기화
      setPhoto(null);
      
    } catch (err) {
      console.error("인증 실패:", err);
      // 서버에서 보낸 에러 메시지를 표시
      const errorMessage = err.response?.data || "인증 처리 중 오류 발생";
      setError(errorMessage);
      alert(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="attendance-form-container">
      <h3>오늘의 인증</h3>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="photo-upload" className="file-upload-label">
            {photo ? photo.name : "인증 사진 선택"}
          </label>
          <input
            id="photo-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>
        {error && <div className="error-message">{error}</div>}
        <button type="submit" disabled={loading || !photo} className="submit-button">
          {loading ? "업로드 중..." : "인증 완료"}
        </button>
      </form>
    </div>
  );
};

export default ChallengeAttendanceForm;