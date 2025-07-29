// src/user/challenge/create/components/BackButton.jsx
export default function BackButton({ onClick }) {
  return (
    <button onClick={onClick} style={{ fontSize: '16px', background: 'none', border: 'none' }}>
      ←
    </button>
  );
}
