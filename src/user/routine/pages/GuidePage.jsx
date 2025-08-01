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

  const [instruction, setinstruction] = useState("");
  const [meta, setMeta] = useState({
    categoryName: "",
    elementName: "",
    elementPicture: "",
    memoContent: ""
  })

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
      } catch(error) {
        console.error(error);
      }
    };
    getWorkoutGuide();
  }, []);


  const parsed = parseGuideText(instruction);


  return (
    <div className="main-content routine-main-content">
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

        <h5>∙ 내 메모</h5>
      <div className="routine-memo">
        <p>{meta.memoContent}</p>
      </div>
    </div>

    );
}