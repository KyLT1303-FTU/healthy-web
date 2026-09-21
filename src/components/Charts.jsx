import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler,
} from 'chart.js'
import { parseYmd, fmtDayMonth } from '../logic/dates.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Tooltip, Filler)

const GREEN = '#22c55e'
const GREEN_LIGHT = '#bbf7d0'

/** Biểu đường: cân nặng theo thời gian. weights = [{date:'YYYY-MM-DD', kg}] đã sắp theo ngày. */
export function WeightChart({ weights }) {
  const multiYear = new Set(weights.map((w) => w.date.slice(0, 4))).size > 1
  const labels = weights.map((w) => {
    const base = fmtDayMonth(parseYmd(w.date))
    return multiYear ? `${base}/${w.date.slice(2, 4)}` : base
  })
  const data = {
    labels,
    datasets: [{
      label: 'Cân nặng (kg)',
      data: weights.map((w) => w.kg),
      borderColor: GREEN,
      backgroundColor: 'rgba(34, 197, 94, 0.15)',
      fill: true,
      tension: 0.3,
      pointRadius: 4,
    }],
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { ticks: { callback: (v) => `${v} kg` } } },
  }
  return (
    <div className="h-56">
      <Line data={data} options={options} role="img" aria-label="Biểu đồ cân nặng theo thời gian" />
    </div>
  )
}

/**
 * Biểu đồ cột: số buổi hoặc số phút mỗi tuần.
 * series = [{label, sessions, minutes}] (cũ → mới). mode = 'sessions' | 'minutes'.
 * Ở chế độ số buổi, cột đạt mục tiêu có màu xanh đậm.
 */
export function WeeklyChart({ series, mode, goal }) {
  const isSessions = mode === 'sessions'
  const values = series.map((s) => (isSessions ? s.sessions : s.minutes))
  const data = {
    labels: series.map((s) => s.label),
    datasets: [{
      label: isSessions ? 'Số buổi' : 'Số phút',
      data: values,
      backgroundColor: isSessions ? values.map((v) => (v >= goal ? GREEN : GREEN_LIGHT)) : GREEN,
      borderRadius: 6,
    }],
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
  }
  return (
    <div className="h-56">
      <Bar data={data} options={options} role="img" aria-label={isSessions ? 'Biểu đồ số buổi tập mỗi tuần' : 'Biểu đồ số phút tập mỗi tuần'} />
    </div>
  )
}