import { useEffect, useState } from 'react';
import routineCharacter from '../../../assets/img//routine/routine_character.png';
import '../styles/RoutineHomePage.css'
import { useNavigate } from 'react-router-dom';
import useRoutineService from '../service/routineService';
import { useSelector } from 'react-redux';

export default function RoutineHomePage() {
  const fullText = `오늘은 어떤 부위를\n운동해보시겠소?\n매번 즐겨하는 부위말고\n다른 부위도 단련해주시오.`;
  
  const [displayedText, setDisplayedText] = useState('');
  // const routines = ['가슴', '등', '어깨', '팔', '하체'];
  const [routines, setRoutines] = useState([]);
  const [showOptions, setShowOptions] = useState(false);

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
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(fullText.slice(0, i + 1));
      i++;
      if (i === fullText.length) clearInterval(interval);
    }, 50); // 50ms마다 한 글자씩

    return () => clearInterval(interval);
  }, []);



    return(
        <>
        <div className="main-content">


        
          <div className="routine-homepage-body">
            <div className="routine-homepage-container">
              <div className="routine-homepage-content">
                <h2 className="routine-homepage-title"></h2>
        
                {/* 캐릭터, 말풍선 */}

                <div className="row">
                  {/* 캐릭터 */}
                  <div className="col-5">
                    <img
                      src={routineCharacter}
                      alt="루틴 이미지"
                      style={{ width: "80%", marginTop: "15px", marginBottom: "30px" }}  
                    />
                  </div>

                  {/* 말풍선 */}
                  <div className="col-7">
                    <div className="routine-speech-bubble">
                      <p style={{ whiteSpace: 'pre-line' }}>{displayedText}</p>
                      <div className="routine-speech-arrow" />
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col" style={{textAlign: 'left',paddingLeft: '1.5rem', marginBottom: '0.5rem'}}>
                    <h5>나의 루틴</h5>
                  </div>
                </div>

                <div className="routine-grid">
                {routines.map((routine, idx) => (
                  <div
                    key={`${routine.routineId}-${idx}`}
                    className="routine-card"
                    onClick={() => navigate(`/gymmadang/routine/list/${routine.routineId}`)}
                    style={{ cursor: 'pointer' }}
                  >
                    {routine.routineName}
                  </div>

                ))}

                

                </div>

                {/* 하단 고정 버튼 영역 */}
                <div className="routine-bottom-buttons">
                  <button className="routine-free-btn" onClick={() => navigate('/gymmadang/routine/free')}>⚡ 자유운동</button>
                  <button className="routine-add-btn" onClick={() => navigate('/gymmadang/routine/add')}>＋ 루틴생성</button>
                </div>


              </div>
            </div>

          </div>

        </div>
        </>
    )
}