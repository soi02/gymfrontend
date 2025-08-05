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

  // ✅ 수정: 채팅 기록과 상대방 이름을 API 응답에서 올바르게 가져오는 함수
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
      // 서버 응답에 따라 `chats`와 `otherBuddyName`을 각각 설정합니다.
      // `res.data`가 배열인 경우와 객체인 경우를 모두 고려하여 처리합니다.
      if (Array.isArray(res.data)) {
        setChats(res.data);
      } else if (res.data && res.data.chats) {
        setChats(res.data.chats);
        setOtherBuddyName(res.data.otherBuddyName || '상대방');
      } else {
        setChats([]);
      }
    } catch (error) {
      console.error("채팅 기록 불러오기 실패:", error);
      setChats([]); // 오류 발생 시 빈 배열로 초기화
    }
  };

  // ✅ 채팅 메시지 목록을 자동으로 맨 아래로 스크롤
  useEffect(() => {
    if (chatMessagesRef.current) {
      chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
    }
  }, [chats]);

  // ✅ 웹소켓 연결 및 채팅 메시지 구독
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

    // 컴포넌트 마운트 시, 기존 채팅 기록과 상대방 이름을 먼저 불러옴
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
        // 받은 메시지를 기존 채팅 기록에 추가
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

  // ✅ 시간 표시를 위한 포맷팅 함수
  const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <div className="chat-container">
      {/* ✅ 헤더 부분 */}
      <div className="chat-header">
        <span className="back-button" onClick={() => navigate(-1)}>
          &lt;
        </span>
        <span className="buddy-name">{otherBuddyName}</span>
      </div>

      {/* ✅ 채팅 메시지 목록 */}
      <div className="chat-messages" ref={chatMessagesRef}>
        {chats.map((chat, index) => {
          const isMyMessage = chat.sendBuddyId === loggedInUserId;
          return (
            <div
              key={index}
              className={`chat-message ${isMyMessage ? 'my-message' : 'other-message'}`}
            >
              {!isMyMessage && <div className="profile-pic"></div>}
              <div className={`message-bubble ${isMyMessage ? 'my-message-bubble' : 'other-message-bubble'}`}>
                {chat.message}
              </div>
              {/* ✅ 보낸 시간 표시 (sentAt 사용) */}
              <div className="message-time">
                {formatTime(chat.sentAt)}
              </div>
            </div>
          );
        })}
      </div>

      {/* ✅ 메시지 입력 영역 */}
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