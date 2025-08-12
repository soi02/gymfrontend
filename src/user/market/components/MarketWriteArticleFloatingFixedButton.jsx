import { Link } from "react-router-dom";

function MarketWriteArticleFloatingFixedButton() {
  return (
    <>
      <Link
        to="/market/writeArticle"
        style={{
          position: "absolute",
          bottom: "20px",
          right: "20px",
          width: "65px",
          height: "65px",
          backgroundColor: "#afacacff",
          color: "#fff",
          display: "flex",
          justifyContent: "center",
          alignItems: "center", 
          borderRadius: "50%",
          textAlign: "center",
          lineHeight: "60px",
          fontSize: "28px",
          textDecoration: "none",
          boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
          zIndex: 9999,
        }}
      >
        <i className="bi bi-brush-fill"></i>
      </Link>
    </>
  );
}

export default MarketWriteArticleFloatingFixedButton;