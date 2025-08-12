import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useUserService from "../service/userService";
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../redux/authSlice';
import { useAuth } from '../../global/hooks/useAuth';

import '../styles/LoginPage.css';

export default function LoginPage() {

    const [formData, setFormData] = useState({
        accountName: '',
        password: ''
    });

    const [modalMessage, setModalMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useUserService();
    const { loginCustom } = useAuth();
    const currentUserId = useSelector(state => state.auth.id);

    useEffect(() => {
        if (currentUserId) {
            const from = location.state?.from;
            if (from) {
                navigate(from, { replace: true });
            }
        }
    }, [currentUserId, navigate, location.state]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const handleLogin = async () => {
        try {
            const json = await login(formData);
            loginCustom(json.token, { name: json.name, id: json.id });
        } catch (error) {
            setModalMessage(<><span>입력하신 성함과 암호가</span><br /> <span>짐의 장부와 맞지 않소이다.</span><br /><span> 재차 확인하여 주시기 바라오.</span></>);
            console.log("로그인 에러: ", error);
        }
    };

    return (
        <div className="login-container">
            {/* <Link to="/gymmadang" className="back-btn">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15.75 18L9.75 12L15.75 6" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </Link> */}
            <div className="login-header-wrapper">
                <button className="login-back-btn" onClick={() => navigate(-1)}>&lt;</button>
                {/* <h2 className="login-title">환영하오</h2> */}
            </div>

            <div className="login-box">
                <h2 className="login-title">환영하오</h2>
                <p className="login-subtitle">그대의 이름이 짐마당의 열쇠요</p>

                <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                    <input name="accountName" onChange={handleChange} value={formData.accountName} type="text" className="login-input" placeholder="아이디" required />
                    <input name='password' onChange={handleChange} value={formData.password} type="password" className="login-input" placeholder="비밀번호" required />

                    <button type="submit" className="loginpage-btn sign-in-btn">입장하기</button>
                </form>

                <div className="forgot-password">암호를 잊으셨소?</div>
                
                <div className="divider">
                    <span>혹은 다음 선택지도 있소</span>
                </div>

                <div className="social-buttons">
                    <button className="social-btn" onClick={() => setModalMessage(<><span>지금은 이용이 어려우나,</span><br/><span>머지않아 열릴 것이오.</span></>)}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png" alt="Google" />
                    </button>
                    <button className="social-btn" onClick={() => setModalMessage(<><span>지금은 이용이 어려우나,</span><br/><span>머지않아 열릴 것이오.</span></>)}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/500px-Apple_logo_black.svg.png" alt="Apple" />
                    </button>
                    <button className="social-btn" onClick={() => setModalMessage(<><span>지금은 이용이 어려우나,</span><br/><span>머지않아 열릴 것이오.</span></>)}>
                        <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" alt="Kakao" />
                    </button>
                </div>

                <div className="signup-text">
                    처음오셨소? <Link className="signup-link" to="/register">계정 생성</Link>
                </div>
            </div>

            {modalMessage && (
                <div className="loginpage-modal-overlay">
                    <div className="loginpage-modal-content">
                        <p>{modalMessage}</p>
                        <button onClick={() => setModalMessage('')} className='loginpage-modal-close-btn'>닫기</button>
                    </div>
                </div>
            )}
        </div>
    );
}