import React, { useEffect, useState } from 'react';
import '../styles/ChallengeCreate.css';
import apiClient from '../../../../global/api/apiClient';
import StepLayout from './StepLayout';

export default function StepKeywordDynamic({ onNext, onBack }) {
  const [tree, setTree] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const MAX = 5;

  useEffect(() => {
    const fetchTree = async () => {
      try {
        const res = await apiClient.get('http://localhost:8080/api/challenge/keywords/tree');
        setTree(res.data || []);
      } catch (e) {
        console.error('키워드 트리 로딩 실패', e);
      }
    };
    fetchTree();
  }, []);

  const toggle = (id) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) return prev.filter(v => v !== id);
      if (prev.length >= MAX) return prev;
      return [...prev, id];
    });
  };

  const handleNext = () => {
    onNext({ keywordIds: selectedIds });
  };

  return (
    <StepLayout
      onBack={onBack}
      onNext={handleNext}
      question={`<span class="highlight">수련의 특징을 담을 <br /> 키워드를 골라주시오.</span>`}
      subText="최대 5가지 키워드를 고를 수 있소."
      nextButtonText="다음"
      isNextButtonDisabled={selectedIds.length === 0}
    >
      <div className="step-keyword-info">
        <strong>{selectedIds.length > 0 ? `${selectedIds.length}개 선택됨` : '키워드를 골라주시오'}</strong>
      </div>
      
      <div className="step-keyword-wrapper">
        {tree.map(cat => (
          <div key={cat.keywordCategoryId} className="step-keyword-section">
            <h4 className="step-keyword-category">{cat.keywordCategoryName}</h4>
            <div className="step-keyword-list">
              {(cat.keywords || []).map(k => {
                const active = selectedIds.includes(k.keywordId);
                const disabled = !active && selectedIds.length >= MAX;
                return (
                  <button
                    key={k.keywordId}
                    className={`step-keyword-button ${active ? 'active' : ''} ${disabled ? 'disabled' : ''}`}
                    onClick={() => toggle(k.keywordId)}
                    disabled={disabled}
                  >
                    {k.keywordName}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </StepLayout>
  );
}