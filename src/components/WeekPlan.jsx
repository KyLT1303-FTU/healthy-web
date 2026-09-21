import { useState } from 'react'
import { Link } from 'react-router-dom'
import useLocalStorage from '../store/useLocalStorage.js'
import exercises from '../data/exercises.sample.json'
import { scheduleWeek } from '../logic/scheduler.js'
import { mondayOf, addDays, toYmd, parseYmd, fmtDayMonth } from '../logic/dates.js'

const DAY_NAMES = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
const PHASES = [
  ['warmup', 'Khởi động'],
  ['main', 'Tập chính'],
  ['cooldown', 'Thả lỏng'],
]
const TIERS = { mini: 'Buổi ngắn', short: 'Buổi vừa', full: 'Buổi đầy đủ' }
const INJURY_LABELS = {
  lower_back: 'Đau lưng dưới', knee: 'Đau gối', shoulder: 'Đau vai',
  wrist: 'Đau cổ tay', ankle: 'Đau cổ chân', neck: 'Đau cổ',
}
const NAME = Object.fromEntries(exercises.map((e) => [e.id, e.name]))

function describeItem(i) {
  const amount = i.reps != null ? `${i.reps} lần` : `${i.durationSec} giây`
  const rest = i.sets > 1 ? ` · nghỉ ${i.restSec} giây` : ''
  return `${i.sets} hiệp × ${amount}${rest}`
}

