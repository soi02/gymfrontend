import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ChallengeStartModal.css';

import goalImg from '../../../../assets/img/challenge/testResult/goal.png'; // 예시 이미지


export default function ChallengeStartModal({ onClose, challengeId, challengeTitle, challengeDepositAmount, onPaymentStart }) {
    const userId = useSelector((state) => state.auth.id);
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    // 보증금이 0원인 챌린지 참여 로직
    const handleFreeChallengeStart = async () => {
        if (isProcessing) return;
        setIsProcessing(true);

        try {
            await axios.post(`http://localhost:8080/api/challenge/startChallengeProcess`, {
                userId,
                challengeId,
            });

            alert("도전을 시작했어요! 이제부터 챌린지 페이지에서 진행 상황을 확인할 수 있습니다.");
            onClose();
            // ★ 수정: 결제 완료 후 나의 수련 기록 목록 페이지로 이동
            navigate('/gymmadang/challenge/myRecordList'); 
        } catch (err) {
            console.error("도전 시작 실패", err);
            if (err.response && err.response.status === 409) {
                alert("이미 이 챌린지에 참여 중입니다.");
            } else {
                alert("도전 시작에 실패했습니다. 다시 시도해 주세요.");
            }
        } finally {
            setIsProcessing(false);
        }
    };


        const handleConfirm = () => {
        if (challengeDepositAmount > 0) {
            onPaymentStart(); // 보증금 있는 경우, 결제 시작
        } else {
            handleFreeChallengeStart(); // 보증금 없는 경우, 바로 참여
        }
    };

    return (
        <div className="challenge-start-modal-backdrop" onClick={onClose}>
            <div className="challenge-start-modal-content" onClick={(e) => e.stopPropagation()}>
                {/* ★ 이미지 또는 아이콘 추가 */}
                <div className="modal-icon-container">
                     {/* 이모지 사용 예시 */}
                    <div className="modal-emoji">🙌</div>
                    {/* 이미지 사용 예시 */}
                    {/* <img src={goalImg} alt="챌린지 시작" className="modal-icon"/> */}
                </div>

                <div className="challenge-start-modal-body">
                    <span className="challenge-start-modal-header">수련을 시작하겠소?</span>
                    
                    {/* 챌린지 제목과 보증금 정보만 간결하게 표시 */}
                    {/* <div>
                        <span className='challenge-start-modal-title'>{challengeTitle}</span>
                    </div> */}

                    {/* 보증금 정보는 별도 컴포넌트로 분리하여 강조 */}
                    {challengeDepositAmount > 0 && (
                        <div className="challenge-payment-info">
                            <p className="challenge-start-modal-deposit">
                                보증금: <strong>{challengeDepositAmount.toLocaleString()}원</strong>
                            </p>
                            <p className="challenge-start-modal-description small">
                                수련을 달성하면 100% 환급되오나,<br />실패한다면 50%가 대한장애인체육회에 기부될 것이오.
                            </p>
                        </div>
                    )}
                    
                    <p className="challenge-start-modal-description small">
                        도전 중에는 취소할 수 없소이다. <br />
                        끝까지 함께할 준비가 되었는가?
                    </p>
                    
                    <div className="challenge-start-modal-buttons">
                        <button className="challenge-start-modal-btn challenge-start-modal-btn-cancel" onClick={onClose} disabled={isProcessing}>보류하겠소</button>
                        <button
                            className="challenge-start-modal-btn challenge-start-modal-btn-primary"
                            onClick={handleConfirm}
                            disabled={isProcessing}
                        >
                            {isProcessing ? '처리 중...' : '도전하겠소'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}