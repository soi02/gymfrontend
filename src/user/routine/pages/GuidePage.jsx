import { useParams, useNavigate } from "react-router-dom";
import useRoutineService from "../service/routineService";
import { useEffect, useState } from "react";
import "../styles/GuidePage.css";
import { BiPencil } from "react-icons/bi";


const formatSteps = (text) => {
  if (!text) return "";

  return text
    .replace(/([0-9]+)\.\s*/g, "\n$1. ") // 번호 앞에 줄바꿈 넣기
    .trim()
    .split("\n") // 줄 단위로 자름
    .map((line, idx) => (
      <p key={idx} style={{ marginBottom: "0.5rem" }}>
        {line}
      </p>
    ));
};

const parseGuideText = (text) => {
  if (!text)
    return {
      startPosture: "",
      motion: "",
      breathing: "",
    };

  const startSplit = text.split("운동 동작:");
  const postureText = startSplit[0]?.replace("시작 자세:", "").trim() || "";

  const motionSplit = startSplit[1]?.split("호흡법:");
  const motionText = motionSplit?.[0]?.trim() || "";
  const breathingText = motionSplit?.[1]?.trim() || "";

  return {
    startPosture: postureText,
    motion: motionText,
    breathing: breathingText,
  };
};

export default function GuidePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const routineService = useRoutineService();

  const [instruction, setinstruction] = useState("");
  const [meta, setMeta] = useState({
    categoryName: "",
    elementName: "",
    elementPicture: "",
    memoContent: "",
  });
const handleBack = () => {
    const canGoBack = window.history.state && window.history.state.idx > 0;
    if (canGoBack) navigate(-1);
    else navigate("/routine"); // 👉 원하는 기본 경로로 변경 가능
  };
  useEffect(() => {
    const getWorkoutGuide = async () => {
      try {
        const raw = await routineService.getWorkoutGuide(id);
        const data = raw?.[0];

        setinstruction(data?.instruction || "");
        setMeta({
          categoryName: data?.categoryName || "",
          elementName: data?.elementName || "",
          elementPicture: data?.elementPicture || "",
          memoContent: data?.memoContent || "",
        });
      } catch (error) {
        console.error(error);
      }
    };
    getWorkoutGuide();
  }, []);

  const parsed = parseGuideText(instruction);

  const [isEditing, setIsEditing] = useState(false);
  const [editedMemo, setEditedMemo] = useState(meta.memoContent);

  // 상단의 state들 아래에 추가
  // const [videos, setVideos] = useState([]);

  // 운동명(meta.elementName) 세팅된 뒤 검색
  // useEffect(() => {
  //   const run = async () => {
  //     if (!meta.elementName) return;
  //     try {
  //       const query = `${meta.elementName} 운동 방법`; // 예: 벤치 프레스 운동 방법
  //       const list = await routineService.youtubeSearch(query);
  //       setVideos((list || []).slice(0, 3)); // 3개만
  //     } catch (e) {
  //       console.error("유튜브 검색 실패", e);
  //     }
  //   };
  //   run();
  // }, [meta.elementName]);

  return (
    <>
      {/* <div className="divider-line" /> */}
      {/* ← 동일한 상단 라인 */}

      <div
        className="main-content routine-main-content"
        style={{ height: "100vh", display: "flex", flexDirection: "column" }}
      >
        <div className="gp-header-wrapper">
          <button type="button" className="gp-back-btn" onClick={handleBack}>
            &lt; 이전
          </button>
        {/* 캘린더 */}
        {/* 헤더 */}
        </div>

        <h4 className="routine-title">
          <span className="routine-subtitle">
            {meta.categoryName} &gt; {meta.elementName}
          </span>
        </h4>

        {meta.elementPicture && (
          <div className="routine-image-wrapper">
            <img
              src={`http://localhost:8080/uploadFiles/${meta.elementPicture}`}
              alt={meta.elementName}
              className="routine-image"
            />
          </div>
        )}
        <h5>∙ 운동 방법</h5>

        <div className="routine-guide-box">
          <h5>[시작 자세]</h5>
          {formatSteps(parsed.startPosture)}

          <h5 style={{ marginTop: "1rem" }}>[운동 동작]</h5>
          {formatSteps(parsed.motion)}

          <h5 style={{ marginTop: "1rem" }}>[호흡법]</h5>
          {formatSteps(parsed.breathing)}
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "0.6rem",
          }}
        >
          <h5 style={{ margin: 0 }}>∙ 내 메모</h5>
          <BiPencil
            size={20}
            style={{ cursor: "pointer", marginRight: "1rem" }}
            onClick={() => {
              setEditedMemo(meta.memoContent);
              setIsEditing(true);
            }}
          />
        </div>

        <div className="routine-memo">
          {isEditing ? (
            <>
              <textarea
                className="memo-edit-box"
                value={editedMemo}
                onChange={(e) => setEditedMemo(e.target.value)}
              />

              <div style={{ marginTop: "1rem", textAlign: "right" }}>
                <button
                  className="memo-button-cancel"
                  onClick={() => setIsEditing(false)}
                >
                  취소
                </button>
                <button
                  className="memo-button"
                  onClick={() => {
                    routineService
                      .updateMemo(id, editedMemo)
                      .then(() => {
                        setMeta({ ...meta, memoContent: editedMemo });
                        setIsEditing(false);
                      })
                      .catch((err) => {
                        console.error("메모 저장 실패", err);
                        alert("메모 저장 중 오류가 발생했소.");
                      });
                  }}
                >
                  저장
                </button>
              </div>
            </>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p style={{ margin: 0 }}>{meta.memoContent}</p>
            </div>
          )}
        </div>
        {/* 
      <h5 style={{ marginTop: "1rem" }}>∙ 운동 영상</h5>
        <div
          className="youtube-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '0.6rem',
          }}
        >
          {videos.map(v => (
            <div key={v.videoId} className="youtube-item">
              <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 12, overflow: 'hidden' }}>
                <iframe
                  title={v.title}
                  src={`https://www.youtube.com/embed/${v.videoId}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
                />
              </div>
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.9rem' }}>{v.title}</p>
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
}
