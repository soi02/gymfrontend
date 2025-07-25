import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useUserService from "../service/userService"; 
import { useDispatch } from 'react-redux';
import { loginAction } from '../../redux/authSlice';
// import {jwtDecode} from "jwt-decode";

import '../styles/LoginPage.css';


export default function LoginPage() {


    const [formData,setFormData] = useState({
    
        accountName:'',
        password:''
    });

    const [showModal, setShowModal] = useState(false);


    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;
        setFormData({
            ...formData,
            [name]: newValue
        });
    }

    const { login } = useUserService();
    const navigate = useNavigate();
    const dispatch = useDispatch(); 

    const handleLogin = async()=>{
        try{
            const json = await login(formData);

            localStorage.setItem("token",json.token);

            // const decoded = jwtDecode(json.token);
            // const id = decoded.sub;
            const name = json.name;
            const id = json.id;

            dispatch(loginAction({ name: json.name, id: json.id }));
            console.log("얍얍: " , json );
        }catch(error){
            alert("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
            console.log(error)
            return;
        }
        navigate('/welcome')
    }

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="login-title">환영하오</h2>
                <p className="login-subtitle">그대의 이름이 짐마당의 열쇠요</p>

                <input name="accountName" onChange={handleChange} value={formData.accountName} type="text" className="login-input" placeholder="아이디" />
                <input name='password' onChange={handleChange} value={formData.password} type="password" className="login-input" placeholder="비밀번호" />

                <div className="forgot-password">암호를 잊으셨소?</div>

                <button onClick={handleLogin} className="loginpage-btn sign-in-btn">입장하기</button>
                {/* <button className="btn google-btn">
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
                </button> */}
                <div className="divider">
                <span>혹은 다음 선택지도 있소</span>
                </div>

                <div className="social-buttons">
                    <button className="social-btn" onClick={() => setShowModal(true)}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png" alt="Google" />
                    </button>
                    <button className="social-btn" onClick={() => setShowModal(true)}>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/500px-Apple_logo_black.svg.png" alt="Apple" />
                    </button>
                    <button className="social-btn" onClick={() => setShowModal(true)}>
                        <img src="https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png" alt="Kakao" />
                    </button>
                </div>


                <div className="signup-text">
                    처음오셨소? <Link className="signup-link" to="/register">계정 생성</Link>

                </div>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <p>지금은 이용이 어려우나,<br></br> 머지않아 열릴 것이오.</p>
                        <button onClick={() => setShowModal(false)} className='modal-close-btn'>닫기</button>
                    </div>
                </div>
            )}


        </div>
    );


}