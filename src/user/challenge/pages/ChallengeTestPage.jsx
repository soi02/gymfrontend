import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
    addScore,
    setKeywordResult,
    setRoutineResult
} from '../../../redux/challengeTestSlice';

import '../styles/TestPage.css';
import { useState, useEffect } from 'react';

import testQ1 from '../../../assets/img/challenge/test/testQ1.png';
import testQ2 from '../../../assets/img/challenge/test/testQ2.png';
import testQ3 from '../../../assets/img/challenge/test/testQ3.png';
import testQ4 from '../../../assets/img/challenge/test/testQ4.png';
import testQ5 from '../../../assets/img/challenge/test/testQ5.png';
import testQ6 from '../../../assets/img/challenge/test/testQ6.png';

// TODO: 이 부분을 실제 백엔드 API 기본 URL로 교체해야 합니다.
// 예: 'http://localhost:8080/api'
const BACKEND_BASE_URL = 'http://localhost:8080/api';

// 키워드 매핑 데이터 임시 정의
const keywordMapping = {
    '루틴': 1,
    '스트레스': 2,
    '고중량': 3,
    'PR갱신': 4,
    '바디프로필': 5,
    '새벽헬스': 6,
    '원정헬스': 7,
    '헬스습관': 8,
    '홈트': 9,
    '운동복': 10,
    '운동기구': 11,
    '스트레칭': 12,
    '재활': 13,
    '부상예방': 14,
    '마사지볼': 15,
    '슬로우워크': 16,
    '헬태기 극복': 17,
    '같이해요': 18,
    '응원해요': 19,
    '오늘도출첵': 20,
    '그룹챗': 21,
    '서로서로': 22,
    '오운완 인증': 23,
    '자세교정': 24,
    '식단정보': 25,
    '초보루틴': 26,
    '헬스상식': 27,
    'PT복습': 28,
    '헬스꿀팁': 29,
    '헬스고민': 30,
    '물 2L': 31,
    '미라클모닝': 32,
    '일찍자기': 33,
    '아침 산책': 34,
    '바디체크': 35,
    'Before/After': 36,
    '체중감량': 37,
    '미션인증': 38,
    '기록공유': 39,
    '대회 준비': 40,
    '헬스노트': 41,
    '루틴계획': 42,
    '마이페이스': 43,
    '한달기록': 44,
    '나와의약속': 45,
    '다이어트': 46,
    '건강식단': 47,
};

const questionImages = {
    1: testQ1, 2: testQ2, 3: testQ3, 4: testQ4, 5: testQ5, 6: testQ6
};


