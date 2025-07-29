import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
    addScore,
    setKeywordResult,
    setRoutineResult
} from '../../../redux/challengeTestSlice'; // 경로 확인 필요

import '../styles/TestPage.css'; // CSS 별도 작성
import { useState } from 'react';



export default function ChallengeTestPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    
    const { stepId } = useParams();
    const step = parseInt(stepId || '1', 10);

    const totalSteps = 8;

    // STEP 1 ~ 6 성향 테스트 질문
    const questions = {
        1: {
            question: '헬스에서 더 중요한 건 뭐라고 생각해?',
            options: [
            { text: '목표를 향해 성취하는 과정', type: 'goal' },
            { text: '사람들과의 연결과 소속감', type: 'relationship' }
            ]
        },
        2: {
            question: '힘들 땐 어떻게 극복하는 편인가요?',
            options: [
            { text: '휴식이나 회복 루틴으로 내 컨디션을 챙긴다', type: 'recovery' },
            { text: '끝까지 버티며 기록을 이어간다', type: 'goal' }
            ]
        },
        3: {
            question: '나를 운동하게 만드는 원동력은?',
            options: [
            { text: '함께 하는 사람들과의 약속', type: 'relationship' },
            { text: '새로운 지식과 훈련법을 배우는 것', type: 'learning' }
            ]
        },
        4: {
            question: '운동할 때 나는...',
            options: [
            { text: '새로운 시도나 도전에 흥미를 느낀다', type: 'learning' },
            { text: '몸 상태에 따라 유연하게 루틴을 조절한다', type: 'recovery' }
            ]
        },
        5: {
            question: '기록을 남길 땐 어떤 방식이 좋아요?',
            options: [
            { text: '혼자만의 기록을 조용히 쌓는다', type: 'goal' },
            { text: '개인과 팀의 균형을 맞추는 게 좋다', type: 'balanced' }
            ]
        },
        6: {
            question: '꾸준히 하려면 어떤 방식이 더 잘 맞나요?',
            options: [
            { text: '서로 응원하며 함께하는 분위기', type: 'relationship' },
            { text: '각자 목표는 다르지만 흐름은 맞추는 것', type: 'balanced' }
            ]
        }
    };

    
    // STEP 7 관심사 키워드
    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [selectedKeywords, setSelectedKeywords] = useState([]);
    const keywordCategories = {
    루틴: [
        '루틴',
        '스트레스',
        '고중량',
        'PR갱신',
        '바디프로필',
        '새벽헬스',
        '원정헬스',
        '헬스습관',
        '홈트',
        '운동복',
        '운동기구'
    ],
    회복: [
        '스트레칭',
        '재활',
        '부상예방',
        '마사지볼',
        '슬로우워크',
        '헬태기 극복'
    ],
    소통: [
        '같이해요',
        '응원해요',
        '오늘도출첵',
        '그룹챗',
        '서로서로',
        '오운완 인증'
    ],
    정보: [
        '자세교정',
        '식단정보',
        '초보루틴',
        '헬스상식',
        'PT복습',
        '헬스꿀팁',
        '헬스고민'
    ],
    습관: [
        '물 2L',
        '미라클모닝',
        '일찍자기',
        '아침 산책'
    ],
    동기부여: [
        '바디체크',
        'Before/After',
        '체중감량',
        '미션인증',
        '기록공유',
        '대회 준비'
    ],
    자기관리: [
        '헬스노트',
        '루틴계획',
        '마이페이스',
        '한달기록',
        '나와의약속',
        '다이어트',
        '건강식단'
    ]
    };

    const toggleKeyword = (keyword) => {
        setSelectedKeywords((prev) => {
            if (prev.includes(keyword)) {
            return prev.filter((k) => k !== keyword);
            } else {
            if (prev.length >= 5) {
                setToastVisible(true);
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



    // 선택
    const handleNext = () => {
    if (step === 7) {
        if (selectedKeywords.length === 0) {
            setToastMessage("관심사를 하나 이상 선택해주세요!");
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 2000);
        return;
        }
    dispatch(setKeywordResult(selectedKeywords));
    }

    if (step === 8) {
        if (selectedDays.length === 0) {
            setToastMessage("운동하는 요일을 선택해주세요!");
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 2000);
        return;
        }
        if (!region) {
            setToastMessage("운동 지역을 선택해주세요!");
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 2000);
        return;
        }
        dispatch(setRoutineResult({ days: selectedDays, region }));
        navigate('/gymmadang/challenge/challengeTest/result');
        return;
    }

    navigate(`/gymmadang/challenge/challengeTest/step/${step + 1}`);
    };



    // 뒤로 가기
    const handleBack = () => {
        if (step === 1) {
            navigate('/gymmadang/challenge/challengeIntro'); // 테스트 인트로로 돌아가기
        } else {
            navigate(`/gymmadang/challenge/challengeTest/step/${step - 1}`);
        }
    };


    const data = questions[step];

    if (step <= 6 && !data) return <div>잘못된 접근입니다.</div>;


    return (
    <div className="test-page-body">
        <div className="test-page-top">

            <button className="back-button" onClick={handleBack}>←</button>

            {/* 진행 상황 표시용 도트 */}
            <div className="progress-dots">
                {[...Array(totalSteps)].map((_, i) => ( // totalSteps 수만큼 Array() 생성 -> ... 스프레드 연산자로 진짜 배열로 바꿔주면서 undefined 채워주기
                // _는 배열 값 (undefined)은 안 쓰니까 무시하고, i는 index 값 (0부터 시작)
                <div key={i} className={`dot ${i < step ? 'active' : ''}`} /> // 현재 step보다 index가 작으면 active
                ))}
            </div>

        </div>


        {/* STEP 1~6: 성향 테스트 질문 */}
        {step <= 6 && data && (
            <>
                <h2 className="test-question-title">{data.question}</h2>
                <div className="choice-buttons">
                    {data.options.map((opt, idx) => (
                    <button key={idx} className="choice-btn" onClick={() => {
                        // addScore(opt.type);
                        dispatch(addScore({ type: opt.type }));
                        console.log("📌 dispatched:", opt.type);
                        navigate(`/gymmadang/challenge/challengeTest/step/${step + 1}`);
                    }}>
                        {opt.text}
                    </button>
                    ))}
                </div>
            </>
        )}

        {/* STEP 7: 관심사 키워드 선택 */}
        {step === 7 && (
            <>
                <h2 className="test-question-title">요즘 나의 관심사는?</h2>

                {/* 최대 선택 안내 문구 → 질문 아래로 이동 */}
                <div style={{ fontSize: '14px', marginTop: '-20px', marginBottom: '7px', textAlign: 'right' }}>
                    최대 5개 선택할 수 있어요
                </div>

                {/* 선택 개수 카운트 표시 */}
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

                {/* 운동 요일 선택 제목 */}
                <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px', marginTop: '10px' }}>
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

                {/* 운동 지역 선택 제목 */}
                <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '8px', marginTop: '20px' }}>
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

                <button className="next-button" onClick={handleNext}>결과 보기</button>
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
