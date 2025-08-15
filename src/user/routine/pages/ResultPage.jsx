import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ResultPage.css";
import useRoutineService from "../service/routineService";
import gold from "../../../assets/img/challenge/norigae/gold.png";
import WorkoutShareCard from "./WorkoutShareCard.jsx";
import WorkoutLogModal from "./WorkoutLogModal.jsx";


export default function ResultPage() {
  const { getActualWorkout, upsertWorkoutLogExtras, getWorkoutLog } = useRoutineService();
  const { workoutId } = useParams();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [logExtras, setLogExtras] = useState({ memo: "", pictureUrl: "" });

  const [workoutList, setWorkoutList] = useState([]);
  const [summary, setSummary] = useState({
    dateLabel: "",
    totalVolume: 0,
    totalSets: 0,
    totalCalories: 0,
    totalMinutes: 0,
  });

const photoUrl = useMemo(() => {
  const raw = (logExtras.pictureUrl || "").trim();
  if (!raw) return "";

  // 이미 절대 URL이면 그대로 사용
  if (/^https?:\/\//i.test(raw)) return raw;

  // 앞 슬래시 강제
  const withSlash = raw.startsWith("/") ? raw : `/${raw}`;

  // /uploadFiles 프리픽스 강제
  const normalized = withSlash.startsWith("/uploadFiles/")
    ? withSlash
    : `/uploadFiles${withSlash}`;

  return `http://localhost:8080${normalized}`;
}, [logExtras.pictureUrl]);

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

    async function handleSaveExtras({ memo, file }) {
    try {
      const { data } = await upsertWorkoutLogExtras(workoutId, { memo, file });
      setLogExtras({ memo: data.memo || "", pictureUrl: data.pictureUrl || "" });
      setShowModal(false);
    } catch (e) {
      console.error(e);
      alert("업로드에 실패했소.");
    }
  }


  useEffect(() => {
    if (!workoutId) return;
    (async () => {
      try {
        const { data } = await getWorkoutLog(workoutId);
        if (data) setLogExtras({ memo: data.memo || "", pictureUrl: data.pictureUrl || "" });
      } catch (_) {}
    })();
  }, [workoutId, getWorkoutLog]);

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

useEffect(() => {
  console.log("photoUrl:", photoUrl);
}, [photoUrl]);
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
  <div
    className={`pf-card-media ${photoUrl ? "has-photo" : ""}`}
    style={photoUrl ? { ["--pf-bg"]: `url("${photoUrl}")` } : undefined}
  >
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
        {/* <div className="pf-illustration">
          <img src= {gold} alt="" className="pf-img" />
        </div> */}

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
        <button className="pf-btn" onClick={() => setShowModal(true)}>기념 사진을 추가하겠소</button>
        <button className="pf-btn" onClick={() => navigate("/home")}>나의 기록을 보러가겠소</button>
      </div>


      {/* 아래 표시 영역 */}
      {/* <div className="pf-card" style={{ marginTop: 12, textAlign:"left" }}>
        <h4 style={{marginTop:0}}>오늘의 기록</h4>
        {(!logExtras.pictureUrl && !logExtras.memo) ? (
          <div className="rp-empty">아직 사진/메모가 없어요.</div>
        ) : (
          <div className="extras-row">
            {logExtras.pictureUrl && (
              <img
                alt="workout"
                className="extras-thumb"
                src={logExtras.pictureUrl.startsWith("http")
                      ? logExtras.pictureUrl
                      : `http://localhost:8080${logExtras.pictureUrl}`}
              />
            )}
            {logExtras.memo && <p className="extras-memo">{logExtras.memo}</p>}
          </div>
        )}
      </div> */}

      {/* 모달 */}
      <WorkoutLogModal
        open={showModal}
        onClose={() => setShowModal(false)}
        onSave={handleSaveExtras}
        initialMemo={logExtras.memo}
        initialPreview={
          logExtras.pictureUrl
            ? (logExtras.pictureUrl.startsWith("http")
                ? logExtras.pictureUrl
                : `http://localhost:8080${logExtras.pictureUrl}`)
            : ""
        }
      />


    </div>
    </>

  );
}
