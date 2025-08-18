// src/MyUserInformation.js

import React, { useState } from 'react';
import '../styles/MyUserInformation.css';

export default function MyUserInformation() {
    // 임시 사용자 데이터. 나중에 백엔드와 연동할 때 이 부분을 수정합니다.
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData({
            ...userData,
            [name]: value,
        });
    };

    const handleSave = () => {
        // 나중에 백엔드 API를 호출하여 사용자 정보를 업데이트하는 로직을 추가합니다.
        console.log('변경된 사용자 정보:', userData);
        alert('정보가 성공적으로 저장되었습니다!');
    };

    return (
        <div className="mp-container">
            <h1 className="mp-title">내 정보 수정</h1>
            
            <div className="mp-profile-section">
                <div className="mp-profile-image-container">
                    <img src={userData.profile_image} alt="프로필 이미지" className="mp-profile-image" />
                    <button className="mp-edit-button">
                        <svg className="mp-edit-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M7.127 22.564l-2.091-2.091c-.516-.516-.763-1.16-.729-1.802l.068-.781 1.776 1.776c.075.075.16.14.25.195l.1.06c.09.054.187.087.29.098l.128.012c.11.002.215-.02.32-.075l.1-.059 1.776 1.776.082-.246c.02-.06.036-.12.045-.181l.012-.13c.01-.102-.016-.207-.07-.317l-.06-.1zM19.782 5.218c-.39-.39-1.024-.39-1.414 0l-12.8 12.8c-.39.39-.39 1.024 0 1.414.39.39 1.024.39 1.414 0l12.8-12.8c.39-.39.39-1.024 0-1.414zm-4.364 2.89l-2.09-2.091 6.364-6.364c.39-.39 1.024-.39 1.414 0l2.09 2.09c.39.39.39 1.024 0 1.414l-6.364 6.364zm-5.01-1.378l1.414 1.414-1.414 1.414-1.414-1.414 1.414-1.414zm-2.09-2.09l-1.414 1.414-1.414-1.414 1.414-1.414 1.414 1.414z"/>
                        </svg>
                    </button>
                </div>
                <h2 className="mp-user-name">{userData.name}</h2>
            </div>
            
            <div className="mp-form-section">
                <div className="mp-form-group">
                    <label className="mp-label">아이디</label>
                    <input
                        type="text"
                        name="account_name"
                        value={userData.account_name}
                        onChange={handleChange}
                        className="mp-input"
                        placeholder="아이디"
                    />
                </div>
                
                <div className="mp-form-group">
                    <label className="mp-label">비밀번호</label>
                    <input
                        type="password"
                        name="password"
                        value={userData.password}
                        onChange={handleChange}
                        className="mp-input"
                        placeholder="새 비밀번호 입력"
                    />
                </div>
                
                <div className="mp-form-group">
                    <label className="mp-label">생년월일</label>
                    <input
                        type="date"
                        name="birth"
                        value={userData.birth}
                        onChange={handleChange}
                        className="mp-input"
                    />
                </div>
                
                <div className="mp-form-group">
                    <label className="mp-label">성별</label>
                    <select
                        name="gender"
                        value={userData.gender}
                        onChange={handleChange}
                        className="mp-input"
                    >
                        <option value="M">남자</option>
                        <option value="F">여자</option>
                        <option value="O">기타</option>
                    </select>
                </div>

                <div className="mp-form-group">
                    <label className="mp-label">거주지역</label>
                    <input
                        type="text"
                        name="address"
                        value={userData.address}
                        onChange={handleChange}
                        className="mp-input"
                        placeholder="거주지역"
                    />
                </div>
                
                <div className="mp-form-group">
                    <label className="mp-label">전화번호</label>
                    <input
                        type="tel"
                        name="phone"
                        value={userData.phone}
                        onChange={handleChange}
                        className="mp-input"
                        placeholder="전화번호"
                    />
                </div>
            </div>
            
            <hr className="mp-divider" />
            
            <div className="mp-form-section mp-grid-3">
                <div className="mp-form-group">
                    <label className="mp-label">키 (cm)</label>
                    <input
                        type="number"
                        name="height"
                        value={userData.height}
                        onChange={handleChange}
                        className="mp-input"
                        placeholder="키"
                    />
                </div>
                <div className="mp-form-group">
                    <label className="mp-label">몸무게 (kg)</label>
                    <input
                        type="number"
                        name="weight"
                        value={userData.weight}
                        onChange={handleChange}
                        className="mp-input"
                        placeholder="몸무게"
                    />
                </div>
                <div className="mp-form-group">
                    <label className="mp-label">근육량 (kg)</label>
                    <input
                        type="number"
                        name="muscle_mass"
                        value={userData.muscle_mass}
                        onChange={handleChange}
                        className="mp-input"
                        placeholder="근육량"
                    />
                </div>
            </div>

            <div className="mp-checkbox-group">
                <input
                    type="checkbox"
                    id="isBuddyCheckbox"
                    name="is_buddy"
                    checked={userData.is_buddy}
                    onChange={(e) => setUserData({ ...userData, is_buddy: e.target.checked })}
                    className="mp-checkbox"
                />
                <label htmlFor="isBuddyCheckbox" className="mp-label-checkbox">
                    운동동무 참여여부
                </label>
            </div>

            <div className="mp-button-group">
                <button onClick={handleSave} className="mp-save-button">정보 저장</button>
            </div>
        </div>
    );
}