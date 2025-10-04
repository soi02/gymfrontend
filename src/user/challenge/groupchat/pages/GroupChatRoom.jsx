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

// 24시간 형식으로 분 단위 시간을 포맷하는 함수
const formatTime = (isoString) => {
    if (!isoString) return '';
    const date = new Date(isoString);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
};

export default function GroupChatRoom() {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const userId = useSelector(state => state.auth.id);
    const reduxToken = useSelector(state => state.auth.token);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);

    const [participantCount, setParticipantCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [challengeTitle, setChallengeTitle] = useState('챌린지 채팅방');

    const token = reduxToken || localStorage.getItem("token");

    // 채팅방 접속 시, 데이터 불러오기 및 읽음 처리
    useEffect(() => {
        const fetchChatData = async () => {
            setIsLoading(true);
            try {
                // ❌ 챌린지 정보를 가져오는 API 호출을 삭제합니다.
                // 이전 백엔드 수정으로 인해 필요 없는 호출입니다.
                // const challengeResponse = await apiClient.get(`/challenge/getChallenge/${challengeId}`);
                // if (challengeResponse.data && challengeResponse.data.challengeName) {
                //     setChallengeTitle(challengeResponse.data.challengeName);
                // }

                const participantResponse = await apiClient.get(`/challenge/groupchat/getParticipantCount/${challengeId}`);
                setParticipantCount(participantResponse.data);

                const historyResponse = await apiClient.get(`/challenge/groupchat/getChatHistoryProcess/${challengeId}`);
                const chatHistory = historyResponse.data;

                // ✅ 챌린지 제목을 채팅 기록에서 가져와 설정합니다.
                if (chatHistory.length > 0) {
                    setChallengeTitle(chatHistory[0].challengeTitle);
                }

                setMessages(chatHistory);

                if (chatHistory.length > 0) {
                    const messageIds = chatHistory.map(msg => msg.groupChatMessageId);
                    await apiClient.post(`/challenge/groupchat/readMessageProcess`, {
                        messageIds: messageIds,
                        userId: userId
                    });
                }
            } catch (error) {
                console.error("데이터를 불러오는 데 실패했습니다:", error);
                alert("데이터를 불러올 수 없습니다. 다시 시도해 주세요.");
                navigate(`/challenge/challengeDetail/${challengeId}`);
            } finally {
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
        // stompClient.current.debug = null;
        stompClient.current.debug = (s) => console.log('[STOMP]', s);

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
        // stompClient.current.send(`/app/sendGroupMessage/${challengeId}`, {}, JSON.stringify(chatMessage));
        stompClient.current.send(
        `/app/sendGroupMessage/${challengeId}`,
        { 'content-type': 'application/json' },
        JSON.stringify(chatMessage)
        );

        setNewMessage('');
    };

    console.log("GroupChatRoom 컴포넌트가 렌더링되었습니다. challengeId:", challengeId);

    return (
        <div className="group-chat-room-container">
            <header className="group-chat-room-header">
                <button onClick={() => navigate(-1)} className="group-chat-room-back-button">&lt;</button>
                <h2>{challengeTitle}</h2> {/* 동적으로 챌린지 이름 표시 */}
                <div></div>
            </header>
            <div className="group-chat-room-messages">
                {messages.map((msg, index) => {
                    const prevMsg = messages[index - 1];
                    const nextMsg = messages[index + 1];
                    const isMyMessage = msg.senderUserId === userId;

                    const shouldShowSenderInfo = !isMyMessage && (!prevMsg || prevMsg.senderUserId !== msg.senderUserId);
                    // const shouldShowTime = !nextMsg || (nextMsg && new Date(nextMsg.createdAt).getMinutes() !== new Date(msg.createdAt).getMinutes());
                    // const shouldShowReadCount = isMyMessage && (!nextMsg || nextMsg.senderUserId !== msg.senderUserId || new Date(nextMsg.createdAt).getMinutes() !== new Date(msg.createdAt).getMinutes());
                    const isBlockEnd =
                    !nextMsg ||
                    nextMsg.senderUserId !== msg.senderUserId ||
                    new Date(nextMsg.createdAt).getMinutes() !== new Date(msg.createdAt).getMinutes();
                    const shouldShowTime = isBlockEnd;
                    const unreadCount = Math.max(0, (participantCount ?? 0) - (msg.readCount ?? 0));

                    return (
                        <div 
                            key={index} 
                            className={`group-chat-room-message-row ${isMyMessage ? 'group-chat-room-my-message' : 'group-chat-room-other-message'} ${shouldShowSenderInfo ? 'first-message' : ''}`}
                        >
                            {!isMyMessage && (
                                shouldShowSenderInfo ? (
                                    <img 
                                        src={toAbsUrl(msg.senderProfileImagePath)}
                                        alt={msg.senderNickname || '프로필 사진'} 
                                        className="group-chat-room-profile-image" 
                                    />
                                ) : (
                                    <div className="group-chat-room-profile-placeholder"></div>
                                )
                            )}
                            <div className="group-chat-room-message-group">
                                {shouldShowSenderInfo && (
                                    <span className="group-chat-room-message-sender">
                                        {msg.senderNickname || `사용자 ${msg.senderUserId}`}
                                    </span>
                                )}
                                <div className="group-chat-room-message-and-info">
                                    <div className="group-chat-room-message-content">
                                        {msg.groupChatMessageContent}
                                    </div>
                                    {shouldShowTime && (
                                        <div className="group-chat-room-message-info">
                                            {/* {isMyMessage && shouldShowReadCount && (
                                                <span className="group-chat-room-unread-count">
                                                    {participantCount - (msg.readCount || 0)}
                                                </span>
                                            )} */}
                                               {isBlockEnd && unreadCount > 0 && (
                                                    <span className="group-chat-room-unread-count">{unreadCount}</span>
                                                )}
                                            <span className="group-chat-room-message-time">
                                                {formatTime(msg.createdAt)}
                                            </span>
                                        </div>
                                    )}
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
                    placeholder="말을 건네보시오"
                    className="group-chat-room-input"
                />
                <button type="submit" className="group-chat-room-send-button">전송</button>
            </form>
        </div>
    );
}