import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUserService from "../service/userService";
import "../styles/RegisterPage.css";

export default function RegisterPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        accountName: '',
        password: '',
        name: '',
        // age: '',
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
        agreePrivacy: false

    });

    const navigate = useNavigate();
    const { registerUser } = useUserService();
    const totalSteps = 5;



    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // setFormData({
        //     ...formData,
        //     [name]: type === "checkbox" ? checked : value
        // });
        if (type === "file") {
            // 파일 입력인 경우에만 e.target.files에 접근합니다.
            setFormData({
                ...formData,
                [name]: e.target.files[0] // 선택된 첫 번째 파일 (File 객체)을 저장합니다.
            });
        } else {
            // 그 외의 입력 (텍스트, 체크박스 등)은 기존 방식대로 처리합니다.
            setFormData({
                ...formData,
                [name]: type === "checkbox" ? checked : value
            });
        }
    };

    const handleNext = () => {
        if (step === 1 && (!formData.agreeTerms || !formData.agreePrivacy)) {
            alert("모든 약관에 동의해야 다음 단계로 진행할 수 있습니다.");
            return;
        }
        setStep(prev => Math.min(prev + 1, totalSteps));
    };
    const handleBack = () => setStep(prev => Math.max(prev - 1, 1));
    const handleSubmit = async () => {
        await registerUser(formData);
        alert("계정 생성이 완료되었습니다.");
        navigate("/gymmadang");
    };

    // 🔙 이전 페이지(뒤로가기)
    const handleGoBackPage = () => navigate(-1);

    return (
        <div className="register-container">

            {/* 상단 타이틀 */}
            <div className="top-bar">
                <span className="back-button" onClick={handleGoBackPage}>←</span>
                <h2>회원가입</h2>
            </div>

            {/* 단계 동그라미 표시 */}
            {/* <div className="step-indicator">
                {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className={`circle ${step >= s ? 'active' : ''}`}>{s}</div>
                ))}
            </div> */}
            {/* 진행 상태 바 표시 */}
            {/* <div className="progress-container">
                <div className="progress-bar" style={{ width: `${(step - 1) / (totalSteps - 1) * 100}%` }} />
            </div> */}
            <div className="progress-line">
                {[...Array(totalSteps)].map((_, index) => (
                    <span
                        key={index}
                        className={`progress-step ${index < step ? 'filled' : ''}`}
                    >
                        ●
                    </span>
                ))}
            </div>

            {/* 단계별 폼 */}
            <div className="form-section">
                {step === 1 && (
                    <>
                        <h4>Welcome,</h4>
                        <h4>이용약관에 동의해주세요.</h4>

                        <div className="terms-box mt-4">
                            <h5>1. 서비스 이용약관</h5>
                            <div className="terms-content">
                                짐마당 서비스(이하 "서비스")는 헬스 파트너 매칭, 챌린지 운영 등 다양한 건강 관련 기능을 제공합니다.<br /><br />
                                1) 본 서비스는 만 14세 이상만 가입 가능합니다.<br />
                                2) 사용자는 허위 정보를 입력하지 않아야 하며, 부정행위를 통한 이용 시 이용 제한 조치가 취해질 수 있습니다.<br />
                                3) 서비스는 운영자의 사정에 따라 변경되거나 중단될 수 있습니다.<br />
                                4) 이용자는 타인의 정보를 도용해서는 안 됩니다.<br />
                                5) 서비스 내에서 발생한 분쟁은 민사상의 절차를 통해 해결합니다.
                            </div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.agreeTerms}
                                    onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                                /> 동의합니다
                            </label>
                        </div>

                        <div className="terms-box">
                            <h5>2. 개인정보 수집 및 이용 동의</h5>
                            <div className="terms-content">
                                본 서비스는 사용자 편의를 위해 아래 정보를 수집 및 이용합니다.<br /><br />
                                1) 수집 항목: 이름, 아이디, 비밀번호, 생년월일, 키, 몸무게, 전화번호, 주소, 프로필 사진<br />
                                2) 수집 목적: 운동 파트너 매칭, 건강 분석 서비스 제공<br />
                                3) 보관 기간: 회원 탈퇴 시 즉시 파기<br />
                                4) 개인정보 제3자 제공: 없음<br /><br />
                                위 내용에 동의하지 않으면 서비스 이용이 제한될 수 있습니다.
                            </div>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={formData.agreePrivacy}
                                    onChange={(e) => setFormData({ ...formData, agreePrivacy: e.target.checked })}
                                /> 동의합니다
                            </label>
                        </div>
                    </>
                )}

                {step === 2 && (
                    <>
                        <h4>👤 기본 정보</h4>

                        <div className="form-group">
                            <label>아이디</label>
                            <div className="input-with-button">
                                <input
                                    name="accountName"
                                    value={formData.accountName}
                                    onChange={handleChange}
                                    placeholder="아이디"
                                />
                                <button className="btn btn-outline-primary btn-sm" onClick={() => alert("아이디 중복 확인 로직 연결 필요")}>중복 확인</button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>비밀번호</label>
                            <input
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="비밀번호"
                            />
                        </div>

                        <div className="form-group">
                            <label>비밀번호 확인</label>
                            <input
                                type="password"
                                value={formData.confirmPassword || ''}
                                onChange={(e) =>
                                    setFormData({ ...formData, confirmPassword: e.target.value })
                                }
                                placeholder="비밀번호 확인"
                            />
                            {formData.confirmPassword && formData.confirmPassword !== formData.password && (
                                <p className="error-text">❌ 비밀번호가 일치하지 않습니다.</p>
                            )}
                            {formData.confirmPassword && formData.confirmPassword === formData.password && (
                                <p className="success-text">✅ 비밀번호가 일치합니다.</p>
                            )}
                        </div>

                        <div className="form-group">
                            <label>이름</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="이름"
                            />
                        </div>

                        <div className="form-group">
                            <label>생년월일</label>
                            <input
                                name="birth"
                                type="date"
                                value={formData.birth}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="form-group">
                            <label>성별</label>
                            <div className="gender-buttons">
                                <button
                                    className={formData.gender === 'M' ? 'active' : ''}
                                    onClick={() => setFormData({ ...formData, gender: 'M' })}
                                >
                                    남
                                </button>
                                <button
                                    className={formData.gender === 'F' ? 'active' : ''}
                                    onClick={() => setFormData({ ...formData, gender: 'F' })}
                                >
                                    여
                                </button>
                            </div>
                        </div>
                    </>
                )}

                {step === 3 && (
                    <>
                        <h4>📞 연락처 정보</h4>
                        <input name="phone" value={formData.phone} onChange={handleChange} placeholder="전화번호" />
                        <input name="address" value={formData.address} onChange={handleChange} placeholder="주소" />
                    </>
                )}

                {step === 4 && (
                    <>
                        <h4>📏 신체 정보</h4>
                        <input name="height" type="number" value={formData.height} onChange={handleChange} placeholder="키(cm)" />
                        <input name="weight" type="number" value={formData.weight} onChange={handleChange} placeholder="몸무게(kg)" />
                        <input name="muscleMass" type="number" value={formData.muscleMass} onChange={handleChange} placeholder="골격근량(kg)" />
                    </>
                )}

                {step === 5 && (
                    <>
                        <h4>📷 프로필</h4>
                        <div className="profile-upload-area">
                            <label htmlFor="profileImageFileInput" className="profile-upload-label">
                                {formData.profileImageFile ? (
                                    // 이미지가 선택된 경우 미리보기 표시
                                    <img
                                        src={URL.createObjectURL(formData.profileImageFile)}
                                        alt="Profile Preview"
                                        className="profile-image-preview"
                                    />
                                ) : (
                                    // 이미지가 없는 경우 기본 텍스트와 아이콘 표시
                                    <div className="upload-placeholder">
                                        <p>프로필을 추가해주세요</p>
                                        <div className="upload-plus-icon">+</div>
                                        <p className="upload-files-text">Upload Files</p>
                                    </div>
                                )}
                            </label>
                            <input
                                id="profileImageFileInput"
                                name="profileImageFile"
                                type="file"
                                onChange={handleChange}
                                accept="image/*"
                                style={{ display: 'none' }} // 실제 input은 숨김
                            />
                        </div>
                    </>
                )}
            </div>

            {/* 하단 버튼 */}
            <div className="form-footer">
                {step > 1 && <button onClick={handleBack} className="btn btn-secondary">이전</button>}
                {step < totalSteps && <button onClick={handleNext} className="btn btn-primary">다음</button>}
                {step === totalSteps && <button onClick={handleSubmit} className="btn btn-success">가입 완료</button>}
            </div>
        </div>
    );
}