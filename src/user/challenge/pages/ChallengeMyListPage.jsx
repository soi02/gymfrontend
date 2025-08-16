import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MyChallengeCard from '../components/MyChallengeCard';
import '../styles/ChallengeList.css';
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
        setMyChallengeList(res.data || []);
      } catch (err) {
        setError("참여중 챌린지를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };
    if (userId) fetchMyChallengeList();
  }, [userId]);

  return (
    <div className="ccp-page">
      <h2 className="ccp-title">참여중인 챌린지</h2>
      <p className="ccp-sub">현재 도전중인 챌린지를 모두 확인할 수 있습니다.</p>

      <div className="ccp-scroll">
        {loading && <p className="empty-text">불러오는 중...</p>}
        {!loading && error && <p className="empty-text">{error}</p>}
        {!loading && !error && myChallengeList.length === 0 && (
          <p className="empty-text">현재 참여중인 챌린지가 없습니다.</p>
        )}
        {!loading && !error && myChallengeList.length > 0 && (
          <section className="card-list-container">
            {myChallengeList.map(ch => (
              <MyChallengeCard
                key={ch.challengeId}
                challenge={ch}
                onClick={() => navigate(`/challenge/challengeMyRecordDetail/${ch.challengeId}`)}
              />
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default ChallengeMyListPage;
