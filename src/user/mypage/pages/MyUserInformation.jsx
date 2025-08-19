// src/MyUserInformation.js

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useUserService from '../../../auth/service/userService';
import '../styles/MyUserInformation.css';

// Daum Postcode API를 로드하기 위한 스크립트
const loadDaumPostcodeScript = () => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Daum Postcode script.'));
        document.head.appendChild(script);
    });
};

export default function MyUserInformation() {
    const userId = useSelector(state => state.auth.id);

    const [userData, setUserData] = useState({
        id: '',
        name: '',
        password: '',
        birth: '',
        address: '',
        phone: '',
        profileImage: '',
        height: '',
        weight: '',
        muscleMass: '',
        accountName: ''
    });

    const [isPhoneValid, setIsPhoneValid] = useState(true);
    const navigate = useNavigate();
    const { getUserInfo, updateUserInfo } = useUserService();

    useEffect(() => {
        if (userId) {
            console.log("Current User ID from Redux:", userId);
            const fetchUserData = async () => {
                try {
                    const data = await getUserInfo(userId);
                    console.log("Data fetched from backend:", data);
                    setUserData(data);
                } catch (error) {
                    console.error("사용자 정보 로드 실패:", error);
                    alert("사용자 정보를 불러오는 데 실패했습니다.");
                }
            };
            fetchUserData();
        }

        if (window.daum === undefined) {
            loadDaumPostcodeScript();
        }
    }, [userId]); // ✅ getUserInfo를 의존성 배열에서 제거

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const cleanedValue = value.replace(/[^0-9]/g, '');
            if (cleanedValue.length > 11) {
                setIsPhoneValid(false);
                return;
            } else {
                setIsPhoneValid(true);
            }

            let formattedValue = '';
            if (cleanedValue.length > 3 && cleanedValue.length <= 7) {
                formattedValue = `${cleanedValue.slice(0, 3)}-${cleanedValue.slice(3)}`;
            } else if (cleanedValue.length > 7) {
                formattedValue = `${cleanedValue.slice(0, 3)}-${cleanedValue.slice(3, 7)}-${cleanedValue.slice(7, 11)}`;
            } else {
                formattedValue = cleanedValue;
            }
            setUserData({ ...userData, [name]: formattedValue });
        } else {
            setUserData({ ...userData, [name]: value });
        }
    };

    const handleKeyDown = (e) => {
        const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
        if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }
    };

    const handleSave = async () => {
        if (!isPhoneValid || userData.phone.replace(/[^0-9]/g, '').length < 10) {
            alert('전화번호 형식을 확인해 주세요.');
            return;
        }

        try {
            await updateUserInfo(userData);
            alert('정보가 성공적으로 저장되었습니다!');
        } catch (error) {
            console.error("정보 저장 실패:", error);
            alert('정보 저장에 실패했습니다. 다시 시도해 주세요.');
        }
    };

    const handleGoBack = () => {
        navigate(-1);
    };

    const handleAddressSearch = () => {
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: function(data) {
                    setUserData({
                        ...userData,
                        address: data.address
                    });
                }
            }).open();
        } else {
            alert("주소 검색 스크립트를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
        }
    };

    return (
        <div className="mpInfo-container">
            <header className="mpInfo-main-header">
                <button onClick={handleGoBack} className="mpInfo-back-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z"/>
                    </svg>
                </button>
                <h2 className="mpInfo-header-title">프로필 수정</h2>
                <button onClick={handleSave} className="mpInfo-save-button-top">저장</button>
            </header>

            <div className="mpInfo-profile-section">
                <div className="mpInfo-profile-image-container">
                    <img src={userData.profileImage} alt="프로필 이미지" className="mpInfo-profile-image" />
                    <button className="mpInfo-edit-button">
                        <svg className="mpInfo-edit-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.127 22.564l-2.091-2.091c-.516-.516-.763-1.16-.729-1.802l.068-.781 1.776 1.776c.075.075.16.14.25.195l.1.06c.09.054.187.087.29.098l.128.012c.11.002.215-.02.32-.075l.1-.059 1.776 1.776.082-.246c.02-.06.036-.12.045-.181l.012-.13c.01-.102-.016-.207-.07-.317l-.06-.1zM19.782 5.218c-.39-.39-1.024-.39-1.414 0l-12.8 12.8c-.39.39-.39 1.024 0 1.414.39.39 1.024.39 1.414 0l12.8-12.8c.39-.39.39-1.024 0-1.414zm-4.364 2.89l-2.09-2.091 6.364-6.364c.39-.39 1.024-.39 1.414 0l2.09 2.09c.39.39.39 1.024 0 1.414l-6.364 6.364zm-5.01-1.378l1.414 1.414-1.414 1.414-1.414-1.414 1.414-1.414zm-2.09-2.09l-1.414 1.414-1.414-1.414 1.414-1.414 1.414 1.414z"/>
                        </svg>
                    </button>
                </div>
                <h1 className="mpInfo-user-name">@{userData.accountName}</h1>
            </div>

            <div className="mpInfo-form-section">
                
                <div className="mpInfo-form-group">
                    <label className="mpInfo-label">이름</label>
                    <input
                        type="text"
                        name="name"
                        value={userData.name}
                        onChange={handleChange}
                        className="mpInfo-input"
                        placeholder="이름"
                    />
                </div>

                <div className="mpInfo-form-group">
                    <label className="mpInfo-label">비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        className="mpInfo-input"
                        placeholder="새 비밀번호 입력"
                    />
                </div>
                
                <div className="mpInfo-form-group">
                    <label className="mpInfo-label">생년월일</label>
                    <input
                        type="date"
                        name="birth"
                        value={userData.birth}
                        onChange={handleChange}
                        className="mpInfo-input"
                    />
                </div>
                
                <div className="mpInfo-form-group">
                    <label className="mpInfo-label">거주지역</label>
                    <div className="mpInfo-address-input-group">
                        <input
                            type="text"
                            name="address"
                            value={userData.address}
                            readOnly
                            className="mpInfo-input"
                            placeholder="주소 검색"
                        />
                        <button type="button" onClick={handleAddressSearch} className="mpInfo-address-button">
                            주소 찾기
                        </button>
                    </div>
                </div>
                
                <div className="mpInfo-form-group">
                    <label className="mpInfo-label">전화번호</label>
                    <input
                        type="tel"
                        name="phone"
                        value={userData.phone}
                        onChange={handleChange}
                        className="mpInfo-input"
                        placeholder="전화번호"
                    />
                    {!isPhoneValid && (
                        <p className="mpInfo-error-message">전화번호는 11자리를 넘을 수 없습니다.</p>
                    )}
                </div>

                <div className="mpInfo-form-group-triple">
                    <div className="mpInfo-form-group">
                        <label className="mpInfo-label">키</label>
                        <div className="mpInfo-input-with-unit">
                            <input
                                type="number"
                                name="height"
                                value={userData.height}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className="mpInfo-input"
                                placeholder="키"
                            />
                            <span className="mpInfo-unit">cm</span>
                        </div>
                    </div>
                    <div className="mpInfo-form-group">
                        <label className="mpInfo-label">몸무게</label>
                        <div className="mpInfo-input-with-unit">
                            <input
                                type="number"
                                name="weight"
                                value={userData.weight}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className="mpInfo-input"
                                placeholder="몸무게"
                            />
                            <span className="mpInfo-unit">kg</span>
                        </div>
                    </div>
                    <div className="mpInfo-form-group">
                        <label className="mpInfo-label">근육량</label>
                        <div className="mpInfo-input-with-unit">
                            <input
                                type="number"
                                name="muscleMass"
                                value={userData.muscleMass}
                                onChange={handleChange}
                                onKeyDown={handleKeyDown}
                                className="mpInfo-input"
                                placeholder="근육량"
                            />
                            <span className="mpInfo-unit">kg</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}