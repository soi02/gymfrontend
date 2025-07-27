// 선택값과 점수 관리 훅


import { useState } from 'react';

export function useTestState() {
  const [scores, setScores] = useState({
    goal: 0,
    relationship: 0,
    recovery: 0,
    learning: 0,
    balanced: 0,
  });

  const addScore = (type, amount = 1) => {
    // 그 선택지에 해당하는 성향 타입(type)의 점수를 amount만큼 증가시키는 함수, 점수는 누적됨
    setScores((prev) => ({
      ...prev,
      [type]: prev[type] + amount
      // goal: prev.goal + amount 이런 식으로 계산될 것임
    }));
  };

  return { scores, addScore };
}
