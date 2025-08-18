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
        if (filename && filename.startsWith('http')) {
            return filename;
        }
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
            console.log('서버에서 받은 전체 채팅 기록:', res.data);
            if (Array.isArray(res.data)) {
                setChats(res.data);
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
            await axios.post(`http://localhost:8080/api/buddy/chat/read/${matchingId}`, null, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('메시지 읽음 처리 완료!');
        } catch (error) {
            console.error("메시지 읽음 처리 실패:", error);
        }
    };

    // 스크롤을 맨 아래로 내리는 useEffect
    useEffect(() => {
        if (chatMessagesRef.current) {
            chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
        }
    }, [chats]);

    // ✅ 웹소켓 연결 및 초기 데이터 로딩을 위한 useEffect
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

        // 컴포넌트가 마운트될 때 한 번만 실행되는 초기 데이터 로딩
        fetchOtherBuddyInfo();
        fetchChats();
        markChatsAsRead();

        // Stomp 클라이언트 생성
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

        // 웹소켓 연결 성공 시
        stompClient.current.onConnect = (frame) => {
            console.log('✅ WebSocket 연결 성공! frame:', frame);

            if (subscriptionRef.current) {
                subscriptionRef.current.unsubscribe();
            }

            // ✅ 토픽 구독
            subscriptionRef.current = stompClient.current.subscribe(`/topic/${matchingId}`, (message) => {
                const receivedChat = JSON.parse(message.body);
                console.log('--- 웹소켓에서 새 메시지 수신:', receivedChat);

                // ✅ 수신된 메시지를 무조건 배열에 추가하는 단순한 로직으로 변경
                setChats(prevChats => [...prevChats, receivedChat]);
                
                if (receivedChat.sendBuddyId !== loggedInUserId) {
                    markChatsAsRead();
                }
            });
        };

        stompClient.current.onWebSocketError = (error) => {
            console.error('❌ WebSocket 오류:', error);
        };

        stompClient.current.onStompError = (frame) => {
            console.error('❌ STOMP 오류:', frame);
        };

        stompClient.current.onDisconnect = (frame) => {
            console.log('--- 웹소켓 연결 해제 ---');
        };

        stompClient.current.activate();

        // 컴포넌트 언마운트 시 웹소켓 연결 정리
        return () => {
            console.log("--- WebSocket 연결 정리 ---");
            if (stompClient.current) {
                stompClient.current.deactivate();
            }
        };

    }, [matchingId, loggedInUserId]);


    const sendMessage = () => {
        if (!message.trim()) {
            console.error("메시지가 비어있습니다.");
            return;
        }

        if (stompClient.current && stompClient.current.connected) {
            const chatMessage = {
                matchingId: matchingId,
                sendBuddyId: loggedInUserId,
                message: message,
            };

            // ✅ 낙관적 업데이트를 위한 임시 메시지 생성
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
            console.error("STOMP 클라이언트가 연결되지 않았습니다.");
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
                        <React.Fragment key={chat.id || `optimistic-${index}`}>
                            {showDateDivider && (
                                <div className="date-divider">
                                    <span>{formatDateDivider(chat.sentAt)}</span>
                                </div>
                            )}
                            <div
                                className={`chat-message ${isMyMessage ? 'my-message' : 'other-message'}`}
                            >
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
                                    {isMyMessage && chat.read === false && (
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