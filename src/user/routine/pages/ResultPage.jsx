import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ResultPage.css";
import useRoutineService from "../service/routineService";
import gold from "../../../assets/img/challenge/norigae/gold.png";


export default function ResultPage() {
  const { getActualWorkout } = useRoutineService();
  const { workoutId } = useParams();
  const navigate = useNavigate();

  const [workoutList, setWorkoutList] = useState([]);
  const [summary, setSummary] = useState({
    dateLabel: "",
    totalVolume: 0,
    totalSets: 0,
    totalCalories: 0,
    totalMinutes: 0,
  });

  // 데이터 로드 (너가 쓰던 방식 유지)
  useEffect(() => {
    if (!workoutId) return;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await getActualWorkout(workoutId, { signal: controller.signal });
        const d = res?.data ?? res;
        const list = Array.isArray(d)
          ? d
          : d.list ?? d.results ?? d.rows ?? d.items ?? d.sets ?? d.details ?? d.data ?? [];
        setWorkoutList(list);
      } catch (e) {
        if (e.name !== "CanceledError" && e.name !== "AbortError") console.error(e);
      }
    })();

    return () => controller.abort();
  }, [workoutId, getActualWorkout]);

  // 요약 계산 (첫 행에서 minutes/calories 읽기)
  useEffect(() => {
    const dateLabel = new Date().toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    if (!workoutList.length) {
      setSummary((s) => ({ ...s, dateLabel }));
      return;
    }

    const totalSets = workoutList.length;
    const totalVolume = workoutList.reduce(
      (acc, w) => acc + (Number(w.kg) || 0) * (Number(w.reps) || 0),
      0
    );

    const first = workoutList[0] ?? {};
    const totalCalories = Number(first.calories ?? first.calorie ?? first.kcal ?? 0);

    let totalMinutes = Number(first.minutes ?? first.durationMinutes ?? 0);
    if (!totalMinutes) {
      const start = first.startTime ?? first.workoutStart ?? first.startAt;
      const end = first.endTime ?? first.workoutEnd ?? first.endAt;
      if (start && end) {
        totalMinutes = Math.max(0, Math.round((new Date(end) - new Date(start)) / 60000));
      }
    }

    setSummary({ dateLabel, totalVolume, totalSets, totalCalories, totalMinutes });
  }, [workoutList]);

  const fmtInt = (n) => Number(n || 0).toLocaleString("ko-KR");
  const fmtHMS = (m) => {
    const total = Math.max(0, Math.round(m || 0)) * 60;
    const h = Math.floor(total / 3600);
    const mm = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${String(h).padStart(2, "0")}:${String(mm).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };
  const datePill = (() => {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, "0")}월 ${String(d.getDate()).padStart(2, "0")}일`;
  })();

  // 요약 계산 useEffect 아래에 추가
const exerciseCount = useMemo(() => {
  const keys = new Set(
    workoutList.map(w => (w.elementId ?? w.elementName ?? `#${w.detailId}`))
  );
  return keys.size;
}, [workoutList]);


  return (
    <>
    <div className="divider-line"></div>
    <div className="pf-page">
      {/* 상단 히어로 */}
      <div className="pf-hero">
        {/* <span className="pf-confetti" aria-hidden>🎉</span> */}
        <div className="pf-hero-title">오늘도 한 걸음 성장하였소</div>
        {/* <div className="pf-hero-date">{summary.dateLabel}</div> */}
      </div>

      {/* 메인 카드 */}
      <div className="pf-card">
        <div className="pf-date-pill">{datePill}</div>

        <div className="pf-subtitle">오늘 들어올린 무게</div>

        <div
          className="pf-volume"
          aria-label={`${fmtInt(summary.totalVolume)} 킬로그램`}
        >
          <span className="pf-volume-number">{fmtInt(summary.totalVolume)}</span>
          <span className="pf-volume-unit">KG</span>
        </div>


        {/* 이미지 영역 — 너가 넣을 자리 */}
        <div className="pf-illustration">
          <img src= {gold} alt="" className="pf-img" />
        </div>

        <div className="pf-metrics">
          <div className="pf-metric">
            <span className="pf-metric-ico" aria-hidden>💪</span>
            <span className="pf-metric-text">{fmtInt(exerciseCount)} 운동</span>
          </div>
          <div className="pf-metric">
            <span className="pf-metric-ico" aria-hidden>🏋️‍♀️</span>
            <span className="pf-metric-text">{fmtInt(summary.totalSets)}세트</span>
          </div>
          <div className="pf-metric">
            <span className="pf-metric-ico" aria-hidden>🔥</span>
            <span className="pf-metric-text">{fmtInt(summary.totalCalories)} Kcal</span>
          </div>
        </div>

      </div>

      {/* 하단 브랜드/액션 */}
      {/* <div className="pf-brand">짐마당</div> */}

      <div className="pf-actions">
        <button className="pf-btn" onClick={() => navigate("/home")}>
        사진추가
        </button>
        <button className="pf-btn" onClick={() => navigate("/home")}>
          나의 기록을 보러가겠소
        </button>
      </div>
    </div>
    </>

  );
}
