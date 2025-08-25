import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserService from "../service/userService";
import "../styles/RegisterPage.css";
import { useEffect } from "react";

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

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        accountName: '',
        password: '',
        name: '',
        gender: 'M',
        birth: '',
        address: '',
        phone: '',
        profileImageFile: null,
        height: '',
        weight: '',
        muscleMass: '',
        isBuddy: false,
        agreeTerms: false,
        agreePrivacy: false,
        confirmPassword: ''
    });

    const [idCheckStatus, setIdCheckStatus] = useState({
        checked: false,
        available: false,
        message: ''
    });

    const [isTermsOpen, setIsTermsOpen] = useState(false);
    const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

    const navigate = useNavigate();
    const { registerUser, checkAccountNameDuplicate } = useUserService();
    const totalSteps = 5;

    useEffect(() => {
        // 주소 API 스크립트를 미리 로드
        if (window.daum === undefined) {
            loadDaumPostcodeScript();
        }
    }, []);

    const formatPhoneNumber = (value) => {
        if (!value) return value;
        const phoneNumber = value.replace(/[^\d]/g, '');
        if (phoneNumber.length <= 3) {
            return phoneNumber;
        } else if (phoneNumber.length <= 7) {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3)}`;
        } else {
            return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 7)}-${phoneNumber.slice(7, 11)}`;
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "file") {
            setFormData({
                ...formData,
                [name]: e.target.files[0]
            });
        } else if (name === "phone") {
            const formattedNumber = formatPhoneNumber(value);
            if (formattedNumber.replace(/[^\d]/g, '').length <= 11) {
                setFormData({
                    ...formData,
                    [name]: formattedNumber
                });
            }
        } else {
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value
            });
        }
    };

    const handleAllAgree = (e) => {
        const checked = e.target.checked;
        if (!checked && (formData.agreeTerms || formData.agreePrivacy)) {
            setFormData({
                ...formData,
                agreeTerms: false,
                agreePrivacy: false,
            });
        } else if (checked) {
            setFormData({
                ...formData,
                agreeTerms: true,
                agreePrivacy: true,
            });
        }
    };

    // 각각의 약관 동의 처리
    const handleSingleAgree = (name, checked) => {
        setFormData(prev => ({
            ...prev,
            [name]: checked
        }));
    };

    const handleNext = () => {
        if (step === 1 && (!formData.agreeTerms || !formData.agreePrivacy)) {
            alert("모든 약관에 동의해야 다음 단계로 진행할 수 있습니다.");
            return;
        }
        if (step === 2) {
            if (!idCheckStatus.checked || !idCheckStatus.available) {
                alert("아이디 중복 확인이 필요합니다.");
                return;
            }
            if (formData.password !== formData.confirmPassword) {
                alert("비밀번호가 일치하지 않습니다.");
                return;
            }
        }
        setStep(prev => Math.min(prev + 1, totalSteps));
    };

    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

    const handleSubmit = async () => {
        await registerUser(formData);
        // alert 대신 커스텀 모달 UI 사용
        // alert("계정 생성이 완료되었습니다.");
        navigate("/");
    };

    const handleGoBackPage = () => navigate(-1);

    // 주소 검색 API 호출
    const handleAddressSearch = () => {
        if (window.daum && window.daum.Postcode) {
            new window.daum.Postcode({
                oncomplete: (data) => {
                    let fullAddress = data.address;
                    let extraAddress = '';

                    if (data.addressType === 'R') {
                        if (data.bname !== '') {
                            extraAddress += data.bname;
                        }
                        if (data.buildingName !== '') {
                            extraAddress += (extraAddress !== '' ? `, ${data.buildingName}` : data.buildingName);
                        }
                        fullAddress += (extraAddress !== '' ? ` (${extraAddress})` : '');
                    }

                    setFormData({
                        ...formData,
                        address: fullAddress
                    });
                }
            }).open();
        } else {
            // alert 대신 커스텀 모달 UI 사용
            // alert("주소 검색 스크립트를 불러오는 중입니다. 잠시 후 다시 시도해주세요.");
        }
    };

    return (
        <div className="register-container">

            <div className="register-header">
                <button className="back-btn" onClick={handleGoBackPage}>&lt;</button>
                <h2>회원가입</h2>
            </div>

            <div className="register-progress-bar">
                {[...Array(totalSteps)].map((_, index) => (
                    <div
                        key={index}
                        className={`progress-step-item ${index < step ? 'active' : ''}`}
                    />
                ))}
            </div>

            <div className="register-form-section">
                {step === 1 && (
                    <div className="step-content">
                        <h4 className="step-title">서비스 이용약관에 동의해주세요.</h4>

                        <div className="terms-all-agree-box">
                            <label className="terms-checkbox-label all-agree">
                                <input
                                    type="checkbox"
                                    checked={formData.agreeTerms && formData.agreePrivacy}
                                    onChange={handleAllAgree}
                                />
                                <span>모든 약관에 동의합니다.</span>
                            </label>
                        </div>

                        <div className="terms-accordion">
                            <div className={`terms-accordion-item ${isTermsOpen ? 'open' : ''}`}>
                                <div className="terms-accordion-header" onClick={() => setIsTermsOpen(!isTermsOpen)}>
                                    <label className="terms-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.agreeTerms}
                                            onChange={(e) => handleSingleAgree('agreeTerms', e.target.checked)}
                                        />
                                        <span>이용약관 동의 (필수)</span>
                                    </label>
                                    <span className="arrow-icon">{isTermsOpen ? '▲' : '▼'}</span>
                                </div>
                                <div className="terms-accordion-content">
                                    <div className="terms-content">
                                        짐마당 서비스(이하 "서비스")는 헬스 파트너 매칭, 챌린지 운영 등 다양한 건강 관련 기능을 제공합니다.<br /><br />
                                        1) 본 서비스는 만 14세 이상만 가입 가능합니다.<br />
                                        2) 사용자는 허위 정보를 입력하지 않아야 하며, 부정행위를 통한 이용 시 이용 제한 조치가 취해질 수 있습니다.<br />
                                        3) 서비스는 운영자의 사정에 따라 변경되거나 중단될 수 있습니다.<br />
                                        4) 이용자는 타인의 정보를 도용해서는 안 됩니다.<br />
                                        5) 서비스 내에서 발생한 분쟁은 민사상의 절차를 통해 해결합니다.
                                    </div>
                                </div>
                            </div>

                            <div className={`terms-accordion-item ${isPrivacyOpen ? 'open' : ''}`}>
                                <div className="terms-accordion-header" onClick={() => setIsPrivacyOpen(!isPrivacyOpen)}>
                                    <label className="terms-checkbox-label">
                                        <input
                                            type="checkbox"
                                            checked={formData.agreePrivacy}
                                            onChange={(e) => handleSingleAgree('agreePrivacy', e.target.checked)}
                                        />
                                        <span>개인정보 수집 및 이용 동의 (필수)</span>
                                    </label>
                                    <span className="arrow-icon">{isPrivacyOpen ? '▲' : '▼'}</span>
                                </div>
                                <div className="terms-accordion-content">
                                    <div className="terms-content">
                                        본 서비스는 사용자 편의를 위해 아래 정보를 수집 및 이용합니다.<br /><br />
                                        1) 수집 항목: 이름, 아이디, 비밀번호, 생년월일, 키, 몸무게, 전화번호, 주소, 프로필 사진<br />
                                        2) 수집 목적: 운동 파트너 매칭, 건강 분석 서비스 제공<br />
                                        3) 보관 기간: 회원 탈퇴 시 즉시 파기<br />
                                        4) 개인정보 제3자 제공: 없음<br /><br />
                                        위 내용에 동의하지 않으면 서비스 이용이 제한될 수 있습니다.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className="step-content">
                        <h4 className="step-title">회원정보</h4>
                        <p className="step-subtitle">짐마당에서 사용할 계정 정보를 입력해주세요.</p>

                        <div className="form-group">
                            <label className="form-label">이름</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="이름을 입력해주세요"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">아이디</label>
                            <div className="input-with-button">
                                <input
                                    name="accountName"
                                    value={formData.accountName}
                                    onChange={(e) => {
                                        handleChange(e);
                                        // 아이디 입력 시 중복 체크 상태 초기화
                                        setIdCheckStatus({
                                            checked: false,
                                            available: false,
                                            message: ''
                                        });
                                    }}
                                    placeholder="아이디를 입력해주세요"
                                />
                                <button
                                    className="btn outline-btn"
                                    onClick={async () => {
                                        if (!formData.accountName) {
                                            alert("아이디를 입력해주세요.");
                                            return;
                                        }
                                        try {
                                            const result = await checkAccountNameDuplicate(formData.accountName);
                                            setIdCheckStatus({
                                                checked: true,
                                                available: result.success,
                                                message: result.message
                                            });
                                        } catch (error) {
                                            setIdCheckStatus({
                                                checked: true,
                                                available: false,
                                                message: "계정명 중복 확인에 실패했습니다."
                                            });
                                        }
                                    }}
                                    disabled={!formData.accountName}
                                >
                                    중복 확인
                                </button>
                            </div>
                            {idCheckStatus.checked && (
                                <p className={idCheckStatus.available ? "success-text" : "error-text"}>
                                    {idCheckStatus.message}
                                </p>
                            )}
                        </div>

                        <div className="form-group">
                            <label className="form-label">비밀번호</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="비밀번호를 입력해주세요"
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">비밀번호 확인</label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="비밀번호를 다시 입력해주세요"
                            />
                            {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                                <p className="error-text"> 비밀번호가 일치하지 않습니다.</p>
                            )}
                            {formData.confirmPassword && formData.confirmPassword === formData.password && (
                                <p className="success-text"> 비밀번호가 일치합니다.</p>
                            )}
                        </div>



                        <div className="form-group">
                            <label className="form-label">생년월일</label>
                            <input
                                name="birth"
                                type="date"
                                value={formData.birth}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">성별</label>
                            <div className="gender-buttons">
                                <button
                                    type="button"
                                    className={`gender-btn ${formData.gender === 'M' ? 'active' : ''}`}
                                    onClick={() => setFormData({ ...formData, gender: 'M' })}
                                >
                                    남
                                </button>
                                <button
                                    type="button"
                                    className={`gender-btn ${formData.gender === 'F' ? 'active' : ''}`}
                                    onClick={() => setFormData({ ...formData, gender: 'F' })}
                                >
                                    여
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 3 && (
                    <div className="step-content">
                        <h4 className="step-title">연락처</h4>
                        <p className="step-subtitle">알림 수신과 계정 찾기에 필요한 정보입니다.</p>
                        <div className="form-group">
                            <label className="form-label">전화번호</label>
                            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="전화번호를 입력해주세요" />
                        </div>
                        <div className="form-group">
                            <label className="form-label">주소</label>
                            <div className="input-with-button">
                                <input
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="주소를 검색해주세요"
                                    readOnly // 사용자가 직접 입력하지 못하게 ReadOnly 설정
                                />
                                <button type="button" className="btn outline-btn" onClick={handleAddressSearch}>주소 검색</button>
                            </div>
                        </div>
                    </div>
                )}

                {step === 4 && (
                    <div className="step-content">
                        <h4 className="step-title">신체 정보</h4>
                        <p className="step-subtitle">맞춤 운동 추천을 위한 기본 정보입니다.</p>
                        <div className="body-info-group">
                            <div className="body-info-field">
                                <div className="body-info-label">키</div>
                                <input
                                    type="range"
                                    className="body-info-slider"
                                    name="height"
                                    min="140"
                                    max="200"
                                    value={formData.height || 170}
                                    onChange={handleChange}
                                    style={{
                                        background: `linear-gradient(to right, #7c1d0d ${((formData.height || 170) - 140) / (200 - 140) * 100}%, #e0e0e0 ${((formData.height || 170) - 140) / (200 - 140) * 100}%)`
                                    }}
                                />
                                <div className="body-info-value">{formData.height || 170}<span className="unit">cm</span></div>
                            </div>

                            <div className="body-info-field">
                                <div className="body-info-label">몸무게</div>
                                <input
                                    type="range"
                                    className="body-info-slider"
                                    name="weight"
                                    min="40"
                                    max="150"
                                    value={formData.weight || 60}
                                    onChange={handleChange}
                                    style={{
                                        background: `linear-gradient(to right, #7c1d0d ${((formData.weight || 60) - 40) / (150 - 40) * 100}%, #e0e0e0 ${((formData.weight || 60) - 40) / (150 - 40) * 100}%)`
                                    }}
                                />
                                <div className="body-info-value">{formData.weight || 60}<span className="unit">kg</span></div>
                            </div>

                            <div className="body-info-field">
                                <div className="body-info-label">골격근량</div>
                                <input
                                    type="range"
                                    className="body-info-slider"
                                    name="muscleMass"
                                    min="20"
                                    max="80"
                                    value={formData.muscleMass || 30}
                                    onChange={handleChange}
                                    style={{
                                        background: `linear-gradient(to right, #7c1d0d ${((formData.muscleMass || 30) - 20) / (80 - 20) * 100}%, #e0e0e0 ${((formData.muscleMass || 30) - 20) / (80 - 20) * 100}%)`
                                    }}
                                />
                                <div className="body-info-value">{formData.muscleMass || 30}<span className="unit">kg</span></div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 5 && (
                    <div className="step-content">
                        <h4 className="step-title">프로필 사진</h4>
                        <p className="step-subtitle">다른 회원들에게 보여질 프로필 사진입니다.</p>
                        <div className="profile-upload-area">
                            <label htmlFor="profileImageFileInput" className="profile-upload-label">
                                {formData.profileImageFile ? (
                                    <img
                                        src={URL.createObjectURL(formData.profileImageFile)}
                                        alt="Profile Preview"
                                        className="profile-image-preview"
                                    />
                                ) : (
                                    <div className="upload-placeholder">
                                        <div className="upload-plus-icon">+</div>
                                        <p>프로필 사진 추가</p>
                                    </div>
                                )}
                            </label>
                            <input
                                id="profileImageFileInput"
                                name="profileImageFile"
                                type="file"
                                onChange={handleChange}
                                accept="image/*"
                                style={{ display: 'none' }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="register-form-footer">
                {step > 1 && <button onClick={handleBack} className="btn-secondary">이전</button>}
                {step < totalSteps && <button onClick={handleNext} className="btn-primary">다음</button>}
                {step === totalSteps && <button onClick={handleSubmit} className="btn-primary">가입 완료</button>}
            </div>
        </div>
    );
}