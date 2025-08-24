import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import apiClient from '../../../../global/api/apiClient';
import '../styles/GroupChatListNew.css'; // ⬅️ 새 CSS로 교체 (공유 X)

const BACKEND_BASE_URL = 'http://localhost:8080';

function toAbsUrl(path) {
  if (!path) return null;
  if (/^https?:\/\//i.test(path)) return path;
  return `${BACKEND_BASE_URL}${path}`;
}

// 썸네일 없을 때 이니셜
function getInitials(text = '') {
  const s = text.trim();
  if (!s) return 'G';
  const parts = s.split(/\s+/);
  const first = parts[0]?.[0] || '';
  const second = parts[1]?.[0] || '';
  return (first + second).toUpperCase();
}

export default function GroupChatList() {
  const [challenges, setChallenges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [err, setErr] = useState(null);
  const [q, setQ] = useState('');
  const navigate = useNavigate();
  const userId = useSelector((s) => s.auth.id);

  useEffect(() => {
    if (!userId) {
      setErr('로그인이 필요하오');
      setIsLoading(false);
      return;
    }
    (async () => {
      try {
        // baseURL: http://localhost:8080/api
        const res = await apiClient.get(`/challenge/groupchat/listWithSummary/${userId}`);
        setChallenges(res.data || []);
      } catch (e) {
        console.error(e);
        setErr('수련 채팅 목록을 불러올 수 없소. 다시 시도해 주시오.');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userId]);

  const onClickItem = (challengeId) => {
    navigate(`/challenge/groupchat/${challengeId}`);
  };

  const filtered = useMemo(() => {
    if (!q) return challenges;
    const k = q.toLowerCase();
    return challenges.filter((c) => (c.challengeTitle || '').toLowerCase().includes(k));
  }, [q, challenges]);

  if (isLoading) {
    return (
      <div className="gchat-container">
        <div className="gchat-header">
          <h1 className="gchat-title">수련 채팅</h1>
          <p className="gchat-subtitle">참여 중인 수련에서 이어서 대화해 보시오</p>
        </div>
        <div className="gchat-status">불러오는 중…</div>
      </div>
    );
  }
  if (err) {
    return (
      <div className="gchat-container">
        <div className="gchat-header">
          <h1 className="gchat-title">수련 채팅</h1>
          <p className="gchat-subtitle">참여 중인 수련에서 이어서 대화해 보시오</p>
        </div>
        <div className="gchat-status gchat-error">{err}</div>
      </div>
    );
  }

  return (
    <div className="gchat-container">
      {/* 헤더: ChallengeList와 동일 구조/여백 */}
      <div className="gchat-header">
        <h1 className="gchat-title">수련 채팅</h1>
        <p className="gchat-subtitle">참여 중인 수련에서 이어서 대화해 보시오</p>
      </div>

      {/* 검색바 */}
      <div className="gchat-search-wrap">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="gchat-search"
          placeholder="수련 이름 또는 메시지 내용으로 검색"
          aria-label="수련 채팅 검색"
        />
      </div>

      {/* 리스트 */}
      <div className="gchat-list-wrap">
        {filtered.length === 0 ? (
          <div className="gchat-empty">참여 중인 수련 채팅이 없소</div>
        ) : (
          <ul className="gchat-list" role="list">
            {filtered.map((c) => {
              const img = toAbsUrl(c.challengeThumbnailPath);
              const timeText = c.lastMessageTime
                ? (() => {
                    const dt = new Date(c.lastMessageTime);
                    const now = new Date();
                    const same =
                      dt.getFullYear() === now.getFullYear() &&
                      dt.getMonth() === now.getMonth() &&
                      dt.getDate() === now.getDate();
                    return same
                      ? dt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                      : dt.toLocaleDateString();
                  })()
                : '';
              return (
                <li
                  key={c.challengeId}
                  className="gchat-item"
                  onClick={() => onClickItem(c.challengeId)}
                >
                  <div className="gchat-avatar-wrap">
                    {img ? (
                      <img className="gchat-avatar" src={img} alt={`${c.challengeTitle} 썸네일`} />
                    ) : (
                      <div className="gchat-avatar gchat-avatar-fallback">
                        {getInitials(c.challengeTitle)}
                      </div>
                    )}
                    {c.unreadCount > 0 && <span className="gchat-unread-dot" aria-hidden="true" />}
                  </div>

                  <div className="gchat-main">
                    <div className="gchat-row-1">
                      <div className="gchat-title-row">{c.challengeTitle}</div>
                      <div className="gchat-time">{timeText}</div>
                    </div>
                    <div className="gchat-row-2">
                      <div className="gchat-preview">
                        {c.lastMessage || '가장 먼저 말을 걸어보시오'}
                      </div>
                      {c.unreadCount > 0 && (
                        <div
                          className="gchat-unread-badge"
                          aria-label={`안 읽은 메시지 ${c.unreadCount}개`}
                        >
                          {c.unreadCount > 99 ? '99+' : c.unreadCount}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
