// src/components/DailyCompletionLineChart.jsx
import React, { useMemo } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';

import '../styles/DailyCompletionLineChart.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
  Legend
);

// ✅ 앱의 기본 폰트를 그대로 사용
const APP_FONT =
   typeof window !== 'undefined'
     ? getComputedStyle(document.body).fontFamily
     : '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif';
 ChartJS.defaults.font.family = APP_FONT;
 ChartJS.defaults.color = '#f2f2f2'; //(선택) 기본 글자색 톤 통일

const DAYS_TO_SHOW = 60;

export default function DailyCompletionLineChart({ myChallengeList = [] }) {
  const chartData = useMemo(() => {
    const dailyCounts = new Map();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    (myChallengeList || []).forEach((ch) => {
      ch.daysAttendedList?.forEach((dateStr) => {
        const d = new Date(dateStr);
        d.setHours(0, 0, 0, 0);
        const key = d.toISOString().split('T')[0];
        dailyCounts.set(key, (dailyCounts.get(key) || 0) + 1);
      });
    });

    const labels = [];
    const data = [];
    const todayMillis = today.getTime();

    for (let i = DAYS_TO_SHOW - 1; i >= 0; i--) {
      const date = new Date(todayMillis);
      date.setDate(today.getDate() - i);
      const key = date.toISOString().split('T')[0];

      labels.push(`${date.getDate()}`);
      data.push(dailyCounts.get(key) || 0);
    }
    return { labels, data };
  }, [myChallengeList]);

  const totalCompletions = chartData.data.reduce((s, n) => s + n, 0);
  if (totalCompletions === 0) return null;

  // y축 상한을 예쁘게 보정
  const yMax = useMemo(() => {
    const max = Math.max(...chartData.data);
    if (max <= 5) return 6;
    const k = Math.ceil(max / 2);
    return k * 2; // 짝수로 맞춤
  }, [chartData.data]);

  // ✅ 라인 + 영역 그라데이션 (Chart.js에서 함수로 생성)
  const dataForChart = useMemo(() => {
    return {
      labels: chartData.labels,
      datasets: [
        {
          label: '인증 횟수',
          data: chartData.data,
          borderColor: '#7c1d0d',
          borderWidth: 2,
          tension: 0.35,                // 부드러운 곡선
          pointRadius: 0,               // 원형 점 제거
          pointHoverRadius: 5,          // hover 시만 살짝 강조
          hitRadius: 10,                // 터치/호버 판정 완화
          fill: true,
          backgroundColor: (ctx) => {
            const { chart } = ctx;
            const { ctx: c, chartArea } = chart;
            if (!chartArea) return null; // 초기 레이아웃 전에는 null
            const gradient = c.createLinearGradient(
              0,
              chartArea.top,
              0,
              chartArea.bottom
            );
            gradient.addColorStop(0, 'rgba(124, 29, 13, 0.25)'); // 위쪽 진하게
            gradient.addColorStop(1, 'rgba(124, 29, 13, 0.02)'); // 아래쪽 옅게
            return gradient;
          },
        },
      ],
    };
  }, [chartData]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    layout: { padding: { top: 6, right: 8, bottom: 0, left: 12 } },
    plugins: {
      legend: { display: false },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#ffffff',
        borderColor: '#e9edf2',
        borderWidth: 1,
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        displayColors: false,
        padding: 10,
        callbacks: {
          title: (items) => (items[0]?.label ?? ''),
          label: (item) => `인증 ${item.formattedValue}회`,
        },
      },
    },
    elements: {
      line: { capBezierPoints: true },
      point: { borderWidth: 0 },
    },
    scales: {
      x: {
        ticks: {
          maxTicksLimit: 10,
          color: '#8a95a1',
          font: { size: 11, weight: '600', family: APP_FONT },
          padding: 6,                   // x축 라벨 ↕ 간격(가독성)
        },
        grid: { display: false },
        border: { color: 'rgba(0,0,0,0.06)' },
        offset: true,       // 좌우 여백 추가 (tick을 안쪽으로)
        grace: 0.5,         // (선택) 데이터 영역 끝에도 여유 공간
      },
      y: {
        beginAtZero: true,
        suggestedMax: yMax,
        ticks: {
          stepSize: 1,
          color: '#8a95a1',
          font: { size: 11, weight: '600', family: APP_FONT },
          padding: 14,
          crossAlign: 'far',           // ← (v4) y라벨을 축에서 더 멀리
          callback: (v) => `${v}`,
        },
        grid: {
          color: 'rgba(0,0,0,0.06)',
          borderDash: [4, 3],          // 점선 그리드
          drawTicks: false,
        },
        border: { display: false },
        title: { display: false },
      },
    },
  }), [yMax]);

  return (
    <section className="cmrl-new-section">
      <div className="cmrl-new-section-head">
        <h4>일별 인증 횟수</h4>
      </div>

      <div className="cmrl-new-card daily-line-chart-card">
        <div className="daily-line-chart-wrapper">
          <Line data={dataForChart} options={options} />
        </div>
      </div>
    </section>
  );
}
