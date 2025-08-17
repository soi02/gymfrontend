// src/routine/components/DiaryPage.jsx
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useRoutineService from "../service/routineService";
import "../styles/ResultPage.css";              // ✅ 카드 스타일 재활용
import gibon from "../../../assets/img/routine/r_gym.png";
import logo from "../../../assets/img/gymmadang_logo_kr.svg";
import WorkoutDetailModal from "./WorkoutDetailModal"; // ✅ 새 모달

const toLocalYYYYMMDD = (d) => {
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
};


const normalizePic = (raw) => {
  const s = (raw || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  const withSlash = s.startsWith("/") ? s : `/${s}`;
  const normalized = withSlash.startsWith("/uploadFiles/")
    ? withSlash
    : `/uploadFiles${withSlash}`;
  // 절대 URL (개발 서버 기준). 프록시 쓰면 앞부분 빼도 됨.
  return `http://localhost:8080${normalized}`;
};

export default function DiaryPage() {
  const [sp] = useSearchParams();
  const date = sp.get("date") || toLocalYYYYMMDD(new Date());
  const id = useSelector((s) => s.auth.id);

  const { getWorkoutByDate, getWorkoutLog, getActualWorkout } = useRoutineService();

  // 날짜의 workout 리스트
  const [workouts, setWorkouts] = useState([]); // [{ workoutId, totalSets, totalCalories, totalVolume, exerciseCount }]
  const [loading, setLoading] = useState(true);

  // 카드 앞/뒤 상태
  const [flipped, setFlipped] = useState({});   // { [workoutId]: true/false }
  // 일지/사진 캐시
  const [logs, setLogs] = useState({});         // { [workoutId]: { memo, pictureUrl } }

  // 상세 모달
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRows, setDetailRows] = useState([]);
  const [detailTarget, setDetailTarget] = useState(null); // workoutId

  // 날짜 타이틀
  const dateTitle = useMemo(() => `${date} 운동`, [date]);

  // 날짜별 workout 불러오기
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        const res = await getWorkoutByDate(id, date);
        const arr = Array.isArray(res?.data) ? res.data : (res?.data?.list ?? []);
        // 백엔드 필드 케이스를 유연하게 대응
        const mapped = arr
          .map((x, idx) => {
            const workoutId =
              x.workoutId ?? x.id ?? x.workout_id ?? x.workoutid ?? null;
            if (!workoutId) return null;
            return {
              workoutId,
              totalSets: x.setCount ?? x.totalSets ?? x.sets ?? 0,
              totalCalories: x.calories ?? x.kcal ?? 0,
              totalVolume: x.totalVolume ?? x.volume ?? 0,
              exerciseCount: x.workoutCount ?? x.exerciseCount ?? x.exercises ?? 0,
            };
          })
          .filter(Boolean);
        if (alive) setWorkouts(mapped);
      } catch (e) {
        console.error("날짜별 workout 조회 실패:", e);
        if (alive) setWorkouts([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, date, getWorkoutByDate]);

  // 카드 뒤집기 + 일지 로드(처음 뒤집을 때만)
  const handleFlipToBack = async (workoutId) => {
    setFlipped((prev) => ({ ...prev, [workoutId]: true }));
    // 이미 로드했으면 스킵
    if (logs[workoutId]) return;
    try {
      const { data } = await getWorkoutLog(workoutId);
      setLogs((prev) => ({
        ...prev,
        [workoutId]: {
          memo: data?.memo || "",
          pictureUrl: normalizePic(data?.pictureUrl),
        },
      }));
    } catch (e) {
      console.error("일지/사진 로드 실패:", e);
      setLogs((prev) => ({
        ...prev,
        [workoutId]: { memo: "", pictureUrl: "" },
      }));
    }
  };

  const handleFlipToFront = (workoutId) => {
    setFlipped((prev) => ({ ...prev, [workoutId]: false }));
  };

  // 상세 모달 열기
  const openDetail = async (workoutId) => {
    setDetailTarget(workoutId);
    setDetailOpen(true);
    try {
      const res = await getActualWorkout(workoutId);
      const list = Array.isArray(res?.data)
        ? res.data
        : res?.data?.list ?? res?.data?.items ?? res?.data?.data ?? [];
      setDetailRows(list);
    } catch (e) {
      console.error("운동 상세 조회 실패:", e);
      setDetailRows([]);
    }
  };

  return (
    <div className="pf-page" style={{ paddingTop: 12 }}>
      <div className="pf-hero-row" style={{ marginTop: 0 }}>
        <div className="pf-hero-title">{dateTitle}</div>
      </div>

      {loading ? (
        <div style={{ padding: 16 }}>불러오는 중…</div>
      ) : workouts.length === 0 ? (
        <div style={{ padding: 16 }}>이 날짜의 운동 기록이 없소.</div>
      ) : (
        <div style={{ width: "100%", maxWidth: 520, display: "grid", gap: 12 }}>
          {workouts.map((w) => {
            const log = logs[w.workoutId] || {};
            const bg = log.pictureUrl || gibon;

            return (
              <div key={w.workoutId} className="flip">
                <div className={`flip-inner ${flipped[w.workoutId] ? "is-flipped" : ""}`}>
                  {/* 앞면(카드 = ResultPage 스타일) */}
                  <div className="flip-face flip-front">
                    <div
                      className={`pf-card-media has-photo`}
                      style={{ ["--pf-bg"]: `url("${bg}")` }}
                    >
                      <div className="pf-media-overlay" />
                      <div className="pf-share-header">
                        <img className="pf-share-logo" src={logo} alt="짐마당" />
                        <div className="pf-share-date">{date}</div>
                      </div>

                      <div className="pf-stats-box">
                        <div className="pf-stat-row">
                          <span className="pf-stat-ico">🏋️</span>
                          <span className="pf-stat-value">
                            {Number(w.totalVolume || 0).toLocaleString("ko-KR")} kg
                          </span>
                        </div>
                        <div className="pf-stat-row">
                          <span className="pf-stat-ico">💪</span>
                          <span className="pf-stat-value">
                            {Number(w.exerciseCount || 0).toLocaleString("ko-KR")} 운동
                          </span>
                        </div>
                        <div className="pf-stat-row">
                          <span className="pf-stat-ico">🏆</span>
                          <span className="pf-stat-value">
                            {Number(w.totalSets || 0).toLocaleString("ko-KR")} 세트
                          </span>
                        </div>
                        <div className="pf-stat-row">
                          <span className="pf-stat-ico">🔥</span>
                          <span className="pf-stat-value">
                            {Number(w.totalCalories || 0).toLocaleString("ko-KR")} 칼로리
                          </span>
                        </div>
                      </div>

                      {/* 카드 하단 액션 */}
                      <div style={{
                        position: "absolute", left: 16, right: 16, bottom: 16,
                        display: "flex", gap: 8, zIndex: 1
                      }}>
                        <button
                          className="pf-btn pf-btn-primary"
                          style={{ flex: 1 }}
                          onClick={() => handleFlipToBack(w.workoutId)}
                        >
                          일지 보기
                        </button>
                        <button
                          className="pf-btn pf-btn-secondary"
                          style={{ flex: 1 }}
                          onClick={() => openDetail(w.workoutId)}
                        >
                          운동 상세보기
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* 뒷면(일지) */}
                  <div className="flip-face flip-back">
                    <div
                      className={`pf-card-media has-photo`}
                      style={{ ["--pf-bg"]: `url("${bg}")` }}
                    >
                      <div className="pf-media-overlay" />
                      <div className="pf-share-header">
                        <img className="pf-share-logo" src={logo} alt="짐마당" />
                        <div className="pf-share-date">{date}</div>
                      </div>

                      {/* 일지 내용 */}
                      <div style={{
                        position: "absolute",
                        left: 16, right: 16, top: 64, bottom: 72,
                        zIndex: 1,
                        background: "rgba(255,255,255,.18)",
                        backdropFilter: "blur(4px)",
                        borderRadius: 16,
                        padding: 12,
                        color: "#fff",
                        overflow: "auto",
                        whiteSpace: "pre-wrap",
                        lineHeight: 1.5,
                        fontWeight: 700
                      }}>
                        {log.memo ? log.memo : "작성된 일지가 없소."}
                      </div>

                      <div style={{
                        position: "absolute", left: 16, right: 16, bottom: 16,
                        display: "flex", gap: 8, zIndex: 1
                      }}>
                        <button
                          className="pf-btn pf-btn-secondary"
                          style={{ flex: 1 }}
                          onClick={() => handleFlipToFront(w.workoutId)}
                        >
                          앞면으로
                        </button>
                        <button
                          className="pf-btn pf-btn-primary"
                          style={{ flex: 1 }}
                          onClick={() => openDetail(w.workoutId)}
                        >
                          운동 상세보기
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 상세 모달 */}
      <WorkoutDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        rows={detailRows}
      />
    </div>
  );
}
