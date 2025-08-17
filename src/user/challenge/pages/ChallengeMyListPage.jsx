// src/pages/ChallengeMyListPage.jsx

import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MyChallengeCard from '../components/MyChallengeCard';
import { MdArrowBack } from 'react-icons/md';

import '../styles/ChallengeMyListPage.css'; 
import '../styles/MyChallengeCard.css';

const BACKEND_BASE_URL = "http://localhost:8080";

const ChallengeMyListPage = () => {
  const [myChallengeList, setMyChallengeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const userId = useSelector(state => state.auth.id);

  useEffect(() => {
    const fetchMyChallengeList = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `${BACKEND_BASE_URL}/api/challenge/getAllMyChallengeListProcess`,
          { params: { userId } }
        );
        const inProgressList = res.data.filter(ch => {
          const dur = Number(ch.challengeDurationDays) || 0;
          const done = Number(ch.daysAttended) || 0;
          return dur > 0 && done < dur;
        });

        setMyChallengeList(inProgressList || []);
      } catch (err) {
        setError("참여중 챌린지를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchMyChallengeList();
  }, [userId]);

  return (
    <div className="cmlp-page">
      {/* ===== Header ===== */}
      <div className="cmlp-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0',
            color: '#1c1c1e',
            fontSize: '24px'
          }}
        >
          <MdArrowBack />
        </button>
        <div style={{ flex: 1, textAlign: 'center', marginRight: '24px' }}>
          <h2 className="cmlp-title" style={{ margin: '0' }}>오늘의 수련 인증</h2>
          <p className="cmlp-sub" style={{ margin: '0' }}>오늘 인증해야 할 챌린지들을 한 눈에 확인하시오.</p>
        </div>
      </div>
      
      <div className="cmlp-body">
        {loading && <p className="cmlp-empty-text">불러오는 중...</p>}
        {!loading && !error && myChallengeList.length === 0 && (
          <p className="cmlp-empty-text">아직 참여중인 챌린지가 없소. 새로운 챌린지를 시작해보시오!</p>
        )}
        {!loading && !error && myChallengeList.length > 0 && (
          <section className="cmlp-card-list-container">
            {myChallengeList.map(ch => (
              <MyChallengeCard
                key={ch.challengeId}
                challenge={ch}
                onClick={() => navigate(`/challenge/challengeMyRecordDetail/${ch.challengeId}`)}
                isTodayAttended={ch.todayAttended}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default ChallengeMyListPage;