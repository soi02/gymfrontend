import { useState } from 'react';

export function useTestState() {
  const [scores, setScores] = useState({
    goal: 0,
    relationship: 0,
    recovery: 0,
    learning: 0,
    balanced: 0,
  });

  const [keywords, setKeywords] = useState([]); // 관심 키워드
  const [routine, setRoutine] = useState({ days: [], region: '' }); // 루틴 정보

  const addScore = (type, amount = 1) => {
    setScores((prev) => ({
      ...prev,
      [type]: prev[type] + amount
    }));
  };

  const setKeywordResult = (selected) => {
    setKeywords(selected);
  };

  const setRoutineResult = ({ days, region }) => {
    setRoutine({ days, region });
  };

  return {
    scores,
    addScore,
    keywords,
    setKeywordResult,
    routine,
    setRoutineResult,
  };
}
