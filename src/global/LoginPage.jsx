import React from 'react';
import './LoginPage.css';
import { Link } from 'react-router-dom';

export default function LoginPage() {
    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">환영하오</h2>
                <p className="login-subtitle">이곳이 바로 그대의 수련터요</p>

                <input type="text" className="login-input" placeholder="아이디" />
                <input type="password" className="login-input" placeholder="비밀번호" />

                <div className="forgot-password">암호를 잊으셨소?</div>

                <button className="btn sign-in-btn">입장하기</button>
                <button className="btn google-btn">
                    <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google" />
                    구글로 입장하기
                </button>
                <button className="btn kakao-btn">
                    <img
                        src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png"
                        alt="Kakao"
                        style={{ height: '16px' }}
                    />
                    카카오톡으로 입장하기
                </button>

                <div className="signup-text">
                    처음이오? <Link className="signup-link" to="/register">계정 생성</Link>

                </div>
            </div>
        </div>
    );
}