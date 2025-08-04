import { useState } from "react";
import Calendar from "react-calendar";
import { useSelector } from "react-redux"
import "../styles/MyPage.css"; // ✨ 여기서 예쁜 스타일링
import { useNavigate } from "react-router-dom";


export default function MyPage() {

    const name = useSelector(state => state.auth.name);

    console.log(name);

    const navigator = useNavigate();





    return(

        <div className="mypage-container">
        <div>{name}님 안녕하세요.</div>

        <button type="button" onClick={() => navigator("/gymmadang/routineCalendar")}>
        운동 기록 보기
        </button>


        </div>

    )
}