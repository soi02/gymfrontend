import { useNavigate } from 'react-router-dom';
// import introLogo from '../../assets/img/challenge_intro_logo.svg'; // 이미지 경로는 실제에 맞게 수정
import './css/ChallengeIntro.css';

export default function ChallengeIntro() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: 'center', padding: '40px 20px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>수련장</h2>
      {/* <img src={introLogo} alt="수련장 로고" style={{ width: '120px', marginBottom: '16px' }} /> */}

      <p style={{ fontSize: '14px', marginBottom: '8px' }}>
        챌린지 수련장에 오신걸 환영해요!
      </p>
      <p style={{ fontSize: '13px', color: '#555', marginBottom: '32px' }}>
        목표를 향한 여정이 지금 시작됩니다.<br />
        당신만의 챌린지를 만들고, 함께 도전해보세요!
      </p>

      <button
        onClick={() => navigate('/personality-test')}
        style={{
          padding: '12px',
          width: '100%',
          maxWidth: '280px',
          marginBottom: '12px',
          border: '1px solid #000',
          borderRadius: '8px',
          backgroundColor: '#fff',
          fontWeight: 'bold',
        }}
      >
        성향 테스트 후 챌린지 추천 받기
      </button>

      <button
        onClick={() => navigate('/challengeHome')}
        style={{
          padding: '12px',
          width: '100%',
          maxWidth: '280px',
          border: '1px solid #000',
          borderRadius: '8px',
          backgroundColor: '#fff',
          fontWeight: 'bold',
        }}
      >
        바로 수련장 둘러보기
      </button>
    </div>
  );
}