export default function WeekPlan() {
  const [profile] = useLocalStorage('profile', null)
  const [busySlots] = useLocalStorage('busySlots', null)
  const [adapt] = useLocalStorage('adaptState', { step: 0, lastAdjustedLogId: null })
  const [plan, setPlan] = useLocalStorage('weekPlan', null)
  const [error, setError] = useState('')

  const today = new Date()
  const thisMonday = mondayOf(today)
  const nextMonday = addDays(thisMonday, 7)
  const [which, setWhich] = useState(() => (plan && plan.weekStart === toYmd(nextMonday) ? 'next' : 'this'))
  const weekStart = toYmd(which === 'next' ? nextMonday : thisMonday)
  const step = adapt?.step ?? 0

  if (!profile) {
    return (
      <section className="rounded-2xl border border-gray-200 bg-white p-5">
        <h2 className="text-lg font-bold">Lịch tập của bạn</h2>
        <p className="mt-2 text-sm text-gray-600">Bạn chưa có hồ sơ, nên hệ thống chưa biết nên xếp bài nào cho bạn.</p>
        <Link to="/onboarding" className="mt-3 inline-block rounded-xl bg-green-500 px-5 py-3 font-semibold text-white hover:bg-green-600">
          Tạo hồ sơ
        </Link>
      </section>
    )
  }

  const inputsKey = JSON.stringify([profile, busySlots ?? [], step, weekStart])
  const stale = plan && plan.inputsKey !== inputsKey

  function generate() {
    setError('')
    try {
      const r = scheduleWeek({
        profile,
        busySlots: busySlots ?? [],
        exercises,
        weekStart,
        loadStep: step,
      })
      setPlan({
        weekStart,
        generatedAt: new Date().toISOString(),
        inputsKey,
        sessions: r.sessions,
        warnings: r.warnings,
        excluded: r.excluded.map((x) => ({ id: x.exercise.id, name: x.exercise.name, reason: x.reason })),
      })
    } catch (e) {
      setError(`Không tạo được lịch: ${e.message}`)
    }
  }

  const todayYmd = toYmd(today)
  const planMonday = plan ? parseYmd(plan.weekStart) : null

  // Gom các bài bị loại vì chấn thương theo từng chấn thương
  const byInjury = {}
  for (const x of plan?.excluded ?? []) {
    if (x.reason === 'chưa gắn nhãn an toàn') continue
    ;(byInjury[x.reason] ??= []).push(x.name)
  }

  const weekBtn = (value, label, monday) => (
    <button
      type="button"
      onClick={() => setWhich(value)}
      aria-pressed={which === value}
      className={`flex-1 rounded-lg px-3 py-2 text-sm ${
        which === value ? 'bg-green-500 font-semibold text-white' : 'bg-white text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label} ({fmtDayMonth(monday)} – {fmtDayMonth(addDays(monday, 6))})
    </button>
  )

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-bold">Lịch tập của bạn</h2>

      {profile.needsDoctorCheck && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Bạn đã trả lời &quot;Có&quot; ở phần sàng lọc sức khoẻ. Hãy hỏi ý kiến bác sĩ trước khi tập theo lịch này.
        </div>
      )}

      {busySlots === null && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Bạn chưa lưu lịch bận. Nếu tạo lịch ngay, hệ thống coi như bạn rảnh cả tuần.{' '}
          <a href="#busy" className="font-semibold underline">Khai báo lịch bận</a>
        </div>
      )}

      <div className="flex gap-2 rounded-xl bg-gray-100 p-1">
        {weekBtn('this', 'Tuần này', thisMonday)}
        {weekBtn('next', 'Tuần sau', nextMonday)}
      </div>

      {step !== 0 && (
        <p className="text-sm text-gray-600">
          Mức tải đã được điều chỉnh {step > 0 ? `+${step}` : step} bậc theo phản hồi của bạn.
        </p>
      )}

      <button type="button" onClick={generate} className="w-full rounded-xl bg-green-500 px-5 py-3 font-semibold text-white hover:bg-green-600">
        {plan ? 'Tạo lại lịch' : 'Tạo lịch tuần'}
      </button>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</p>
      )}

      {stale && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
          Hồ sơ, lịch bận hoặc tuần đã chọn có thay đổi so với lúc tạo lịch. Bấm &quot;Tạo lại lịch&quot; để cập nhật.
        </div>
      )}

      {plan && (
        <>
          {plan.warnings.length > 0 && (
            <ul className="space-y-1 rounded-xl border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">
              {plan.warnings.map((w) => <li key={w}>• {w}</li>)}
            </ul>
          )}

          <ul className="space-y-3">
            {DAY_NAMES.map((dayName, i) => {
              const date = addDays(planMonday, i)
              const past = toYmd(date) < todayYmd
              const s = plan.sessions.find((x) => x.dayOfWeek === i + 1)
              return (
                <li key={dayName} className={`rounded-2xl border border-gray-200 p-4 ${past ? 'bg-gray-50 opacity-60' : 'bg-white'}`}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="font-bold">
                      {dayName} <span className="ml-1 text-sm font-normal text-gray-500">{fmtDayMonth(date)}</span>
                    </h3>
                    {past && <span className="text-xs text-gray-500">Đã qua</span>}
                  </div>
                  {s ? (
                    <div className="mt-2 space-y-3">
                      <p className="text-sm font-medium text-green-700">
                        {s.startTime}–{s.endTime} · {s.minutes} phút · {TIERS[s.session.tier]}
                      </p>
                      {PHASES.map(([phase, title]) => {
                        const items = s.session.items.filter((it) => it.phase === phase)
                        if (!items.length) return null
                        return (
                          <div key={phase}>
                            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</p>
                            <ol className="space-y-1 text-sm">
                              {items.map((it) => (
                                <li key={it.exerciseId}>
                                  <span className="font-medium">{it.name}</span>
                                  <span className="text-gray-500"> — {describeItem(it)}</span>
                                  {it.replacedFrom && (
                                    <span className="block text-xs text-amber-700">
                                      Bản nhẹ hơn thay cho &quot;{NAME[it.replacedFrom] ?? it.replacedFrom}&quot;
                                    </span>
                                  )}
                                </li>
                              ))}
                            </ol>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <p className="mt-2 text-sm text-gray-500">Ngày nghỉ</p>
                  )}
                </li>
              )
            })}
          </ul>

          {Object.keys(byInjury).length > 0 && (
            <details className="rounded-xl border border-gray-200 bg-white p-4 text-sm">
              <summary className="cursor-pointer font-medium">Vì sao một số bài không có trong lịch?</summary>
              <ul className="mt-2 space-y-2 text-gray-700">
                {Object.entries(byInjury).map(([inj, names]) => (
                  <li key={inj}>
                    Vì bạn chọn <b>{INJURY_LABELS[inj] ?? inj}</b>, hệ thống đã loại: {names.join(', ')}.
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-xs text-gray-500">
                Ngoài ra, các bài cần dụng cụ bạn chưa có hoặc quá sức với trình độ hiện tại cũng không được chọn.
              </p>
            </details>
          )}
        </>
      )}
    </section>
  )
}