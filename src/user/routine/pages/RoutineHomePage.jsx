import { useEffect, useRef, useState } from 'react';
import routineCharacter from '../../../assets/img//routine/routine_character.png';
import '../styles/RoutineHomePage.css'
import { useNavigate } from 'react-router-dom';
import useRoutineService from '../service/routineService';
import { useSelector } from 'react-redux';

export default function RoutineHomePage() {
  const fullText = `오늘은 어떤 운동을 해보시겠소?\n매번 즐겨하는 부위말고 \n다른 부위도 고르게 단련해주시오.`;
  
  const [routines, setRoutines] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

  const [displayedText, setDisplayedText] = useState("");
  const [bubbleMinHeight, setBubbleMinHeight] = useState(0);
  const measureRef = useRef(null);

  // 최종 높이 측정
  useEffect(() => {
    if (measureRef.current) {
      setBubbleMinHeight(measureRef.current.offsetHeight);
    }
  }, []);

  // 타이핑 효과
  useEffect(() => {
    let i = 0;
    const itv = setInterval(() => {
      setDisplayedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(itv);
    }, 50);
    return () => clearInterval(itv);
  }, []);

  const handleFabClick = () => {
    setShowOptions(!showOptions);
  };

  const navigate = useNavigate();

  const { getRoutinesByUserId } = useRoutineService();

  const userId = useSelector(state => state.auth.id);
  // console.log("현재 로그인한 사용자 ID", userId);

  useEffect(() => {
      const fetchData = async () => {
      const data = await getRoutinesByUserId(userId);

      // 중복 제거 (routineId 기준)
      const uniqueRoutines = data.filter(
        (routine, index, self) =>
          index === self.findIndex((r) => r.routineId === routine.routineId)
      );

      // ✅ 중복 제거된 데이터로 세팅해야 함!
      setRoutines(uniqueRoutines);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    const prevHeight = document.body.style.height;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    const prevHtmlHeight = document.documentElement.style.height;

    document.body.style.overflow = 'hidden';
    document.body.style.height = '100dvh';
    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.height = '100dvh';

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.height = prevHeight;
      document.documentElement.style.overflow = prevHtmlOverflow;
      document.documentElement.style.height = prevHtmlHeight;
    };
  }, []);






    return(
        <>
        <div className="main-content">


        
          <div className="routine-homepage-body">
            <div className="routine-homepage-container">
              <div className="routine-homepage-content">

              <div className="divider-line"></div>

                {/* 캐릭터, 말풍선 */}
                <div className="routine-homepage-title">
                  훈련기록
                </div>

                {/* 실제 보이는 말풍선 */}
                <div className="routine-speech-bubble" style={{ minHeight: bubbleMinHeight }}>
                  <p style={{ whiteSpace: "pre-line" }}>{displayedText}</p>
                  <div className="routine-speech-arrow" />
                </div>

                {/* 숨김 측정용 말풍선 (최종 텍스트로 렌더) */}
                <div
                  ref={measureRef}
                  className="routine-speech-bubble"
                  style={{
                    position: "absolute",
                    visibility: "hidden",
                    pointerEvents: "none",
                    left: "-9999px",
                    top: 0,
                  }}
                >
                  <p style={{ whiteSpace: "pre-line" }}>{fullText}</p>
                </div>

                {/* 캐릭터 */}
                <div className="routine-character-wrapper">
                  <img
                    src={routineCharacter}
                    alt="루틴 이미지"
                    style={{ width: "50%", marginTop: "15px" }}  
                  />
                </div>

                {/* <div className="row">
                  <div className="col" style={{textAlign: 'left',paddingLeft: '1.5rem', marginBottom: '0.5rem'}}>
                    <h5
                    style={{fontSize: '1.1rem',
                            fontWeight: '600'
                            }}
                    >나의 루틴</h5>
                  </div>
                </div>

                <div className="routine-grid">
                {routines.map((routine, idx) => (
                  <div
                    key={`${routine.routineId}-${idx}`}
                    className="routine-card"
                    onClick={() => navigate(`/routine/list/${routine.routineId}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {routine.routineName}
                  </div>

                ))}
                </div> */}

                <div className='routine-bottom-buttons-2'>
                  <button className="routine-free-btn-2" onClick={() => navigate('/routine/free')}>오늘은 자유롭게<br /> 운동하겠소</button>
                  <button className="routine-add-btn-2" onClick={() => navigate('/routine/myroutines')}>나의 루틴에서<br /> 선택하겠소</button>
                </div>





                {/* 하단 고정 버튼 영역 */}
                {/* <div className="routine-bottom-buttons">
                  <button className="routine-free-btn" onClick={() => navigate('/routine/free')}>⚡ 자유운동</button>
                  <button className="routine-add-btn" onClick={() => navigate('/routine/add')}>＋ 루틴생성</button>
                </div> */}


              </div>
            </div>

          </div>

        </div>
        </>
    )
}