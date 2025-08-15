// WorkoutLogModal.jsx
import { useState } from "react";
import "../styles/WorkoutLogModal.css"; 

export default function WorkoutLogModal({ open, onClose, onSave, initialMemo = "", initialPreview = "" }) {
  const [memo, setMemo] = useState(initialMemo);
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initialPreview);

  if (!open) return null;

  return (
    <div className="wlm-backdrop" onClick={onClose}>
      <div className="wlm-modal" onClick={(e) => e.stopPropagation()}>
        <h3>기념 사진 & 메모</h3>

        <label className="wlm-file">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files?.[0];
              setFile(f || null);
              if (f) setPreview(URL.createObjectURL(f));
            }}
          />
        </label>

        {preview && <img src={preview} alt="preview" className="wlm-preview" />}

        <textarea
          className="wlm-textarea"
          rows={5}
          placeholder="메모를 남겨보세요"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
        />

        <div className="wlm-actions">
          <button className="wlm-btn cancel" onClick={onClose}>취소</button>
          <button className="wlm-btn primary" onClick={() => onSave({ memo, file })}>저장</button>
        </div>
      </div>
    </div>
  );
}
