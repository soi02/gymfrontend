import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../styles/BuddyChat.css';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import bgogo from "../../../assets/img/buddy/bgogo.png";
import { Client } from '@stomp/stompjs';

function BuddyChat() {
  const [chatList, setChatList] = useState([]);
  const navigate = useNavigate();
  const stompClient = useRef(null);
  const chatListRef = useRef([]); // ✅ useRef를 사용하여 최신 chatList 값 참조

  const reduxId = useSelector(state => state.auth.id);
  const reduxToken = useSelector(state => state.auth.token);

  const savedAuth = JSON.parse(localStorage.getItem('auth'));
  const buddyId = reduxId || savedAuth?.id;
  const token = reduxToken || localStorage.getItem('token');

  const getFullImageUrl = (filename) => {
    return filename
      ? `http://localhost:8080/uploadFiles/${filename}`
      : 'https://placehold.co/100x100?text=No+Image';
  };

  const fetchChatList = () => {
    if (!buddyId || !token) {
      console.warn("사용자 정보가 없습니다. 채팅 리스트 요청을 중단합니다.");
      return;
    }

    axios.get(`http://localhost:8080/api/buddy/rooms/${buddyId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => setChatList(res.data))
    .catch(err => console.error("채팅 리스트 불러오기 실패:", err));
  };

  // ✅ chatList 상태가 변경될 때마다 useRef 값 업데이트
  useEffect(() => {
    chatListRef.current = chatList;
  }, [chatList]);

  useEffect(() => {
    fetchChatList();

    if (!buddyId || !token) {
      return;
    }

    stompClient.current = new Client({
        brokerURL: `ws://localhost:8080/ws/chat`,
        connectHeaders: { Authorization: `Bearer ${token}` },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
    });

    stompClient.current.onConnect = () => {
        stompClient.current.subscribe('/topic/chat-list', (message) => {
            const receivedMessage = JSON.parse(message.body);
            console.log("새로운 메시지 알림:", receivedMessage);

            // ✅ useRef의 현재 값을 사용하여 최신 chatList에 접근
            const updatedChatList = chatListRef.current.map(chat => {
                if (chat.matchingId === receivedMessage.matchingId) {
                    return {
                        ...chat,
                        unreadCount: chat.unreadCount + 1,
                        lastMessage: receivedMessage.message,
                        lastSentAt: receivedMessage.sentAt
                    };
                }
                return chat;
            });
            setChatList(updatedChatList);
        });
    };

    stompClient.current.onWebSocketError = (error) => {
        console.error('WebSocket 오류:', error);
    };
    stompClient.current.onStompError = (frame) => {
        console.error('STOMP 오류:', frame);
    };

    stompClient.current.activate();

    return () => {
        if (stompClient.current) {
            stompClient.current.deactivate();
        }
    };
  }, [buddyId, token]); // ✅ 의존성 배열에 chatList 제거

  return (
    <div className="chat-list-container">
       {chatList.length === 0 ? (
        <div className="no-chat-container">
          <img src={bgogo} alt="운동벗 이미지" className="no-chat-image" />
          <p className="no-chat-text">아직 운동 벗이 없어요.<br />새로운 운동 벗을 찾아보세요!</p>
          <button 
            className="find-buddy-button" 
            onClick={() => navigate('/buddy/buddyHome')}
          >
            운동 벗 찾으러 가기
          </button>
        </div>
      ) : (
      <div className="chat-rooms">
        {chatList.map((chat, index) => (
          <div
            key={index}
            className="chat-room-item"
            onClick={() => navigate(`/buddy/buddyChat/${chat.matchingId}`)}
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
              {/* ✅ lastSentAt 값이 있을 때만 시간을 표시 */}
              {chat.lastSentAt
                ? new Date(chat.lastSentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : ''}
              {chat.unreadCount > 0 && (
                <div className="unread-count-badge">
                  {chat.unreadCount}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      )}
    </div>
  );
}

export default BuddyChat;