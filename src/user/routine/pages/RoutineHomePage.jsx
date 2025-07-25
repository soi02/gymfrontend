import { useEffect, useState } from 'react';
import routineCharacter from '../../../assets/img/routine_character.png';
import '../styles/RoutineHomePage.css'

export default function RoutineHomePage() {
  const fullText = `오늘은 어떤 부위를\n운동해보시겠소?\n매번 즐겨하는 부위말고\n다른 부위도 단련해주시오.`;
  const [displayedText, setDisplayedText] = useState('');

  // 더미 - 추후 수정
  const routines = ['가슴', '등', '어깨', '팔', '하체'];


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
        
          <div className="routine-homepage-body">
            <div className="routine-homepage-container">
              <div className="routine-homepage-content">
                <h2 className="routine-homepage-title">훈련도감</h2>
        
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

                {/* 루틴 선택 박스 */}
                <div className="routine-grid">
                  {routines.map((routine, idx) => (
                    <div key={idx} className="routine-card">{routine}</div>
                  ))}
                  <div className="routine-card add-card">＋ 루틴 추가</div>
                </div>


                <div className="routine-grid">

                </div>


              </div>
            </div>

          </div>
        </>
    )
}