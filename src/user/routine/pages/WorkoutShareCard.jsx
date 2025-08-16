import { useEffect, useMemo, useRef, useState } from "react";
import '../styles/WorkoutShareCard.css';

export default function WorkoutShareCard({ workoutList, brand = "짐마당" }) {
  const [bgUrl, setBgUrl] = useState(null);
  const canvasRef = useRef(null);

  // 날짜(우상단)
  const dateLabel = useMemo(() => {
    const d = new Date();
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getDate()).padStart(2, "0")}.`;
  }, []);

  // 운동명 별 세트수 집계 (최대 5줄만 노출)
  const items = useMemo(() => {
    const map = new Map();
    for (const w of workoutList || []) {
      const name = w.elementName ?? "(이름없음)";
      map.set(name, (map.get(name) || 0) + 1);
    }
    return Array.from(map.entries()).map(([name, count]) => ({ name, count })).slice(0, 5);
  }, [workoutList]);

  useEffect(() => {
    draw();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgUrl, items, dateLabel, brand]);

  const onPick = (e) => {
    const f = e.target.files?.[0];
    if (f) setBgUrl(URL.createObjectURL(f));
  };

  const save = () => {
    const c = canvasRef.current;
    const a = document.createElement("a");
    a.download = "workout-card.png";
    a.href = c.toDataURL("image/png");
    a.click();
  };

  async function draw() {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const W = 1080, H = 1350; // 인스타/카톡 공유용 세로 비율
    canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d");

    // 1) 배경 이미지 (cover)
    if (bgUrl) {
      const img = await loadImage(bgUrl);
      drawCover(ctx, img, W, H);
    } else {
      // 기본 배경 (이미지 없을 때)
      const g = ctx.createLinearGradient(0, 0, W, H);
      g.addColorStop(0, "#2b2d31");
      g.addColorStop(1, "#3d4348");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    }

    // 2) 가독성용 비네팅/그라데이션
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, "rgba(0,0,0,0.10)");
    grad.addColorStop(1, "rgba(0,0,0,0.45)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // 공통 텍스트 스타일
    ctx.textBaseline = "alphabetic";
    ctx.shadowColor = "rgba(0,0,0,0.25)";
    ctx.shadowBlur = 8;

    // 3) 좌상단 브랜드, 우상단 날짜
    ctx.fillStyle = "#fff";
    ctx.font = "900 72px system-ui, Apple SD Gothic Neo, Pretendard, sans-serif";
    ctx.fillText(brand, 60, 110);

    ctx.textAlign = "right";
    ctx.font = "600 48px system-ui, Apple SD Gothic Neo, Pretendard, sans-serif";
    ctx.fillText(dateLabel, W - 60, 110);

    // 4) 하단 리스트
    ctx.textAlign = "left";
    const lineGap = 120;
    let y = H - (items.length * lineGap) - 80;
    y = Math.max(y, 320); // 너무 위로 붙지 않도록

    items.forEach(({ name, count }) => {
      const pillText = `${count} sets`;       // 원하면 '세트'로 바꿔도 OK
      const nameText = name;

      // 세트 뱃지(둥근 사각형)
      ctx.font = "700 44px system-ui, Pretendard, sans-serif";
      const padX = 28, padY = 18;
      const textW = ctx.measureText(pillText).width;
      const pillW = textW + padX * 2;
      const pillH = 68;

      roundRect(ctx, 60, y - 54, pillW, pillH, 34, "rgba(255,255,255,0.16)", "rgba(255,255,255,0.9)", 2);
      ctx.fillStyle = "#fff";
      ctx.fillText(pillText, 60 + padX, y - 54 + (pillH - padY));

      // 운동명
      ctx.font = "900 56px system-ui, Apple SD Gothic Neo, Pretendard, sans-serif";
      ctx.fillStyle = "#fff";
      ctx.fillText(nameText, 60 + pillW + 26, y);

      y += lineGap;
    });

    // 그림자 원상복구
    ctx.shadowBlur = 0;
  }

  return (
    <div className="share-wrap">
      <div className="share-toolbar">
        <label className="share-file">
          사진 선택
          <input type="file" accept="image/*" onChange={onPick} hidden />
        </label>
        <button className="share-save" onClick={save}>이미지 저장</button>
      </div>
      <canvas ref={canvasRef} className="share-canvas" />
    </div>
  );
}

/* utils */
function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

function drawCover(ctx, img, W, H) {
  const ir = img.width / img.height;
  const cr = W / H;
  let sx, sy, sw, sh;
  if (ir > cr) { // 이미지가 더 넓음 → 좌우 자르기
    sh = img.height; sw = sh * cr; sx = (img.width - sw) / 2; sy = 0;
  } else {       // 이미지가 더 세로김 → 상하 자르기
    sw = img.width; sh = sw / cr; sx = 0; sy = (img.height - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, W, H);
}

function roundRect(ctx, x, y, w, h, r, fill, stroke, sw = 1) {
  ctx.beginPath();
  const rr = Math.min(r, w / 2, h / 2);
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (stroke) { ctx.lineWidth = sw; ctx.strokeStyle = stroke; ctx.stroke(); }
}
