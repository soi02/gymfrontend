import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/BuddyChatRoom.css';

const BuddyChatRoom = () => {
  const { matchingId } = useParams();
  const loggedInUserId = useSelector(state => state.auth.id);
  const stompClient = useRef(null);
  const subscriptionRef = useRef(null);
  const navigate = useNavigate();
  const chatMessagesRef = useRef(null);

  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');
  const [otherBuddyName, setOtherBuddyName] = useState('상대방');
  const [otherBuddyProfileImage, setOtherBuddyProfileImage] = useState(null);

  const getFullImageUrl = (filename) => {
    if (filename && filename.startsWith('http')) return filename;
    return filename
      ? `http://localhost:8080/uploadFiles/${filename}`
      : 'https://placehold.co/100x100?text=No+Image';
  };

  const fetchOtherBuddyInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8080/api/buddy/matching-info/${matchingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data && res.data.otherBuddyName) {
        setOtherBuddyName(res.data.otherBuddyName);
        setOtherBuddyProfileImage(res.data.otherBuddyProfileImage);
      }
    } catch (error) {
      console.error("상대방 정보 불러오기 실패:", error);
    }
  };

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(`http://localhost:8080/api/buddy/list/${matchingId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setChats(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("채팅 기록 불러오기 실패:", error);
      setChats([]);
    }
  };

  const markChatsAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:8080/api/buddy/chat/read/${matchingId}`, null, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("메시지 읽음 처리 실패:", error);
    }
  };

  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chats]);

  useEffect(() => {
    if (!matchingId || !loggedInUserId) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error("토큰이 없습니다. 웹소켓 연결 불가.");
      return;
    }

    fetchOtherBuddyInfo();
    fetchChats();
    markChatsAsRead();

    stompClient.current = new Client({
      brokerURL: `ws://localhost:8080/ws/chat`,
      connectHeaders: { Authorization: `Bearer ${token}` },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log('STOMP Debug:', str),
    });

    stompClient.current.onConnect = () => {
      if (subscriptionRef.current) subscriptionRef.current.unsubscribe();

      subscriptionRef.current = stompClient.current.subscribe(
        `/topic/${matchingId}`,
        (message) => {
          try {
            const receivedChat = JSON.parse(message.body);
            console.log('서버에서 받은 메시지:', receivedChat);

            // ✅ 'message' 필드가 있는 유효한 채팅 메시지만 추가
            if (receivedChat.message !== undefined && receivedChat.message !== null) {
              setChats(prev => [...prev, receivedChat]);
              if (receivedChat.sendBuddyId !== loggedInUserId) {
                markChatsAsRead();
              }
            } else if (receivedChat.type === 'READ_STATUS') {
              // 'READ_STATUS' 메시지는 채팅 목록에 추가하지 않고 로그만 출력
              console.log('읽음 상태 메시지 수신 (채팅 목록에 미추가):', receivedChat);
            }
          } catch (error) {
            console.error('메시지 파싱 오류:', error);
          }
        }
      );
    };

    stompClient.current.onWebSocketError = (error) => {
      console.error('❌ WebSocket 오류:', error);
    };
    stompClient.current.onStompError = (frame) => {
      console.error('❌ STOMP 오류:', frame);
    };

    stompClient.current.activate();

    return () => {
      console.log('--- WebSocket 연결 정리 ---');
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
        subscriptionRef.current = null;
      }
      if (stompClient.current) {
        stompClient.current.deactivate();
        stompClient.current = null;
      }
    };
  }, [matchingId, loggedInUserId]);

  const sendMessage = () => {
    if (!message.trim()) return;

    if (stompClient.current && stompClient.current.connected) {
      const chatMessage = {
        matchingId,
        sendBuddyId: loggedInUserId,
        message,
      };

      // 낙관적 업데이트 로직을 주석 처리하여 메시지 중복 문제를 방지
      // const tempMessage = {
      //   ...chatMessage,
      //   isOptimistic: true,
      //   read: false,
      //   sentAt: new Date().toISOString(),
      // };
      // setChats(prev => [...prev, tempMessage]);

      stompClient.current.publish({
        destination: `/app/chat/send`,
        body: JSON.stringify(chatMessage),
        headers: { 'content-type': 'application/json' },
      });

      setMessage('');
    } else {
      console.error('STOMP 미연결 상태');
      alert('메시지를 보낼 수 없습니다. 연결 상태를 확인하세요.');
    }
  };
  
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
      sendMessage();
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    return `${String(date.getHours()).padStart(2,'0')}:${String(date.getMinutes()).padStart(2,'0')}`;
  };

  const formatDateDivider = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const weekdays = ['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
    return `${date.getFullYear()}년 ${date.getMonth()+1}월 ${date.getDate()}일 ${weekdays[date.getDay()]}`;
  };

  const isNewDay = (currentChat, previousChat) => {
    if (!previousChat) return true;
    return new Date(currentChat.sentAt).toDateString() !== new Date(previousChat.sentAt).toDateString();
  };

  const handleVideoCall = () => {
    navigate(`/buddy/videoCall/${matchingId}`, {
      state: { userId: loggedInUserId, username: otherBuddyName }
    });
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="back-button" onClick={() => navigate(-1)}>&lt;</span>
        <span className="buddy-name">{otherBuddyName}</span>
        <button className="video-call-button" onClick={handleVideoCall}>
          <i className="bi bi-camera-video-fill"></i>
        </button>
      </div>

      <div className="chat-messages" ref={chatMessagesRef}>
        {chats.map((chat, index) => {
          const isMyMessage = chat.sendBuddyId === loggedInUserId;
          const showDateDivider = isNewDay(chat, chats[index - 1]);
          return (
            <React.Fragment key={chat.id || `optimistic-${index}`}>
              {showDateDivider && (
                <div className="date-divider">
                  <span>{formatDateDivider(chat.sentAt)}</span>
                </div>
              )}
              <div className={`chat-message ${isMyMessage ? 'my-message' : 'other-message'}`}>
                {!isMyMessage && otherBuddyProfileImage && (
                  <img
                    src={getFullImageUrl(otherBuddyProfileImage)}
                    alt={`${otherBuddyName}님의 프로필 사진`}
                    className="profile-pic"
                  />
                )}
                <div className={`message-bubble ${isMyMessage ? 'my-message-bubble' : 'other-message-bubble'}`}>
                  {chat.message}
                </div>
                <div className="message-time">
                  {isMyMessage && chat.read === false && <span className="unread-count">1</span>}
                  <span>{formatTime(chat.sentAt)}</span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <div className="chat-input-area">
        <input
          type="text"
          className="chat-input"
          placeholder="메시지를 입력하세요"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button className="send-button" onClick={sendMessage}>
          <i className="bi bi-send"></i>
        </button>
      </div>
    </div>
  );
};

export default BuddyChatRoom;