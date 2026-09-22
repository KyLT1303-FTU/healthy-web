import { useState } from 'react'
import { Link } from 'react-router-dom'
import useLocalStorage from '../store/useLocalStorage.js'
import TimerPanel from '../components/TimerPanel.jsx'
import { unlockAudio } from '../components/sound.js'
import exercises from '../data/exercises.js'
import { evaluateAdaptation } from '../logic/adaptive.js'
import { unsafeItems } from '../logic/today.js'
import { startTimer, countDone, countSetsDone, describeItem, buildLog, logsForAdaptation } from '../logic/workout.js'
import { toYmd, fmtDayMonth, parseYmd } from '../logic/dates.js'
import { DAY_NAMES, PHASES, TIERS, FEEDBACK } from '../data/labels.js'

const EX = Object.fromEntries(exercises.map((e) => [e.id, e]))

const primaryBtn = 'rounded-xl bg-green-500 px-5 py-3 font-semibold text-white hover:bg-green-600 disabled:cursor-not-allowed disabled:bg-gray-300'
const ghostBtn = 'rounded-xl border border-gray-300 bg-white px-5 py-3 text-gray-700 hover:bg-gray-100'

const sessionTitle = (s) => `${DAY_NAMES[s.dayOfWeek - 1]} ${fmtDayMonth(parseYmd(s.date))}`

function SafetyBanner() {
  return (
    <p className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
      Dừng ngay nếu bạn thấy đau nhói, chóng mặt, buồn nôn hoặc khó thở. Nội dung chỉ mang tính tham khảo.
    </p>
  )
}

function ExerciseDetails({ ex }) {
  const steps = ex?.steps ?? []
  const mistakes = ex?.commonMistakes ?? []
  const notes = ex?.safetyNotes ?? []
  return (
    <details className="mt-2 text-sm">
      <summary className="cursor-pointer text-gray-600">Cách thực hiện và lưu ý an toàn</summary>
      <div className="mt-2 space-y-2 text-gray-700">
        {steps.length ? (
          <ol className="list-decimal space-y-1 pl-5">
            {steps.map((s, i) => <li key={i}>{s}</li>)}
          </ol>
        ) : (
          <p className="text-gray-500">Chưa có hướng dẫn chi tiết cho bài này.</p>
        )}
        {mistakes.length > 0 && (
          <div>
            <p className="font-medium">Lỗi thường gặp</p>
            <ul className="list-disc pl-5">{mistakes.map((s, i) => <li key={i}>{s}</li>)}</ul>
          </div>
        )}
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-2 text-amber-900">
          {notes.map((s, i) => <p key={i}>{s}</p>)}
          <p>Dừng lại nếu thấy đau nhói, chóng mặt hoặc khó thở.</p>
        </div>
      </div>
    </details>
  )
}

