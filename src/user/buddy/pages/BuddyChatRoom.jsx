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
      // 여기! 👇
      console.log('서버에서 받은 전체 채팅 기록:', res.data);

      console.log('기존 채팅 기록:', res.data);

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
      console.log('메시지 읽음 처리 완료!');
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
      console.log("기존 연결이 있어 정리 후 다시 연결합니다.");
      stompClient.current.deactivate();
    }

    stompClient.current = new Client({
      brokerURL: `ws://localhost:8080/ws/chat`,
      // brokerURL: `wss://gymmadangapi.null-pointer-exception.com/ws/chat`,
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

        // 메시지를 받는 시점에 `setChats`를 호출하여 상태를 업데이트합니다.
        // 내가 보낸 메시지(옵티미스틱 업데이트)와 상대방이 보낸 메시지를 모두 처리합니다.
        setChats(prevChats => {
          // 서버에서 받은 메시지가 이미 임시 메시지로 목록에 있는지 확인
          const isOptimisticUpdate = prevChats.some(
            (chat) =>
              chat.isOptimistic &&
              chat.message === receivedChat.message &&
              chat.sendBuddyId === receivedChat.sendBuddyId
          );

          if (isOptimisticUpdate) {
            // 내가 보낸 메시지일 경우, 임시 메시지를 실제 메시지로 교체
            // (서버에서 받은 메시지에 id, read 상태 등이 포함되어 있음)
            return prevChats.map(chat =>
              (chat.isOptimistic && chat.message === receivedChat.message)
                ? { ...receivedChat, isOptimistic: false }
                : chat
            );
          } else {
            // 상대방이 보낸 새로운 메시지일 경우, 배열에 추가
            return [...prevChats, receivedChat];
          }
        });

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


  const handleVideoCall = () => {

    navigate(`/buddy/videoCall/${matchingId}`, {

      state: {

        userId: loggedInUserId,

        username: otherBuddyName,

      }

    });

  };



  return (

    <div className="chat-container">

      <div className="chat-header">

        <span className="back-button" onClick={() => navigate(-1)}>

          &lt;

        </span>

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

    </div>

  );

};



export default BuddyChatRoom;