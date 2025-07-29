import React, { useState } from 'react';
// import './BuddyHome.css'; // CSS 파일을 불러옵니다.ㄴ
import '../styles/BuddyHome.css';

// 예시 버디 데이터 (실제로는 API 등에서 받아올 데이터입니다)
const buddies = [
  { id: 1, name: '김민준', age: 24, university: '서울대학교', major: '컴퓨터공학과', image: 'https://via.placeholder.com/300x400?text=Buddy+1' },
  { id: 2, name: '이서연', age: 23, university: '고려대학교', major: '경영학과', image: 'https://via.placeholder.com/300x400?text=Buddy+2' },
  { id: 3, name: '박준영', age: 25, university: '연세대학교', major: '전자공학과', image: 'https://via.placeholder.com/300x400?text=Buddy+3' },
  { id: 4, name: '최지우', age: 22, university: '성균관대학교', major: '사회학과', image: 'https://via.placeholder.com/300x400?text=Buddy+4' },
];

export default function BuddyHome() {
  const [currentIndex, setCurrentIndex] = useState(0); // 현재 보여지는 버디의 인덱스

  const handleLike = () => {
    // 좋아요 로직 (나중에 여기에 상대방에게 요청을 보내는 로직을 추가)
    console.log(`${buddies[currentIndex].name}에게 좋아요를 보냈습니다!`);
    moveToNextBuddy();
  };

  const handleDislike = () => {
    // 싫어요 로직 (나중에 여기에 다음 버디를 보여주는 로직을 추가)
    console.log(`${buddies[currentIndex].name}를 싫어합니다.`);
    moveToNextBuddy();
  };

  const moveToNextBuddy = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % buddies.length); // 다음 버디로 이동 (마지막이면 처음으로)
  };

  if (buddies.length === 0) {
    return (
      <div className="buddy-home-container">
        <h1 className="buddy-home-title">버디 홈</h1>
        <p className="buddy-home-description">더 이상 보여줄 버디가 없습니다.</p>
      </div>
    );
  }

  const currentBuddy = buddies[currentIndex];

  return (
    <div className="buddy-home-container">
      {/* <h1 className="buddy-home-title">버디 홈</h1> */}
      <p className="buddy-home-description">새로운 버디를 만나보세요!</p>

      <div className="buddy-card-wrapper">
        <div className="buddy-card">
          <img src={currentBuddy.image} alt={currentBuddy.name} className="buddy-card-image" />
          <div className="buddy-card-info">
            <h2>{currentBuddy.name}, {currentBuddy.age}</h2>
            <p>{currentBuddy.university} - {currentBuddy.major}</p>
          </div>
          <div className="buddy-card-actions">
            <button className="dislike-button" onClick={handleDislike}>
              <span role="img" aria-label="dislike">❌</span>
            </button>
            <button className="like-button" onClick={handleLike}>
              <span role="img" aria-label="like">❤️</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}