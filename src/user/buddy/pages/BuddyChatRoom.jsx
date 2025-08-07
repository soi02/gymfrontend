import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/BuddyChatRoom.css';
import WebRtcCall from '../hooks/WebRtcCall.jsx'; 

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
  const [isCallActive, setIsCallActive] = useState(false);
  const [isStompConnected, setIsStompConnected] = useState(false); // ✅ STOMP 연결 상태 추가

  const getFullImageUrl = (filename) => {
    if (filename && filename.startsWith('http')) {
      return filename;
    }
    return filename
      ? `http://localhost:8080/uploadFiles/${filename}`
      : 'https://placehold.co/100x100?text=No+Image';
  };

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("토큰이 없어 채팅 기록을 불러올 수 없습니다.");
        return;
      }

      const res = await axios.get(`http://localhost:8080/api/buddy/list/${matchingId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      if (Array.isArray(res.data)) {
        setChats(res.data);
        const otherChat = res.data.find(chat => chat.sendBuddyId !== loggedInUserId);
        if (otherChat) {
          setOtherBuddyName(otherChat.senderName);
        }
      } else {
        setChats([]);
      }
    } catch (error) {
      console.error("채팅 기록 불러오기 실패:", error);
      setChats([]);
    }
  };

  const markChatsAsRead = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error("토큰이 없어 메시지를 읽음 처리할 수 없습니다.");
        return;
      }
      await axios.post(`http://localhost:8080/api/buddy/chat/read/${matchingId}`, null, {
        headers: {
          Authorization: `Bearer ${token}`
        }
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
    if (!matchingId || !loggedInUserId) {
      console.log("매칭 ID 또는 사용자 ID가 없어 웹소켓 연결을 시도하지 않습니다.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error("토큰이 없습니다. 웹소켓 연결을 시도할 수 없습니다.");
      return;
    }

    const setupChatRoom = async () => {
      await fetchChats();
      await markChatsAsRead();
    };
    setupChatRoom();

    if (stompClient.current && stompClient.current.connected) {
      stompClient.current.deactivate();
    }

    stompClient.current = new Client({
      brokerURL: `ws://localhost:8080/ws/chat`,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.current.onConnect = (frame) => {
        console.log('✅ STOMP 연결 성공!', frame);
        setIsStompConnected(true); // ✅ 연결 성공 시 상태 업데이트
        if (subscriptionRef.current) {
            subscriptionRef.current.unsubscribe();
        }
        subscriptionRef.current = stompClient.current.subscribe(`/topic/${matchingId}`, (message) => {
            const receivedChat = JSON.parse(message.body);

            if (receivedChat.sendBuddyId === loggedInUserId) {
                setChats(prevChats => {
                    const updatedChats = prevChats.map(chat => {
                        if (chat.isOptimistic && chat.message === receivedChat.message) {
                            return { ...receivedChat, isOptimistic: false };
                        }
                        return chat;
                    });
                    return updatedChats.some(chat => chat.id === receivedChat.id) ? updatedChats : [...updatedChats, receivedChat];
                });
            } else {
                setChats(prevChats => [...prevChats, receivedChat]);
            }
        });
    };

    stompClient.current.onWebSocketError = (error) => {
      console.error('❌ WebSocket 오류:', error);
      setIsStompConnected(false);
    };

    stompClient.current.onStompError = (frame) => {
      console.error('❌ STOMP 오류:', frame);
      setIsStompConnected(false);
    };

    stompClient.current.onDisconnect = (frame) => {
        setIsStompConnected(false);
    };

    stompClient.current.activate();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [matchingId, loggedInUserId]);

  const sendMessage = () => {
    if (stompClient.current && stompClient.current.connected && message) {
      const chatMessage = {
        matchingId: matchingId,
        sendBuddyId: loggedInUserId,
        message: message,
      };

      const tempMessage = {
          ...chatMessage,
          isOptimistic: true,
          read: false,
          sentAt: new Date().toISOString()
      };
      setChats(prevChats => [...prevChats, tempMessage]);

      stompClient.current.publish({
        destination: `/app/chat/send`,
        body: JSON.stringify(chatMessage),
      });
      setMessage('');
    } else {
      console.error("STOMP 클라이언트가 연결되지 않았거나 메시지가 비어있습니다.");
      alert("메시지를 보낼 수 없습니다. 연결 상태를 확인하세요.");
    }
  };

  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDateDivider = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    const weekday = weekdays[date.getDay()];

    return `${year}년 ${month}월 ${day}일 ${weekday}`;
  };

  const isNewDay = (currentChat, previousChat) => {
    if (!previousChat) {
      return true;
    }
    const currentDate = new Date(currentChat.sentAt).toDateString();
    const previousDate = new Date(previousChat.sentAt).toDateString();
    return currentDate !== previousDate;
  };
  
  const handleVideoCallClick = () => {
      setIsCallActive(true);
  };
  
  const handleCallEnd = () => {
      setIsCallActive(false);
  };

  return (
    <div className="chat-container">
      {isCallActive ? (
        isStompConnected ? (
          <WebRtcCall 
            callId={matchingId}
            onCallEnd={handleCallEnd}
            stompClient={stompClient}
            loggedInUserId={loggedInUserId}
            matchingId={matchingId}
          />
        ) : (
          <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
              웹소켓 연결 중... 잠시만 기다려주세요.
          </div>
        )
      ) : (
        <>
          <div className="chat-header">
            <span className="back-button" onClick={() => navigate(-1)}>
              &lt;
            </span>
            <span className="buddy-name">{otherBuddyName}</span>
            <button className="video-call-button" onClick={handleVideoCallClick}>
              <i className="bi bi-camera-video-fill"></i>
            </button>
          </div>

          <div className="chat-messages" ref={chatMessagesRef}>
            {chats.map((chat, index) => {
              const isMyMessage = chat.sendBuddyId === loggedInUserId;
              const showDateDivider = isNewDay(chat, chats[index - 1]);

              return (
                <React.Fragment key={index}>
                  {showDateDivider && (
                    <div className="date-divider">
                      <span>{formatDateDivider(chat.sentAt)}</span>
                    </div>
                  )}
                  <div
                    className={`chat-message ${isMyMessage ? 'my-message' : 'other-message'}`}
                  >
                    {!isMyMessage && (
                      <img
                        src={getFullImageUrl(chat.senderProfileImageUrl)}
                        alt={`${chat.senderName}님의 프로필 사진`}
                        className="profile-pic"
                      />
                    )}
                    <div className={`message-bubble ${isMyMessage ? 'my-message-bubble' : 'other-message-bubble'}`}>
                      {chat.message}
                    </div>

                    <div className="message-time">
                      {isMyMessage && !chat.read && (
                        <span className="unread-count">1</span>
                      )}
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
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            />
            <button className="send-button" onClick={sendMessage}>
              <i className="bi bi-send"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default BuddyChatRoom;