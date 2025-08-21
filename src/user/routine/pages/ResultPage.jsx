import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/ResultPage.css";
import useRoutineService from "../service/routineService";
import gold from "../../../assets/img/challenge/norigae/gold.png";
import WorkoutShareCard from "./WorkoutShareCard.jsx";
import WorkoutLogModal from "./WorkoutLogModal.jsx";
import logo from "../../../assets/img/gymmadang_logo_kr.svg";
import gibon from "../../../assets/img/routine/r_gym.png";

export default function ResultPage() {
  const { getActualWorkout, upsertWorkoutLogExtras, getWorkoutLog } =
    useRoutineService();
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

  const bgUrl = useMemo(() => {
    return photoUrl || gibon;
  }, [photoUrl]);


  // 데이터 로드 (너가 쓰던 방식 유지)
  useEffect(() => {
    if (!workoutId) return;
    const controller = new AbortController();

    (async () => {
      try {
        const res = await getActualWorkout(workoutId, {
          signal: controller.signal,
        });
        const d = res?.data ?? res;
        const list = Array.isArray(d)
          ? d
          : d.list ??
            d.results ??
            d.rows ??
            d.items ??
            d.sets ??
            d.details ??
            d.data ??
            [];
        setWorkoutList(list);
      } catch (e) {
        if (e.name !== "CanceledError" && e.name !== "AbortError")
          console.error(e);
      }
    })();

    return () => controller.abort();
  }, [workoutId, getActualWorkout]);

  async function handleSaveExtras({ memo, file }) {
    try {
      const { data } = await upsertWorkoutLogExtras(workoutId, { memo, file });
      setLogExtras({
        memo: data.memo || "",
        pictureUrl: data.pictureUrl || "",
      });
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
        if (data)
          setLogExtras({
            memo: data.memo || "",
            pictureUrl: data.pictureUrl || "",
          });
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
    const totalCalories = Number(
      first.calories ?? first.calorie ?? first.kcal ?? 0
    );

    let totalMinutes = Number(first.minutes ?? first.durationMinutes ?? 0);
    if (!totalMinutes) {
      const start = first.startTime ?? first.workoutStart ?? first.startAt;
      const end = first.endTime ?? first.workoutEnd ?? first.endAt;
      if (start && end) {
        totalMinutes = Math.max(
          0,
          Math.round((new Date(end) - new Date(start)) / 60000)
        );
      }
    }

    setSummary({
      dateLabel,
      totalVolume,
      totalSets,
      totalCalories,
      totalMinutes,
    });
  }, [workoutList]);

  const fmtInt = (n) => Number(n || 0).toLocaleString("ko-KR");
  const fmtHMS = (m) => {
    const total = Math.max(0, Math.round(m || 0)) * 60;
    const h = Math.floor(total / 3600);
    const mm = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${String(h).padStart(2, "0")}:${String(mm).padStart(
      2,
      "0"
    )}:${String(s).padStart(2, "0")}`;
  };
  const datePill = (() => {
    const d = new Date();
    return `${String(d.getMonth() + 1).padStart(2, "0")}월 ${String(
      d.getDate()
    ).padStart(2, "0")}일`;
  })();

  // 요약 계산 useEffect 아래에 추가
  const exerciseCount = useMemo(() => {
    const keys = new Set(
      workoutList.map((w) => w.elementId ?? w.elementName ?? `#${w.detailId}`)
    );
    return keys.size;
  }, [workoutList]);

  useEffect(() => {
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
        {/* 메인 카드 (사진 배경 + 오버레이 UI) */}
          <div
            className={`pf-card-media ${bgUrl ? "has-photo" : ""}`}
            style={{ ["--pf-bg"]: `url("${bgUrl}")` }}
          >
          {/* 가독성 오버레이 */}
          <div className="pf-media-overlay" />

          {/* 상단 바: 좌측 로고(교체), 우측 날짜 */}
          <div className="pf-share-header">
            {/* 로고는 네가 static 경로로 교체해서 쓰면 됨 */}
            <img className="pf-share-logo" src={logo} alt="짐마당" />
            <div className="pf-share-date">
              {(() => {
                const d = new Date();
                const y = d.getFullYear();
                const m = String(d.getMonth() + 1).padStart(2, "0");
                const day = String(d.getDate()).padStart(2, "0");
                return `${y}.${m}.${day}.`;
              })()}
            </div>
          </div>

          {/* 좌하단: 하나의 박스 안에 4줄 */}
          <div className="pf-stats-box">
            <div className="pf-stat-row">
              <span className="pf-stat-ico" aria-hidden>
                🏋️
              </span>
              <span className="pf-stat-value">
                {fmtInt(summary.totalVolume)} kg
              </span>
            </div>
            <div className="pf-stat-row">
              <span className="pf-stat-ico" aria-hidden>
                💪
              </span>
              <span className="pf-stat-value">
                {fmtInt(exerciseCount)} 운동
              </span>
            </div>
            <div className="pf-stat-row">
              <span className="pf-stat-ico" aria-hidden>
                🏆
              </span>
              <span className="pf-stat-value">
                {fmtInt(summary.totalSets)}&nbsp;세트
              </span>
            </div>
            <div className="pf-stat-row">
              <span className="pf-stat-ico" aria-hidden>
                🔥
              </span>
              <span className="pf-stat-value">
                {fmtInt(summary.totalCalories)} 칼로리
              </span>
            </div>
          </div>

          {/* 오른쪽 스티커(금 노리개) – 원하면 이미지 바꿔도 됨 */}
          {/* <img src={gold} alt="" className="pf-sticker" /> */}
        </div>

        {/* 하단 브랜드/액션 */}
        {/* <div className="pf-brand">짐마당</div> */}

        <div className="pf-actions">
          <button className="pf-btn" onClick={() => setShowModal(true)}>
            사진을 추가하겠소
          </button>
          <button className="pf-btn" onClick={() => setShowModal(true)}>
            일지를 작성하겠소
          </button>


        </div>
        <div className="pf-action-2">
          <button className="pf-btn-2" onClick={() => navigate("/mypage/routineCalendar")}>
            나의 기록들을 보러가겠소
          </button>
        </div>

        {/* 모달 */}
        <WorkoutLogModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveExtras}
          initialMemo={logExtras.memo}
          initialPreview={photoUrl}
        />
      </div>
    </>
  );
}
