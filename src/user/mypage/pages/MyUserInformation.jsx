// src/MyUserInformation.js

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useUserService from '../../../auth/service/userService';
import '../styles/MyUserInformation.css';

// 백엔드 API 기본 URL
const API_BASE_URL = 'http://localhost:8080';

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
    // Redux store에서 사용자 ID를 가져옵니다.
    const userId = useSelector(state => state.auth.id);

    // 파일 입력(input) 엘리먼트에 접근하기 위한 ref 생성
    const fileInputRef = useRef(null);
    // ✅ 프로필 이미지 파일 객체를 저장할 상태 추가
    const [profileImageFile, setProfileImageFile] = useState(null);

    // 백엔드 데이터와 일치하도록 상태 필드명을 camelCase로 설정
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

    // 컴포넌트 마운트 시 사용자 정보 로드
    useEffect(() => {
        if (userId) {
            console.log("Current User ID from Redux:", userId);
            const fetchUserData = async () => {
                try {
                    const data = await getUserInfo(userId);
                    console.log("Data fetched from backend:", data);
                    // ✅ 컴포넌트 상태 업데이트
                    setUserData(data);
                } catch (error) {
                    console.error("사용자 정보 로드 실패:", error);
                    alert("사용자 정보를 불러오는 데 실패했습니다.");
                }
            };
            fetchUserData();
        }

        // 주소 검색 API 스크립트 로드
        if (window.daum === undefined) {
            loadDaumPostcodeScript();
        }
    }, [userId]);

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

    // ✅ handleSave 함수 수정: FormData를 사용하여 데이터를 보냄
    const handleSave = async () => {
        if (!isPhoneValid || userData.phone.replace(/[^0-9]/g, '').length < 10) {
            alert('전화번호 형식을 확인해 주세요.');
            return;
        }

        // FormData 객체 생성
        const formData = new FormData();

        // 텍스트 필드를 FormData에 추가
        formData.append('id', userData.id);
        formData.append('name', userData.name);
        formData.append('password', userData.password); // 비밀번호는 수정 시에만 보내도록 로직 추가 가능
        formData.append('birth', userData.birth);
        formData.append('address', userData.address);
        formData.append('phone', userData.phone);
        formData.append('height', userData.height);
        formData.append('weight', userData.weight);
        formData.append('muscleMass', userData.muscleMass);

        // ✅ 이미지 파일이 존재하면 FormData에 추가
        if (profileImageFile) {
            formData.append('profileImageFile', profileImageFile);
        }

        try {
            // ✅ updateUserInfo 함수에 FormData를 전달
            await updateUserInfo(formData);
            alert('정보가 성공적으로 저장되었습니다!');
            // 저장 후 사용자 정보 다시 불러와서 화면 갱신
            const updatedData = await getUserInfo(userId);
            setUserData(updatedData);
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
                oncomplete: function (data) {
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

    const getProfileImageUrl = () => {
        // ✅ 상태에 새로운 파일이 있으면 미리보기 URL을 반환
        if (profileImageFile) {
            return URL.createObjectURL(profileImageFile);
        }
        // ✅ 그렇지 않으면 기존 이미지 URL을 반환
        return userData.profileImage
            ? `${API_BASE_URL}/uploadFiles/${userData.profileImage}`
            : 'https://placehold.co/100x100?text=No+Image';
    };

    // ✅ 파일 변경 핸들러 함수 수정
    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log("선택된 파일:", file.name);
            setProfileImageFile(file); // ✅ 파일 객체를 상태에 저장
        }
    };

    return (
        <div className="mpInfo-container">
            <header className="mpInfo-main-header">
                <button onClick={handleGoBack} className="mpInfo-back-button">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M10.828 12l4.95 4.95-1.414 1.414L8 12l6.364-6.364 1.414 1.414z" />
                    </svg>
                </button>
                <h2 className="mpInfo-header-title">프로필 수정</h2>
                <button onClick={handleSave} className="mpInfo-save-button-top">저장</button>
            </header>

            <div className="mpInfo-profile-section">
                <div className="mpInfo-profile-image-container">
                    <img src={getProfileImageUrl()} alt="프로필 이미지" className="mpInfo-profile-image" />
                    <button
                        onClick={() => fileInputRef.current.click()}
                        className="mpInfo-edit-button"
                    >
                        <i className="bi bi-camera"></i>
                    </button>
                </div>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: 'none' }}
                />
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