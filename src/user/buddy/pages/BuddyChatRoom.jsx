import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const BuddyChatRoom = () => {
  const { matchingId } = useParams();
  const loggedInUserId = useSelector(state => state.auth.id);
  const stompClient = useRef(null);
  const subscriptionRef = useRef(null); // 구독 객체 관리를 위한 ref 추가

  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 1. 필수 값 검증 및 클린업 로직
    if (!matchingId || !loggedInUserId) {
      console.log("매칭 ID 또는 사용자 ID가 없어 웹소켓 연결을 시도하지 않습니다.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error("토큰이 없습니다. 웹소켓 연결을 시도할 수 없습니다.");
      return;
    }

    // 2. 이미 연결된 클라이언트가 있으면 클린업하고 다시 시작
    if (stompClient.current && stompClient.current.connected) {
      console.log("기존 연결이 있어 정리 후 다시 연결합니다.");
      stompClient.current.deactivate();
    }

    console.log("--- 새로운 WebSocket 연결 시작 (SockJS 없이) ---");
    console.log("현재 토큰:", token);

    // 3. STOMP 클라이언트 객체 생성 및 설정
    // SockJS 대신 WebSocket 프로토콜을 직접 사용합니다.
    stompClient.current = new Client({
      // ✅ webSocketFactory를 사용하고 SockJS 객체를 반환합니다.
      webSocketFactory: () => {
        return new SockJS('http://localhost:8080/ws/chat');
      },
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    // 4. 연결 성공 시 콜백
    stompClient.current.onConnect = (frame) => {
      console.log('✅ WebSocket 연결 성공! frame:', frame);

      // ... (채팅방 구독 로직)
    };

    // 5. 오류 및 연결 종료 핸들러
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

    // 6. 클라이언트 활성화
    stompClient.current.activate();

    // 7. 컴포넌트 언마운트 시 클린업
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
        senderId: loggedInUserId,
        message: message,
      };
      stompClient.current.publish({
        destination: `/app/chat/send`,
        body: JSON.stringify(chatMessage),
      });
      setMessage('');
    } else {
      console.error("STOMP 클라이언트가 연결되지 않았거나 메시지가 비어있습니다.");
      console.error("현재 상태:", {
        connected: stompClient.current ? stompClient.current.connected : false,
        message: message,
      });
      alert("메시지를 보낼 수 없습니다. 연결 상태를 확인하세요.");
    }
  };

  return (
    <div>
      <h1>버디 채팅방: {matchingId}</h1>
      <div style={{ height: '300px', border: '1px solid black', overflowY: 'scroll', padding: '10px' }}>
        {chats.map((chat, index) => (
          <div key={index}>
            <strong>{chat.senderId}:</strong> {chat.message}
          </div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>보내기</button>
    </div>
  );
};

export default BuddyChatRoom;