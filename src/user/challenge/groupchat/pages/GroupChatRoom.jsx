// src/components/GroupChatRoom.jsx

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Stomp from 'stompjs';
import '../styles/GroupChatRoom.css';
import apiClient from '../../../../global/api/apiClient';

const BACKEND_BASE_URL = 'http://localhost:8080';

// 상대 경로를 절대 URL로 변환하는 함수
function toAbsUrl(path) {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) {
        return path;
    }
    return `${BACKEND_BASE_URL}/uploadFiles/${path}`;
}

export default function GroupChatRoom() {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const userId = useSelector(state => state.auth.id);
    const reduxToken = useSelector(state => state.auth.token);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);

    // 💡 새로운 상태 변수: 전체 참여 인원 수
    const [participantCount, setParticipantCount] = useState(0);
    // 💡 이 로딩 상태를 추가해야 합니다.
    const [isLoading, setIsLoading] = useState(true);

    const token = reduxToken || localStorage.getItem("token");

    // 채팅방 접속 시, 데이터 불러오기 및 읽음 처리
    useEffect(() => {
        const fetchChatData = async () => {
            // 로딩 시작
            setIsLoading(true);
            try {
                // 💡 1. 챌린지 참여 인원 수 불러오기
                const participantResponse = await apiClient.get(`/challenge/groupchat/getParticipantCount/${challengeId}`);
                setParticipantCount(participantResponse.data);

                // 2. 이전 채팅 기록 불러오기
                const historyResponse = await apiClient.get(`/challenge/groupchat/getChatHistoryProcess/${challengeId}`);
                const chatHistory = historyResponse.data;
                setMessages(chatHistory);

                // 3. 메시지 읽음 처리 API 호출
                if (chatHistory.length > 0) {
                    const messageIds = chatHistory.map(msg => msg.groupChatMessageId);
                    await apiClient.post(`/challenge/groupchat/readMessageProcess`, {
                        messageIds: messageIds,
                        userId: userId
                    });
                }
            } catch (error) {
                console.error("채팅 데이터를 불러오는 데 실패했습니다:", error);
                alert("채팅 데이터를 불러올 수 없습니다. 다시 시도해 주세요.");
                navigate(`/challenge/challengeDetail/${challengeId}`);
            } finally {
                // 로딩 종료
                setIsLoading(false);
            }
        };

        if (challengeId && token) {
            fetchChatData();
        }
    }, [challengeId, navigate, token, userId]);
    // WebSocket 연결 및 구독
    useEffect(() => {
        if (!token) {
            console.error("인증 토큰이 없습니다. 로그인 상태를 확인하세요.");
            alert("세션이 만료되었거나 로그인 상태가 아닙니다.");
            window.location.href = '/login';
            return;
        }
        
        const socket = new WebSocket('ws://localhost:8080/ws/group-chat');
        stompClient.current = Stomp.over(socket);
        stompClient.current.debug = null;

        const headers = { 'Authorization': `Bearer ${token}` };

        stompClient.current.connect(headers, () => {
            console.log('✅ WebSocket 연결 성공!');
            
            // 메시지 수신 구독
            stompClient.current.subscribe(`/topic-group/sendGroupMessage/${challengeId}`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                setMessages(prevMessages => [...prevMessages, receivedMessage]);
                apiClient.post(`/challenge/groupchat/readMessageProcess`, {
                    messageIds: [receivedMessage.groupChatMessageId],
                    userId: userId
                });
            });

            // 읽음 상태 업데이트 구독
            stompClient.current.subscribe(`/topic-group/readMessageUpdate/${challengeId}`, (message) => {
                const updateInfo = JSON.parse(message.body);
                setMessages(prevMessages => 
                    prevMessages.map(msg => 
                        msg.groupChatMessageId === updateInfo.messageId ? { ...msg, readCount: updateInfo.readCount } : msg
                    )
                );
            });

        }, (error) => {
            console.error('❌ WebSocket 연결 실패:', error);
            alert("채팅 서버 연결에 실패했습니다.");
        });

        return () => {
            if (stompClient.current && stompClient.current.connected) {
                stompClient.current.disconnect(() => {
                    console.log('🔗 WebSocket 연결 해제됨');
                });
            }
        };
    }, [challengeId, token, userId]);

    // 메시지 목록이 업데이트될 때마다 스크롤을 가장 아래로 이동
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // 메시지 전송 핸들러
    const handleSendMessage = (e) => { 
        e.preventDefault();
        if (newMessage.trim() === '' || !stompClient.current || !stompClient.current.connected) {
            return;
        }
        const chatMessage = {
            senderUserId: userId,
            groupChatMessageContent: newMessage,
            challengeId: challengeId
        };
        stompClient.current.send(`/app/sendGroupMessage/${challengeId}`, {}, JSON.stringify(chatMessage));
        setNewMessage('');
    };

    console.log("GroupChatRoom 컴포넌트가 렌더링되었습니다. challengeId:", challengeId);

return (
    <div className="group-chat-room-container">
        <header className="group-chat-room-header">
            <h2>챌린지 채팅방</h2>
            <button onClick={() => navigate(-1)} className="group-chat-room-back-button">뒤로</button>
        </header>
        <div className="group-chat-room-messages">
            {messages.map((msg, index) => {
                const unreadCount = participantCount - (msg.readCount || 0);

                // 💡 여기에 디버깅용 console.log를 추가합니다.
                console.log(
                    `--- 메시지 ID: ${msg.groupChatMessageId} ---`
                );
                console.log(`participantCount: ${participantCount}`);
                console.log(`msg.readCount: ${msg.readCount}`);
                console.log(`unreadCount: ${unreadCount}`);
                console.log(`userId: ${userId}, msg.senderUserId: ${msg.senderUserId}, 동일 여부: ${userId === msg.senderUserId}`);
                console.log(`unreadCount > 0 조건: ${unreadCount > 0}`);

                return (
                    <div 
                        key={index} 
                        className={`group-chat-room-message ${msg.senderUserId === userId ? 'group-chat-room-my-message' : 'group-chat-room-other-message'}`}
                    >
                        {msg.senderUserId !== userId && (
                            <img 
                                src={toAbsUrl(msg.senderProfileImagePath)}
                                alt={msg.senderNickname || '프로필 사진'} 
                                className="group-chat-room-profile-image" 
                            />
                        )}
                        <div className="group-chat-room-message-bubble">
                            {msg.senderUserId !== userId && (
                                <span className="group-chat-room-message-sender">
                                    {msg.senderNickname || `사용자 ${msg.senderUserId}`}
                                </span>
                            )}
                            <div className="group-chat-room-message-content">
                                {msg.groupChatMessageContent}
                            </div>
                            {/* 💡 unreadCount와 time을 감싸는 div를 추가 */}
                            <div className="group-chat-room-message-info">
                                {unreadCount > 0 && (
                                    <span className="group-chat-room-unread-count">
                                        {unreadCount}
                                    </span>
                                )}
                                <span className="group-chat-room-message-time">
                                    {new Date(msg.createdAt).toLocaleTimeString()}
                                </span>
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} /> 
        </div>
        <form onSubmit={handleSendMessage} className="group-chat-room-input-form">
            <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="group-chat-room-input"
            />
            <button type="submit" className="group-chat-room-send-button">전송</button>
        </form>
    </div>
);
}