import { useState } from "react";
import Calendar from "react-calendar";
import { useSelector } from "react-redux"
import "../styles/MyPage.css"; // ✨ 여기서 예쁜 스타일링
import { useNavigate } from "react-router-dom";


export default function MyPage() {
  const name = useSelector((state) => state.auth.name);
  const navigate = useNavigate();

  return (
    <div className="mypage-container">
      {/* 유저 정보 */}
<div className="profile-box" onClick={() => navigate("/gymmadang/editProfile")}>
  <div className="profile-info-wrapper">
    <div className="profile-info">
      <div className="profile-img" />
      <div className="profile-text">
        <div className="username">{name}님</div>
        <div className="greeting">정진 223일째</div>
      </div>
    </div>

    <div className="go-arrow">{'>'}</div>
  </div>
</div>


      {/* 간단 기능 */}
      {/* <div className="quick-buttons">
        <button onClick={() => navigate("/gymmadang/routineCalendar")}>운동 기록</button>
        <button onClick={() => navigate("/gymmadang/routineList")}>내 루틴</button>
        <button onClick={() => navigate("/gymmadang/market")}>중고거래</button>
      </div> */}

      <div className="each-box">
        <div className="row-between" onClick={() => navigate("/gymmadang/routineCalendar")}>
            <span>운동 기록</span>
            <span style={{ fontSize: "1.2rem", color: "#888" }}>{'>'}</span>
        </div>

      </div>


    </div>
  );
}