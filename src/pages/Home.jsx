import { Link, useNavigate } from 'react-router-dom'
import useLocalStorage from '../store/useLocalStorage.js'
import exercises from '../data/exercises.js'
import { getTodayState, unsafeItems } from '../logic/today.js'
import { computeStreaks } from '../logic/progress.js'
import { toYmd, parseYmd, fmtDayMonth } from '../logic/dates.js'
import { DAY_NAMES, TIERS } from '../data/labels.js'
import {
  IconTarget, IconShield, IconCalendar, IconTrend, IconFlame, IconPlay, IconLeaf, IconMoon,
  IconCheckBadge, IconSparkle, IconArrowRight, IconDumbbell, IconSun, IconUser,
} from '../components/icons.jsx'
import HeroIllustration from '../components/HeroIllustration.jsx'

// Đổi mỗi ngày (không đổi mỗi lần render), để không "nhấp nháy" khi component vẽ lại
const QUOTES = [
  'Mỗi bước nhỏ đều tạo nên sự thay đổi lớn.',
  'Khoẻ mạnh là hạnh phúc.',
  'Không cần hoàn hảo, chỉ cần đều đặn.',
  'Cơ thể bạn nghe thấy mọi điều bạn nói. Hãy nói những lời tích cực.',
  'Hôm nay là ngày tốt để bắt đầu, hoặc để tiếp tục.',
]
const quoteOfDay = (ymd) => QUOTES[[...ymd].reduce((s, c) => s + c.charCodeAt(0), 0) % QUOTES.length]

const QUICK_LINKS = [
  { to: '/onboarding', icon: IconUser, title: 'Hồ sơ sức khoẻ', desc: 'Theo dõi chỉ số và tình trạng sức khoẻ của bạn' },
  { to: '/schedule', icon: IconCalendar, title: 'Lịch tuần', desc: 'Xem lịch tập luyện và khai báo giờ bận' },
  { to: '/workout', icon: IconDumbbell, title: 'Tập luyện', desc: 'Tạo thói quen vận động và cải thiện thể lực' },
]

const primaryBtn = 'inline-flex items-center justify-center gap-2 rounded-2xl bg-brand-500 px-5 py-3.5 text-center font-semibold text-white shadow-lg shadow-brand-500/25 transition hover:-translate-y-0.5 hover:bg-brand-600 hover:shadow-xl hover:shadow-brand-500/30 active:translate-y-0'
const ghostBtn = 'inline-flex items-center justify-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-center font-medium text-gray-700 transition hover:border-brand-300 hover:bg-brand-50'

const sessionTitle = (s) => `${DAY_NAMES[s.dayOfWeek - 1]} ${fmtDayMonth(parseYmd(s.date))}`

