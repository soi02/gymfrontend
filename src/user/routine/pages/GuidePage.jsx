import { useParams } from "react-router-dom"
import useRoutineService from "../service/routineService";
import { useEffect, useState } from "react";
import '../styles/GuidePage.css';

const formatSteps = (text) => {
  if (!text) return "";

  return text
    .replace(/([0-9]+)\.\s*/g, "\n$1. ") // 번호 앞에 줄바꿈 넣기
    .trim()
    .split("\n") // 줄 단위로 자름
    .map((line, idx) => <p key={idx} style={{ marginBottom: '0.5rem' }}>{line}</p>);
};

const parseGuideText = (text) => {
  if (!text) return {
    startPosture: "",
    motion: "",
    breathing: ""
  };

  const startSplit = text.split("운동 동작:");
  const postureText = startSplit[0]?.replace("시작 자세:", "").trim() || "";

  const motionSplit = startSplit[1]?.split("호흡법:");
  const motionText = motionSplit?.[0]?.trim() || "";
  const breathingText = motionSplit?.[1]?.trim() || "";

  return {
    startPosture: postureText,
    motion: motionText,
    breathing: breathingText
  };
};

export default function GuidePage() {
  const { id } = useParams();
  const routineService = useRoutineService();

  const [workoutGuide, setWorkoutGuide] = useState({
    startPosture: "",
    motion: "",
    breathing: ""
  });

  useEffect(() => {
    const getWorkoutGuide = async () => {
      try {
        const rawList = await routineService.getWorkoutGuide(id);
        const instruction = rawList?.[0]?.instruction; // 여기!
        const parsed = parseGuideText(instruction);
        setWorkoutGuide(parsed);
      } catch (err) {
        console.error(err);
      }
    };

    getWorkoutGuide();
  }, [id]);

  return (
    <>
    <div className="main-content routine-main-content">
    
      <h2>가이드 페이지</h2>
      <p>ID: {id}</p>
        <div style={{ padding: "1rem", background: "#f9f9f9", borderRadius: "10px" }}>
        <h3>∙ 시작 자세</h3> 
        {formatSteps(workoutGuide.startPosture)}

        <h3>∙ 운동 동작</h3>
        {formatSteps(workoutGuide.motion)}

        <h3>∙ 호흡법</h3>
        {formatSteps(workoutGuide.breathing)}
        </div>

        
    </div>

    </>
  );
}