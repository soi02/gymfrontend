// src/challenge/pages/ChallengeStartPaymentSuccess.jsx
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../styles/ChallengeStartPaymentSuccess.css';

export default function ChallengeStartPaymentSuccess() {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSuccess, setIsSuccess] = useState(true)
    const [message, setMessage] = useState("결제 성공");

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const status = urlParams.get('status');
        
        if (status === 'success') {
            setIsSuccess(true);
            const msg = urlParams.get('message');
            if (msg === 'already_processed') {
                setMessage("이미 결제가 처리되었소.");
            } else {
                setMessage("결제 성공");
            }
            
            // // 3초 후 자동 이동
            // setTimeout(() => {
            //     navigate('/gymmadang/challenge/myRecordList');
            // }, 3000);
        } else {
            // status가 success가 아닌 경우 (예: fail)
            setIsSuccess(false);
            setMessage("결제에 실패했거나 잘못된 접근이오.");
            setTimeout(() => {
                navigate('/gymmadang/challenge/challengeHome');
            }, 3000);
        }
    }, [navigate, location.search]);




    return (
        <div className="success-page-container">
            <div className="success-content">
                {isSuccess ? (
                    <div className="success-icon">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="#fff"/>
                        </svg>
                    </div>
                ) : (
                    <div className="error-icon">
                        {/* 실패 아이콘 추가 (예: 엑스표시) */}
                    </div>
                )}
                <h2>{message}</h2>
                <p style={{textAlign: 'center'}}>
                    이제부터 매일 출석을 인증하며 <br /> 수련을 달성해보시오!
                </p>
                <button 
                    className="go-to-challenges-btn" 
                    onClick={() => navigate('/gymmadang/challenge/challengeMy')}
                >
                    나의 수련기록을 보러 가겠소
                </button>
            </div>
        </div>
    );
}
