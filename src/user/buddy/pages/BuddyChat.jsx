import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/BuddyChat.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

function BuddyChat() {
  const [chatList, setChatList] = useState([]);
  const navigate = useNavigate();

  // Redux에서 사용자 ID와 토큰 가져오기
  const reduxId = useSelector(state => state.auth.id);
  const reduxToken = useSelector(state => state.auth.token);

  // localStorage fallback (Redux에 값이 없을 경우 대비)
  const savedAuth = JSON.parse(localStorage.getItem('auth'));
  const buddyId = reduxId || savedAuth?.id;
  const token = reduxToken || localStorage.getItem('token');

  useEffect(() => {
    if (!buddyId || !token) {
      console.warn("사용자 정보가 없습니다. 채팅 리스트 요청을 중단합니다.");
      return;
    }

    axios.get(`https://172.30.1.74:8443/api/buddy/rooms/${buddyId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setChatList(res.data))
    .catch(err => console.error("채팅 리스트 불러오기 실패:", err));
  }, [buddyId, token]);

  const getFullImageUrl = (filename) => {
    return filename
      ? `https://172.30.1.74:8443/uploadFiles/${filename}`
      : 'https://placehold.co/100x100?text=No+Image'; // 기본 이미지
  };

  return (
    <div className="chat-list-container">
      <div className="chat-rooms">
        {chatList.map((chat, index) => (
          <div
            key={index}
            className="chat-room-item"
            onClick={() => navigate(`/gymmadang/buddy/buddyChat/${chat.matchingId}`)}
            style={{ cursor: 'pointer' }}
          >
            <div className="avatar">
              <img
                src={getFullImageUrl(chat.opponentProfileImage)}
                alt={`${chat.opponentName} 아바타`}
              />
            </div>
            <div className="chat-info">
              <div className="chat-name">{chat.opponentName}</div>
              <div className="last-message">{chat.lastMessage}</div>
            </div>
            <div className="chat-time">
              {chat.lastSentAt
                ? new Date(chat.lastSentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : ''}
              {/* ✅ unreadCount가 0보다 클 경우 뱃지 표시 */}
              {chat.unreadCount > 0 && (
                <div className="unread-count-badge">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default BuddyChat;