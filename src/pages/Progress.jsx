import { toYmd, parseYmd, fmtDayMonth } from '../logic/dates.js'
import { DAY_NAMES, FEEDBACK as FEEDBACK_LIST } from '../data/labels.js'

const FEEDBACK = Object.fromEntries(
  FEEDBACK_LIST.map((f, i) => [f.value, [f.label, ['bg-sky-100 text-sky-700', 'bg-green-100 text-green-700', 'bg-orange-100 text-orange-700'][i]]]),
)
const dayLabel = (ymd) => {
  const d = parseYmd(ymd)
  return `${DAY_NAMES[(d.getDay() + 6) % 7]} · ${fmtDayMonth(d)}`
}
const fmtTotalTime = (min) => {
  const h = Math.floor(min / 60)
  const m = min % 60
  return h ? `${h} giờ ${m} phút` : `${m} phút`
}

const card = 'rounded-2xl border border-gray-200 bg-white p-4'
const primaryBtn = 'rounded-xl bg-green-500 px-5 py-3 font-semibold text-white hover:bg-green-600'

function Stat({ label, value, sub }) {
  return (
    <div className={card}>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="mt-1 text-2xl font-bold">{value}</p>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  )
}

export default function Progress() {
  const [logs] = useLocalStorage('logs', [])
  const [weights, setWeights] = useLocalStorage('weights', [])
  const [profile] = useLocalStorage('profile', null)

  const todayYmd = toYmd(new Date())
  const [weightInput, setWeightInput] = useState('')
  const [dateInput, setDateInput] = useState(todayYmd)
  const [weightError, setWeightError] = useState('')
  const [mode, setMode] = useState('sessions')
  const [showAll, setShowAll] = useState(false)

  const goal = profile?.daysPerWeek ?? 3
  const stats = computeStreaks(logs, goal, todayYmd)
  const badges = evaluateBadges(stats)
  const earned = badges.filter((b) => b.earned).length
  const series = weeklySeries(logs, todayYmd, 8)
  const change = weightChange(weights)
  const sortedLogs = [...logs].sort((a, b) => String(b.completedAt).localeCompare(String(a.completedAt)))
  const shownLogs = showAll ? sortedLogs : sortedLogs.slice(0, 10)

  function saveWeight(e) {
    e.preventDefault()
    const err = validateWeight(weightInput)
    if (err) return setWeightError(err)
    if (!dateInput || dateInput > todayYmd) return setWeightError('Hãy chọn một ngày không nằm trong tương lai.')
    setWeightError('')
    setWeights(upsertWeight(weights, dateInput, weightInput))
    setWeightInput('')
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Tiến độ</h1>

      {/* Tổng quan */}
      <section className="space-y-3">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          <Stat label="Chuỗi hiện tại" value={`${stats.current} tuần`} sub="liên tiếp đạt mục tiêu" />
          <Stat label="Tuần này" value={`${stats.thisWeek.count}/${stats.thisWeek.goal} buổi`} sub={stats.thisWeek.met ? 'Đã đạt mục tiêu!' : 'Cố lên nhé'} />
          <Stat label="Chuỗi dài nhất" value={`${stats.longest} tuần`} />
          <Stat label="Tổng cộng" value={`${stats.totalSessions} buổi`} sub={fmtTotalTime(stats.totalMinutes)} />
        </div>
        <p className="text-xs text-gray-500">
          Chuỗi tuần là số tuần liên tiếp (thứ Hai đến Chủ nhật) bạn tập đủ {goal} buổi. Buổi làm dưới một nửa số bài
          không tính vào số buổi và chuỗi (thời gian tập vẫn được cộng).
        </p>
      </section>

      {/* Huy hiệu */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Huy hiệu ({earned}/{badges.length})</h2>
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {badges.map((b) => (
            <li key={b.id} className={`${card} text-center ${b.earned ? 'border-green-300 bg-green-50' : 'opacity-70'}`} data-earned={b.earned}>
              <p className={`text-3xl ${b.earned ? '' : 'grayscale'}`} aria-hidden="true">{b.icon}</p>
              <p className="mt-1 text-sm font-bold">{b.title}</p>
              <p className="text-xs text-gray-500">{b.desc}</p>
              <p className={`mt-2 text-xs font-semibold ${b.earned ? 'text-green-700' : 'text-gray-500'}`}>
                {b.earned ? 'Đã mở khoá ✓' : `${b.current}/${b.value}`}
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* Số buổi / phút mỗi tuần */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold">8 tuần gần nhất</h2>
          <div className="flex gap-1 rounded-lg bg-gray-100 p-1 text-sm">
            {[['sessions', 'Số buổi'], ['minutes', 'Số phút']].map(([v, l]) => (
              <button key={v} type="button" aria-pressed={mode === v} onClick={() => setMode(v)}
                className={`rounded-md px-3 py-1 ${mode === v ? 'bg-white font-semibold shadow-sm' : 'text-gray-600'}`}>
                {l}
              </button>
            ))}
          </div>
        </div>
        {logs.length ? (
          <div className={card}>
            <WeeklyChart series={series} mode={mode} goal={goal} />
            {mode === 'sessions' && <p className="mt-2 text-xs text-gray-500">Cột xanh đậm là tuần đạt mục tiêu {goal} buổi.</p>}
          </div>
        ) : (
          <div className={`${card} text-center text-sm text-gray-600`}>
            <p>Chưa có buổi tập nào. Hoàn thành buổi đầu tiên để xem biểu đồ.</p>
            <Link to="/workout" className={`${primaryBtn} mt-3 inline-block`}>Đi tập ngay</Link>
          </div>
        )}
      </section>

      {/* Cân nặng */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Cân nặng</h2>
        <form onSubmit={saveWeight} noValidate className={`${card} space-y-3`}>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="weight" className="mb-1 block text-sm font-medium text-gray-700">Cân nặng (kg)</label>
              <input id="weight" type="number" inputMode="decimal" step="0.1" value={weightInput}
                onChange={(e) => setWeightInput(e.target.value)}
                placeholder={String(weights[weights.length - 1]?.kg ?? profile?.weightKg ?? 60)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200" />
            </div>
            <div>
              <label htmlFor="wdate" className="mb-1 block text-sm font-medium text-gray-700">Ngày</label>
              <input id="wdate" type="date" value={dateInput} max={todayYmd} onChange={(e) => setDateInput(e.target.value)}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200" />
            </div>
          </div>
          {weightError && <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{weightError}</p>}
          <button type="submit" className={`${primaryBtn} w-full`}>Lưu cân nặng</button>
          <p className="text-xs text-gray-500">
            Cân nặng dao động vài trăm gram mỗi ngày là bình thường. Nên cân vào cùng một thời điểm, chỉ cần 1 đến 2 lần mỗi tuần.
          </p>
        </form>

        {weights.length ? (
          <div className={card}>
            <WeightChart weights={weights} />
            {change && (
              <p className="mt-2 text-sm text-gray-700">
                Từ {change.from} kg đến {change.to} kg ({change.diff > 0 ? '+' : ''}{change.diff} kg).
              </p>
            )}
            <details className="mt-3 text-sm">
              <summary className="cursor-pointer text-gray-600">Lịch sử cân nặng</summary>
              <ul className="mt-2 divide-y divide-gray-100">
                {[...weights].reverse().map((w) => (
                  <li key={w.date} className="flex items-center justify-between py-2">
                    <span>{dayLabel(w.date)}: <b>{w.kg} kg</b></span>
                    <button type="button" onClick={() => setWeights(removeWeight(weights, w.date))}
                      aria-label={`Xoá cân nặng ngày ${w.date}`} className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100">
                      Xoá
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          </div>
        ) : (
          <p className="text-sm text-gray-500">Chưa có số cân nào. Nhập số đầu tiên để bắt đầu theo dõi.</p>
        )}
      </section>

      {/* Nhật ký */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Nhật ký tập luyện</h2>
        {sortedLogs.length === 0 ? (
          <p className="text-sm text-gray-500">Nhật ký sẽ hiện ở đây sau buổi tập đầu tiên.</p>
        ) : (
          <>
            <ul className="space-y-2">
              {shownLogs.map((l) => {
                const [fbLabel, fbColor] = FEEDBACK[l.feedback] ?? ['', '']
                return (
                  <li key={l.id} className={card}>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{dayLabel(l.doneDate)}</p>
                        <p className="text-sm text-gray-600">
                          {l.completedCount}/{l.total} bài · {l.actualMinutes} phút
                          {!isQualifying(l) && <span className="ml-2 rounded bg-gray-100 px-1.5 py-0.5 text-xs text-gray-600">Làm dở</span>}
                        </p>
                      </div>
                      {fbLabel && <span className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${fbColor}`}>{fbLabel}</span>}
                    </div>
                    {l.note && <p className="mt-2 text-sm text-gray-600">&ldquo;{l.note}&rdquo;</p>}
                  </li>
                )
              })}
            </ul>
            {sortedLogs.length > 10 && (
              <button type="button" onClick={() => setShowAll(!showAll)} className="text-sm text-green-700 underline">
                {showAll ? 'Thu gọn' : `Xem tất cả ${sortedLogs.length} buổi`}
              </button>
            )}
          </>
        )}
      </section>
    </div>
  )
}