import { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import useRoutineService from "../service/routineService";
import "../styles/ResultPage.css";
import "../styles/DiaryPage.css";
import gibon from "../../../assets/img/routine/r_gym.png";
import logo from "../../../assets/img/gymmadang_logo_kr.svg";
import WorkoutDetailModal from "./WorkoutDetailModal";

// YYYY-MM-DD
const toLocalYYYYMMDD = (d) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};
// 문자열 YYYY-MM-DD → Date
const ymdToDate = (s) => {
  const [y, m, d] = (s || "").split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
};
// 날짜 + n일 이동
const shiftYMD = (s, delta) => {
  const dt = ymdToDate(s);
  dt.setDate(dt.getDate() + delta);
  return toLocalYYYYMMDD(dt);
};

// 업로드 사진 경로 정규화
const normalizePic = (raw) => {
  const s = (raw || "").trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  const withSlash = s.startsWith("/") ? s : `/${s}`;
  const normalized = withSlash.startsWith("/uploadFiles/")
    ? withSlash
    : `/uploadFiles${withSlash}`;
  return `http://localhost:8080${normalized}`;
};

export default function DiaryPage() {
  const navigate = useNavigate();

  const [sp, setSp] = useSearchParams();
  const date = sp.get("date") || toLocalYYYYMMDD(new Date());
  const id = useSelector((s) => s.auth.id);

  const { getWorkoutsByDate, getActualWorkout } = useRoutineService();

  // 여러 카드
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 앞/뒤
  const [flipped, setFlipped] = useState({});

  // 상세 모달
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailRows, setDetailRows] = useState([]);

  const dateTitle = useMemo(() => `${date} 운동`, [date]);

  const dateInputRef = useRef(null);
  const openPicker = () => {
    const el = dateInputRef.current;
    if (!el) return;
    if (el.showPicker) el.showPicker(); // 크롬/신규
    else el.click(); // 사파리 등
  };
  const onPickDate = (e) => {
    const v = e.target.value || toLocalYYYYMMDD(new Date());
    setSp({ date: v });
  };
  const goPrev = () => setSp({ date: shiftYMD(date, -1) });
  const goNext = () => setSp({ date: shiftYMD(date, +1) });

  // 날짜별 카드 목록
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!id) return;
      setLoading(true);
      try {
        const res = await getWorkoutsByDate(id, date);
        const arr = Array.isArray(res?.data) ? res.data : res?.data?.list ?? [];
        const mapped = arr
          .map((x) => ({
            workoutId: x.workoutId ?? x.id ?? x.workout_id,
            totalSets: Number(x.totalSets ?? x.setCount ?? x.sets ?? 0),
            exerciseCount: Number(x.exerciseCount ?? x.workoutCount ?? 0),
            totalVolume: Number(x.totalVolume ?? x.volume ?? 0),
            totalCalories: Number(x.calories ?? x.kcal ?? 0),
            memo: x.memo ?? "",
            pictureUrl: normalizePic(x.pictureUrl),
            startedAt: x.startedAt ?? x.createdAt ?? x.startTime ?? null,
          }))
          .filter((x) => x.workoutId);

        mapped.sort((a, b) => {
          const ta = a.startedAt ? new Date(a.startedAt).getTime() : 0;
          const tb = b.startedAt ? new Date(b.startedAt).getTime() : 0;
          if (ta !== tb) return ta - tb;
          return String(a.workoutId).localeCompare(String(b.workoutId));
        });

        if (alive) setWorkouts(mapped);
      } catch (e) {
        console.error("[DiaryPage] getWorkoutsByDate 실패:", e);
        if (alive) setWorkouts([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id, date, getWorkoutsByDate]);

  // 단순 뒤집기
  const flipToBack = (workoutId) =>
    setFlipped((p) => ({ ...p, [workoutId]: true }));
  const flipToFront = (workoutId) =>
    setFlipped((p) => ({ ...p, [workoutId]: false }));

  // 상세 모달
  const openDetail = async (workoutId) => {
    setDetailOpen(true);
    try {
      const res = await getActualWorkout(workoutId);
      const list = Array.isArray(res?.data)
        ? res.data
        : res?.data?.list ?? res?.data?.items ?? res?.data?.data ?? [];
      setDetailRows(list);
    } catch (e) {
      console.error("상세 조회 실패:", e);
      setDetailRows([]);
    }
  };

  return (
    <div className="pf-page" style={{ paddingTop: 12 }}>
      <div className="pf-date-nav">
        <button className="pf-icon-btn" onClick={goPrev} aria-label="이전 날짜">
          ‹
        </button>

        <button
          className="pf-date-pill-btn"
          onClick={() => navigate("/routineCalendar")}
          aria-label="날짜 선택"
        >
          {date}
          <span className="pf-cal-emoji" role="img" aria-label="calendar">
            📅
          </span>
        </button>

        <button className="pf-icon-btn" onClick={goNext} aria-label="다음 날짜">
          ›
        </button>

        {/* 실제 달력 input (숨김) */}
        <input
          ref={dateInputRef}
          type="date"
          value={date}
          onChange={onPickDate}
          className="pf-date-input"
        />
      </div>

      <div className="pf-hero-row" style={{ marginTop: 0 }}>
        {/* <div className="pf-hero-title">{dateTitle}</div> */}
      </div>

      {loading ? (
        <div style={{ padding: 16 }}>불러오는 중…</div>
      ) : workouts.length === 0 ? (
        <div style={{ padding: 16 }}>이 날짜의 운동 기록이 없소.</div>
      ) : (
        <div style={{ width: "100%", maxWidth: 520, display: "grid", gap: 20 }}>
          {workouts.map((w, idx) => {
            const n = idx + 1;
            const bg = w.pictureUrl || gibon;
            const isBack = !!flipped[w.workoutId];

            return (
              <section key={w.workoutId} className="diary-section">
                {/* 운동 n 라벨 */}
                <div className="pf-chip">운동 {n}</div>

                {/* 카드(앞/뒤 플립) */}
                <div className="flip">
                  <div className={`flip-inner ${isBack ? "is-flipped" : ""}`}>
                    {/* 앞면 */}
                    <div className="flip-face flip-front">
                      <div
                        className="pf-card-media has-photo"
                        style={{ ["--pf-bg"]: `url("${bg}")` }}
                      >
                        <div className="pf-media-overlay" />
                        <div className="pf-share-header">
                          <img
                            className="pf-share-logo"
                            src={logo}
                            alt="짐마당"
                          />
                          <div className="pf-share-date">{date}</div>
                        </div>

                        <div className="pf-stats-box">
                          <div className="pf-stat-row">
                            <span className="pf-stat-ico">🏋️</span>
                            <span className="pf-stat-value">
                              {w.totalVolume.toLocaleString("ko-KR")} kg
                            </span>
                          </div>
                          <div className="pf-stat-row">
                            <span className="pf-stat-ico">💪</span>
                            <span className="pf-stat-value">
                              {w.exerciseCount.toLocaleString("ko-KR")} 운동
                            </span>
                          </div>
                          <div className="pf-stat-row">
                            <span className="pf-stat-ico">🏆</span>
                            <span className="pf-stat-value">
                              {w.totalSets.toLocaleString("ko-KR")} 세트
                            </span>
                          </div>
                          <div className="pf-stat-row">
                            <span className="pf-stat-ico">🔥</span>
                            <span className="pf-stat-value">
                              {w.totalCalories.toLocaleString("ko-KR")} 칼로리
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 뒷면(일지) */}
                    {/* 뒷면(일지) */}
                    <div className="flip-face flip-back">
                      <div
                        className="pf-card-media has-photo"
                        style={{ ["--pf-bg"]: `url("${bg}")` }}
                      >
                        <div className="pf-media-overlay" />
                        <div className="pf-share-header">
                          <img
                            className="pf-share-logo"
                            src={logo}
                            alt="짐마당"
                          />
                          <div className="pf-share-date">{date}</div>
                        </div>

                        {/* 👇 새 유리 카드 */}
                        <div className="pf-memo">
                          <div className="pf-memo__text">
                            {w.memo ? w.memo : "작성된 일지가 없소."}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* ✅ 카드 바깥 버튼 2개 */}
                <div className="dp-cta-row dp-cta-row--diary">
                  <button
                    className="dp-btn dp-btn-primary"
                    onClick={() =>
                      isBack
                        ? flipToFront(w.workoutId)
                        : flipToBack(w.workoutId)
                    }
                  >
                    {isBack ? "앞면으로" : "일지 보기"}
                  </button>
                  <button
                    className="dp-btn dp-btn-secondary"
                    onClick={() => openDetail(w.workoutId)}
                  >
                    운동 상세보기
                  </button>
                </div>

                {/* 구분선 */}
                {/* <hr className="pf-divider" /> */}
              </section>
            );
          })}
        </div>
      )}

      <WorkoutDetailModal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        rows={detailRows}
      />
    </div>
  );
}
