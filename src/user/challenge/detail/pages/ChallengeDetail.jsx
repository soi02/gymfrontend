// ChallengeDetail.jsx (최종본)
import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import apiClient from '../../../../global/api/apiClient';
import ChallengeStartModal from '../components/ChallengeStartModal';
import '../styles/ChallengeDetail.css';
import { BsCalendarEvent, BsPeople, BsWallet2, BsShare, BsArrowLeft } from 'react-icons/bs';

export default function ChallengeDetail() {
    const { challengeId } = useParams();
    const navigate = useNavigate();
    const [challenge, setChallenge] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [timeLeft, setTimeLeft] = useState(null);
    const [isHeaderVisible, setIsHeaderVisible] = useState(false);
    const scrollRef = useRef(null);

    const userId = useSelector(state => state.auth.id);
    const BACKEND_BASE_URL = "http://localhost:8080";

    useEffect(() => {
        if (!challengeId) {
            alert("잘못된 접근입니다.");
            navigate('/challenge/challengeHome');
            return;
        }
        (async () => {
            try {
                const params = { challengeId };
                if (userId) params.userId = userId;
                const res = await apiClient.get('/challenge/detail', { params });
                setChallenge(res.data);
            } catch (err) {
                console.error("챌린지 상세 실패", err);
                alert("챌린지를 불러올 수 없습니다.");
                navigate('/challenge/challengeHome');
            }
        })();
    }, [challengeId, userId, navigate]);

    useEffect(() => {
        if (!challenge) { setTimeLeft(null); return; }
        const start = new Date(challenge.challengeRecruitStartDate);
        const endRaw = new Date(challenge.challengeRecruitEndDate);
        if (isNaN(start) || isNaN(endRaw)) { setTimeLeft(null); return; }
        const end = new Date(endRaw);
        end.setHours(23, 59, 59, 999);
        const inRecruit = Date.now() >= start.getTime() && Date.now() <= end.getTime();
        if (!inRecruit) { setTimeLeft(null); return; }
        const calc = () => {
            const diff = Math.max(0, end.getTime() - Date.now());
            const DAY = 86400000, H = 3600000, M = 60000, S = 1000;
            const days = Math.floor(diff / DAY);
            const hours = Math.floor((diff % DAY) / H);
            const minutes = Math.floor((diff % H) / M);
            const seconds = Math.floor((diff % M) / S);
            setTimeLeft({ days, hours, minutes, seconds });
        };
        calc();
        const t = setInterval(calc, 1000);
        return () => clearInterval(t);
    }, [challenge]);

    const handleScroll = useMemo(() => {
        let lastScrollY = 0;
        return () => {
            if (!scrollRef.current) return;
            const currentScrollY = scrollRef.current.scrollTop;
            if (currentScrollY > 100 && currentScrollY > lastScrollY) {
                setIsHeaderVisible(true);
            } else if (currentScrollY <= 100) {
                setIsHeaderVisible(false);
            }
            lastScrollY = currentScrollY;
        };
    }, []);

    if (!challenge) return <div className="cdp-loading">로딩 중...</div>;

    const {
        challengeTitle,
        challengeDescription,
        challengeRecruitStartDate,
        challengeRecruitEndDate,
        challengeDurationDays,
        participantCount = 0,
        challengeThumbnailPath,
        keywords = [],
        challengeDepositAmount = 0,
        userParticipating = false,
        challengeMaxMembers = 0
    } = challenge;

    const cap = Number(challengeMaxMembers) || 0;
    const imageUrl = challengeThumbnailPath
        ? `${BACKEND_BASE_URL}${challengeThumbnailPath}`
        : '/images/default-thumbnail.png';
    const fmt = (d) => {
        if (!d) return '-';
        const dt = new Date(d);
        if (isNaN(dt)) return d;
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, '0');
        const da = String(dt.getDate()).padStart(2, '0');
        return `${y}.${m}.${da}`;
    };
    const pad2 = (n) => String(n).padStart(2, '0');
    const now = new Date();
    const recruitStart = new Date(challengeRecruitStartDate);
    const recruitEnd = new Date(challengeRecruitEndDate); recruitEnd.setHours(23, 59, 59, 999);
    let status = '모집 종료';
    if (now < recruitStart) status = '모집 예정';
    else if (now >= recruitStart && now <= recruitEnd) status = '모집 중';
    const isJoinable = status === '모집 중' && !userParticipating;
    const buttonText = userParticipating ? '도전 중' : (status === '모집 중' ? '도전하기' : status);
    const navigateToChat = () => navigate(`/challenge/groupchat/${challengeId}`);
    
    const handlePaymentStart = async () => {
        if (!userId) { alert("로그인 후 이용 가능합니다."); navigate('/login'); return; }
        try {
            const res = await apiClient.post(`/challenge/join/payment`, null, {
                params: { userId, challengeId, redirectUrl: `${window.location.origin}/challenge/payment/success` },
            });
            if (res.data?.redirectUrl) {
                window.location.href = res.data.redirectUrl;
            } else {
                alert("결제 준비에 실패했습니다.");
            }
        } catch (err) {
            console.error("결제 실패", err);
            alert("결제 과정 중 오류가 발생했습니다: " + (err.response?.data || err.message));
        }
    };
    
    return (
        <div className="cdp-page-layout">
            <header className={`cdp-header ${isHeaderVisible ? 'visible' : ''}`}>
                <button onClick={() => navigate(-1)} className="cdp-header-btn">
                    <BsArrowLeft size={24} />
                </button>
                <div className="cdp-header-actions">
                    <button className="cdp-header-btn"><BsShare size={20} /></button>
                </div>
            </header>
            
            <div className="cdp-content-scrollable" ref={scrollRef} onScroll={handleScroll}>
                <div className="cdp-hero-image-wrapper">
                    <img src={imageUrl} alt="챌린지 이미지" className="cdp-hero-image" />
                    <div className="cdp-hero-overlay"></div>
                    <div className="cdp-hero-content">
                        <div className="cdp-hero-badges">
                            {status === '모집 중' ? (
                                <span className="cdp-badge cdp-badge-dday" style={{ fontVariantNumeric: 'tabular-nums' }}>
                                    마감 D-{timeLeft?.days ?? 0} {pad2(timeLeft?.hours ?? 0)}:{pad2(timeLeft?.minutes ?? 0)}:{pad2(timeLeft?.seconds ?? 0)}
                                </span>
                            ) : (
                                <span className={`cdp-badge ${status === '모집 예정' ? 'cdp-badge-upcoming' : 'cdp-badge-closed'}`}>{status}</span>
                            )}
                            <span className="cdp-badge">{challengeDurationDays ?? '-'}일 수련</span>
                        </div>
                    </div>
                </div>

                <div className="cdp-content">
                    <div className="cdp-info-section">
                        <h1 className="cdp-title">{challengeTitle}</h1>
                        <div className="cdp-tags">
                            {keywords.length > 0 && (
                                keywords.map((k, i) => <span className="tag" key={`k-${i}`}>#{k}</span>)
                            )}
                        </div>
                        <div className="cdp-stats">
                            <div className="cdp-stat-item">
                                <BsPeople />
                                <span className="text-sm">현재 {participantCount}명 참가중</span>
                            </div>
                        </div>
                    </div>

                    {challengeDescription && (
                        <div className="cdp-detail-section">
                            <h2>챌린지 설명</h2>
                            <p className="cdp-description">{challengeDescription}</p>
                        </div>
                    )}
                    
                    <div className="cdp-detail-section">
                        <h2>참여 유의사항</h2>
                        <ul className="cdp-rules">
                            <li>
                                <h3 className="rule-title">1. 출석 인증 방법</h3>
                                <p>매일 정해진 시간에 '챌린지 상세' 페이지 하단의 인증 버튼을 통해 인증샷을 업로드해야 합니다. 인증샷에는 챌린지 내용과 관련된 명확한 증거가 포함되어야 합니다.</p>
                            </li>
                            <li>
                                <h3 className="rule-title">2. 보증금 환급 기준</h3>
                                <p>챌린지 기간 동안 챌린지 성공률 80% 이상을 달성하면 보증금이 환급됩니다. 80% 미만일 경우 보증금은 반환되지 않으며, 기부금으로 전환됩니다.</p>
                            </li>
                            <li>
                                <h3 className="rule-title">3. 챌린지 중도 포기</h3>
                                <p>챌린지 시작 후 중도 포기 시에는 보증금이 환급되지 않습니다. 신중하게 결정 후 참여해 주세요.</p>
                            </li>
                            <li>
                                <h3 className="rule-title">4. 부적절한 인증</h3>
                                <p>다른 참가자의 인증샷을 도용하거나, 챌린지 내용과 무관한 사진을 업로드할 경우 즉시 챌린지에서 제외되며, 보증금은 환급되지 않습니다.</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* ✅ 버튼만 직접 렌더링하고, CSS로 위치를 고정시킵니다. */}
            <button
                className={`cdp-cta-btn ${isJoinable ? '' : 'disabled'}`}
                disabled={!isJoinable}
                onClick={() => isJoinable && setShowModal(true)}
            >
                {buttonText}
            </button>

            {showModal && (
                <ChallengeStartModal
                    onClose={() => setShowModal(false)}
                    challengeId={challengeId}
                    challengeTitle={challengeTitle}
                    challengeDepositAmount={challengeDepositAmount}
                    onPaymentStart={handlePaymentStart}
                />
            )}
        </div>
    );
}