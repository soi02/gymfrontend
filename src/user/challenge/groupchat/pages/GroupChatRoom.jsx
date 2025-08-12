// src/components/GroupChatRoom.jsx

import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Stomp from 'stompjs';
// import '../styles/GroupChatRoom.css';
import apiClient from '../../../../global/api/apiClient';

export default function GroupChatRoom() {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const userId = useSelector(state => state.auth.id);
    const reduxToken = useSelector(state => state.auth.token);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const stompClient = useRef(null);
    const messagesEndRef = useRef(null);

    const token = reduxToken || localStorage.getItem("token");

    // 채팅방 접속 시 이전 메시지 기록 불러오기
    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                // 이전 채팅 기록을 불러오는 API 호출
                const response = await apiClient.get(`/challenge/groupchat/getChatHistoryProcess/${challengeId}`);
                setMessages(response.data);
            } catch (error) {
                console.error("채팅 기록을 불러오는 데 실패했습니다:", error);
                alert("채팅 기록을 불러올 수 없습니다. 다시 시도해 주세요.");
                navigate(`/challenge/challengeDetail/${challengeId}`);
            }
        };

        if (challengeId && token) {
            fetchChatHistory();
        }
    }, [challengeId, navigate, token]);

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

        const headers = {
            'Authorization': `Bearer ${token}`
        };

        stompClient.current.connect(headers, () => {
            console.log('✅ WebSocket 연결 성공!');
            stompClient.current.subscribe(`/topic-group/sendGroupMessage/${challengeId}`, (message) => {
                const receivedMessage = JSON.parse(message.body);
                // 서버에서 받은 메시지를 상태에 추가
                setMessages(prevMessages => [...prevMessages, receivedMessage]);
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
    }, [challengeId, token]);

    // 메시지 목록이 업데이트될 때마다 스크롤을 가장 아래로 이동
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    // // 메시지 전송 핸들러
    // const handleSendMessage = async (e) => {
    //     e.preventDefault();
    //     if (newMessage.trim() === '' || !stompClient.current || !stompClient.current.connected) {
    //         return;
    //     }
        
    //     const chatMessage = {
    //         senderUserId: userId, 
    //         groupChatMessageContent: newMessage,
    //         challengeId: challengeId
    //     };
        
    //     try {
    //         // ✅ API를 호출하여 메시지를 서버에 저장
    //         const response = await apiClient.post(`/challenge/groupchat/saveGroupChatMessage`, chatMessage);
    //         console.log("메시지 저장 성공:", response.data);

    //         // STOMP를 통해 메시지 전송
    //         stompClient.current.send(`/app/sendGroupMessage/${challengeId}`, {}, JSON.stringify(response.data));

    //         // 전송 후 입력창 비우기
    //         setNewMessage('');
    //     } catch (error) {
    //         console.error("메시지 저장 실패:", error);
    //         alert("메시지 전송에 실패했습니다. 다시 시도해 주세요.");
    //     }
    // };

// 메시지 전송 핸들러
const handleSendMessage = (e) => { // ✅ async 키워드 삭제
    e.preventDefault();
    if (newMessage.trim() === '' || !stompClient.current || !stompClient.current.connected) {
        return;
    }

    // 서버의 STOMP 컨트롤러가 받을 메시지 형식에 맞게 객체 구성
    const chatMessage = {
        senderUserId: userId,
        groupChatMessageContent: newMessage,
        challengeId: challengeId
    };
    
    // ✅ STOMP를 통해 메시지 전송
    stompClient.current.send(`/app/sendGroupMessage/${challengeId}`, {}, JSON.stringify(chatMessage));

    // 전송 후 입력창 비우기
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
                {messages.map((msg, index) => (
                    <div 
                        key={index} 
                        className={`group-chat-room-message ${msg.senderUserId === userId ? 'group-chat-room-my-message' : 'group-chat-room-other-message'}`}
                    >
                        <span className="group-chat-room-message-sender">{msg.senderUserId}</span>
                        <div className="group-chat-room-message-content">{msg.groupChatMessageContent}</div>
                        <span className="group-chat-room-message-time">{new Date(msg.createdAt).toLocaleTimeString()}</span>
                    </div>
                ))}
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