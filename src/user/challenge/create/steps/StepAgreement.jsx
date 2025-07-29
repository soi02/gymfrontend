import { useState } from 'react';

export default function StepAgreement({ onNext, onBack }) {
  const [agreements, setAgreements] = useState([false, false, false]);

  const allChecked = agreements.every(Boolean);

  const toggleCheck = (index) => {
    setAgreements((prev) => {
      const copy = [...prev];
      copy[index] = !copy[index];
      return copy;
    });
  };

  return (
    <div style={{ padding: 24 }}>
              <div style={{ marginBottom: 10 }}>
        <button onClick={onBack}>←</button>
      </div>
      <h3>챌린지를 시작하기 전, 약속해 주세요!</h3>
      <ul>
        <li><input type="checkbox" checked={agreements[0]} onChange={() => toggleCheck(0)} /> 만든 챌린지는 끝까지 책임질게요.</li>
        <li><input type="checkbox" checked={agreements[1]} onChange={() => toggleCheck(1)} /> 참가자들이 무리하지 않도록 목표를 설정할게요.</li>
        <li><input type="checkbox" checked={agreements[2]} onChange={() => toggleCheck(2)} /> 모두가 즐길 수 있는 챌린지를 만들게요.</li>
      </ul>

      <button disabled={!allChecked} onClick={() => onNext()}>생성하기</button>
    </div>
  );
}
