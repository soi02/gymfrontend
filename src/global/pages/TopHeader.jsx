import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logoutAction } from "../../redux/authSlice";
import logoImg from "../../assets/img/gymmadang_logo_kr.svg";
import profileImg from "../../assets/img/default_profile_img.svg";
import birdImg from "../../assets/img/bird.png";
import { useState } from "react";
import { useAuth } from "../hooks/useAuth";

export default function TopHeader() {
    const authInfo = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    
    // 로그아웃 커스텀 훅 사용 전 코드
    //   const handleLogout = () => {
    //     dispatch(logoutAction());
    //     localStorage.removeItem("token");
    //   };

    // 로그아웃 커스텀 훅 사용 후 코드
    const { logoutCustom } = useAuth();

    const [showPrompt, setShowPrompt] = useState(false);
    const [showMenu, setShowMenu] = useState(false);



  return (
    <>
        <div
        className="d-flex justify-content-between align-items-center"
        style={{
            padding: "15px 18px",
            height: "28px",
            marginTop: "0.8rem",
            marginBottom: "0.45rem"
            // backgroundColor: 'rgba(245, 245, 245, 0.54)'
        }}
        >
            {/* 왼쪽 로고 */}
            <Link to="/mainpage">
            <img src={logoImg} alt="로고" style={{ height: "28px", cursor: "pointer" }} />
            </Link>

            {/* 오른쪽 영역 */}
            <div className="d-flex align-items-center gap-2">
                {authInfo.isAuthenticated ? (
                <>

            {/* 알림새 아이콘 + 알림 점 */}
            <Link to="/notifications">
            <div style={{ position: "relative", width: "44px", height: "44px" }}>
            <img
                src={birdImg}
                alt="알림"
                style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                cursor: "pointer",
                }}
            />
            
            {/* 알림 포인트 표시 (조건부 렌더링 가능) */}
            <div
                style={{
                position: "absolute",
                top: "3px",
                right: "4px",
                width: "6.5px",
                height: "6.5px",
                backgroundColor: "#c44343ff",
                borderRadius: "50%",
                boxShadow: "0 0 0 1px white",
                }}
            ></div>
            </div>
            </Link>


                    

            <img
            src={profileImg}
            alt="프로필"
            style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
                cursor: "pointer",
            }}
            onClick={() => setShowMenu(!showMenu)}
            />
        </>
        ) : (
            <img
                src={profileImg}
                alt="로그인"
                style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
                cursor: "pointer",
                }}
                onClick={() => setShowPrompt(true)}
            />
            )}
            </div>
        </div>


        {/* 오버레이 (회색 배경) */}
        {(showPrompt || showMenu) && (
        <div
            onClick={() => {
            setShowPrompt(false);
            setShowMenu(false);
            }}
            style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.4)",
            zIndex: 998, // 모달보다 아래에 위치
            }}
        />
        )}



        {showPrompt && (
            <div
            style={{
                position: "fixed",
                bottom: "80px",
                left: "50%",
                transform: "translateX(-50%)",
                backgroundColor: "#fff",
                padding: "24px 16px",
                borderRadius: "16px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                width: "90%",
                maxWidth: "360px",
                textAlign: "center",
                zIndex: 999,
            }}
            >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>👏👏</div>
            <div style={{ fontWeight: "bold", fontSize: "18px" }}>짐마당에 오신 걸 환영하오</div>
            <div style={{ fontSize: "13px", color: "#666", marginBottom: "25px" }}>
                마음에 드는 수련을 시작해보시지요.
            </div>
            <Link
                to="/login"
                onClick={() => setShowPrompt(false)}
                style={{
                display: "inline-block",
                padding: "10px 24px",
                backgroundColor: "#000",
                color: "#fff",
                borderRadius: "8px",
                textDecoration: "none",
                fontSize: "14px",
                }}
            >
                로그인 페이지로 이동
            </Link>
            </div>
        )}

        {showMenu && (
        <div
            style={{
            position: "fixed",
            bottom: "80px",
            left: "50%",
            transform: "translateX(-50%)",
            backgroundColor: "#fff",
            padding: "16px",
            borderRadius: "16px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
            width: "90%",
            maxWidth: "320px",
            textAlign: "center",
            zIndex: 999,
            }}
        >
            <div style={{ fontWeight: "bold", fontSize: "15px", marginBottom: "14px" }}>
            무슨 일로 들르셨사옵니까?
            </div>
            <Link
            to="/mypage"
            style={{
                display: "block",
                padding: "10px",
                backgroundColor: "#000",
                borderRadius: "8px",
                marginBottom: "8px",
                textDecoration: "none",
                color: "#fff",
                fontSize: "14px",
            }}
            onClick={() => setShowMenu(false)}
            >
            나의 처소에 들르겠소
            </Link>
            <Link to="/login">
            <button
            onClick={() => {
                // handleLogout();
                logoutCustom(); // 로그아웃 커스텀 훅 사용
                setShowMenu(false);
            }}
            style={{
                width: "100%",
                padding: "10px",
                backgroundColor: "#c44343ff",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                fontSize: "14px",
            }}
            >
            로그아웃
            </button>
            </Link>
        </div>
        )}






        
    
    </>
  );
}
