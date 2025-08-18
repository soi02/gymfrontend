// src/MyUserInformation.js

import React, { useState } from 'react';
import '../styles/MyUserInformation.css';

export default function MyUserInformation() {
    const [userData, setUserData] = useState({
        id: 1,
        name: '홍길동',
        age: 30,
        gender: 'M',
        account_name: 'hong_gildong',
        password: 'password123',
        birth: '1995-01-01',
        address: '서울시 강남구',
        phone: '010-1234-5678',
        profile_image: 'https://via.placeholder.com/150',
        height: 175,
        weight: 70,
        muscle_mass: 40,
        is_buddy: true,
        created_at: '2023-01-01T10:00:00Z',
    });

    const [isPhoneValid, setIsPhoneValid] = useState(true);

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

            setUserData({
                ...userData,
                [name]: formattedValue,
            });
        } else {
            setUserData({
                ...userData,
                [name]: value,
            });
        }
    };

    const handleKeyDown = (e) => {
        const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
        if (!allowedKeys.includes(e.key) && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
        }
    };

    const handleSave = () => {
        if (!isPhoneValid || userData.phone.replace(/[^0-9]/g, '').length < 10) {
            alert('전화번호 형식을 확인해 주세요.');
            return;
        }
        
        console.log('변경된 사용자 정보:', userData);
        alert('정보가 성공적으로 저장되었습니다!');
    };

    const handleGoBack = () => {
        window.history.back();
    };

    // 주소 검색 함수
    const handleAddressSearch = () => {
        new window.daum.Postcode({
            oncomplete: function(data) {
                // 주소 정보를 받아와 userData 상태 업데이트
                setUserData({
                    ...userData,
                    address: data.address
                });
            }
        }).open();
    };

    return (
        <div className="mpInfo-container">
            {/* 뒤로가기 버튼 섹션 */}
            <div className="mpInfo-back-button-container">
                <button onClick={handleGoBack} className="mpInfo-back-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z"/>
                    </svg>
                </button>
            </div>

            {/* 헤더 섹션 */}
            <div className="mpInfo-header">
                <div className="mpInfo-profile-image-container">
                    <img src={userData.profile_image} alt="프로필 이미지" className="mpInfo-profile-image" />
                    <button className="mpInfo-edit-button">
                        <svg className="mpInfo-edit-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.127 22.564l-2.091-2.091c-.516-.516-.763-1.16-.729-1.802l.068-.781 1.776 1.776c.075.075.16.14.25.195l.1.06c.09.054.187.087.29.098l.128.012c.11.002.215-.02.32-.075l.1-.059 1.776 1.776.082-.246c.02-.06.036-.12.045-.181l.012-.13c.01-.102-.016-.207-.07-.317l-.06-.1zM19.782 5.218c-.39-.39-1.024-.39-1.414 0l-12.8 12.8c-.39.39-.39 1.024 0 1.414.39.39 1.024.39 1.414 0l12.8-12.8c.39-.39.39-1.024 0-1.414zm-4.364 2.89l-2.09-2.091 6.364-6.364c.39-.39 1.024-.39 1.414 0l2.09 2.09c.39.39.39 1.024 0 1.414l-6.364 6.364zm-5.01-1.378l1.414 1.414-1.414 1.414-1.414-1.414 1.414-1.414zm-2.09-2.09l-1.414 1.414-1.414-1.414 1.414-1.414 1.414 1.414z"/>
                        </svg>
                    </button>
                </div>
                <h1 className="mpInfo-user-name">{userData.name}</h1>
                <h2 className="mpInfo-title">내 정보 수정</h2>
            </div>

            <div className="mpInfo-form-section">
                <div className="mpInfo-form-group">
                    <label className="mpInfo-label">아이디</label>
                    <input
                        type="text"
                        name="account_name"
                        value={userData.account_name}
                        onChange={handleChange}
                        className="mpInfo-input"
                        placeholder="아이디"
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
                    <label className="mpInfo-label">성별</label>
                    <select
                        name="gender"
                        value={userData.gender}
                        onChange={handleChange}
                        className="mpInfo-input"
                    >
                        <option value="M">남자</option>
                        <option value="F">여자</option>
                        <option value="O">기타</option>
                    </select>
                </div>

                {/* 주소 입력 필드와 버튼으로 변경 */}
                <div className="mpInfo-form-group">
                    <label className="mpInfo-label">거주지역</label>
                    <div className="mpInfo-address-input-group">
                        <input
                            type="text"
                            name="address"
                            value={userData.address}
                            readOnly // 사용자가 직접 입력하지 못하게 readOnly 속성 추가
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
                                name="muscle_mass"
                                value={userData.muscle_mass}
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

            <div className="mpInfo-button-group">
                <button onClick={handleSave} className="mpInfo-save-button">정보 저장</button>
            </div>
        </div>
    );
}