import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../styles/BuddyNotification.css';
// 알림이 없을 때 표시할 이미지를 가져옵니다.
import noNotificationImage from '../../../assets/img/buddy/balone.png';

export default function BuddyNotification() {
    const [notifications, setNotifications] = useState([]);
    const auth = useSelector(state => state.auth);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();

    const fetchNotifications = async () => {
        try {
            const res = await axios.get(
                `http://localhost:8080/api/buddy/matching-notifications/${auth.id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const processed = res.data.map(item => {
                const isSender = item.send_buddy_id === auth.id;
                const type = isSender ? 'sent' : 'received';

                return {
                    id: item.matching_id,
                    name: type === 'sent' ? item.receiver_name : item.sender_name,
                    intro: type === 'sent' ? item.receiver_intro : item.sender_intro,
                    profileImage: type === 'sent'
                        ? (item.receiver_image ? `http://localhost:8080/uploadFiles/${item.receiver_image}` : 'https://placehold.co/100x100?text=No+Image')
                        : (item.sender_image ? `http://localhost:8080/uploadFiles/${item.sender_image}` : 'https://placehold.co/100x100?text=No+Image'),
                    type,
                    status: item.status,
                    sendBuddyId: item.send_buddy_id,
                    receiverBuddyId: item.receiver_buddy_id,
                };
            });
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

    const handleResponse = async (id, status, sendBuddyId) => {
        try {
            await axios.post('http://localhost:8080/api/buddy/response',
                { id, status, sendBuddyId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (status === '수락') {
                toast.success("요청을 수락했습니다. 채팅방으로 이동하세요.", {
                    position: "top-center",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeButton: false,
                    theme: "colored",
                });
            } else {
                toast.info("요청을 거절했습니다.", {
                    position: "top-center",
                    autoClose: 1500,
                    hideProgressBar: false,
                    closeButton: false,
                });
            }
            fetchNotifications();

        } catch (err) {
            console.error("응답 실패:", err);
            toast.error("처리에 실패했습니다.", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeButton: false,
            });
        }
    };

    const handleCancel = async (id) => {
        try {
            await axios.post('http://localhost:8080/api/buddy/response',
                { id, status: '취소', sendBuddyId: null },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.info("요청을 취소했습니다.", {
                position: "top-center",
                autoClose: 1500,
                hideProgressBar: false,
                closeButton: false,
            });
            fetchNotifications();
        } catch (err) {
            console.error("요청 취소 실패:", err);
            toast.error("취소에 실패했습니다.", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                closeButton: false,
            });
        }
    };

    const handleGoToChat = (matchingId) => {
        navigate(`/buddy/buddyChat/${matchingId}`);
    };

    return (
        <div className="buddy-container">
            {/* <h4 className="buddy-title">버디 알림</h4> */}
            {notifications.length === 0 ? (
                <div className="no-notification-container">
                    <img src={noNotificationImage} alt="운동벗 이미지" className="no-notification-image" />
                    <p className="no-notification-text">아직 운동 벗이 없어요.<br />새로운 운동 벗을 찾으세요!</p>
                    <button 
                        className="find-buddy-button" 
                        onClick={() => navigate('/buddy/buddyHome')}
                    >
                        운동 벗 찾으러 가기
                    </button>
                </div>
            ) : (
                <ul className="buddy-list">
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
                                        {noti.status === '대기중' ? (
                                            <>
                                                <button className="btn-accept" onClick={() => handleResponse(noti.id, '수락', noti.sendBuddyId)}>수락</button>
                                                <button className="btn-decline" onClick={() => handleResponse(noti.id, '거절', noti.sendBuddyId)}>거절</button>
                                            </>
                                        ) : noti.status === '수락' ? (
                                            <button className="btn-go-to-chat" onClick={() => handleGoToChat(noti.id)}>채팅 가기</button>
                                        ) : noti.status === '거절' ? (
                                            <span className="rejected-status">거절됨</span>
                                        ) : null}
                                    </>
                                ) : (
                                    <>
                                        {noti.status === '대기중' ? (
                                            <button className="btn-cancel" onClick={() => handleCancel(noti.id)}>요청 취소</button>
                                        ) : noti.status === '수락' ? (
                                            <button className="btn-go-to-chat" onClick={() => handleGoToChat(noti.id)}>채팅 가기</button>
                                        ) : noti.status === '거절' ? (
                                            <span className="rejected-status">거절됨</span>
                                        ) : null}
                                    </>
                                )}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
            <ToastContainer />
        </div>
    );
}