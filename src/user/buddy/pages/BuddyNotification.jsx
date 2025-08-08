import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import '../styles/BuddyNotification.css';

export default function BuddyNotification() {
    const [notifications, setNotifications] = useState([]);
    const auth = useSelector(state => state.auth);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    // 알림 목록 불러오기
    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`https://172.30.1.74:8443/api/buddy/matching-notifications/${auth.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const processed = res.data.map(item => {
                const type = item.receiver_buddy_id === auth.id ? 'received' : 'sent';
                return {
                    id: item.matching_id,
                    name: type === 'received' ? item.sender_name : item.receiver_name,
                    intro: type === 'received' ? item.sender_intro : item.receiver_intro,
                    profileImage: type === 'received'
                        ? (item.sender_image ? `https://172.30.1.74:8443/uploadFiles/${item.sender_image}` : 'https://placehold.co/100x100?text=No+Image')
                        : (item.receiver_image ? `https://172.30.1.74:8443/uploadFiles/${item.receiver_image}` : 'https://placehold.co/100x100?text=No+Image'),
                    type,
                    status: item.status,
                    sendBuddyId: item.send_buddy_id,
                    receiverBuddyId: item.receiver_buddy_id,
                };
            });
            
            // '취소' 상태인 알림을 제외하고 필터링합니다.
            const filteredNotifications = processed.filter(noti => noti.status !== '취소');

            setNotifications(filteredNotifications);

        } catch (err) {
            console.error("알림 불러오기 실패:", err);
        }
    };

    useEffect(() => {
        if (auth.id) {
            fetchNotifications();
        }
    }, [auth.id]);

    // 수락, 거절 버튼 클릭 핸들러
    const handleResponse = async (id, status, sendBuddyId) => {
        try {
            await axios.post('https://172.30.1.74:8443/api/buddy/response', {
                id,
                status,
                sendBuddyId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });

            if (status === '수락') {
                alert("요청을 수락했습니다. 채팅방으로 이동합니다.");
                fetchNotifications(); 
            } else {
                alert("요청을 거절했습니다.");
                fetchNotifications();
            }

        } catch (err) {
            console.error("응답 실패:", err);
        }
    };

    // 요청 취소 핸들러
    const handleCancel = async (id) => {
        try {
            // "response" API를 사용하여 status를 '취소'로 업데이트합니다.
            await axios.post('https://172.30.1.74:8443/api/buddy/response', { 
                id,
                status: '취소',
                // sendBuddyId는 필수 값이 아닐 수 있으므로 빈 값으로 전달합니다.
                sendBuddyId: null
             }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            alert("요청을 취소했습니다.");
            fetchNotifications();
        } catch (err) {
            console.error("요청 취소 실패:", err);
        }
    };
    
    // '바로 채팅 가기' 버튼 클릭 핸들러
    const handleGoToChat = (matchingId) => {
        navigate(`/gymmadang/buddy/buddyChat/${matchingId}`);
    };

    return (
        <div className="buddy-container">
            <h4 className="buddy-title">버디 알림</h4>
            <ul className="buddy-list">
                {notifications.length === 0 && <li>알림이 없습니다.</li>}
                {notifications.map((noti) => (
                    <li key={noti.id} className="buddy-item">
                        <div className="buddy-info">
                            <img src={noti.profileImage} alt="프로필" className="buddy-profile-img" />
                            <div className="buddy-text">
                                <div className="buddy-name">{noti.name}</div>
                                <div className="buddy-intro">{noti.intro}</div>
                            </div>
                        </div>

                        <div className="buddy-buttons">
                            {noti.type === 'received' ? (
                                // 요청을 받은 경우
                                <>
                                    {noti.status === '대기' ? (
                                        <>
                                            <button className="btn-accept" onClick={() => handleResponse(noti.id, '수락', noti.sendBuddyId)}>수락</button>
                                            <button className="btn-decline" onClick={() => handleResponse(noti.id, '거절', noti.sendBuddyId)}>거절</button>
                                        </>
                                    ) : noti.status === '수락' ? (
                                        <button 
                                            className="btn-go-to-chat" 
                                            onClick={() => handleGoToChat(noti.id)}
                                        >
                                            바로 채팅 가기
                                        </button>
                                    ) : null}
                                </>
                            ) : (
                                // 요청을 보낸 경우
                                <>
                                    {noti.status === '수락' ? (
                                        <button 
                                            className="btn-go-to-chat" 
                                            onClick={() => handleGoToChat(noti.id)}
                                        >
                                            바로 채팅 가기
                                        </button>
                                    ) : (
                                        <button className="btn-cancel" onClick={() => handleCancel(noti.id)}>요청 취소</button>
                                    )}
                                </>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}