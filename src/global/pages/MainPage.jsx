import { Link } from 'react-router-dom';
import '../styles/MainPage.css';
import mainImg from '../../assets/img/yellowmain.png'

export default function MainPage() {
  return (
    <div className="main-container">
      {/* <h3>정진 334일차</h3> */}
      {/* <img src="../src/assets/img/mainPicture.png" alt="메인맵" className="main-image" /> */}
      <img src={mainImg} alt="메인맵" className="main-image" />
      
      {/* 득근실록 */}
      <Link to="/routine" className="link-area routine" />
      {/* 수련장 */}
      <Link to="/challenge/challengeHome" className="link-area challenge" />
      {/* 장터 */}
      <Link to="/market" className="link-area market" />
      {/* 벗찾기 */}
      <Link to="/buddy" className="link-area buddy" />
    </div>
  );
}