// ---------- Màn hình chọn buổi tập ----------
function SessionPicker({ plan, logs, todayYmd, injuries, onStart }) {
  if (!plan) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Buổi tập</h1>
        <p className="text-gray-600">Bạn chưa có lịch tập. Hãy tạo lịch tuần trước.</p>
        <Link to="/schedule" className={`${primaryBtn} inline-block`}>Đến Lịch tuần</Link>
      </div>
    )
  }
  const todo = plan.sessions
    .filter((s) => !logs.some((l) => l.sessionDate === s.date))
    .sort((a, b) => a.date.localeCompare(b.date))
  const today = todo.find((s) => s.date === todayYmd)
  const others = todo.filter((s) => s !== today)

  // An toàn: hồ sơ có thể đã đổi (thêm chấn thương) SAU khi lịch này được tạo.
  // Buổi có bài không còn phù hợp thì không cho bắt đầu, chỉ cho tạo lại lịch.
  const card = (s, highlight) => {
    const bad = unsafeItems(s, injuries, exercises)
    return (
      <li key={s.date} className={`rounded-2xl border p-4 ${highlight ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'}`}>
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-bold">{sessionTitle(s)}{s.date < todayYmd ? ' (đã qua, tập bù được)' : ''}</p>
            <p className="text-sm text-gray-600">{s.startTime} · {s.minutes} phút · {TIERS[s.session.tier]}</p>
          </div>
          {bad.length === 0 && (
            <button type="button" onClick={() => onStart(s)} className={primaryBtn}>Bắt đầu</button>
          )}
        </div>
        {bad.length > 0 && (
          <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
            <p className="font-semibold">Hồ sơ của bạn đã thay đổi, buổi này cần được cập nhật.</p>
            <p className="mt-1">Có bài không còn phù hợp: {bad.join(', ')}.</p>
            <Link to="/schedule" className="mt-2 inline-block font-semibold underline">Tạo lại lịch</Link>
          </div>
        )}
      </li>
    )
  }

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-bold">Buổi tập</h1>
      {today ? (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500">Hôm nay</h2>
          <ul>{card(today, true)}</ul>
        </section>
      ) : (
        todo.length > 0 && <p className="text-gray-600">Hôm nay bạn không có buổi tập trong lịch.</p>
      )}
      {others.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-semibold text-gray-500">Các buổi khác trong lịch</h2>
          <ul className="space-y-2">{others.map((s) => card(s, false))}</ul>
        </section>
      )}
      {todo.length === 0 && (
        <p className="rounded-xl bg-green-50 p-4 text-green-800">Bạn đã hoàn thành hết các buổi trong lịch này. Tuyệt vời!</p>
      )}
      <Link to="/schedule" className="inline-block text-sm text-green-700 underline">Xem lịch tuần</Link>
    </div>
  )
}

