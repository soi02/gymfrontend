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

const steps = [
  StepStart,
  StepAgreement,
  StepDate,
  StepDurationDate,
  StepCapacity,
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
    challengeCreator: null,
    challengeTitle: '',
    challengeDescription: '',
    challengeMaxMembers: 0,
    challengeStartDate: '',
    challengeEndDate: '',
    challengeDurationDays: 0,
    challengeThumbnailImage: null,
    challengeKeywordNameList: [],
  });

 useEffect(() => {
    // userId가 없고, 현재 경로가 로그인 페이지가 아니라면 로그인 페이지로 이동
    if (!userId) {
      alert("로그인이 필요한 기능입니다.");
      // 로그인 후 돌아올 경로를 'state'에 담아서 로그인 페이지로 전달
      navigate("/gymmadang/login", { state: { from: location.pathname } }); 
    } else if (!formData.challengeCreator) {
      // userId가 있으나 formData.challengeCreator가 아직 설정되지 않았다면 설정
      setFormData((prev) => ({
        ...prev,
        challengeCreator: userId,
      }));
    }
  }, [userId, formData.challengeCreator, navigate, location.pathname]); // 의존성 배열에 location.pathname 추가

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
        formDataToSend.append("challengeStartDate", updated.challengeStartDate || '');
        formDataToSend.append("challengeEndDate", updated.challengeEndDate || '');
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
          "http://localhost:8080/api/challengeList/registerChallengeProcess",
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