export default function ChallengeTestPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { id: userId, token: authToken } = useSelector(state => state.auth);

    const { stepId } = useParams();
    const step = parseInt(stepId || '1', 10);

    const totalSteps = 8;

    const [selectedOptionIndex, setSelectedOptionIndex] = useState(null);

    // STEP 1 ~ 6 성향 테스트 질문
    const questions = {
        1: {
            question: '헬스에서 더 중요한 것은 무엇이오?',
            options: [
                { text: '목표를 향해 나아가 성취하는 과정이오', type: 'goal' },
                { text: '사람들과 정을 나누고 인연을 쌓는 것이오', type: 'relationship' }
            ]
        },
        2: {
            question: '고단할 때는 어찌 극복하는 편이오?',
            options: [
                { text: '휴식이나 회복으로 내 몸 상태를 살피오', type: 'recovery' },
                { text: '끝까지 버티며 기록을 이어가고자 하오', type: 'goal' }
            ]
        },
        3: {
            question: '그대를 움직이게 하는 원동력은 무엇이오?',
            options: [
                { text: '함께하는 이들과의 약속이오', type: 'relationship' },
                { text: '새로운 지식과 훈련법을 깨우치는 것이오', type: 'learning' }
            ]
        },
        4: {
            question: '운동할 때 그대는 어떠하오?',
            options: [
                { text: '새로운 시도와 도전에 흥미를 느끼오', type: 'learning' },
                { text: '몸 상태에 따라 유연하게 훈련을 조절하오', type: 'recovery' }
            ]
        },
        5: {
            question: '기록을 남길 때\n그대는 어떤 방식을 선호하오?',
            options: [
                { text: '홀로 조용히 기록을 쌓는 것이 좋소', type: 'goal' },
                { text: '개인과 팀의 균형을 맞추는 것이 좋소', type: 'balanced' }
            ]
        },
        6: {
            question: '꾸준함을 유지하려면\n어떤 방식이 그대에게 맞소?',
            options: [
                { text: '서로 응원하며 함께하는 분위기를 원하오', type: 'relationship' },
                { text: '각자 목표는 다르나 흐름은 함께 맞추기를 원하오', type: 'balanced' }
            ]
        }
    };

    // STEP 7 관심사 키워드
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const keywordCategories = {
        루틴: [
            '루틴', '스트레스', '고중량', 'PR갱신', '바디프로필', '새벽헬스', '원정헬스', '헬스습관', '홈트', '운동복', '운동기구'
        ],
        회복: [
            '스트레칭', '재활', '부상예방', '마사지볼', '슬로우워크', '헬태기 극복'
        ],
        소통: [
            '같이해요', '응원해요', '오늘도출첵', '그룹챗', '서로서로', '오운완 인증'
        ],
        정보: [
            '자세교정', '식단정보', '초보루틴', '헬스상식', 'PT복습', '헬스꿀팁', '헬스고민'
        ],
        습관: [
            '물 2L', '미라클모닝', '일찍자기', '아침 산책'
        ],
        동기부여: [
            '바디체크', 'Before/After', '체중감량', '미션인증', '기록공유', '대회 준비'
        ],
        자기관리: [
            '헬스노트', '루틴계획', '마이페이스', '한달기록', '나와의약속', '다이어트', '건강식단'
        ]
    };

    const toggleKeyword = (keyword) => {
        setSelectedKeywords((prev) => {
            if (prev.includes(keyword)) {
                return prev.filter((k) => k !== keyword);
            } else {
                if (prev.length >= 5) {
                    setToastVisible(true);
                    setToastMessage("최대 5개까지 선택할 수 있습니다.");
                    setTimeout(() => setToastVisible(false), 2000);
                    return prev;
                }
                return [...prev, keyword];
            }
        });
    };

    // STEP 8 루틴 입력
    const [selectedDays, setSelectedDays] = useState([]);
    const [region, setRegion] = useState('');
    const toggleDay = (day) => {
        setSelectedDays((prev) =>
            prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
        );
    };

    // API 호출 중 상태를 관리하기 위한 로딩 상태
    const [isSaving, setIsSaving] = useState(false);
    // 버튼 활성화 상태를 관리하기 위한 상태
    const [isReadyToSave, setIsReadyToSave] = useState(false);

    useEffect(() => {
        // 운동 요일과 지역이 모두 선택되면 버튼을 활성화
        setIsReadyToSave(selectedDays.length > 0 && region !== '');
    }, [selectedDays, region]);

    // 결과를 저장하고 페이지를 이동하는 비동기 함수
    const saveAndNavigateToResult = async () => {
        if (!userId || !authToken) {
            console.error('사용자 정보나 인증 토큰이 없음. 로그인 상태를 확인 요망.');
            setToastMessage('사용자 정보를 불러올 수 없으니, 다시 로그인을 시도해 주시오.');
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 2000);
            return;
        }

        setIsSaving(true);
        try {
            // 백엔드 API 호출에 필요한 페이로드 구성
            const payload = {
                userId: userId,
                // Redux 상태 대신 로컬 상태인 selectedKeywords를 사용합니다.
                keywordIds: selectedKeywords.map(kw => keywordMapping[kw]).filter(id => id),
            };

            console.log("성향 테스트 저장 페이로드:", payload);

            // TODO: fetch를 사용하여 실제 백엔드 API에 POST 요청을 보냅니다.
            const response = await fetch(`${BACKEND_BASE_URL}/challenge/tendency-test/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authToken}` 
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                // HTTP 상태 코드가 200 범위가 아니면 에러를 던집니다.
                throw new Error(`HTTP Error! Status: ${response.status}`);
            }

            console.log("성향 테스트 결과 저장 성공");

            // 저장 성공 시, 결과 페이지로 이동합니다.
            navigate('/challenge/challengeTest/result');
        } catch (err) {
            console.error('성향 테스트 결과 저장 실패', err);
            setToastMessage("성향 테스트 결과 저장에 실패했소. 다시 시도해 주시오.");
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 2000);
            
            // 실패 시 인트로 페이지로 돌아가기
            navigate('/challenge/challengeTest/intro');
        } finally {
            setIsSaving(false);
        }
    };


    // 선택 및 페이지 이동 핸들러
    const handleNext = async () => { // ★ async 키워드 추가
        // ... (이전 코드와 동일한 유효성 검사 로직)
        if (step === 7) {
            if (selectedKeywords.length === 0) {
                setToastMessage("관심사를 하나 이상 선택해 주시오");
                setToastVisible(true);
                setTimeout(() => setToastVisible(false), 2000);
                return;
            }
            dispatch(setKeywordResult(selectedKeywords));
        }

        if (step === 8) {
            if (selectedDays.length === 0) {
                setToastMessage("운동하는 요일을 선택해 주시오");
                setToastVisible(true);
                setTimeout(() => setToastVisible(false), 2000);
                return;
            }
            if (!region) {
                setToastMessage("운동 지역을 선택해 주시오");
                setToastVisible(true);
                setTimeout(() => setToastVisible(false), 2000);
                return;
            }
            dispatch(setRoutineResult({ days: selectedDays, region }));
            // ★ 여기에 API 저장 로직을 호출합니다.
            await saveAndNavigateToResult(); // ★ await 키워드 추가
            return;
        }
        
        // step 1~7까지의 로직
        navigate(`/challenge/challengeTest/step/${step + 1}`);
    };


    // 뒤로 가기
    const handleBack = () => {
        if (step === 1) {
            navigate('/challenge/challengeIntro'); // 테스트 인트로로 돌아가기
        } else {
            navigate(`/challenge/challengeTest/step/${step - 1}`);
        }
    };

    const handleOptionSelect = (option, index) => {
        setSelectedOptionIndex(index); // 선택된 버튼의 인덱스 저장
        dispatch(addScore({ type: option.type }));
        console.log("📌 dispatched:", option.type);
        setTimeout(() => {
            navigate(`/challenge/challengeTest/step/${step + 1}`);
            setSelectedOptionIndex(null); // 다음 페이지 이동 후 선택 상태 초기화
        }, 300); // 선택된 색상을 잠시 보여준 뒤 페이지 이동
    };

    const data = questions[step];

    if (step <= 6 && !data) return <div>잘못된 접근이오.</div>;

    return (
        <div className="test-page-body">
            {/* 뒤로가기 버튼과 진행 표시를 담는 상단 컨테이너 */}
            <div className="test-page-top">
                <button className="ch-test-back-button" onClick={handleBack}>&lt;</button>
                <div className="progress-dots">
                    {[...Array(totalSteps)].map((_, i) => (
                        <div key={i} className={`dot ${i < step ? 'active' : ''}`} />
                    ))}
                </div>
            </div>



            {/* STEP 1~6: 성향 테스트 질문 */}
            {step <= 6 && data && (
                <>
                    <h2 className="test-question-title">{data.question}</h2>
                    <img src={questionImages[step]} alt={`Question ${step}`} className="test-question-image" />
                    
                    <div className="choice-buttons">
                        {data.options.map((opt, idx) => (
                            <button
                                key={idx}
                                // 수정된 부분: 선택된 버튼에 'selected' 클래스 추가
                                className={`choice-btn ${selectedOptionIndex === idx ? 'selected' : ''}`}
                                onClick={() => handleOptionSelect(opt, idx)}
                            >
                                {opt.text}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* STEP 7: 관심사 키워드 선택 */}
            {step === 7 && (
                <>
                    <h2 className="test-question-title">나의 관심사는?</h2>
                    <p className="test-description">최대 5개의 키워드를 선택할 수 있소</p>
                    <div style={{ textAlign: 'right', fontSize: '13px', marginBottom: '8px', paddingRight: '6px' }}>
                        선택됨: {selectedKeywords.length} / 5
                    </div>
                    <div className="keyword-category-section">
                        {Object.entries(keywordCategories).map(([category, keywords]) => (
                            <div key={category} className="keyword-category-block">
                                <h3 className="keyword-category-title">{category}</h3>
                                <div className="keyword-grid">
                                    {keywords.map((kw, i) => (
                                        <button
                                            key={i}
                                            className={`keyword-btn ${selectedKeywords.includes(kw) ? 'selected' : ''}`}
                                            onClick={() => toggleKeyword(kw)}
                                        >
                                            {kw}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <button className="next-button" onClick={handleNext}>다음</button>
                </>
            )}

            {/* STEP 8: 운동 요일, 지역 */}
            {step === 8 && (
                <>
                    <h2 className="test-question-title">언제, 어디서 주로 헬스를 하나요?</h2>
                    <div className="routine-section">
                        <div className="routine-section-title">
                            운동 요일 선택
                        </div>
                        <div className="routine-days">
                            {['일', '월', '화', '수', '목', '금', '토'].map((d) => (
                                <button
                                    key={d}
                                    className={`day-btn ${selectedDays.includes(d) ? 'selected' : ''}`}
                                    onClick={() => toggleDay(d)}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                        <div className="routine-section-title">
                            운동 지역 선택
                        </div>
                        <select
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                            className="region-select"
                        >
                            <option value="">지역 선택</option>
                            <option value="서울">서울</option>
                            <option value="부산">부산</option>
                            <option value="인천">인천</option>
                            <option value="기타">기타</option>
                        </select>
                    </div>
                    <button 
                        className="next-button" 
                        onClick={handleNext}
                        disabled={isSaving || !isReadyToSave}
                    >
                        {isSaving ? '저장 중...' : '결과 보기'}
                    </button>
                </>
            )}


            {toastVisible && (
                <div className="toast-message">
                    {toastMessage}
                </div>
            )}
        </div>
    );
}