// ---------- Màn hình kết quả sau khi lưu ----------
function DoneScreen({ result, onAnother }) {
  const { log, adaptation } = result
  const verdict = adaptation.delta > 0
    ? 'Buổi sau sẽ tăng nhẹ độ khó'
    : adaptation.delta < 0
      ? 'Buổi sau sẽ giảm nhẹ độ khó'
      : 'Giữ nguyên mức tập hiện tại'
  return (
    <div className="space-y-5">
      <div className="rounded-2xl bg-green-500 p-5 text-white">
        <p className="text-2xl font-bold">Hoàn thành buổi tập!</p>
        <p className="mt-1">
          {log.completedCount}/{log.total} bài · {log.actualMinutes} phút
        </p>
      </div>
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <p className="font-semibold">{verdict}</p>
        <p className="mt-1 text-sm text-gray-600">{adaptation.reason}</p>
        {adaptation.decision === 'hold' && adaptation.average === null && (
          <p className="mt-1 text-sm text-gray-500">Hệ thống cần thêm vài buổi phản hồi để điều chỉnh chính xác hơn.</p>
        )}
        {adaptation.delta !== 0 && (
          <p className="mt-2 text-sm text-gray-600">
            Vào <b>Lịch tuần</b> và bấm &quot;Tạo lại lịch&quot; để áp dụng mức tải mới.
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-3">
        <Link to="/schedule" className={`${primaryBtn} inline-block`}>Về lịch tuần</Link>
        <button type="button" onClick={onAnother} className={ghostBtn}>Tập buổi khác</button>
      </div>
    </div>
  )
}

// ---------- Trang chính ----------
export default function Workout() {
  const [profile] = useLocalStorage('profile', null)
  const [plan] = useLocalStorage('weekPlan', null)
  const [logs, setLogs] = useLocalStorage('logs', [])
  const [adapt, setAdapt] = useLocalStorage('adaptState', { step: 0, lastAdjustedLogId: null })
  const [active, setActive] = useLocalStorage('activeWorkout', null) // buổi đang tập dở (giữ lại khi tải lại trang)
  const [soundOn, setSoundOn] = useLocalStorage('soundOn', true)
  const [timer, setTimer] = useState(null)
  const [stage, setStage] = useState('work') // 'work' | 'feedback' | 'done'
  const [feedback, setFeedback] = useState('')
  const [note, setNote] = useState('')
  const [result, setResult] = useState(null)

  const todayYmd = toYmd(new Date())

  if (stage === 'done' && result) {
    return <DoneScreen result={result} onAnother={() => { setStage('work'); setResult(null) }} />
  }

  function startSession(s) {
    // Lưu bản sao của buổi tập: dù sau đó bạn tạo lại lịch, buổi đang tập vẫn giữ nguyên
    setActive({ date: s.date, startedAt: Date.now(), session: s, progress: {} })
    setTimer(null)
    setStage('work')
    setFeedback('')
    setNote('')
  }

  if (!active) {
        return <SessionPicker plan={plan} logs={logs} todayYmd={todayYmd} injuries={profile?.injuries} onStart={startSession} />

  const s = active.session
  const items = s.session.items
  const progress = active.progress
  const doneCount = countDone(items, progress)
  const setsDone = countSetsDone(progress)
  const percent = items.length ? Math.round((doneCount / items.length) * 100) : 0

  const setSets = (id, n) => setActive({ ...active, progress: { ...progress, [id]: n } })

  function startRest(item, doneSets) {
    setTimer(startTimer(Date.now(), item.restSec, {
      kind: 'rest',
      exerciseId: item.exerciseId,
      label: `Nghỉ sau hiệp ${doneSets}/${item.sets}: ${item.name}`,
    }))
  }

  function completeSet(item) {
    const done = progress[item.exerciseId] ?? 0
    if (done >= item.sets) return
    unlockAudio()
    setSets(item.exerciseId, done + 1)
    if (done + 1 < item.sets) startRest(item, done + 1)
    else setTimer(null)
  }

  function startWork(item) {
    const done = progress[item.exerciseId] ?? 0
    unlockAudio()
    setTimer(startTimer(Date.now(), item.durationSec, {
      kind: 'work',
      exerciseId: item.exerciseId,
      label: `${item.name}: hiệp ${done + 1}/${item.sets}`,
    }))
  }

  function toggleItem(item) {
    const isDone = (progress[item.exerciseId] ?? 0) >= item.sets
    setSets(item.exerciseId, isDone ? 0 : item.sets)
    if (timer && timer.exerciseId === item.exerciseId) setTimer(null)
  }

  // Hết giờ đếm ngược tập → tự tính là xong hiệp đó và chuyển sang nghỉ
  function handleTimerEnd(t) {
    if (t.kind !== 'work') return
    const item = items.find((i) => i.exerciseId === t.exerciseId)
    if (item) completeSet(item)
  }

  function skipTimer(t) {
    if (t.kind === 'work') handleTimerEnd(t)
    else setTimer(null)
  }

  function cancelWorkout() {
    if (window.confirm('Huỷ buổi tập đang làm dở? Tiến độ sẽ không được lưu.')) {
      setActive(null)
      setTimer(null)
    }
  }

  function saveWorkout() {
    const nowMs = Date.now()
    const log = buildLog({ session: s, progress, feedback, note, startedAtMs: active.startedAt, nowMs })
    const newLogs = [...logs, log]
    const adaptation = evaluateAdaptation(logsForAdaptation(newLogs), adapt)
    setLogs(newLogs)
    setAdapt(adaptation.state)
    setActive(null)
    setTimer(null)
    setResult({ log, adaptation })
    setStage('done')
  }

  // ---------- Bước chấm điểm cảm nhận ----------
  if (stage === 'feedback') {
    return (
      <div className="mx-auto max-w-lg space-y-5">
        <h1 className="text-2xl font-bold">Buổi tập vừa rồi thế nào?</h1>
        <p className="text-sm text-gray-600">Bạn xong {doneCount}/{items.length} bài. Đánh giá thật lòng để hệ thống chọn mức tập phù hợp cho bạn.</p>
        <div className="grid gap-2">
          {FEEDBACK.map((f) => (
            <button
              key={f.value}
              type="button"
              aria-pressed={feedback === f.value}
              onClick={() => setFeedback(f.value)}
              className={`rounded-xl border px-4 py-3 text-left ${feedback === f.value ? 'border-green-500 bg-green-50 font-semibold text-green-700' : 'border-gray-200 bg-white'}`}
            >
              <span className="block">{f.label}</span>
              <span className="block text-xs font-normal text-gray-500">{f.desc}</span>
            </button>
          ))}
        </div>
        <div>
          <label htmlFor="note" className="mb-1 block text-sm font-medium text-gray-700">Ghi chú (không bắt buộc)</label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="VD: hơi mỏi vai, tập xong thấy khoẻ"
            className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
          />
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => setStage('work')} className={ghostBtn}>Quay lại</button>
          <button type="button" onClick={saveWorkout} disabled={!feedback} className={`${primaryBtn} flex-1`}>Lưu buổi tập</button>
        </div>
      </div>
    )
  }

  // ---------- Đang tập ----------
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Buổi tập</h1>
        <p className="text-sm text-gray-600">
          {sessionTitle(s)} · {s.minutes} phút · {TIERS[s.session.tier]}
        </p>
      </div>

      <SafetyBanner />

      <TimerPanel timer={timer} soundOn={soundOn} onChange={setTimer} onFinish={handleTimerEnd} onSkip={skipTimer} />

      <div>
        <div className="mb-1 flex justify-between text-sm text-gray-600">
          <span>Tiến độ</span>
          <span>{doneCount}/{items.length} bài</span>
        </div>
        <div className="h-3 rounded-full bg-gray-200">
          <div className="h-3 rounded-full bg-green-500 transition-all" style={{ width: `${percent}%` }} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600">
        <input type="checkbox" checked={soundOn} onChange={(e) => setSoundOn(e.target.checked)} />
        Âm báo khi hết giờ
      </label>

      {PHASES.map(([phase, title]) => {
        const list = items.filter((i) => i.phase === phase)
        if (!list.length) return null
        return (
          <section key={phase} className="space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</h2>
            <ol className="space-y-2">
              {list.map((item) => {
                const ex = EX[item.exerciseId]
                const done = progress[item.exerciseId] ?? 0
                const finished = done >= item.sets
                const running = timer && timer.kind === 'work' && timer.exerciseId === item.exerciseId
                return (
                  <li key={item.exerciseId} className={`rounded-2xl border p-4 ${finished ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={finished}
                        onChange={() => toggleItem(item)}
                        aria-label={`Hoàn thành ${item.name}`}
                        className="mt-1 h-5 w-5 accent-green-500"
                      />
                      <div className="min-w-0 flex-1">
                        <p className={`font-semibold ${finished ? 'text-green-700 line-through' : ''}`}>{item.name}</p>
                        <p className="text-sm text-gray-500">{describeItem(item)}</p>
                        <p className="text-xs text-gray-500">Hiệp {done}/{item.sets}</p>
                        {!finished && (
                          item.durationSec != null ? (
                            <button type="button" disabled={running} onClick={() => startWork(item)} className="mt-2 rounded-lg bg-green-500 px-3 py-2 text-sm font-semibold text-white hover:bg-green-600 disabled:bg-gray-300">
                              Bắt đầu hiệp {done + 1} ({item.durationSec} giây)
                            </button>
                          ) : (
                            <button type="button" onClick={() => completeSet(item)} className="mt-2 rounded-lg bg-green-500 px-3 py-2 text-sm font-semibold text-white hover:bg-green-600">
                              Xong hiệp {done + 1}
                            </button>
                          )
                        )}
                        <ExerciseDetails ex={ex} />
                      </div>
                      {ex?.image ? (
                        <img src={ex.image} alt="" loading="lazy" className="h-16 w-16 rounded-lg object-cover" />
                      ) : (
                        <div aria-hidden="true" className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-2xl font-bold text-gray-300">
                          {item.name[0]}
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ol>
          </section>
        )
      })}

      <div className="flex flex-wrap items-center gap-3 pt-2">
        <button type="button" onClick={() => setStage('feedback')} disabled={setsDone === 0} className={primaryBtn}>
          Kết thúc buổi tập
        </button>
        <button type="button" onClick={cancelWorkout} className={ghostBtn}>Huỷ buổi tập</button>
        {setsDone === 0 && <span className="text-sm text-gray-500">Hãy hoàn thành ít nhất một hiệp để kết thúc.</span>}
      </div>
    </div>
  )
}