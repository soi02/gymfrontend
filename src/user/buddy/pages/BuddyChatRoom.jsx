import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

const BuddyChatRoom = () => {
  const { matchingId } = useParams();
  const loggedInUserId = useSelector(state => state.auth.id);
  const stompClient = useRef(null);

  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // 필수 값 검증
        if (!matchingId || !loggedInUserId) {
            console.log("매칭 ID 또는 사용자 ID가 없습니다. useEffect를 종료합니다.");
            return;
        }
    // Redux 상태가 아직 로딩되지 않았을 경우를 대비
    if (!matchingId || !loggedInUserId) {
      console.log("매칭 ID 또는 사용자 ID가 없습니다.");
      return;
    }

    console.log("useEffect 실행됨");
    console.log("matchingId:", matchingId);
    console.log("loggedInUserId:", loggedInUserId);

    const token = localStorage.getItem('token');
    if (!token) {
      console.error("토큰이 없습니다. 웹소켓 연결을 시도할 수 없습니다.");
      return; // 토큰이 없으면 여기서 useEffect 종료
    }

    if (!token) {
      console.error("토큰이 없습니다. 웹소켓 연결을 시도할 수 없습니다.");
      return;
    }

    const connectHeaders = {
      'Authorization': `Bearer ${token}`,
    };
    console.log("STOMP 연결 헤더:", connectHeaders);

    // STOMP 클라이언트 초기화
    stompClient.current = new Client({
      // 서버의 context-path가 기본값인 '/'이므로 URL을 이렇게 수정해야 합니다.
      webSocketFactory: () => new SockJS('http://localhost:8080/ws/chat'),
      connectHeaders: connectHeaders,
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    stompClient.current.onConnect = () => {
      console.log('STOMP 연결 성공!');

      // 채팅방 구독
      const subscription = stompClient.current.subscribe(`/topic/chat/${matchingId}`, (message) => {
        const newChat = JSON.parse(message.body);
        setChats(prevChats => [...prevChats, newChat]);
      });

      // 연결 해제 시 구독 취소
      return () => {
        subscription.unsubscribe();
      };
    };

    stompClient.current.onWebSocketError = (error) => {
      console.error('WebSocket 오류:', error);
    };

    stompClient.current.onStompError = (frame) => {
      console.error('STOMP 오류:', frame);
    };

    console.log("웹소켓 연결 활성화 시도");
    stompClient.current.activate();

    // 컴포넌트 언마운트 시 클라이언트 비활성화
    return () => {
      console.log("웹소켓 연결 비활성화");
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