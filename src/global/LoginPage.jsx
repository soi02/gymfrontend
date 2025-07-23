import React, { useState } from 'react';
import './css/LoginPage.css';
import { Link, useNavigate } from 'react-router-dom';
import useUserService from '../service/userService';
import { useDispatch } from 'react-redux';
import {jwtDecode} from "jwt-decode";
import { loginAction } from '../redux/authSlice';

export default function LoginPage() {


    const [formData,setFormData] = useState({
        accountName:'',
        password:''
    });
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
                <p className="login-subtitle">이곳이 바로 그대의 수련터요</p>

                <input name="accountName" onChange={handleChange} value={formData.accountName} type="text" className="login-input" placeholder="아이디" />
                <input name='password' onChange={handleChange} value={formData.password} type="password" className="login-input" placeholder="비밀번호" />

                <div className="forgot-password">암호를 잊으셨소?</div>

                <button onClick={handleLogin} className="btn sign-in-btn">입장하기</button>
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