import React, { useEffect, useRef, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const BuddyChatRoom = ({ matchingId, senderId }) => {
    const clientRef = useRef(null);
    const [connected, setConnected] = useState(false);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        const token = localStorage.getItem('token');
        // const sock = new SockJS('http://localhost:8080/ws-buddy');
        // const stompClient = Stomp.over(sock);
        const sock = new SockJS('http://localhost:8080/ws-buddy');
        const stompClient = Stomp.over(() => sock); // 함수로 전달 → 경고 제거됨
        stompClient.debug = str => console.log('[STOMP 디버그]:', str);

        // stompClient.connect(
        //     { Authorization: `Bearer ${token}` }, // 헤더에 토큰 추가
        //     () => {
        //         console.log('[2] STOMP 연결 성공 🎉');

        //         stompClient.subscribe(`/topic/public/${matchingId}`, (message) => {
        //             const msg = JSON.parse(message.body);
        //             if (msg.matchingId === matchingId) {
        //                 setMessages(prev => [...prev, msg]);
        //             }
        //         });

        //         clientRef.current = stompClient;
        //         setConnected(true);
        //     },
        //     (error) => {
        //         console.error('[4] STOMP 연결 실패 ❌:', error);
        //     }
        // );
        stompClient.connect(
            {},  // ✅ 빈 헤더로 연결 테스트
            () => {
                console.log('[2] STOMP 연결 성공 🎉');

                stompClient.subscribe(`/topic/public/${matchingId}`, (message) => {
                    const msg = JSON.parse(message.body);
                    if (msg.matchingId === matchingId) {
                        setMessages(prev => [...prev, msg]);
                    }
                });

                clientRef.current = stompClient;
                setConnected(true);
            },
            (error) => {
                console.error('[4] STOMP 연결 실패 ❌:', error);
            }
        );

        return () => {
            if (clientRef.current?.connected) {
                clientRef.current.disconnect(() => {
                    console.log('[5] 연결 해제 완료');
                });
            }
        };
    }, [matchingId]);

    const sendMessage = () => {
        if (!connected || !clientRef.current) {
            alert('서버 연결이 아직 완료되지 않았습니다.');
            return;
        }

        const msgObj = {
            sendBuddyId: senderId,
            matchingId: matchingId,
            message: input
        };

        clientRef.current.send('/app/chat.sendMessage', {}, JSON.stringify(msgObj));
        setInput('');
    };

    return (
        <div>
            <div>
                {messages.map((msg, idx) => (
                    <div key={idx}><b>{msg.sendBuddyId}:</b> {msg.message}</div>
                ))}
            </div>
            <input
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="메시지 입력"
            />
            <button onClick={sendMessage}>Send</button>
        </div>
    );
};

export default BuddyChatRoom;