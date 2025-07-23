import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function NotificationPage() {
  const navigate = useNavigate();

  // 로그인된 사용자 정보
  const authInfo = useSelector((state) => state.auth);
  const userId = authInfo?.id;

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    if (!authInfo?.isAuthenticated) {
      navigate("/login"); // 로그인 안 되어 있으면 로그인 페이지로 이동
      return;
    }

    // TODO: 로그인된 사용자 ID로 알림 데이터 불러오기 (API 요청 예정)
    // 임시 가짜 데이터
    const dummyData = [
      {
        id: 1,
        userId: userId,
        message: "🏆 새로운 노리개를 획득하였습니다!",
        date: "2025-07-23",
      },
      {
        id: 2,
        userId: userId,
        message: "👥 신청한 챌린지가 곧 시작됩니다.",
        date: "2025-07-22",
      },
      {
        id: 3,
        userId: 1, // 수신자 (현재 로그인한 사용자)
        message: "💌 누군가 당신의 프로필에 호감을 표시했습니다.",
        date: "2025-07-23"
        }
    ];

    setNotifications(dummyData);
  }, [authInfo, navigate, userId]);

//   });


// 추후 백엔드 구현 시 수정 필요
  useEffect(() => {
  if (!authInfo?.isAuthenticated) {
    navigate("/login");
    return;
  }

  fetch(`/api/notifications?userId=${userId}`)
    .then(res => res.json())
    .then(data => setNotifications(data))
    .catch(err => console.error(err));
}, [authInfo, navigate, userId]);


  return (
    <div
        style={{
        width: "100vw",
        minHeight: "83vh",
        backgroundColor: "#fff",
        padding: "20px"
        }}
  >

    {/* 뒤로가기 + 제목 */}
    <div
    style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        height: "48px",
        marginBottom: "20px",
    }}
    >
    {/* 꺾쇠 아이콘 */}
    <button
        onClick={() => navigate(-1)}
        style={{
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        background: "transparent",
        border: "none",
        fontSize: "20px",
        cursor: "pointer",
        padding: "8px 16px",
        lineHeight: 1,
        }}
        aria-label="뒤로가기"
    >
        <span style={{ fontSize: "18px", color: "#cacacaff"}}>〈</span>
    </button>

    {/* 중앙 제목 */}
    <h5
        style={{
        fontWeight: "bold",
        fontSize: "16px",
        margin: 0,
        lineHeight: 1,
        }}
    >
        전갈함
    </h5>
    </div>

      {notifications.length === 0 ? (
        <div style={{ color: "#888", fontSize: "14px" }}>
          아직 전갈이 도착하지 않았사옵니다.
        </div>
      ) : (
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {notifications.map((noti) => (
            <li
              key={noti.id}
              style={{
                padding: "14px 14px",
                marginBottom: "12px",
                backgroundColor: "#f8f8f8",
                borderRadius: "12px",
                fontSize: "14px",
              }}
            >
              <div>{noti.message}</div>
              <div style={{ color: "#aaa", fontSize: "12px", marginTop: "4px" }}>
                {noti.date}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>

  );
}
