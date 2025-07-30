import { Link } from "react-router-dom";
import errorImg from "../../assets/img/error_img.png";

export default function ErrorPage() {
  return (
    <div
      style={{
        textAlign: "center",
        padding: "60px 20px",
        maxWidth: "375px",
        margin: "0 auto",
      }}
    >
      <img
        src={errorImg}
        alt="에러 이미지"
        style={{ width: "60%", marginBottom: "24px" }}
      />

      <div style={{ fontWeight: "bold", fontSize: "17px", marginBottom: "8px" }}>
        불편을 드려 송구하옵니다
      </div>

      <div style={{ fontSize: "13px", color: "#666", marginBottom: "32px" }}>
        예기치 못한 오류가 발생하였으나<br />
        속히 해결해 드리겠나이다
      </div>

      <Link
        to="/gymmadang/mainpage"
        style={{
          display: "inline-block",
          padding: "10px 24px",
          border: "1px solid #000",
          borderRadius: "8px",
          textDecoration: "none",
          color: "#000",
          fontSize: "14px",
        }}
      >
       마당으로 가기
      </Link>
    </div>
  );
}
