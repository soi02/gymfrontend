import { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import StepStart from '../steps/StepStart';
import StepAgreement from '../steps/StepAgreement';
import StepDate from '../steps/StepDate';
import StepDurationDate from '../steps/StepDurationDate';
import StepCapacity from '../steps/StepCapacity';
import StepKeyword from '../steps/StepKeyword';
import StepIntroduce from '../steps/StepIntroduce';
import StepImage from '../steps/StepImage';
import StepDone from '../steps/StepDone';
import StepDeposit from '../steps/StepDeposit';

const steps = [
  StepStart,
  StepAgreement,
  StepDate,
  StepDurationDate,
  StepCapacity,
  StepDeposit,
  StepKeyword,
  StepIntroduce,
  StepImage,
  StepDone,
];

export default function ChallengeCreateStepper() {
  const userId = useSelector((state) => state.auth.id); 
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    challengeCreator: userId,
    challengeTitle: '',
    challengeDescription: '',
    challengeMaxMembers: 0,
    challengeRecruitStartDate: '',
    challengeRecruitEndDate: '',
    // challengeStartDate: '',
    // challengeEndDate: '', // 이건 여기 말고 도전하기 누를 때 정해짐
    challengeDurationDays: 0,
    challengeThumbnailImage: null,
    challengeKeywordNameList: [],
    challengeDepositAmount: 0,
  });


  // 로그인 필요 안내 + 로그인 성공 후 원래 위치로 자동 이동
  useEffect(() => {

    if (!userId) {
      alert("이곳은 짐마당의 백성들만 들어올 수 있소. 장부에 이름을 등록해주시오.");
        navigate('/gymmadang/login', { state: { from: location.pathname } });
    }

  }, [userId, navigate, location.pathname]);

    useEffect(() => {
    if (userId) {
      setFormData((prevData) => ({
        ...prevData,
        challengeCreator: userId,
      }));
    }
  }, [userId]);

  const CurrentStep = steps[step];

  const next = async (data = {}) => {
    const updated = { ...formData, ...data };
    setFormData(updated);

    // 마지막 단계 (StepDone) 직전에 API 호출 (StepImage 다음)
    if (step === steps.length - 2) { 
      console.log("전송할 최종 데이터:", updated);

      try {
        const formDataToSend = new FormData();

        // @ModelAttribute ChallengeCreateRequest challengeCreateRequest 에 매핑될 데이터
        // 각 필드를 개별적으로 FormData에 추가
        formDataToSend.append("challengeCreator", updated.challengeCreator || '');
        formDataToSend.append("challengeTitle", updated.challengeTitle || '');
        formDataToSend.append("challengeDescription", updated.challengeDescription || '');
        formDataToSend.append("challengeMaxMembers", updated.challengeMaxMembers || 0);
        formDataToSend.append("challengeDepositAmount", updated.challengeDepositAmount || 0);
        formDataToSend.append("challengeRecruitStartDate", updated.challengeRecruitStartDate || '');
        formDataToSend.append("challengeRecruitEndDate", updated.challengeRecruitEndDate || '');
        // formDataToSend.append("challengeStartDate", updated.challengeStartDate || '');
        // formDataToSend.append("challengeEndDate", updated.challengeEndDate || ''); // 여기서 안보내고, 도전하기 누르면 백엔드에 userChallenge 테이블에 저장
        formDataToSend.append("challengeDurationDays", updated.challengeDurationDays || 0);
        // challengeThumbnailPath는 백엔드에서 생성되므로 여기서 보낼 필요 없음

        // @RequestParam("challengeKeywordNameList") List<String> challengeKeywordNameList 에 매핑
        if (updated.challengeKeywordNameList && updated.challengeKeywordNameList.length > 0) {
          updated.challengeKeywordNameList.forEach((keywordName) =>
            formDataToSend.append("challengeKeywordNameList", String(keywordName))
          );
        }

        // @RequestPart(value = "challengeThumbnailImage", required = false) MultipartFile challengeThumbnailImage 에 매핑
        if (updated.challengeThumbnailImage) {
          formDataToSend.append("challengeThumbnailImage", updated.challengeThumbnailImage);
        }
        
        // FormData 내용을 확인하기 위한 디버깅 코드
        for (let [key, value] of formDataToSend.entries()) {
            console.log(`${key}:`, value);
        }


        const res = await axios.post(
          "http://localhost:8080/api/challenge/registerChallengeProcess",
          formDataToSend,
          {
            headers: {
              'Content-Type': 'multipart/form-data', // FormData 사용 시 필수
            },
          }
        );

        console.log("챌린지 생성 완료 응답:", res.data);
        if (res.data === "챌린지 생성 완료") { // 백엔드 응답 메시지 확인
            navigate('/gymmadang/challenge/challengeList'); // / 붙은 절대경로로 
        } else {
            alert("챌린지 생성 실패: " + res.data);
        }
        
      } catch (error) {
        console.error("챌린지 생성 실패:", error);
        alert("챌린지 생성 중 오류가 발생했습니다.");
      }
    }

    setStep((prev) => prev + 1);
  };

  const back = () => setStep((prev) => prev - 1);

  return (
    <div>
      <CurrentStep data={formData} onNext={next} onBack={back} />
    </div>
  );
}