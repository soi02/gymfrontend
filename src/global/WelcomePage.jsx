// import { Link } from "react-router-dom";
// import "./css/WelcomePage.css"; // 추가된 스타일을 위한 CSS 파일 (선택사항)

// export default function WelcomePage() {
//   return (
//     <div className="toss-welcome">
//       <div className="toss-logo">GYM 마당</div>

//       <h1 className="toss-title">운동, 오늘도<br />함께 가볼까요?</h1>
//       <p className="toss-subtitle">당신만의 짐Buddy와 함께 시작해요</p>

//       <div className="toss-buttons">
//         <Link to="/register" className="toss-btn primary">시작하기</Link>
//         <Link to="/login" className="toss-btn">로그인</Link>
//       </div>
//     </div>
//   );
// }

import { Link } from "react-router-dom";
import "./css/WelcomePage.css";

export default function WelcomePage() {
    return (
        <div className="welcome-container">
            <div className="logo">짐마당</div>

            <h1 className="title">
                수련하러 오셨소? <span className="wave">👋</span>
            </h1>

            <p className="subtitle">
                버디와 함께하는 오늘의 수련<br />
                짐마당에서 시작하시오
            </p>

            {/* <div className="highlight-box">
        <p><strong>🏋️ 짐 버디 매칭:</strong> 혼자 하지 말고 함께 수련!</p>
        <p><strong>🔥 챌린지:</strong> 나태한 자신과의 승부!</p>
        <p><strong>🧘 짐마당:</strong> 마음과 몸을 다듬는 수련터</p>
      </div> */}
            <div className="highlight-box">
                <p><strong>🏋️ 짐 버디 매칭:</strong> 혼자 하지 말고 함께 수련!</p>
                <p><strong>🔥 챌린지:</strong> 나태한 자신과의 승부!</p>
                <p><strong>📒 루틴 일지:</strong> 나만의 운동 루틴을 기록</p>
                <p><strong>🛒 장터:</strong> 운동기구를 나누거나 거래하는 장</p>
            </div>

            <div className="button-group">
                <Link to="/register" className="btn primary">수련 시작하기</Link>
                <Link to="/login" className="btn">이미 수련 중이오</Link>
            </div>

            <p className="small-tip">첫 수련은 무료로 도와드리오</p>
        </div>
    );
}