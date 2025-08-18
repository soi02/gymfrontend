import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import '../styles/ChallengeAttendanceForm.css';

const BACKEND_BASE_URL = 'http://localhost:8080';
const MAX_MB = 15;

export default function ChallengeAttendanceForm({ challengeId, userId, onAttendanceSuccess }) {
  const inputRef = useRef(null);

  const [photo, setPhoto] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // 미리보기 URL 정리
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const pickFile = () => inputRef.current?.click();

  const validate = (file) => {
    if (!file) return '파일을 선택하세요.';
    if (!file.type.startsWith('image/')) return '이미지 파일만 업로드할 수 있습니다.';
    if (file.size > MAX_MB * 1024 * 1024) return `파일 용량은 최대 ${MAX_MB}MB까지 가능합니다.`;
    return null;
  };

  const applyFile = (file) => {
    const err = validate(file);
    if (err) {
      setError(err);
      setPhoto(null);
      setPreviewUrl(null);
      return;
    }
    setError(null);
    setPhoto(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const onInputChange = (e) => {
    applyFile(e.target.files?.[0]);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) applyFile(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!dragging) setDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading || submitted) return;
    if (!userId || !challengeId) {
      setError('사용자/챌린지 정보가 누락되었습니다.');
      return;
    }
    const err = validate(photo);
    if (err) {
      setError(err);
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('challengeId', challengeId);
    formData.append('photo', photo);

    try {
      await axios.post(`${BACKEND_BASE_URL}/api/challenge/attendChallengeProcess`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSubmitted(true);     // 즉시 잠금
      if (onAttendanceSuccess) onAttendanceSuccess(); // 부모에 성공 알림
    } catch (err) {
      const msg = err?.response?.data || '인증 처리 중 오류가 발생했습니다.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="att-wrap">
      <div
        className={`att-drop ${dragging ? 'is-drag' : ''} ${previewUrl ? 'has-image' : ''}`}
        onClick={pickFile}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && pickFile()}
        aria-label="인증 사진 선택"
      >
        {!previewUrl ? (
          <div className="att-empty">
            {/* <div className="att-ico">🖼️</div> */}
            {/* <div className="att-title">인증 사진 업로드</div> */}
            <div className="att-sub">사진을 끌어다 놓거나, 기기에서 선택하시오</div>
            <button type="button" className="att-ghost" onClick={(e) => { e.stopPropagation(); pickFile(); }}>
              사진 선택
            </button>
          </div>
        ) : (
          <div className="att-preview">
            <img src={previewUrl} alt="선택한 인증 사진 미리보기" />
            <button
              type="button"
              className="att-reset"
              onClick={(e) => {
                e.stopPropagation();
                setPhoto(null);
                if (previewUrl) URL.revokeObjectURL(previewUrl);
                setPreviewUrl(null);
              }}
              disabled={loading || submitted}
            >
              변경하기
            </button>
          </div>
        )}

        <input
          ref={inputRef}
          id="att-photo"
          type="file"
          accept="image/*"
          capture="environment"
          onChange={onInputChange}
          disabled={loading || submitted}
          hidden
        />
      </div>

      {error && <div className="att-error">{error}</div>}

      <form onSubmit={handleSubmit} className="att-actions">
        <button
          type="submit"
          className={`att-submit ${submitted ? 'done' : ''}`}
          disabled={loading || submitted || !photo}
        >
          {submitted ? '인증 완료' : loading ? '업로드 중…' : '사진 올리고 인증하기'}
        </button>
        {/* <div className="att-hint">허용 형식: 이미지 · 최대 {MAX_MB}MB</div> */}
      </form>
    </div>
  );
}