function greeting(hour) {
  if (hour < 11) return 'Chào buổi sáng'
  if (hour < 14) return 'Chào buổi trưa'
  if (hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

function Welcome() {
  const points = [
    [IconTarget, 'Gợi ý theo mục tiêu của bạn', 'Giảm cân, tăng cơ hoặc giãn cơ.'],
    [IconShield, 'Tránh bài tập có thể gây đau', 'Loại các bài không phù hợp với chấn thương của bạn.'],
    [IconCalendar, 'Xếp vào giờ rảnh của bạn', 'Bạn tô những lúc bận, phần còn lại để hệ thống lo.'],
    [IconTrend, 'Tự điều chỉnh độ khó', 'Dễ quá thì tăng nhẹ, nặng quá thì giảm bớt.'],
  ]
  return (
    <div className="relative mx-auto max-w-lg overflow-hidden">
      <div className="decor-blob -right-16 -top-24 h-64 w-64 bg-brand-300" />
      <div className="decor-blob -left-20 top-40 h-56 w-56 bg-accent-300" />

      <div className="relative z-10 space-y-7 py-4 text-center animate-pop">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-brand-500 text-white shadow-lg shadow-brand-500/30">
          <IconLeaf className="h-8 w-8" />
        </div>
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold leading-tight text-gray-900">
            Lịch tập phù hợp với <span className="text-brand-600">cơ thể</span> và{' '}
            <span className="text-brand-600">thời gian</span> của bạn
          </h1>
          <p className="text-gray-600">Trả lời vài câu hỏi, hệ thống sẽ xếp lịch tập vào những lúc bạn rảnh.</p>
        </div>

        <ul className="space-y-3 text-left">
          {points.map(([Icon, title, desc]) => (
            <li key={title} className="card-soft flex gap-4 p-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-600">
                <Icon className="h-5 w-5" />
              </span>
              <span>
                <span className="block font-semibold text-gray-900">{title}</span>
                <span className="block text-sm text-gray-500">{desc}</span>
              </span>
            </li>
          ))}
        </ul>

        <Link to="/onboarding" className={`${primaryBtn} w-full text-lg`}>
          Bắt đầu, mất khoảng 2 phút <IconPlay className="h-5 w-5" />
        </Link>
        <p className="text-xs text-gray-500">
          Dữ liệu của bạn được lưu ngay trên thiết bị này. Nội dung chỉ mang tính tham khảo và không thay thế tư vấn y tế.
        </p>
      </div>
    </div>
  )
}

function Step({ done, children }) {
  return (
    <li className="flex items-center gap-3">
      <span
        aria-hidden="true"
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm transition ${
          done ? 'bg-brand-500 text-white' : 'border-2 border-dashed border-gray-300 text-gray-300'
        }`}
      >
        {done && <IconCheckBadge className="h-4 w-4" />}
      </span>
      <span className={done ? 'text-gray-400 line-through' : 'font-medium text-gray-800'}>{children}</span>
    </li>
  )
}

function SessionPreview({ s, onColor = true }) {
  const names = s.session.items.filter((i) => i.phase === 'main').map((i) => i.name)
  const shown = names.slice(0, 4)
  const mainCls = onColor ? 'text-white/90' : 'text-gray-600'
  const subCls = onColor ? 'text-white/75' : 'text-gray-500'
  return (
    <>
      <p className={`text-sm ${mainCls}`}>
        {s.startTime} · {s.minutes} phút · {TIERS[s.session.tier]} · {s.session.items.length} bài
      </p>
      {shown.length > 0 && (
        <p className={`mt-2 text-sm ${subCls}`}>
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
      <section className="card-soft p-5 animate-pop">
        <div className="mb-1 flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
            <IconPlay className="h-5 w-5" />
          </span>
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Đang tập dở</p>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Buổi {sessionTitle(state.session)}</h2>
        <SessionPreview s={state.session} onColor={false} />
        <Link to="/workout" className={`${primaryBtn} mt-4 w-full`}>
          Tiếp tục buổi tập <IconPlay className="h-5 w-5" />
        </Link>
      </section>
    )
  } else if (state.kind === 'setup') {
    const c = state.checklist
    main = (
      <section className="card-soft relative overflow-hidden p-6 animate-pop">
        <div className="decor-blob -right-12 -top-12 h-40 w-40 bg-accent-300" />
        <div className="relative z-10">
          <div className="mb-1 flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent-100 text-accent-600">
              <IconSparkle className="h-5 w-5" />
            </span>
            <h2 className="text-xl font-bold text-gray-900">{state.expired ? 'Lịch tập đã hết hạn' : 'Sắp xong rồi!'}</h2>
          </div>
          <p className="mb-4 text-sm text-gray-600">
            {state.expired ? 'Hãy tạo lịch cho tuần này để tiếp tục.' : 'Thêm một bước nữa là bạn có lịch tập đầu tiên.'}
          </p>
          <ul className="space-y-3">
            <Step done>Tạo hồ sơ</Step>
            <Step done={c.hasBusy}>Khai báo giờ bận (nên làm để lịch chính xác)</Step>
            <Step done={c.hasPlan}>Tạo lịch tuần</Step>
            <Step done={c.hasLogs}>Tập buổi đầu tiên</Step>
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link to="/schedule" className={primaryBtn}>{c.hasBusy ? 'Tạo lịch tuần' : 'Khai báo giờ bận và tạo lịch'}</Link>
          </div>
        </div>
      </section>
    )
  } else if (state.kind === 'today') {
    main = (
      <section className="card-soft p-5 animate-pop">
        <div className="mb-1 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
              <IconCalendar className="h-5 w-5" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-600">Hôm nay</p>
          </div>
          <span className="hidden items-center gap-1.5 rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700 sm:flex">
            <IconSun className="h-3.5 w-3.5" /> Ngày tuyệt vời để chăm sóc bản thân!
          </span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Đến giờ tập rồi!</h2>
        <SessionPreview s={state.session} onColor={false} />
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
            Bắt đầu buổi tập <IconPlay className="h-5 w-5" />
          </button>
        )}
      </section>
    )
  } else if (state.kind === 'done') {
    main = (
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent-500 to-accent-600 p-6 text-white shadow-xl shadow-accent-500/25 animate-pop">
        <div className="decor-blob -right-10 -top-10 h-40 w-40 bg-white/20" />
        <div className="relative z-10">
          <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20">
            <IconCheckBadge className="h-5 w-5" />
          </span>
          <h2 className="text-xl font-bold">Hôm nay bạn đã tập xong! 🎉</h2>
          <p className="mt-1 text-sm text-white/85">Hãy nghỉ ngơi, uống nước và ăn uống đủ chất.</p>
        </div>
      </section>
    )
  } else {
    main = (
      <section className="card-soft relative overflow-hidden p-6 animate-pop">
        <div className="decor-blob -right-12 -top-12 h-40 w-40 bg-info-100" />
        <div className="relative z-10">
          <span className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-info-100 text-info-700">
            <IconMoon className="h-5 w-5" />
          </span>
          <h2 className="text-xl font-bold text-gray-900">Hôm nay là ngày nghỉ</h2>
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
        </div>
      </section>
    )
  }

  const showNext = (state.kind === 'today' || state.kind === 'done' || state.kind === 'rest') && state.next && !state.planStartsLater

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Banner chào mừng: lời chào, chuỗi tuần, lối tắt tới lịch, minh hoạ */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-brand-700 p-6 text-white shadow-xl shadow-brand-600/20 animate-pop sm:p-8">
        <div className="decor-blob -right-16 -top-16 h-56 w-56 bg-white/15" />
        <div className="relative z-10 flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-md">
            <p className="text-sm text-white/80">{DAY_NAMES[(now.getDay() + 6) % 7]}, {fmtDayMonth(now)}/{now.getFullYear()}</p>
            <h1 className="mt-1 text-3xl font-extrabold leading-tight">{greeting(now.getHours())}!</h1>
            <p className="mt-2 text-white/85">Hãy bắt đầu ngày mới với một lối sống lành mạnh hơn nhé!</p>
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Link
                to="/schedule"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-brand-700 shadow-md transition hover:-translate-y-0.5 hover:shadow-lg"
              >
                <IconSun className="h-5 w-5" /> Xem kế hoạch hôm nay <IconArrowRight className="h-4 w-4" />
              </Link>
              {stats.current > 0 && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-semibold">
                  <IconFlame className="h-4 w-4" /> {stats.current} tuần liên tiếp
                </span>
              )}
            </div>
          </div>
          <HeroIllustration className="hidden h-40 w-72 shrink-0 sm:block" />
        </div>
      </section>

      {/* Lối tắt tới 3 khu vực chính */}
      <section className="grid gap-3 sm:grid-cols-3">
        {QUICK_LINKS.map(({ to, icon: Icon, title, desc }) => (
          <Link key={to} to={to} className="card-soft group flex items-center gap-4 p-4 transition hover:-translate-y-0.5">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white">
              <Icon className="h-5 w-5" />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block font-semibold text-gray-900">{title}</span>
              <span className="block truncate text-xs text-gray-500">{desc}</span>
            </span>
            <IconArrowRight className="h-4 w-4 shrink-0 text-gray-300 transition group-hover:text-brand-500" />
          </Link>
        ))}
      </section>

      {/* Nội dung chính (trái, rộng hơn) + cột phụ (phải) */}
      <div className="grid gap-4 lg:grid-cols-3 lg:items-start">
        <div className="space-y-4 lg:col-span-2">
          {state.needsDoctorCheck && (
            <div className="flex items-start gap-2 rounded-2xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              <IconShield className="mt-0.5 h-4 w-4 shrink-0" />
              <span>Bạn đã trả lời &quot;Có&quot; ở phần sàng lọc sức khoẻ. Hãy hỏi ý kiến bác sĩ trước khi tập.</span>
            </div>
          )}

          {state.daysSinceLast !== null && state.daysSinceLast >= 7 && state.kind !== 'active' && (
            <div className="flex items-start gap-2 rounded-2xl bg-info-50 p-3 text-sm text-info-700">
              <IconLeaf className="mt-0.5 h-4 w-4 shrink-0" />
              <span>
                Chào mừng bạn quay lại! Đã {state.daysSinceLast} ngày kể từ buổi tập gần nhất. Hãy bắt đầu nhẹ nhàng
                và nghe theo cơ thể mình nhé.
              </span>
            </div>
          )}

          {main}

          {canStart && state.missed && state.kind !== 'setup' && (
            <section className="card-soft flex items-center justify-between gap-3 p-4">
              <div>
                <p className="font-semibold text-gray-900">Buổi {sessionTitle(state.missed)} chưa tập</p>
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
            <section className="card-soft p-5">
              <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">Buổi tiếp theo</p>
              <p className="mt-1 font-bold text-gray-900">{sessionTitle(state.next)}</p>
              <SessionPreview s={state.next} onColor={false} />
            </section>
          )}
        </div>

        {/* Cột phụ: tiến độ tuần + câu trích dẫn */}
        <div className="space-y-4">
          <section className="card-soft p-5">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-brand-100 text-brand-600">
                <IconTrend className="h-4 w-4" />
              </span>
              <h2 className="font-bold text-gray-900">Tiến độ tuần</h2>
            </div>
            <div className="mt-3 flex items-baseline justify-between text-sm">
              <span className="text-gray-500">Buổi đã tập</span>
              <span className="font-semibold text-gray-900">{stats.thisWeek.count}/{stats.thisWeek.goal} buổi</span>
            </div>
            <div className="mt-2 h-3 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-500"
                style={{ width: `${weekPct}%` }}
                role="progressbar"
                aria-valuenow={weekPct}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label="Tiến độ tuần này"
              />
            </div>
            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3 text-sm">
              <span className="flex items-center gap-1.5 text-gray-600">
                <IconFlame className="h-4 w-4 text-accent-500" /> Chuỗi hiện tại: <b className="text-gray-900">{stats.current} tuần</b>
              </span>
              <Link to="/progress" className="font-medium text-brand-700 hover:underline">Xem tiến độ</Link>
            </div>
          </section>

          <section className="card-soft relative overflow-hidden bg-gradient-to-br from-brand-50 to-white p-5">
            <IconLeaf className="mb-2 h-5 w-5 text-brand-500" />
            <p className="text-sm font-medium italic text-gray-700">&ldquo;{quoteOfDay(todayYmd)}&rdquo;</p>
          </section>
        </div>
      </div>
    </div>
  )
}