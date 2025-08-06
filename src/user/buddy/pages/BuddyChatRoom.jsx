import React, { useState, useEffect, useRef, useCallback } from 'react';
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

  // ---------------- WebRTC 관련 상태 및 레퍼런스 ----------------
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const peerConnectionRef = useRef(null);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  // -------------------------------------------------------------

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
  }, [chats, isCalling]); // isCalling 상태 변경 시에도 스크롤을 맨 아래로 내립니다.

  const handleStompMessage = useCallback(async (message) => {
    const received = JSON.parse(message.body);

    if (received.type === 'CHAT_MESSAGE') {
      // 일반 채팅 메시지 처리
      const receivedChat = received.payload;
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
    } else if (received.type === 'WEBRTC_SIGNAL') {
      // WebRTC 시그널링 메시지 처리
      const signal = received.payload;
      console.log('WebRTC 시그널 수신:', signal);
      
      if (!peerConnectionRef.current && signal.type !== 'hang-up') {
        await createPeerConnection();
      }

      if (signal.type === 'offer') {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
        const answer = await peerConnectionRef.current.createAnswer();
        await peerConnectionRef.current.setLocalDescription(answer);
        sendWebRTCSignal(answer);
      } else if (signal.type === 'answer') {
        await peerConnectionRef.current.setRemoteDescription(new RTCSessionDescription(signal));
      } else if (signal.type === 'ice-candidate') {
        await peerConnectionRef.current.addIceCandidate(new RTCIceCandidate(signal.candidate));
      } else if (signal.type === 'hang-up') {
        hangUp();
      }
    }
  }, [loggedInUserId]);


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
      subscriptionRef.current = stompClient.current.subscribe(`/topic/${matchingId}`, handleStompMessage);
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
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [matchingId, loggedInUserId, handleStompMessage]);

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

      const payload = {
        type: 'CHAT_MESSAGE',
        payload: chatMessage
      };

      stompClient.current.publish({
        destination: `/app/chat/send`,
        body: JSON.stringify(payload),
      });
      setMessage('');
    } else {
      console.error("STOMP 클라이언트가 연결되지 않았거나 메시지가 비어있습니다.");
      alert("메시지를 보낼 수 없습니다. 연결 상태를 확인하세요.");
    }
  };

  const sendWebRTCSignal = (signal) => {
    if (stompClient.current && stompClient.current.connected) {
      const payload = {
        type: 'WEBRTC_SIGNAL',
        payload: { ...signal, matchingId: matchingId }
      };
      stompClient.current.publish({
        destination: `/app/chat/send`,
        body: JSON.stringify(payload),
      });
    }
  };

  // ---------------- WebRTC 관련 함수 ----------------

  const createPeerConnection = async () => {
    console.log('📞 RTCPeerConnection 생성 중...');
    const configuration = { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] };
    const peerConnection = new RTCPeerConnection(configuration);
    peerConnectionRef.current = peerConnection;

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        console.log('📡 ICE 후보자 전송');
        sendWebRTCSignal({ type: 'ice-candidate', candidate: event.candidate });
      }
    };

    peerConnection.ontrack = (event) => {
      console.log('📺 원격 스트림 수신 시작');
      setRemoteStream(event.streams[0]);
    };

    if (localStream) {
      localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, localStream);
      });
    }

    return peerConnection;
  };

  const startCall = useCallback(async () => {
    console.log('🚀 통화 시작');
    setIsCalling(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setLocalStream(stream);

      const peerConnection = await createPeerConnection();
      stream.getTracks().forEach(track => peerConnection.addTrack(track, stream));

      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      console.log('✉️ SDP offer 전송');
      sendWebRTCSignal(offer);

    } catch (error) {
      console.error(`🚨 미디어 접근 오류: ${error.message}`);
      setIsCalling(false);
    }
  }, [localStream]);

  const hangUp = useCallback(() => {
    console.log('👋 통화 종료');
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    setRemoteStream(null);
    setIsCalling(false);

    sendWebRTCSignal({ type: 'hang-up' });
  }, [localStream]);

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream;
    }
  }, [localStream]);

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream]);
  // -------------------------------------------------------------

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

  return (
    <div className="chat-container">
      {isCalling && (
        <div className="video-call-overlay">
          <div className="video-box my-video">
            <video ref={localVideoRef} autoPlay muted playsInline></video>
          </div>
          <div className="video-box other-video">
            <video ref={remoteVideoRef} autoPlay playsInline></video>
          </div>
          <button className="hangup-button" onClick={hangUp}>
            통화 종료
          </button>
        </div>
      )}

      <div className="chat-header">
        <span className="back-button" onClick={() => navigate(-1)}>
          &lt;
        </span>
        <span className="buddy-name">{otherBuddyName}</span>
        <button className="video-call-button" onClick={isCalling ? hangUp : startCall}>
          {isCalling ? (
            <i className="bi bi-camera-video-fill off"></i>
          ) : (
            <i className="bi bi-camera-video-fill"></i>
          )}
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