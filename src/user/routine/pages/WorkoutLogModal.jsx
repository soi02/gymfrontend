import { useEffect, useRef, useState } from "react";
import "../styles/WorkoutLogModal.css";

export default function WorkoutLogModal({
  open,
  onClose,
  onSave,
  initialMemo = "",
  initialPreview = "",
}) {
  const [memo, setMemo] = useState(initialMemo);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialPreview);

  const inputRef = useRef(null);

  // props → state 동기화 (모달 열릴 때 최신값으로)
  useEffect(() => {
    if (!open) return;
    setMemo(initialMemo ?? "");
    setPreview(initialPreview ?? "");
    setFile(null);
  }, [open, initialMemo, initialPreview]);

  // blob URL 정리
  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  if (!open) return null;

  const fileText = file
    ? file.name
    : preview
    ? "위 사진이 선택되었소"
    : "선택된 파일이 없소";

  return (
    <div className="wlm-backdrop" onClick={onClose}>
      <div className="wlm-modal" onClick={(e) => e.stopPropagation()}>
        {/* 헤더/타이틀바 */}
        <div className="wlm-header">
          <div className="wlm-title">금일의 일지</div>
          {/* <button className="wlm-close" onClick={onClose} aria-label="닫기">×</button> */}
        </div>
        {/* 미리보기 */}
        {preview && (
          <img src={preview} alt="preview" className="wlm-preview" />
        )}
        {/* 파일 선택 커스텀 영역 */}
        <div className="wlm-file-row">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="wlm-file-input"   // 화면에서 숨김
            onChange={(e) => {
              const f = e.target.files?.[0] || null;
              setFile(f);
              if (f) setPreview(URL.createObjectURL(f));
            }}
          />
          <button
            type="button"
            className="wlm-file-btn"
            onClick={() => inputRef.current?.click()}
          >
            사진 선택
          </button>
          <span className="wlm-file-help">{fileText}</span>
        </div>



        {/* 메모 */}
        <textarea
          className="wlm-textarea"
          rows={5}
          placeholder="일지를 남겨보시오"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />

        {/* 액션 버튼 */}
        <div className="wlm-actions">
          <button className="wlm-btn cancel" onClick={onClose}>취소</button>
          <button
            className="wlm-btn primary"
            onClick={() => onSave({ memo, file })}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
}
