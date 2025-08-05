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

  // ✅ 이미지 URL을 완성해주는 함수
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
      console.log('기존 채팅 기록:', res.data);
      if (Array.isArray(res.data)) {
        setChats(res.data);
      } else if (res.data && res.data.chats) {
        setChats(res.data.chats);
      } else {
        setChats([]);
      }
    } catch (error) {
      console.error("채팅 기록 불러오기 실패:", error);
      setChats([]);
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

    fetchChats();

    if (stompClient.current && stompClient.current.connected) {
      console.log("기존 연결이 있어 정리 후 다시 연결합니다.");
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
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
    });

    stompClient.current.onConnect = (frame) => {
      console.log('✅ WebSocket 연결 성공! frame:', frame);

      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      subscriptionRef.current = stompClient.current.subscribe(`/topic/${matchingId}`, (message) => {
        const receivedChat = JSON.parse(message.body);
        setChats(prevChats => [...prevChats, receivedChat]);
      });
    };

    stompClient.current.onWebSocketError = (error) => {
      console.error('❌ WebSocket 오류:', error);
    };

    stompClient.current.onStompError = (frame) => {
      console.error('❌ STOMP 오류:', frame);
      console.error('STOMP Error Body:', frame.body);
      console.error('STOMP Error Headers:', frame.headers);
    };

    stompClient.current.onDisconnect = (frame) => {
      console.log('--- 웹소켓 연결 해제 ---');
    };

    stompClient.current.activate();

    return () => {
      console.log("--- WebSocket 연결 정리 ---");
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

  const getOtherName = () => {
    if (chats.length > 0) {
      const firstChat = chats[0];
      if (firstChat.sendBuddyId !== loggedInUserId) {
        return firstChat.senderName || '상대방';
      }
      const otherChat = chats.find(chat => chat.sendBuddyId !== loggedInUserId);
      return otherChat ? otherChat.senderName : '상대방';
    }
    return '상대방';
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <span className="back-button" onClick={() => navigate(-1)}>
          &lt;
        </span>
        <span className="buddy-name">{getOtherName()}</span>
        <button className="video-call-button" onClick={() => alert("비디오 통화 기능은 아직 구현되지 않았습니다.")}>
          <i className="bi bi-camera-video-fill"></i>
        </button>
      </div>

      <div className="chat-messages" ref={chatMessagesRef}>
        {chats.map((chat, index) => {
          const isMyMessage = chat.sendBuddyId === loggedInUserId;
          const showSenderInfo = !isMyMessage;
          const isConsecutiveMessage = index > 0 && chats[index - 1].sendBuddyId === chat.sendBuddyId;

          return (
            <div
              key={index}
              className={`chat-message ${isMyMessage ? 'my-message' : 'other-message'}`}
            >
              {/* 상대방 메시지일 경우에만 프로필 사진을 항상 표시 */}
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
                {formatTime(chat.sentAt)}
              </div>
            </div>
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
    </div>
  );
};

export default BuddyChatRoom;