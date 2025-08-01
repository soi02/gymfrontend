import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useUserService from "../service/userService"; 
import { useDispatch, useSelector } from 'react-redux';
import { loginAction } from '../../redux/authSlice';
// import {jwtDecode} from "jwt-decode";

import '../styles/LoginPage.css';


export default function LoginPage() {

    const [formData,setFormData] = useState({
        accountName:'',
        password:''
    });

    const [modalMessage, setModalMessage] = useState('');

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
    const location = useLocation();

    const currentUserId = useSelector(state => state.auth.id); 

    useEffect(() => {
        // 이미 로그인 되어 있고, 특정 목적지 (from)가 있는 경우 해당 목적지로 이동
        if (currentUserId) { // currentUserId가 null이 아니면 로그인된 상태로 간주
            const from = location.state?.from; // ChallengeCreateStepper에서 전달한 'from' 경로 (다른 페이지들도 마찬가지로 state:from 써주면 됩니다)
            if (from) {
                navigate(from, { replace: true }); // 이전 페이지로 이동 (히스토리 대체)
            } else {
                navigate('/welcome'); // 이전 경로가 없으면 기본 '환영' 페이지로 이동
            }
        }
    }, [currentUserId, navigate, location.state]); // 의존성 배열에 currentUserId 추가

    const handleLogin = async()=>{
        try{
            const json = await login(formData);

            localStorage.setItem("token",json.token);
            localStorage.setItem("userId", json.id); // ✅ 이거 추가!!!
        

            const name = json.name;
            const id = json.id;

            dispatch(loginAction({ name: json.name, id: json.id }));
            console.log("로그인 성공 응답: " , json );
            
            
            // Redux 상태가 업데이트되면 useEffect가 실행되어 자동 리다이렉트되므로
            // 여기서는 navigate('/welcome')을 직접 호출하지 않아도 됩니다.
            // 하지만 즉시 리다이렉션을 원한다면, 로그인 성공 응답을 받은 직후에
            // location.state?.from 값을 사용하여 navigate를 호출할 수 있습니다.
            // 여기서는 useEffect에 맡기겠습니다.
            
        }catch(error){
            setModalMessage(<><span>입력하신 성함과 암호가</span><br/> <span>짐의 장부와 맞지 않소이다.</span><br/><span> 재차 확인하여 주시기 바라오.</span></>);
            console.log("로그인 에러: ",error)
            return;
        }
        // 이 navigate는 useEffect에서 처리할 것이므로 제거하거나,
        // 필요하다면 즉시 이동하도록 로직을 변경할 수 있습니다.
        // 여기서는 useEffect가 리다이렉션을 담당하도록 제거합니다.
        // navigate('/welcome') 
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