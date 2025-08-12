import { Link } from "react-router-dom";
 import "../styles/WelcomePage.css";
 import logoImg from "../../assets/img/gymmadang_logo_kr.svg";
 import welcomeImg from "../../assets/img/welcome_logo.png"; // 추가된 이미지 경로
 

 export default function WelcomePage() {
     return (
         <div className="welcome-container">
             <div className="logo-container">
                 <img src={logoImg} alt="짐마당 로고" className="logo-animated" />
             </div>
 

             {/* 추가된 이미지 컨테이너 */}
             <div className="welcome-image-container">
                 <img src={welcomeImg} alt="환영 이미지" className="welcome-image" />
             </div>
 

             <div className="button-group-bottom">
                 <Link to="/register" className="btn primary">새롭게 가입하기</Link>
                 <Link to="/login" className="btn secondary">이전에 들른적 있소</Link>
             </div>
 

             <p className="small-tip-bottom">진실로 귀한 것은, 꺾이지 않는 그대의 마음이오</p>
         </div>
     );
 }