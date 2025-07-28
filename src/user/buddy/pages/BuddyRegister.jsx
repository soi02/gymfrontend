import React, { useState } from 'react';
import '../styles/BuddyRegister.css';
import buddyImage from "../../../assets/img/buddy/buddy3.png";

export default function BuddyRegister() {
    const [step, setStep] = useState(1);
    const [gender, setGender] = useState('');
    const [ages, setAges] = useState([]);
    const [intro, setIntro] = useState('');
    const [showModal, setShowModal] = useState(false);

    const handleAgeToggle = (age) => {
        if (ages.includes(age)) {
            setAges(ages.filter((a) => a !== age));
        } else {
            setAges([...ages, age]);
        }
    };

    const handleSubmit = () => {
        setShowModal(true);
    };

    const renderPage = () => {
        switch (step) {
            case 1:
                return (
                    <div className="page page1">
                        <h2 className="title">운동벗을<br />찾으시겠습니까?</h2>
                        <img
                            src={buddyImage}
                            alt="챌린지 이미지"
                            style={{ width: "100px", height: "100px", margin: "20px auto" }}
                        />
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
                            <button className="button" onClick={() => setStep(4)}>다음</button>
                        </div>
                    </div>
                );

            case 4:
                return (
                    <div className="page page4">
                        <h2 className="title">자기소개 한 줄</h2>
                        <textarea
                            className="intro-textarea"
                            placeholder="예: 아침에 함께 뛰실 분 구해요!"
                            value={intro}
                            onChange={(e) => setIntro(e.target.value)}
                        />
                        <div className="navigation">
                            <button className="button-outline" onClick={() => setStep(3)}>이전</button>
                            <button className="button" onClick={handleSubmit}>완료</button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="buddy-register-container">
            {renderPage()}

            {/* ✅ 모달창 */}
            {showModal && (
                <div className="modal-backdrop">
                    <div className="modal">
                        <h2>등록이 완료되었습니다!</h2>
                        <p>운동 벗을 찾아보세요 💪</p>
                        <button className="button" onClick={() => {
                            setShowModal(false);
                            // 여기에 페이지 이동 로직 추가 가능
                            // 예: navigate('/buddy/list');
                        }}>벗 구하러 가기</button>
                    </div>
                </div>
            )}
        </div>
    );
}