import { Link, useNavigate } from 'react-router-dom'
import useLocalStorage from '../store/useLocalStorage.js'
import exercises from '../data/exercises.sample.json'
import { getTodayState, unsafeItems } from '../logic/today.js'
import { computeStreaks } from '../logic/progress.js'
import { toYmd, parseYmd, fmtDayMonth } from '../logic/dates.js'

const DAY_NAMES = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
const TIERS = { mini: 'Buổi ngắn', short: 'Buổi vừa', full: 'Buổi đầy đủ' }

const card = 'rounded-2xl border border-gray-200 bg-white p-5'
const primaryBtn = 'inline-block rounded-xl bg-green-500 px-5 py-3 text-center font-semibold text-white hover:bg-green-600'
const ghostBtn = 'inline-block rounded-xl border border-gray-300 bg-white px-5 py-3 text-center text-gray-700 hover:bg-gray-100'

const sessionTitle = (s) => `${DAY_NAMES[s.dayOfWeek - 1]} ${fmtDayMonth(parseYmd(s.date))}`

function greeting(hour) {
  if (hour < 11) return 'Chào buổi sáng'
  if (hour < 14) return 'Chào buổi trưa'
  if (hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

function Welcome() {
  return (
    <div className="mx-auto max-w-lg space-y-6 py-4 text-center">
      <div className="space-y-3">
        <h1 className="text-3xl font-bold leading-tight">Lịch tập phù hợp với cơ thể và thời gian của bạn</h1>
        <p className="text-gray-600">Trả lời vài câu hỏi, hệ thống sẽ xếp lịch tập vào những lúc bạn rảnh.</p>
      </div>
      <ul className="space-y-2 text-left">
        {[
          ['🎯', 'Gợi ý theo mục tiêu của bạn', 'Giảm cân, tăng cơ hoặc giãn cơ.'],
          ['🛡️', 'Tránh bài tập có thể gây đau', 'Loại các bài không phù hợp với chấn thương của bạn.'],
          ['📅', 'Xếp vào giờ rảnh của bạn', 'Bạn tô những lúc bận, phần còn lại để hệ thống lo.'],
          ['📈', 'Tự điều chỉnh độ khó', 'Dễ quá thì tăng nhẹ, nặng quá thì giảm bớt.'],
        ].map(([icon, title, desc]) => (
          <li key={title} className="flex gap-3 rounded-xl bg-white p-3 shadow-sm">
            <span className="text-2xl" aria-hidden="true">{icon}</span>
            <span>
              <span className="block font-semibold">{title}</span>
              <span className="block text-sm text-gray-500">{desc}</span>
            </span>
          </li>
        ))}
      </ul>
      <Link to="/onboarding" className={`${primaryBtn} w-full text-lg`}>Bắt đầu, mất khoảng 2 phút</Link>
      <p className="text-xs text-gray-500">
        Dữ liệu của bạn được lưu ngay trên thiết bị này. Nội dung chỉ mang tính tham khảo và không thay thế tư vấn y tế.
      </p>
    </div>
  )
}

function Step({ done, children }) {
  return (
    <li className="flex items-center gap-3">
      <span aria-hidden="true" className={`flex h-6 w-6 items-center justify-center rounded-full text-sm ${done ? 'bg-green-500 text-white' : 'border border-gray-300 text-gray-300'}`}>
        {done ? '✓' : ''}
      </span>
      <span className={done ? 'text-gray-500 line-through' : 'font-medium'}>{children}</span>
    </li>
  )
}

function SessionPreview({ s }) {
  const names = s.session.items.filter((i) => i.phase === 'main').map((i) => i.name)
  const shown = names.slice(0, 4)
  return (
    <>
      <p className="text-sm text-gray-600">
        {s.startTime} · {s.minutes} phút · {TIERS[s.session.tier]} · {s.session.items.length} bài
      </p>
      {shown.length > 0 && (
        <p className="mt-2 text-sm text-gray-500">
          Gồm: {shown.join(', ')}{names.length > shown.length ? ` và ${names.length - shown.length} bài khác` : ''}
        </p>
      )}
    </>
  )
}

export default function Home() {
  const navigate = useNavigate()
  const [profile] = useLocalStorage('profile', null)
  const [busySlots] = useLocalStorage('busySlots', null)
  const [plan] = useLocalStorage('weekPlan', null)
  const [logs] = useLocalStorage('logs', [])
  const [active, setActive] = useLocalStorage('activeWorkout', null)

  const now = new Date()
  const todayYmd = toYmd(now)
  const state = getTodayState({ profile, busySlots, plan, logs, active, todayYmd })

  if (state.kind === 'welcome') return <Welcome />

  const goal = profile.daysPerWeek ?? 3
  const stats = computeStreaks(logs, goal, todayYmd)
  const weekPct = Math.min(100, Math.round((stats.thisWeek.count / stats.thisWeek.goal) * 100))

  // Bắt đầu một chạm: ghi sẵn buổi đang tập (cùng định dạng với trang Tập) rồi chuyển sang trang Tập
  function start(s) {
    setActive({ date: s.date, startedAt: Date.now(), session: s, progress: {} })
    navigate('/workout')
  }

  const canStart = state.kind !== 'active' // đang tập dở thì không mở buổi khác đè lên
  // Hồ sơ có thể đã đổi sau khi tạo lịch: không cho bắt đầu buổi có bài không còn phù hợp
  const unsafe = (s) => (s ? unsafeItems(s, profile.injuries, exercises) : [])
  const todayUnsafe = state.kind === 'today' ? unsafe(state.session) : []
  const missedUnsafe = state.missed ? unsafe(state.missed) : []

  let main = null
  if (state.kind === 'active') {
    main = (
      <section className={`${card} border-green-500 bg-green-50`}>
        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Đang tập dở</p>
        <h2 className="mt-1 text-xl font-bold">Buổi {sessionTitle(state.session)}</h2>
        <SessionPreview s={state.session} />
        <Link to="/workout" className={`${primaryBtn} mt-4 w-full`}>Tiếp tục buổi tập</Link>
      </section>
    )
  } else if (state.kind === 'setup') {
    const c = state.checklist
    main = (
      <section className={card}>
        <h2 className="text-xl font-bold">{state.expired ? 'Lịch tập đã hết hạn' : 'Sắp xong rồi!'}</h2>
        <p className="mt-1 text-sm text-gray-600">
          {state.expired ? 'Hãy tạo lịch cho tuần này để tiếp tục.' : 'Thêm một bước nữa là bạn có lịch tập đầu tiên.'}
        </p>
        <ul className="mt-4 space-y-3">
          <Step done>Tạo hồ sơ</Step>
          <Step done={c.hasBusy}>Khai báo giờ bận (nên làm để lịch chính xác)</Step>
          <Step done={c.hasPlan}>Tạo lịch tuần</Step>
          <Step done={c.hasLogs}>Tập buổi đầu tiên</Step>
        </ul>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/schedule" className={primaryBtn}>{c.hasBusy ? 'Tạo lịch tuần' : 'Khai báo giờ bận và tạo lịch'}</Link>
        </div>
      </section>
    )
  } else if (state.kind === 'today') {
    main = (
      <section className={`${card} border-green-500 bg-green-50`}>
        <p className="text-xs font-semibold uppercase tracking-wide text-green-700">Hôm nay</p>
        <h2 className="mt-1 text-xl font-bold">Đến giờ tập rồi!</h2>
        <SessionPreview s={state.session} />
        {todayUnsafe.length > 0 ? (
          <>
            <div className="mt-3 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              <p className="font-semibold">Hồ sơ của bạn đã thay đổi, lịch này cần được cập nhật.</p>
              <p className="mt-1">Buổi này có bài không còn phù hợp: {todayUnsafe.join(', ')}.</p>
            </div>
            <Link to="/schedule" className={`${primaryBtn} mt-4 w-full`}>Tạo lại lịch</Link>
          </>
        ) : (
          <button type="button" onClick={() => start(state.session)} className={`${primaryBtn} mt-4 w-full`}>
            Bắt đầu buổi tập
          </button>
        )}
      </section>
    )
  } else if (state.kind === 'done') {
    main = (
      <section className={`${card} border-green-300 bg-green-50`}>
        <h2 className="text-xl font-bold">Hôm nay bạn đã tập xong! 🎉</h2>
        <p className="mt-1 text-sm text-gray-600">Hãy nghỉ ngơi, uống nước và ăn uống đủ chất.</p>
      </section>
    )
  } else {
    main = (
      <section className={card}>
        <h2 className="text-xl font-bold">Hôm nay là ngày nghỉ</h2>
        <p className="mt-1 text-sm text-gray-600">
          {state.planStartsLater
            ? `Lịch tập của bạn bắt đầu từ ${sessionTitle(state.next)}.`
            : 'Nghỉ ngơi cũng là một phần của tập luyện.'}
        </p>
        {!state.next && (
          <div className="mt-3 space-y-2">
            <p className="text-sm text-gray-600">Bạn đã tập hết các buổi trong lịch này.</p>
            <Link to="/schedule" className={ghostBtn}>Tạo lịch cho tuần sau</Link>
          </div>
        )}
      </section>
    )
  }

  const showNext = (state.kind === 'today' || state.kind === 'done' || state.kind === 'rest') && state.next && !state.planStartsLater

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <header>
        <p className="text-sm text-gray-500">{DAY_NAMES[(now.getDay() + 6) % 7]}, {fmtDayMonth(now)}/{now.getFullYear()}</p>
        <h1 className="text-2xl font-bold">{greeting(now.getHours())}!</h1>
      </header>

      {state.needsDoctorCheck && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Bạn đã trả lời &quot;Có&quot; ở phần sàng lọc sức khoẻ. Hãy hỏi ý kiến bác sĩ trước khi tập.
        </div>
      )}

      {state.daysSinceLast !== null && state.daysSinceLast >= 7 && state.kind !== 'active' && (
        <div className="rounded-xl border border-sky-200 bg-sky-50 p-3 text-sm text-sky-900">
          Chào mừng bạn quay lại! Đã {state.daysSinceLast} ngày kể từ buổi tập gần nhất. Hãy bắt đầu nhẹ nhàng
          và nghe theo cơ thể mình nhé.
        </div>
      )}

      {main}

      {canStart && state.missed && state.kind !== 'setup' && (
        <section className={`${card} flex items-center justify-between gap-3`}>
          <div>
            <p className="font-semibold">Buổi {sessionTitle(state.missed)} chưa tập</p>
            <p className="text-sm text-gray-500">
              {missedUnsafe.length > 0 ? 'Hồ sơ đã thay đổi nên buổi này cần được tạo lại.' : 'Muốn tập bù hôm nay không?'}
            </p>
          </div>
          {missedUnsafe.length > 0 ? (
            <Link to="/schedule" className={ghostBtn}>Tạo lại lịch</Link>
          ) : (
            <button type="button" onClick={() => start(state.missed)} className={ghostBtn}>Tập bù</button>
          )}
        </section>
      )}

      {showNext && (
        <section className={card}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Buổi tiếp theo</p>
          <p className="mt-1 font-bold">{sessionTitle(state.next)}</p>
          <SessionPreview s={state.next} />
        </section>
      )}

      {/* Tiến độ tuần */}
      <section className={card}>
        <div className="flex items-baseline justify-between">
          <h2 className="font-bold">Tuần này</h2>
          <span className="text-sm text-gray-600">{stats.thisWeek.count}/{stats.thisWeek.goal} buổi</span>
        </div>
        <div className="mt-2 h-3 rounded-full bg-gray-200">
          <div className="h-3 rounded-full bg-green-500 transition-all" style={{ width: `${weekPct}%` }} role="progressbar" aria-valuenow={weekPct} aria-valuemin={0} aria-valuemax={100} aria-label="Tiến độ tuần này" />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="text-gray-600">Chuỗi hiện tại: <b>{stats.current} tuần</b></span>
          <Link to="/progress" className="text-green-700 underline">Xem tiến độ</Link>
        </div>
      </section>
    </div>
  )
}