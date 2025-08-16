import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import * as htmlToImage from "html-to-image";
import "../styles/ResultPage.css";
import useRoutineService from "../service/routineService";
import WorkoutLogModal from "./WorkoutLogModal.jsx";
import logo from "../../../assets/img/gymmadang_logo_kr.svg";
import gibon from "../../../assets/img/routine/r_gym.png";
import sharebtn from "../../../assets/img/share2.png";
import camerabtn from "../../../assets/img/camera2.png";

export default function ResultPage() {
  const { getActualWorkout, upsertWorkoutLogExtras, getWorkoutLog } =
    useRoutineService();
  const { workoutId } = useParams();
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [logExtras, setLogExtras] = useState({ memo: "", pictureUrl: "" });
  const [workoutList, setWorkoutList] = useState([]);
  const [openMenu, setOpenMenu] = useState(null); // 'camera' | 'share' | null

  const leftMenuRef = useRef(null); // 카메라 드롭다운 래퍼
  const rightMenuRef = useRef(null); // 공유 드롭다운 래퍼

  const cameraInputRef = useRef(null); // 사진 찍기
  const galleryInputRef = useRef(null); // 사진 선택
  const fileInputRef = useRef(null);
  const cardRef = useRef(null);

  const photoUrl = useMemo(() => {
    const raw = (logExtras.pictureUrl || "").trim();
    if (!raw) return "";
    if (/^https?:\/\//i.test(raw)) return raw;
    const withSlash = raw.startsWith("/") ? raw : `/${raw}`;
    const normalized = withSlash.startsWith("/uploadFiles/")
      ? withSlash
      : `/uploadFiles${withSlash}`;
    return `http://localhost:8080${normalized}`;
  }, [logExtras.pictureUrl]);

  const bgUrl = useMemo(() => photoUrl || gibon, [photoUrl]);
  useEffect(() => {
    const onDocPointerDown = (e) => {
      // 메뉴 영역 바깥 클릭이면 닫기
      if (
        leftMenuRef.current?.contains(e.target) ||
        rightMenuRef.current?.contains(e.target)
      )
        return;
      setOpenMenu(null);
    };
    const onEsc = (e) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    window.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("pointerdown", onDocPointerDown);
      window.removeEventListener("keydown", onEsc);
    };
  }, []);

  useEffect(() => {
    if (!workoutId) return;
    const controller = new AbortController();
    (async () => {
      try {
        const res = await getActualWorkout(workoutId, {
          signal: controller.signal,
        });
        const d = res?.data ?? res;
        const list = Array.isArray(d) ? d : d.list ?? d.items ?? d.data ?? [];
        setWorkoutList(list);
      } catch (e) {
        if (e.name !== "CanceledError" && e.name !== "AbortError")
          console.error(e);
      }
    })();
    return () => controller.abort();
  }, [workoutId, getActualWorkout]);

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
      } catch {}
    })();
  }, [workoutId, getWorkoutLog]);

  // 저장 핸들러 교체
  async function handleSavePhoto() {
    if (!cardRef.current) return;
    try {
      const blob = await htmlToImage.toBlob(cardRef.current, {
        cacheBust: true,
        pixelRatio: Math.max(2, window.devicePixelRatio || 1), // 선명하게
        backgroundColor: "#ffffff", // 바탕 보정(투명 방지)
      });

      if (!blob) {
        alert("이미지 생성에 실패했소.");
        return;
      }

      // 공유 시트 지원되면 파일 공유, 아니면 다운로드
      const file = new File([blob], `gymmadang_${Date.now()}.png`, {
        type: "image/png",
      });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "짐마당",
          text: "금일 운동 완료",
        });
      } else {
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `gymmadang_${new Date().toISOString().slice(0, 10)}.png`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      }
    } catch (e) {
      console.error(e);
      alert("저장 중 문제가 생겼소.");
    } finally {
      setOpenMenu(null); // 드롭다운 닫기(네 상태명에 맞춰서)
    }
  }

  // 🖼 사진 선택(업로드)
  async function handlePickFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const { data } = await upsertWorkoutLogExtras(workoutId, {
        memo: logExtras.memo,
        file,
      });
      setLogExtras({
        memo: data.memo || "",
        pictureUrl: data.pictureUrl || "",
      });
    } catch (err) {
      console.error(err);
      alert("사진 업로드에 실패했소.");
    } finally {
      // 같은 파일 다시 선택 가능하도록 리셋
      e.target.value = "";
    }
  }
  async function handleSaveExtras({ memo, file }) {
    try {
      const { data } = await upsertWorkoutLogExtras(workoutId, { memo, file });
      setLogExtras({
        memo: data?.memo || "",
        pictureUrl: data?.pictureUrl || "",
      });
      setShowModal(false); // 저장 후 모달 닫기
    } catch (e) {
      console.error(e);
      alert("일지 저장 중 문제가 발생했소.");
    }
  }

  const exerciseCount = useMemo(() => {
    const keys = new Set(
      workoutList.map((w) => w.elementId ?? w.elementName ?? `#${w.detailId}`)
    );
    return keys.size;
  }, [workoutList]);
  const totalSets = workoutList.length;
  const totalVolume = workoutList.reduce(
    (acc, w) => acc + (Number(w.kg) || 0) * (Number(w.reps) || 0),
    0
  );
  const totalCalories = Number((workoutList[0] ?? {}).calories ?? 0);

  return (
    <>
      <div className="divider-line"></div>
      <div className="pf-page">
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment" // 후면 카메라 힌트 (iOS/Android 대부분 지원)
          hidden
          onChange={handlePickFile}
        />
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handlePickFile}
        />

        {/* 히어로: 좌 카메라(드롭다운) / 가운데 타이틀 / 우 공유(드롭다운) */}
        <div className="pf-hero-row3">
          {/* CENTER: 타이틀 */}
          <div className="pf-hero-title center">금일 운동 완료</div>
          {/* LEFT: 카메라 */}
          <div className="pf-hero-left" ref={leftMenuRef}>
            <button
              className="pf-share-trigger"
              onClick={() =>
                setOpenMenu((m) => (m === "camera" ? null : "camera"))
              }
              aria-haspopup="menu"
              aria-expanded={openMenu === "camera"}
              aria-label="사진 추가"
              title="사진 추가"
            >
              <img src={camerabtn} alt="카메라" />
            </button>
            {openMenu === "camera" && (
              <div className="pf-share-menu" role="menu">
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenMenu(null);
                    cameraInputRef.current?.click();
                  }}
                >
                  사진 찍기
                </button>
                <button
                  role="menuitem"
                  onClick={() => {
                    setOpenMenu(null);
                    galleryInputRef.current?.click();
                  }}
                >
                  사진 선택
                </button>
              </div>
            )}
          </div>

          {/* RIGHT: 공유 */}
          {/* <div className="pf-hero-right" ref={rightMenuRef}>
            <button
              className="pf-share-trigger"
              onClick={() =>
                setOpenMenu((m) => (m === "share" ? null : "share"))
              }
              aria-haspopup="menu"
              aria-expanded={openMenu === "share"}
              aria-label="공유/저장"
              title="공유/저장"
            >
              <img src={sharebtn} alt="공유" />
            </button>
            {openMenu === "share" && (
              <div className="pf-share-menu" role="menu">
                <button role="menuitem" onClick={handleSavePhoto}>
                  사진 저장하기
                </button>
              </div>
            )}
          </div> */}
        </div>

        {/* 메인 카드 */}
        <div
          ref={cardRef}
          className={`pf-card-media ${bgUrl ? "has-photo" : ""}`}
          style={{ ["--pf-bg"]: `url("${bgUrl}")` }}
        >
          <div className="pf-media-overlay" />
          <div className="pf-share-header">
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

          {/* 좌하단 요약 */}
          <div className="pf-stats-box">
            <div className="pf-stat-row">
              <span className="pf-stat-ico">🏋️</span>
              <span className="pf-stat-value">
                {totalVolume.toLocaleString("ko-KR")} kg
              </span>
            </div>
            <div className="pf-stat-row">
              <span className="pf-stat-ico">💪</span>
              <span className="pf-stat-value">{exerciseCount} 운동</span>
            </div>
            <div className="pf-stat-row">
              <span className="pf-stat-ico">🏆</span>
              <span className="pf-stat-value">{totalSets} 세트</span>
            </div>
            <div className="pf-stat-row">
              <span className="pf-stat-ico">🔥</span>
              <span className="pf-stat-value">
                {totalCalories.toLocaleString("ko-KR")} 칼로리
              </span>
            </div>
          </div>
        </div>

        {/* 사진 선택 버튼 */}
        {/* <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={handlePickFile}
        />
        <div className="pf-photo-picker">
          <button
            className="pf-btn pf-btn-file"
            onClick={() => fileInputRef.current?.click()}
          >
            사진을 선택하겠소
          </button>
        </div> */}

        {/* 일지/기록 2버튼 가로 배치 */}
        <div className="pf-cta-row">
          <button
            className="pf-btn pf-btn-primary"
            onClick={() => setShowModal(true)}
          >
            일지를 작성하겠소
          </button>
          <button
            className="pf-btn pf-btn-secondary"
            onClick={() => navigate("/routineCalendar")}
          >
            기록을 보러가겠소
          </button>
        </div>

        {/* 일지 모달 */}
        <WorkoutLogModal
          open={showModal}
          onClose={() => setShowModal(false)}
          onSave={handleSaveExtras} // ✅ 수정 포인트
          initialMemo={logExtras.memo}
          initialPreview={photoUrl}
        />
      </div>
    </>
  );
}
