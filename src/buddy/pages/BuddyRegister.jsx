import React, { useState } from 'react';
// import './BuddyRegister.css'; // 필요 시 스타일 분리

export default function BuddyRegister() {
  const [step, setStep] = useState(1);
  const [gender, setGender] = useState('');
  const [ages, setAges] = useState([]);

  const handleAgeToggle = (age) => {
    if (ages.includes(age)) {
      setAges(ages.filter((a) => a !== age));
    } else {
      setAges([...ages, age]);
    }
  };

  const renderPage = () => {
    switch (step) {
      case 1:
        return (
          <div className="page page1">
            <h2 className="title">운동벗을<br />찾으시겠습니까?</h2>
            <div className="image-runner" />
            <button className="button" onClick={() => setStep(2)}>네, 원해요</button>
          </div>
        );

      case 2:
        return (
          <div className="page page2">
            <h2 className="title">선호하는 성별</h2>
            <div className="gender-options">
              {['남성', '여성', '성별무관'].map((g) => (
                <button
                  key={g}
                  className={`circle-button ${gender === g ? 'selected' : ''}`}
                  onClick={() => setGender(g)}
                >
                  {g === '남성' && '♂'}
                  {g === '여성' && '♀'}
                  {g === '성별무관' && '⚧'}<br />{g}
                </button>
              ))}
            </div>
            <div className="navigation">
              <button className="button-outline" onClick={() => setStep(1)}>이전</button>
              <button className="button" onClick={() => setStep(3)}>다음</button>
            </div>
          </div>
        );

      case 3:
        const ageOptions = ['10대', '20대', '30대', '40대', '50대', '60대', '70대', '80대'];
        return (
          <div className="page page3">
            <h2 className="title">선호 연령대</h2>
            <div className="age-grid">
              {ageOptions.map((age) => (
                <button
                  key={age}
                  className={`pill-button ${ages.includes(age) ? 'selected' : ''}`}
                  onClick={() => handleAgeToggle(age)}
                >
                  {age}
                </button>
              ))}
            </div>
            <p className="subtext">중복 선택 가능합니다.</p>
            <div className="navigation">
              <button className="button-outline" onClick={() => setStep(2)}>이전</button>
              <button className="button" onClick={() => alert(`선택 완료: 성별 - ${gender}, 연령 - ${ages.join(', ')}`)}>다음</button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return <div className="buddy-register-container">{renderPage()}</div>;
}