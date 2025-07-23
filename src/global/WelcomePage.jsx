import { Link } from "react-router-dom";
import "./css/WelcomePage.css"; // 추가된 스타일을 위한 CSS 파일 (선택사항)

export default function WelcomePage() {
  return (
    <div className="welcome-container">
      <h1 className="welcome-title">환영합니다 👋</h1>
      <p className="welcome-subtitle">지금 바로 시작해보세요</p>

      <div className="button-group">
        <Link to="/register" className="btn btn-primary">회원가입</Link>
        <Link to="/login" className="btn btn-outline-primary">로그인</Link>
      </div>
    </div>
  );
}