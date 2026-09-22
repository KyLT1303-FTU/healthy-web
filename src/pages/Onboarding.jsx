import { useState } from 'react'
import useLocalStorage from '../store/useLocalStorage.js'
import { calcBMI, bmiCategory } from '../logic/profile.js'
import { GOALS, LEVELS, INJURIES, EQUIPMENT, PERIODS, labelOf } from '../data/labels.js'

// ---------- Các lựa chọn riêng của trang này ----------
const STEPS = ['Thể trạng', 'Mục tiêu', 'Chấn thương', 'Sức khoẻ', 'Lịch tập']
const DAYS = [2, 3, 4, 5, 6]
const MINUTES = [15, 20, 30, 45, 60]
const SCREENING = [
  { id: 'chestPain', text: 'Bạn có bị đau tức ngực khi vận động hoặc khi nghỉ ngơi?' },
  { id: 'dizziness', text: 'Bạn có hay bị chóng mặt hoặc ngất xỉu?' },
  { id: 'heartBP', text: 'Bác sĩ có từng nói bạn bị bệnh tim hoặc huyết áp cao?' },
  { id: 'pregnant', text: 'Bạn đang mang thai hoặc mới sinh con gần đây?' },
  { id: 'medical', text: 'Bạn có bệnh mãn tính hoặc đang dùng thuốc mà bác sĩ dặn cần hạn chế vận động?' },
]


// ---------- Hàm hỗ trợ ----------
function emptyForm() {
  return {
    age: '', heightCm: '', weightKg: '',
    goal: '', level: '',
    injuries: [], equipment: [],
    daysPerWeek: 3, sessionMinutes: 30, preferredPeriod: 'any',
    screening: Object.fromEntries(SCREENING.map((q) => [q.id, null])),
    doctorAck: false,
  }
}

function toForm(p) {
  if (!p) return emptyForm()
  return {
    age: String(p.age), heightCm: String(p.heightCm), weightKg: String(p.weightKg),
    goal: p.goal, level: p.level,
    injuries: p.injuries, equipment: p.equipment,
    daysPerWeek: p.daysPerWeek, sessionMinutes: p.sessionMinutes,
    preferredPeriod: p.preferredPeriod ?? 'any',
    screening: p.screening, doctorAck: !!p.needsDoctorCheck,
  }
}

const anyYes = (screening) => SCREENING.some((q) => screening[q.id] === true)

function buildProfile(f) {
  return {
    age: Number(f.age),
    heightCm: Number(f.heightCm),
    weightKg: Number(f.weightKg),
    goal: f.goal,
    level: f.level,
    injuries: f.injuries,
    equipment: f.equipment,
    daysPerWeek: f.daysPerWeek,
    sessionMinutes: f.sessionMinutes,
    preferredPeriod: f.preferredPeriod === 'any' ? undefined : f.preferredPeriod,
    screening: f.screening,
    needsDoctorCheck: anyYes(f.screening),
    updatedAt: new Date().toISOString(),
  }
}

function safeBMI(weightKg, heightCm) {
  try {
    const bmi = calcBMI(Number(weightKg), Number(heightCm))
    return { bmi, label: bmiCategory(bmi) }
  } catch {
    return null // chưa nhập đủ hoặc giá trị vô lý
  }
}

// Trả về câu báo lỗi (chuỗi rỗng nếu bước này hợp lệ)
function validateStep(step, f) {
  if (step === 0) {
    const age = Number(f.age)
    if (!Number.isInteger(age) || age < 14 || age > 90) return 'Tuổi cần là số nguyên từ 14 đến 90.'
    const h = Number(f.heightCm)
    if (!(h >= 100 && h <= 250)) return 'Chiều cao cần từ 100 đến 250 cm.'
    const w = Number(f.weightKg)
    if (!(w >= 20 && w <= 300)) return 'Cân nặng cần từ 20 đến 300 kg.'
  }
  if (step === 1) {
    if (!f.goal) return 'Hãy chọn một mục tiêu.'
    if (!f.level) return 'Hãy chọn trình độ hiện tại.'
  }
  if (step === 3) {
    if (SCREENING.some((q) => f.screening[q.id] === null)) return 'Hãy trả lời tất cả các câu hỏi.'
    if (anyYes(f.screening) && !f.doctorAck) return 'Hãy tick vào ô xác nhận bên dưới để tiếp tục.'
  }
  return ''
}

