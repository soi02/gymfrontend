import React, { useMemo, useState, useEffect } from 'react';
import { IoChevronBackOutline, IoShareOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import '../styles/NorigaeListPage.css';

// 로컬 이미지
import goldNorigae from '../../../assets/img/challenge/norigae/gold.png';
import silverNorigae from '../../../assets/img/challenge/norigae/silver.png';
import bronzeNorigae from '../../../assets/img/challenge/norigae/bronze.png';

const BACKEND_BASE_URL = 'http://localhost:8080';

const norigaeImages = {
    '금': goldNorigae,
    '은': silverNorigae,
    '동': bronzeNorigae,
    gold: goldNorigae,
    silver: silverNorigae,
    bronze: bronzeNorigae,
};

function toAbsUrl(path) {
    if (!path) return null;
    if (/^https?:\/\//i.test(path)) return path;
    return `${BACKEND_BASE_URL}${path}`;
}

// 출석률에 따라 노리개 등급을 결정하는 함수 추가
// 7일 중 5일 이상 출석 (71.4%) -> 동 노리개
// 7일 중 6일 이상 출석 (85.7%) -> 은 노리개
// 7일 중 7일 출석 (100%) -> 금 노리개
const getNorigaeTier = (daysAttended, totalDays) => {
    if (totalDays <= 0) return null;
    const attendanceRate = (daysAttended / totalDays) * 100;

    if (attendanceRate >= 100) return { name: '금 노리개', description: '챌린지 100% 달성!', icon: goldNorigae };
    if (attendanceRate >= 80) return { name: '은 노리개', description: '챌린지 80% 이상 달성!', icon: silverNorigae };
    if (attendanceRate >= 50) return { name: '동 노리개', description: '챌린지 50% 이상 달성!', icon: bronzeNorigae };

    return null; // 조건 미달성 시 null 반환
};

export default function NorigaeListPage() {
    const navigate = useNavigate();
    const userId = useSelector((state) => state.auth.id);
    const [norigaeList, setNorigaeList] = useState([]);
    const [loading, setLoading] = useState(true);

    // 컴포넌트 마운트 시 데이터 불러오기
    useEffect(() => {
        async function fetchNorigaeList() {
            try {
                if (!userId) {
                    navigate('/login', { state: { from: '/norigae' } });
                    return;
                }
                setLoading(true);

                // 1단계: 모든 챌린지 기록 목록 가져오기
                const allMyChallengesRes = await axios.get(`${BACKEND_BASE_URL}/api/challenge/getAllMyChallengeListProcess`, {
                    params: { userId },
                });
                const myChallenges = allMyChallengesRes.data || [];

                const awardedNorigae = [];

                // 2단계: 각 챌린지 ID로 상세 기록을 가져와 노리개 정보 추출
                for (const challenge of myChallenges) {
                    try {
                        const detailRes = await axios.get(`${BACKEND_BASE_URL}/api/challenge/getMyRecordDetailProcess`, {
                            params: {
                                userId,
                                challengeId: challenge.challengeId,
                            },
                        });
                        const detailData = detailRes.data;

                        if (detailData && detailData.challengeInfo) {
                            const { daysAttended, challengeDurationDays, challengeTitle } = detailData.challengeInfo;

                            // 챌린지 출석률을 기반으로 노리개 등급 판별
                            const norigae = getNorigaeTier(daysAttended, challengeDurationDays);

                            // 노리개를 획득했다면 리스트에 추가
                            if (norigae) {
                                awardedNorigae.push({
                                    id: challenge.challengeId,
                                    name: norigae.name,
                                    description: <><strong>{challengeTitle}</strong> 챌린지를 통해 획득</>,
                                    iconPath: norigae.icon,
                                    awardedDate: new Date().toISOString(), // 획득 날짜는 임시로 현재 날짜 사용
                                });
                            }
                        }
                    } catch (detailError) {
                        console.error(`챌린지 상세 정보를 불러오는 데 실패했습니다: ${challenge.challengeId}`, detailError);
                    }
                }

                setNorigaeList(awardedNorigae);

            } catch (e) {
                console.error("노리개 리스트를 불러오는 데 실패했습니다.", e);
                setNorigaeList([]);
            } finally {
                setLoading(false);
            }
        }
        fetchNorigaeList();
    }, [userId, navigate]);

    const mapped = useMemo(() => {
        return norigaeList.map(n => ({
            ...n,
            iconPath: n.iconPath || toAbsUrl(n.iconPath),
        }));
    }, [norigaeList]);

    // ✅ 노리개 등급에 따라 정렬하는 코드 추가
    const norigaeOrder = ['금', '은', '동'];
    const sortedNorigaeList = useMemo(() => {
        return [...mapped].sort((a, b) => {
            const orderA = norigaeOrder.indexOf(a.name.replace(/ 노리개/, ''));
            const orderB = norigaeOrder.indexOf(b.name.replace(/ 노리개/, ''));
            return orderA - orderB;
        });
    }, [mapped]);

    // ✅ 기존 idx 상태는 제거하고, 항상 가장 높은 등급의 노리개 (정렬된 리스트의 첫 번째 항목)를 사용하도록 변경
    const current = sortedNorigaeList[0] || null;

    if (loading) {
        return <div className="crd-loading">노리개 리스트를 불러오는 중입니다...</div>;
    }

    // 노리개 리스트가 비어 있을 때 처리
    if (sortedNorigaeList.length === 0) {
        return (
            <div className="nlm-page">
                <div className="nlm-topbar">
                    <button className="nlm-top-btn" onClick={() => navigate(-1)} aria-label="뒤로 가기">
                        <IoChevronBackOutline />
                        <span className="nlm-top-label">나의 수련기록</span>
                    </button>
                </div>
                <div className="nlm-sheet">
                    <div className="nlm-empty-state">
                        <h2 className="nlm-empty-title">아직 획득한 노리개가 없습니다.</h2>
                        <p className="nlm-empty-desc">
                            챌린지에 참여하고 첫 노리개를 획득해 보세요!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const title = current?.name || '노리개';
    const description = current?.description || '꾸준한 수련으로 획득하셨습니다. 계속 이어가 보세요!';
    const awardedDate = current?.awardedDate || null;
    const formattedDate = awardedDate ? `${new Date(awardedDate).getFullYear()}/${new Date(awardedDate).getMonth() + 1}/${new Date(awardedDate).getDate()}` : '';

    const handleShare = async () => {
        if (!current?.iconPath) return;
        try {
            if (navigator.share) {
                await navigator.share({ title, url: current.iconPath });
            } else if (navigator.clipboard) {
                await navigator.clipboard.writeText(current.iconPath);
            }
        } catch (_) {}
    };

    return (
        <div className="nlm-page">
            <div className="nlm-topbar">
                <button className="nlm-top-btn" onClick={() => navigate(-1)} aria-label="뒤로 가기">
                    <IoChevronBackOutline />
                    <span className="nlm-top-label">나의 수련기록</span>
                </button>
                <button className="nlm-top-btn right" onClick={handleShare} aria-label="공유">
                    <IoShareOutline />
                </button>
            </div>
            <div className="nlm-sheet">
                <div className="nlm-medal-wrap">
                    {current?.iconPath && <img src={current.iconPath} alt={title} className="nlm-medal" />}
                    <div className="nlm-medal-glow" />
                </div>
                <div className="nlm-text">
                    <h2 className="nlm-title">{title}</h2>
                    <p className="nlm-desc">
                        {current.description}
                        <br />
                        <span className="nlm-date">{formattedDate}</span>
                    </p>
                </div>
            </div>
        </div>
    );
}