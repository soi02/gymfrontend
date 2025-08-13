import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import buddyImage from "../../../assets/img/buddy/buddy3.png";
import '../styles/BuddyStart.css';

export default function BuddyStart() {
    const navigate = useNavigate();

    const buddyFullText = `운동 벗을 찾으시는군요!\n나와 함께 할 운동 벗을 등록하고\n서로에게 동기 부여를 해보세요.`;
    const [buddyDisplayedText, setBuddyDisplayedText] = useState('');
    const indexRef = useRef(0);

    useEffect(() => {
        const interval = setInterval(() => {
            const currentIndex = indexRef.current;
            const nextChar = buddyFullText[currentIndex];

            if (nextChar !== undefined) {
                setBuddyDisplayedText((prev) => prev + nextChar);
                indexRef.current += 1;
            } else {
                clearInterval(interval);
            }
        }, 50);

        return () => clearInterval(interval);
    }, [buddyFullText]);

    const handleStart = () => {
        navigate('/buddy/register');
    };

    return (
        <div className="buddy-start-container">
            <div className="buddy-start-page">
                <h2 className="buddy-start-title">운동 벗 찾기</h2>

                <div className="buddy-character-and-bubble-container">
                    <img
                        src={buddyImage}
                        alt="운동 벗 이미지"
                        className="buddy-intro-character-img"
                    />
                    <div className="buddy-speech-bubble">
                        <p style={{ whiteSpace: 'pre-line', margin: 0 }}>{buddyDisplayedText}</p>
                        <div className='buddy-speech-arrow'></div>
                    </div>
                </div>

                <div className="buddy-helper-text-container">
                    <p className="buddy-helper-text">운동벗을 찾으려면 아래 버튼을 선택해보시오</p>
                </div>
            </div>

            <div className="buddy-bottom-buttons">
                <button className="buddy-choice-btn" onClick={handleStart}>시작하기</button>
            </div>
        </div>
    );
}