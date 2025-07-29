// ChallengeCard.jsx
// import './ChallengeCard.css';

export default function ChallengeCard({ challenge }) {
  return (
    <div className="challenge-card">
      <div className="thumbnail">
        <img src={challenge.image || '/default.png'} alt="챌린지 썸네일" />
        <span className="badge">{challenge.status}</span>
      </div>
      <div className="info">
        <h3>{challenge.title}</h3>
        <p>{challenge.date}</p>
        <p>👥 {challenge.participants} / {challenge.capacity}</p>
      </div>
    </div>
  );
}
