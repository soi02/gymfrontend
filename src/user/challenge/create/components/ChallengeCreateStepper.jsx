import { useState } from 'react';
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

  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    challengeKeywordIds: [],
    challengeCreator: userId, // user 테이블의 id (int) (이거 어디서 가져오는건지 확인하기 위해서 리덕스 셀렉트 사용)
  });

  const CurrentStep = steps[step];

  const next = async (data = {}) => {
    const updated = { ...formData, ...data }; 
    setFormData(updated);

    // 각 스텝에서 onNext(data) → formData에 데이터가 누적된 거 받아서 여기서 백으로 formData 전송 처리해주기
    // 마지막 단계(제출)
    if (step === steps.length - 2) {
        console.log('전송할 데이터:', updated); // ✅ 여기 추가
      try {
        const res = await axios.post('http://localhost:8080/api/challengeList/registerChallengeProcess', {
          ...updated,
        });
        console.log('챌린지 생성 완료:', res.data);
      } catch (error) {
        console.error('챌린지 생성 실패:', error);
      }
    }

    setStep((prev) => prev + 1); // 전송 성공 후 step ++ 해서 StepDone 렌더링
  };

  const back = () => setStep((prev) => prev - 1);

  return (
    <div>
      <CurrentStep data={formData} onNext={next} onBack={back} />
    </div>
  );
}
