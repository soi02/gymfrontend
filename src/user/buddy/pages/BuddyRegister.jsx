import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import buddyImage from "../../../assets/img/buddy/buddy3.png";
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
        // 기존의 다중 선택 로직을 단일 선택 로직으로 변경
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
            alert('등록 중 오류가 발생했습니다.');
        }
    };

    const handleGoToBuddyHome = () => {
        setShowModal(false);
        navigate('/buddyhome');
    };

    const handleGoBack = () => {
        if (step > 1) {
            setStep(step - 1);
        } else if (step === 1) {
            navigate('/buddy/start');
        }
    };

    const renderPage = () => {
        switch (step) {
            case 1:
                return (
                    <div className="page page2">
                        <h2 className="title">선호하는 성별은<br />무엇이오?</h2>
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
                            <button className="button-outline" onClick={handleGoBack}>이전</button>
                            <button className="button" onClick={() => setStep(2)}>다음</button>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="page page3">
                        <h2 className="title">선호하는 연령대는<br />무엇이오?</h2>
                        <div className="age-grid">
                            {ageOptions.map(({ label, id }) => (
                                <button
                                    key={id}
                                    className={`pill-button ${ages.includes(id) ? 'selected' : ''}`}
                                    onClick={() => handleAgeToggle(id)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                        <p className="subtext">하나만 선택 가능합니다.</p>
                        <div className="navigation">
                            <button className="button-outline" onClick={handleGoBack}>이전</button>
                            <button className="button" onClick={() => setStep(3)}>다음</button>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="page page4">
                        <h2 className="title">자기소개를<br />해보시오!</h2>
                        <textarea
                            className="intro-textarea"
                            placeholder="예: 아침에 함께 뛰실 분 구해요!"
                            value={intro}
                            onChange={(e) => setIntro(e.target.value)}
                        />
                        <div className="navigation">
                            <button className="button-outline" onClick={handleGoBack}>이전</button>
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

            {showModal && (
                <div
                    className="modal-backdrop"
                    style={{
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 9999,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: '#fff',
                            padding: '30px 20px',
                            borderRadius: '16px',
                            width: '320px',
                            textAlign: 'center',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
                            zIndex: 10000,
                            position: 'relative',
                            color: '#000',
                        }}
                    >
                        <h2>등록이 완료되었습니다!</h2>
                        <p>운동 벗을 찾아보세요 💪</p>
                        <button
                            className="button"
                            onClick={handleGoToBuddyHome}
                        >
                            벗 구하러 가기
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}