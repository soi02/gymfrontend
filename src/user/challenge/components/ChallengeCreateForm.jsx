// ChallengeCreateForm.jsx
import { useState } from 'react';

export default function ChallengeCreateForm({ onSubmit }) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, date, description });
  };

  return (
    <form onSubmit={handleSubmit} className="create-form">
      <label>제목</label>
      <input value={title} onChange={(e) => setTitle(e.target.value)} />

      <label>기간</label>
      <input value={date} onChange={(e) => setDate(e.target.value)} placeholder="예: 2025.08.01 ~ 08.10" />

      <label>설명</label>
      <textarea value={description} onChange={(e) => setDescription(e.target.value)} />

      <button type="submit">등록하기</button>
    </form>
  );
}
