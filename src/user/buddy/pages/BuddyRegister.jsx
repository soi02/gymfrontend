import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import buddyImage from "../../../assets/img/buddy/bgender.png"; // 이미지 import
import buddyIntroImage from "../../../assets/img/buddy/bintro.png";
import '../styles/BuddyRegister.css';

export default function BuddyRegister() {
    const [step, setStep] = useState(1);
    const [gender, setGender] = useState('');
    const [ages, setAges] = useState([]);
    const [intro, setIntro] = useState('');
    const [showModal, setShowModal] = useState(false);

    const navigate = useNavigate();

    const ageOptions = [
        { label: '10대', id: 1, age: 10 },
        { label: '20대', id: 2, age: 20 },
        { label: '30대', id: 3, age: 30 },
        { label: '40대', id: 4, age: 40 },
        { label: '50대', id: 5, age: 50 },
        { label: '60대', id: 6, age: 60 },
        { label: '70대', id: 7, age: 70 },
        { label: '80대', id: 8, age: 80 },
    ];

    const handleAgeToggle = (id) => {
        setAges([id]);
    };

    const convertGenderToEnum = (g) => {
        if (g === '남성') return 'MALE';
        if (g === '여성') return 'FEMALE';
        return 'ANY';
    };

    const handleSubmit = async () => {
        try {
            const token = localStorage.getItem('token');
            const buddyAgeList = ages.map(id => ({ id }));

            const data = {
                preferredGender: convertGenderToEnum(gender),
                intro: intro,
                buddyAgeList: buddyAgeList,
            };

            const res = await axios.post('http://localhost:8080/api/buddy/register', data, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            console.log('보내는 데이터:', data);
            setShowModal(true);

        } catch (error) {
            console.error('등록 실패:', error);
        }
    };

    const handleGoToBuddyHome = () => {
        setShowModal(false);
        navigate('/buddy/buddyHome');
    };

    const handleGoBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else if (step === 1) {
            navigate('/buddy');
        }
    };
    
    const progressBarWidth = `${(step / 3) * 100}%`;

    const renderPage = () => {
        switch (step) {
            case 1:
                return (
                    <div className="buddy-register-page-content">
                        {/* 요청하신 이미지 태그 형식으로 변경 */}
                        <img
                            src={buddyImage}
                            alt="운동 벗 이미지"
                            className="buddy-intro-character-img"
                        />
                        <div className="buddy-register-page-text">
                            <h2 className="buddy-register-title">선호하는 벗의 성별은<br />무엇이오?</h2>
                        </div>
                        <div className="buddy-register-gender-options">
                            {['남성', '여성', '무관'].map((g) => (
                                <button
                                    key={g}
                                    className={`buddy-register-gender-button ${gender === g ? 'selected' : ''}`}
                                    onClick={() => setGender(g)}
                                >
                                    {g === '남성' && '♂'}
                                    {g === '여성' && '♀'}
                                    {g === '무관' && '⚧'}<br />{g}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="buddy-register-page-content">
                        <div className="buddy-register-page-text">
                            <h2 className="buddy-register-title">선호하는 연령대는<br />무엇이오?</h2>
                            <p className="buddy-register-subtext">하나만 선택 가능합니다.</p>
                        </div>
                        <div className="buddy-register-age-grid">
                            {ageOptions.map(({ label, id }) => (
                                <button
                                    key={id}
                                    className={`buddy-register-pill-button ${ages.includes(id) ? 'selected' : ''}`}
                                    onClick={() => handleAgeToggle(id)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="buddy-register-page-content">
                         <img
                            src={buddyIntroImage}
                            alt="운동 벗 이미지"
                            className="buddy-intro-character-img"
                        />
                        <div className="buddy-register-page-text">
                            <h2 className="buddy-register-title">자기소개를<br />해보시오!</h2>
                        </div>
                        <textarea
                            className="buddy-register-intro-textarea"
                            placeholder="예: 아침에 함께 뛰실 분 구해요!"
                            value={intro}
                            onChange={(e) => setIntro(e.target.value)}
                        />
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="buddy-register-container">
            <div className="buddy-register-progress-bar-container">
                <div className="buddy-register-progress-bar-fill" style={{ width: progressBarWidth }}></div>
            </div>

            {renderPage()}
            
            <div className="buddy-register-navigation">
                <button className="buddy-register-button-outline" onClick={handleGoBack}>이전</button>
                {step < 3 ? (
                    <button className="buddy-register-button" onClick={() => setStep(step + 1)}>다음</button>
                ) : (
                    <button className="buddy-register-button" onClick={handleSubmit}>완료</button>
                )}
            </div>

            {showModal && (
                <div className="buddy-register-modal-backdrop">
                    <div className="buddy-register-modal-content">
                        <h2>등록이 완료되었습니다.</h2>
                        <p>운동 벗을 찾아보시오 💪</p>
                        <button
                            className="buddy-register-button"
                            onClick={handleGoToBuddyHome}
                        >
                            운동 벗 구하러 가기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
