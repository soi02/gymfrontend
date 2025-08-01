import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import '../styles/BuddyNotification.css';

export default function BuddyNotification() {
    const [notifications, setNotifications] = useState([]);
    const auth = useSelector(state => state.auth);
    const token = localStorage.getItem('token');

    // 알림 목록 불러오기
    const fetchNotifications = async () => {
        try {
            const res = await axios.get(`http://localhost:8080/api/buddy/matching-notifications/${auth.id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // 예를 들어 받은 요청: status === "pending" && 내가 받는 사람(receiverBuddyId === auth.id)
            // 보낸 요청: 내가 보낸 사람(sendBuddyId === auth.id)
            // 형식에 맞게 변환 필요

            // 임시 가공 (백엔드 반환 데이터에 따라 조절)
            const processed = res.data.map(item => {
                const type = item.receiver_buddy_id === auth.id ? 'received' : 'sent';
                return {
                    id: item.matching_id,                   // matching_id로 키 지정
                    name: type === 'received' ? item.sender_name : item.receiver_name,  // 상대방 이름 보여주기
                    intro: type === 'received' ? item.sender_intro : item.receiver_intro,  // 상대방 소개글
                    profileImage: type === 'received'
                        ? (item.sender_image ? `http://localhost:8080/uploadFiles/${item.sender_image}` : 'https://placehold.co/100x100?text=No+Image')
                        : (item.receiver_image ? `http://localhost:8080/uploadFiles/${item.receiver_image}` : 'https://placehold.co/100x100?text=No+Image'),
                    type,
                    status: item.status,
                    sendBuddyId: item.send_buddy_id,
                    receiverBuddyId: item.receiver_buddy_id,
                };
            });
            setNotifications(processed);

        } catch (err) {
            console.error("알림 불러오기 실패:", err);
        }
    };

    // useEffect(() => {
    //     fetchNotifications();
    // }, []);
    useEffect(() => {
        if (auth.id) {
            fetchNotifications();
        }
    }, [auth.id]);

    // 수락, 거절 버튼 클릭 핸들러
    const handleResponse = async (id, status, sendBuddyId) => {
        try {
            await axios.post('http://localhost:8080/api/buddy/response', {
                id,
                status,  // "accepted" 또는 "rejected"
                sendBuddyId,
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            alert(`요청을 ${status === 'accepted' ? '수락' : '거절'}했습니다.`);
            fetchNotifications(); // 변경 후 목록 갱신
        } catch (err) {
            console.error("응답 실패:", err);
        }
    };

    // 요청 취소 버튼 핸들러 (필요하면 백엔드 API 맞게 수정)
    const handleCancel = async (id) => {
        try {
            await axios.post('http://localhost:8080/api/buddy/cancel-request', { id }, {
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
                                <>
                                    <button className="btn-accept" onClick={() => handleResponse(noti.id, 'accepted', noti.sendBuddyId)}>수락</button>
                                    <button className="btn-decline" onClick={() => handleResponse(noti.id, 'rejected', noti.sendBuddyId)}>거절</button>
                                </>
                            ) : (
                                <button className="btn-cancel" onClick={() => handleCancel(noti.id)}>요청취소</button>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}