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
    challengeDurationDays: 0,
    challengeThumbnailImage: null,
    keywordIds: [], 
    challengeDepositAmount: 0,
  });


  // 로그인 필요 안내 + 로그인 성공 후 원래 위치로 자동 이동
  useEffect(() => {

    if (!userId) {
      alert("이곳은 짐마당의 백성들만 들어올 수 있소. 장부에 이름을 등록해주시오.");
        navigate('/login', { state: { from: location.pathname } });
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
        formDataToSend.append("challengeDepositAmount", String(updated.challengeDepositAmount) || 0);
        formDataToSend.append("challengeRecruitStartDate", updated.challengeRecruitStartDate || '');
        formDataToSend.append("challengeRecruitEndDate", updated.challengeRecruitEndDate || '');
        formDataToSend.append("challengeDurationDays", updated.challengeDurationDays || 0);

        
        // ✅ keywordIds는 같은 키로 여러 번 append 해야 @ModelAttribute List<Integer>로 바인딩됨
        if (Array.isArray(updated.keywordIds) && updated.keywordIds.length > 0) {
          updated.keywordIds.forEach((id) => {
            formDataToSend.append('keywordIds', String(id));
          });
        } else {
          console.warn('keywordIds 비어 있음:', updated.keywordIds);
        }

        // @RequestPart(value = "challengeThumbnailImage", required = false) MultipartFile challengeThumbnailImage 에 매핑
        if (updated.challengeThumbnailImage) {
          formDataToSend.append("challengeThumbnailImage", updated.challengeThumbnailImage);
        }
        
      console.log("전송 keywordIds:", updated.keywordIds);

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

        // API 호출 성공/실패 여부를 `formData`에 저장하고, 다음 단계로 이동합니다.
        if (res.data === "챌린지 생성 성공") {
            setFormData((prevData) => ({ ...prevData, createStatus: 'success' }));
        } else {
            setFormData((prevData) => ({ ...prevData, createStatus: 'fail' }));
            alert("챌린지 생성 실패: " + res.data);
        }
        
      } catch (error) {
        console.error("챌린지 생성 실패:", error);
        alert("챌린지 생성 중 오류가 발생했습니다.");
        setFormData((prevData) => ({ ...prevData, createStatus: 'fail' }));
      }
    }

    // API 호출 성공/실패와 관계없이 다음 스텝으로 이동
    setStep((prev) => prev + 1);
  };

  const back = () => setStep((prev) => prev - 1);

  return (
    <div>
      <CurrentStep data={formData} onNext={next} onBack={back} />
    </div>
  );
}