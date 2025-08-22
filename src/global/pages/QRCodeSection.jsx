// src/components/QRCodeSection.jsx
import React from 'react';
import '../styles/QRCodeSection.css'; // 별도 CSS 파일 생성
import qrImage from "../../assets/img/gymQR.png"

const QRCodeSection = () => {
  return (
    <div className="qr-code-container">
      <div className="qr-code-box">
        {/* <h4>모바일에서 접속</h4> */}
        <p>지금 바로 QR 코드를 스캔하고, <br />어디서든 짐마당을 만나보세요.</p>
        <div className="qr-code-image-wrapper">
          {/* QR 코드 이미지를 여기에 넣습니다. */}
          <img src={qrImage} alt="모바일 접속 QR 코드" />
        </div>
        <p className="qr-code-link">QR 코드로 빠르게 시작하기</p>
      </div>
    </div>
  );
};

export default QRCodeSection;