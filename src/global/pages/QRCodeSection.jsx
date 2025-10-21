// src/global/pages/QRCodeSection.jsx
import React from 'react';
import '../styles/QRCodeSection.css';
import qrImage from "../../assets/img/gymQR.png";
import erdImage from "../../assets/img/gymmadang_erd.png";

const defaultLinks = {
  erd: erdImage,
  backend: 'https://github.com/soi02/gymbackend',
  frontend: 'https://github.com/soi02/gymfrontend',
};

const QRCodeSection = ({ links = defaultLinks }) => {
  return (
    <div className="qr-code-container">
      {/* QR 카드 */}
      <div className="qr-code-box">
        <p>지금 바로 QR 코드를 스캔하고, <br />어디서든 짐마당을 만나보세요.</p>
        <div className="qr-code-image-wrapper">
          <img src={qrImage} alt="모바일 접속 QR 코드" />
        </div>
        <p className="qr-code-link">QR 코드로 빠르게 시작하기</p>
      </div>

      {/* ↓ 카드와 분리된 버튼 3개 */}
{/* 카드 아래 액션 영역 */}
<div className="qr-actions-grid">
  <a
    href={links.erd}
    target="_blank"
    rel="noopener noreferrer"
    className="qr-box-link"
    aria-label="ERD 보기"
  >
    ERD
  </a>

  <a
    href={links.frontend}
    target="_blank"
    rel="noopener noreferrer"
    className="qr-box-link"
    aria-label="프론트엔드 GitHub"
  >
    FRONT
  </a>

  <a
    href={links.backend}
    target="_blank"
    rel="noopener noreferrer"
    className="qr-box-link"
    aria-label="백엔드 GitHub"
  >
    BACK
  </a>
</div>

      </div>
  );
};

export default QRCodeSection;
