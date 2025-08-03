import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useParams, useLocation } from 'react-router-dom';

const BuddyChatRoom = () => {
    const { matchingId } = useParams();
    const location = useLocation();
    const senderId = location.state?.senderId;

    const clientRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    //   import { Client } from '@stomp/stompjs';

    useEffect(() => {
        const stompClient = new Client({
            webSocketFactory: () => {
                const sock = new SockJS('http://localhost:8080/ws-buddy');

                sock.onopen = () => console.log('[SockJS] 연결 열림');
                sock.onclose = () => console.log('[SockJS] 연결 닫힘');
                sock.onerror = (e) => console.error('[SockJS] 오류 발생:', e);

                return sock;
            },
            reconnectDelay: 5000,
            debug: (msg) => console.log('[STOMP 디버그]:', msg),
        });

        stompClient.onConnect = (frame) => {
            console.log('[STOMP 연결 성공 🎉]', frame);

            stompClient.subscribe(`/topic/public/${matchingId}`, (message) => {
                console.log('[메시지 수신]', message);
                const msg = JSON.parse(message.body);
                if (msg.matchingId === matchingId) {
                    setMessages((prev) => [...prev, msg]);
                }
            });

            clientRef.current = stompClient;
            setConnected(true);
        };

        stompClient.onStompError = (frame) => {
            console.error('[STOMP 에러]', frame.headers['message']);
            console.error(frame.body);
        };

        stompClient.onWebSocketClose = (event) => {
            console.warn('[WebSocket 닫힘]', event);
        };

        stompClient.onWebSocketError = (event) => {
            console.error('[WebSocket 오류]', event);
        };

        stompClient.activate();

        return () => {
            console.log('[STOMP 연결 비활성화]');
            stompClient.deactivate();
            setConnected(false);
        };
    }, [matchingId]);
    const sendMessage = () => {
        if (!connected || !clientRef.current) {
            alert('서버 연결이 아직 완료되지 않았습니다.');
            return;
        }

        const msgObj = {
            sendBuddyId: senderId,
            matchingId,
            message: input,
        };

        clientRef.current.publish({
            destination: '/app/chat.sendMessage',
            body: JSON.stringify(msgObj),
        });

        setInput('');
    };

    return (
        <div>
            <div>
                {messages.map((msg, idx) => (
                    <div key={idx}>
                        <b>{msg.sendBuddyId}:</b> {msg.message}
                    </div>
                ))}
            </div>
            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메시지 입력"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default BuddyChatRoom;