const toggle = (list, v) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v])

// ---------- Các mảnh giao diện nhỏ ----------
function Choice({ selected, onClick, children, className = '' }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-xl border px-4 py-3 text-left text-sm transition ${
        selected
          ? 'border-green-500 bg-green-50 font-semibold text-green-700'
          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
      } ${className}`}
    >
      {children}
    </button>
  )
}

function NumberField({ id, label, unit, value, onChange, placeholder }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <input
          id={id}
          type="number"
          inputMode="decimal"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-base focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200"
        />
        <span className="w-10 text-sm text-gray-500">{unit}</span>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div>
      <h2 className="mb-2 text-sm font-medium text-gray-700">{title}</h2>
      {children}
    </div>
  )
}

// ---------- Màn hình xem hồ sơ đã lưu ----------
function ProfileView({ profile, onEdit, onReset }) {
  const b = safeBMI(profile.weightKg, profile.heightCm)
  const rows = [
    ['Tuổi', `${profile.age}`],
    ['Chiều cao', `${profile.heightCm} cm`],
    ['Cân nặng', `${profile.weightKg} kg`],
    ['Mục tiêu', labelOf(GOALS, profile.goal)],
    ['Trình độ', labelOf(LEVELS, profile.level)],
    ['Chấn thương', profile.injuries.length ? profile.injuries.map((v) => labelOf(INJURIES, v)).join(', ') : 'Không có'],
    ['Dụng cụ', ['Không dụng cụ', ...profile.equipment.map((v) => labelOf(EQUIPMENT, v))].join(', ')],
    ['Số buổi mỗi tuần', `${profile.daysPerWeek} buổi`],
    ['Thời lượng mỗi buổi', `${profile.sessionMinutes} phút`],
    ['Giờ ưa thích', labelOf(PERIODS, profile.preferredPeriod ?? 'any')],
  ]
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Hồ sơ của bạn</h1>

      {b && (
        <div className="rounded-2xl bg-green-500 p-5 text-white">
          <p className="text-sm opacity-90">Chỉ số BMI</p>
          <p className="text-4xl font-bold">{b.bmi}</p>
          <p className="mt-1 font-medium">{b.label}</p>
          <p className="mt-2 text-xs opacity-90">
            BMI chỉ là con số tham khảo, không phản ánh tỉ lệ mỡ và cơ.
          </p>
        </div>
      )}

      {profile.needsDoctorCheck && (
        <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
          <p className="font-semibold">Lưu ý sức khoẻ</p>
          <p className="mt-1">
            Bạn đã trả lời &quot;Có&quot; ở phần sàng lọc sức khoẻ. Hãy hỏi ý kiến bác sĩ trước khi bắt đầu tập.
          </p>
        </div>
      )}

      <dl className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
        {rows.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-4 px-4 py-3 text-sm">
            <dt className="text-gray-500">{k}</dt>
            <dd className="text-right font-medium">{v}</dd>
          </div>
        ))}
      </dl>

      <p className="text-sm text-gray-500">
        Bước tiếp theo: khai báo khung giờ bận để hệ thống xếp lịch tập cho bạn.
      </p>

      <div className="flex flex-wrap gap-3">
        <button type="button" onClick={onEdit} className="rounded-xl bg-green-500 px-5 py-3 font-semibold text-white hover:bg-green-600">
          Chỉnh sửa hồ sơ
        </button>
        <button type="button" onClick={onReset} className="rounded-xl border border-gray-300 px-5 py-3 text-gray-600 hover:bg-gray-100">
          Xoá hồ sơ và làm lại
        </button>
      </div>
    </div>
  )
}

// ---------- Trang chính ----------
export default function Onboarding() {
  const [saved, setSaved] = useLocalStorage('profile', null)
  const [editing, setEditing] = useState(!saved)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(() => toForm(saved))
  const [tried, setTried] = useState(false)

  const update = (patch) => setForm((f) => ({ ...f, ...patch }))

  if (!editing && saved) {
    return (
      <ProfileView
        profile={saved}
        onEdit={() => {
          setForm(toForm(saved))
          setStep(0)
          setEditing(true)
        }}
        onReset={() => {
          if (window.confirm('Xoá hồ sơ và làm lại từ đầu?')) {
            setSaved(null)
            setForm(emptyForm())
            setStep(0)
            setEditing(true)
          }
        }}
      />
    )
  }

  const error = validateStep(step, form)
  const isLast = step === STEPS.length - 1
  const bmiInfo = safeBMI(form.weightKg, form.heightCm)

  function next() {
    if (error) {
      setTried(true)
      return
    }
    setTried(false)
    if (!isLast) {
      setStep(step + 1)
    } else {
      setSaved(buildProfile(form))
      setEditing(false)
      setStep(0)
    }
  }

  function back() {
    setTried(false)
    setStep(step - 1)
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-4 text-2xl font-bold">Hồ sơ của bạn</h1>

      {/* Thanh tiến độ */}
      <div className="mb-6">
        <p className="mb-2 text-xs text-gray-500">
          Bước {step + 1}/{STEPS.length}: {STEPS[step]}
        </p>
        <div className="h-2 rounded-full bg-gray-200">
          <div
            className="h-2 rounded-full bg-green-500 transition-all"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <div className="space-y-5">
        {/* Bước 1: thể trạng */}
        {step === 0 && (
          <>
            <NumberField id="age" label="Tuổi" unit="tuổi" placeholder="VD: 28" value={form.age} onChange={(v) => update({ age: v })} />
            <NumberField id="height" label="Chiều cao" unit="cm" placeholder="VD: 165" value={form.heightCm} onChange={(v) => update({ heightCm: v })} />
            <NumberField id="weight" label="Cân nặng" unit="kg" placeholder="VD: 58" value={form.weightKg} onChange={(v) => update({ weightKg: v })} />
            {bmiInfo && (
              <div className="rounded-xl bg-green-50 p-4 text-sm text-green-800">
                BMI của bạn: <b>{bmiInfo.bmi}</b> ({bmiInfo.label})
              </div>
            )}
            {Number(form.age) >= 14 && Number(form.age) < 18 && (
              <p className="text-sm text-amber-700">
                Bạn dưới 18 tuổi: nên tập cùng người lớn và hỏi ý kiến bác sĩ hoặc huấn luyện viên.
              </p>
            )}
          </>
        )}

        {/* Bước 2: mục tiêu và trình độ */}
        {step === 1 && (
          <>
            <Section title="Mục tiêu của bạn">
              <div className="grid gap-2">
                {GOALS.map((g) => (
                  <Choice key={g.value} selected={form.goal === g.value} onClick={() => update({ goal: g.value })}>
                    <span className="block">{g.label}</span>
                    <span className="block text-xs font-normal text-gray-500">{g.desc}</span>
                  </Choice>
                ))}
              </div>
            </Section>
            <Section title="Trình độ hiện tại">
              <div className="grid gap-2">
                {LEVELS.map((l) => (
                  <Choice key={l.value} selected={form.level === l.value} onClick={() => update({ level: l.value })}>
                    <span className="block">{l.label}</span>
                    <span className="block text-xs font-normal text-gray-500">{l.desc}</span>
                  </Choice>
                ))}
              </div>
            </Section>
          </>
        )}

        {/* Bước 3: chấn thương */}
        {step === 2 && (
          <Section title="Vùng nào đang bị đau hoặc chấn thương? (chọn nhiều được)">
            <div className="grid grid-cols-2 gap-2">
              {INJURIES.map((i) => (
                <Choice
                  key={i.value}
                  selected={form.injuries.includes(i.value)}
                  onClick={() => update({ injuries: toggle(form.injuries, i.value) })}
                >
                  {i.label}
                </Choice>
              ))}
            </div>
            <Choice className="mt-2 w-full" selected={form.injuries.length === 0} onClick={() => update({ injuries: [] })}>
              Không có chấn thương
            </Choice>
            <p className="mt-3 text-xs text-gray-500">
              Các bài tập có thể gây đau ở vùng bạn chọn sẽ được loại khỏi lịch tập.
            </p>
          </Section>
        )}

        {/* Bước 4: sàng lọc sức khoẻ */}
        {step === 3 && (
          <>
            {SCREENING.map((q) => (
              <div key={q.id} className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="mb-3 text-sm">{q.text}</p>
                <div className="grid grid-cols-2 gap-2">
                  <Choice
                    selected={form.screening[q.id] === true}
                    onClick={() => update({ screening: { ...form.screening, [q.id]: true } })}
                  >
                    Có
                  </Choice>
                  <Choice
                    selected={form.screening[q.id] === false}
                    onClick={() => update({ screening: { ...form.screening, [q.id]: false } })}
                  >
                    Không
                  </Choice>
                </div>
              </div>
            ))}
            {anyYes(form.screening) && (
              <div className="rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900">
                <p className="font-semibold">Bạn nên hỏi ý kiến bác sĩ trước khi bắt đầu tập.</p>
                <p className="mt-1">Web chỉ đưa gợi ý tham khảo và không thay thế tư vấn y tế.</p>
                <label className="mt-3 flex items-start gap-2">
                  <input
                    type="checkbox"
                    checked={form.doctorAck}
                    onChange={(e) => update({ doctorAck: e.target.checked })}
                    className="mt-0.5"
                  />
                  <span>Tôi đã hiểu và sẽ hỏi ý kiến bác sĩ nếu cần.</span>
                </label>
              </div>
            )}
          </>
        )}

        {/* Bước 5: lịch tập */}
        {step === 4 && (
          <>
            <Section title="Dụng cụ bạn có (không dụng cụ thì để trống)">
              <div className="grid grid-cols-2 gap-2">
                {EQUIPMENT.map((e) => (
                  <Choice
                    key={e.value}
                    selected={form.equipment.includes(e.value)}
                    onClick={() => update({ equipment: toggle(form.equipment, e.value) })}
                  >
                    {e.label}
                  </Choice>
                ))}
              </div>
            </Section>
            <Section title="Số buổi tập mỗi tuần">
              <div className="flex flex-wrap gap-2">
                {DAYS.map((d) => (
                  <Choice key={d} selected={form.daysPerWeek === d} onClick={() => update({ daysPerWeek: d })}>
                    {d} buổi
                  </Choice>
                ))}
              </div>
            </Section>
            <Section title="Thời lượng mỗi buổi">
              <div className="flex flex-wrap gap-2">
                {MINUTES.map((m) => (
                  <Choice key={m} selected={form.sessionMinutes === m} onClick={() => update({ sessionMinutes: m })}>
                    {m} phút
                  </Choice>
                ))}
              </div>
            </Section>
            <Section title="Bạn thích tập vào lúc nào?">
              <div className="grid grid-cols-2 gap-2">
                {PERIODS.map((p) => (
                  <Choice key={p.value} selected={form.preferredPeriod === p.value} onClick={() => update({ preferredPeriod: p.value })}>
                    {p.label}
                  </Choice>
                ))}
              </div>
            </Section>
          </>
        )}
      </div>

      {tried && error && (
        <p role="alert" className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-6 flex gap-3">
        {step > 0 && (
          <button type="button" onClick={back} className="rounded-xl border border-gray-300 px-5 py-3 text-gray-600 hover:bg-gray-100">
            Quay lại
          </button>
        )}
        {saved && step === 0 && (
          <button type="button" onClick={() => setEditing(false)} className="rounded-xl border border-gray-300 px-5 py-3 text-gray-600 hover:bg-gray-100">
            Huỷ
          </button>
        )}
        <button type="button" onClick={next} className="flex-1 rounded-xl bg-green-500 px-5 py-3 font-semibold text-white hover:bg-green-600">
          {isLast ? 'Lưu hồ sơ' : 'Tiếp tục'}
        </button>
      </div>
    </div>
  )
}