import { useState } from 'react';
import StepStart from '../steps/StepStart';
import StepAgreement from '../steps/StepAgreement';
import StepDate from '../steps/StepDate';
import StepCapacity from '../steps/StepCapacity';
import StepKeyword from '../steps/StepKeyword';
import StepIntroduce from '../steps/StepIntroduce';
import StepImage from '../steps/StepImage';
import StepDone from '../steps/StepDone';

const steps = [
  StepStart,
  StepAgreement,
  StepDate,
  StepCapacity,
  StepKeyword,
  StepIntroduce,
  StepImage,
  StepDone
];

export default function ChallengeCreateStepper() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({});

  const CurrentStep = steps[step];

  const next = (data = {}) => {
    setFormData({ ...formData, ...data });
    setStep((prev) => prev + 1);
  };

  const back = () => setStep((prev) => prev - 1);

  return (
    <div>
      <CurrentStep data={formData} onNext={next} onBack={back} />
    </div>
  );
}
