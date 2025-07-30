import React from 'react';
import '../styles/BuddyNotification.css';

export default function BuddyNotification() {
  const notifications = [
    {
      id: 1,
      name: '김철수',
      intro: '운동 좋아하는 개발자!',
      profileImage: '/images/profile1.jpg',
      type: 'received',
    },
    {
      id: 2,
      name: '홍길동',
      intro: '같이 러닝할 친구 구해요',
      profileImage: '/images/profile2.jpg',
      type: 'sent',
    },
  ];

  return (
    <div className="buddy-container">
      <h4 className="buddy-title">버디 알림</h4>
      <ul className="buddy-list">
        {notifications.map((noti) => (
          <li key={noti.id} className="buddy-item">
            <div className="buddy-info">
              <img src={noti.profileImage} alt="프로필" className="buddy-profile-img" />
              <div className="buddy-text">
                <div className="buddy-name">{noti.name}</div>
                <div className="buddy-intro">{noti.intro}</div>
              </div>
            </div>

            <div className="buddy-buttons">
              {noti.type === 'received' ? (
                <>
                  <button className="btn-accept">수락</button>
                  <button className="btn-decline">거절</button>
                </>
              ) : (
                <button className="btn-cancel">요청취소</button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}