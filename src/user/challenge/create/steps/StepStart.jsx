export default function StepStart({ onNext, onBack }) {
  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 10 }}>
        <button onClick={onBack}>←</button>
      </div>
      <h2>챌린지를 만들어보세요!</h2>
      <p>직접 만들어 함께할 사람들을 모아보세요.</p>
      <button onClick={() => onNext({})}>시작하기</button>
    </div>
  );
}
