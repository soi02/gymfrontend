import { useEffect, useState } from 'react';
import axios from 'axios';

import StepStart from '../steps/StepStart';
import StepAgreement from '../steps/StepAgreement';
import StepDate from '../steps/StepDate';
import StepCapacity from '../steps/StepCapacity';
import StepKeyword from '../steps/StepKeyword';
import StepIntroduce from '../steps/StepIntroduce';
import StepImage from '../steps/StepImage';
import StepDone from '../steps/StepDone';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const steps = [
  StepStart,
  StepAgreement,
  StepDate,
  StepCapacity,
  StepKeyword,
  StepIntroduce,
  StepImage,
  StepDone,
];

export default function ChallengeCreateStepper() {
  const userId = useSelector((state) => state.auth.id); // 리덕스에서 userId 가져오기
  // console.log("✅ Redux에서 가져온 userId:", userId);  // 여기에 추가!


  // const authState = useSelector((state) => state.auth);
// console.log("🧠 전체 auth state:", authState);

const navigate = useNavigate();

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    challengeKeywordIds: [],
    challengeCreator: null, // 처음에는 null
  });


    // ✅ 로그인 여부 확인 → 비로그인 시 로그인 페이지로 이동
  useEffect(() => {
    if (!userId) {
      alert("로그인이 필요한 기능입니다.");
      navigate("/gymmadang/login");
    } else if (!formData.challengeCreator) {
      setFormData((prev) => ({
        ...prev,
        challengeCreator: userId,
      }));
    }
  }, [userId]);


  const CurrentStep = steps[step];

  const next = async (data = {}) => {
  const updated = { ...formData, ...data };
  setFormData(updated);

  if (step === steps.length - 2) {
    console.log("전송할 데이터:", updated);

    try {
      const formDataToSend = new FormData();

      // 텍스트 데이터
formDataToSend.append("challengeTitle", String(updated.challengeTitle));
formDataToSend.append("challengeDescription", String(updated.challengeDescription));
formDataToSend.append("challengeMaxMembers", String(updated.challengeMaxMembers));
formDataToSend.append("challengeStartDate", String(updated.challengeStartDate));
formDataToSend.append("challengeEndDate", String(updated.challengeEndDate));
formDataToSend.append("challengeCreator", String(updated.challengeCreator));

      // 키워드 배열
updated.challengeKeywordIds.forEach((id) =>
  formDataToSend.append("challengeKeywordIds", String(id))
);

      // 이미지 파일 
      if (updated.challengeThumnailPath) {
        formDataToSend.append("challengeThumnailPath", updated.challengeThumnailPath);
      }

const res = await axios.post(
  "http://localhost:8080/api/challengeList/registerChallengeProcess",
  formDataToSend,
  {
    // headers: {
    //   'Content-Type': undefined, // 이 줄을 제거하세요!
    // },
  }
);

      console.log("챌린지 생성 완료:", res.data);
    } catch (error) {
      console.error("챌린지 생성 실패:", error);
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
