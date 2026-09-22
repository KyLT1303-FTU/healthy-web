import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Schedule() {
  // Logic 1: Chuyển đổi giữa Tuần này và Tuần sau
  const [activeWeekTab, setActiveWeekTab] = useState('thisWeek') // 'thisWeek' | 'nextWeek'

  // Logic 2: Danh sách mục tiêu tuần này (có thể click để tích chọn/bỏ chọn)
  const [goals, setGoals] = useState([
    { id: 1, text: 'Tập thể dục 3 buổi/tuần', completed: true },
    { id: 2, text: 'Uống đủ nước (2L/ngày)', completed: true },
    { id: 3, text: 'Ăn nhiều rau xanh', completed: false },
    { id: 4, text: 'Ngủ đủ 7–8 tiếng/ngày', completed: false },
    { id: 5, text: 'Giảm đồ ngọt, đồ ăn nhanh', completed: true },
  ])

  // Tính số lượng mục tiêu đã hoàn thành
  const completedGoalsCount = goals.filter((g) => g.completed).length

  // Hàm toggle trạng thái mục tiêu
  const toggleGoal = (id) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, completed: !g.completed } : g))
    )
  }

  // Danh sách các khung giờ hiển thị trong lịch
  const timeSlots = [
    '06:00',
    '07:00',
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '12:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
  ]

  // Các ngày trong tuần này (21/09 - 27/09)
  const days = [
    { key: 'T2', date: '21/09', active: true },
    { key: 'T3', date: '22/09', active: false },
    { key: 'T4', date: '23/09', active: false },
    { key: 'T5', date: '24/09', active: false },
    { key: 'T6', date: '25/09', active: false },
    { key: 'T7', date: '26/09', active: false },
    { key: 'CN', date: '27/09', active: false },
  ]

  // Danh sách các sự kiện / lịch đã lên kế hoạch
  const scheduledEvents = [
    {
      day: 'T2',
      time: '06:00',
      title: 'Tập thể dục',
      duration: '06:00 - 07:00',
      icon: '🏋️',
      colorBg: 'bg-[#2d9354] text-white',
    },
    {
      day: 'T2',
      time: '12:00',
      title: 'Ăn trưa',
      duration: '12:00 - 13:00',
      icon: '🍴',
      colorBg: 'bg-[#f0f8f3] text-emerald-900 border border-emerald-200',
    },
    {
      day: 'T3',
      time: '08:00',
      title: 'Ăn sáng',
      duration: '08:00 - 08:30',
      icon: '🍴',
      colorBg: 'bg-[#f0f8f3] text-emerald-900 border border-emerald-200',
    },
    {
      day: 'T4',
      time: '16:00',
      title: 'Tập luyện',
      duration: '16:00 - 17:00',
      icon: '🏃',
      colorBg: 'bg-[#f0f8f3] text-emerald-900 border border-emerald-200',
    },
  ]

  // Hàm tìm sự kiện cho 1 ô lịch cụ thể
  const getEvent = (dayKey, timeSlot) => {
    return scheduledEvents.find(
      (ev) => ev.day === dayKey && ev.time === timeSlot
    )
  }

  return (
    <div className="relative space-y-6">
      {/* Trang trí họa tiết chùm lá góc trên bên phải */}
      <div className="pointer-events-none absolute -right-8 -top-8 z-0 opacity-80">
        <svg className="h-36 w-36 text-emerald-300/40" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0C50 0 55 25 75 35C95 45 100 70 100 70C100 70 75 65 65 45C55 25 50 0 50 0Z" />
          <path d="M30 20C30 20 40 40 60 50C80 60 85 85 85 85C85 85 60 75 50 55C40 35 30 20 30 20Z" />
        </svg>
      </div>

      {/* Header Trang Lịch Tuần */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#133e29] text-white shadow-sm">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lịch tuần</h1>
            <p className="text-xs text-gray-500">
              Sắp xếp thời gian, duy trì thói quen để đạt mục tiêu sức khỏe của bạn!
            </p>
          </div>
        </div>

        {/* Chữ nghệ thuật góc trên phải */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-xl font-serif italic text-[#133e29] font-medium">
            Kỷ luật hôm nay là sức khỏe ngày mai ❤️
          </span>
        </div>
      </div>

      {/* Bố cục 2 Cột Main */}
      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cột Trái: Bảng Lịch Tuần (Chiếm 2 cột) */}
        <div className="space-y-4 lg:col-span-2">
          {/* Thanh điều hướng Tuần & Nút chuyển Tuần này / Tuần sau */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 rounded-2xl border border-gray-100 bg-white px-3 py-2 text-xs font-semibold text-gray-700 shadow-sm">
              <button className="text-gray-400 hover:text-gray-700">‹</button>
              <div className="flex items-center gap-1.5">
                <svg className="h-4 w-4 text-[#133e29]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>
                  {activeWeekTab === 'thisWeek'
                    ? 'Tuần này (21/09 – 27/09)'
                    : 'Tuần sau (28/09 – 04/10)'}
                </span>
              </div>
              <button className="text-gray-400 hover:text-gray-700">›</button>
            </div>

            <div className="flex rounded-2xl bg-gray-100/80 p-1 text-xs font-semibold">
              <button
                onClick={() => setActiveWeekTab('thisWeek')}
                className={`rounded-xl px-4 py-1.5 transition-all ${
                  activeWeekTab === 'thisWeek'
                    ? 'bg-[#133e29] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tuần này
              </button>
              <button
                onClick={() => setActiveWeekTab('nextWeek')}
                className={`rounded-xl px-4 py-1.5 transition-all ${
                  activeWeekTab === 'nextWeek'
                    ? 'bg-[#133e29] text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Tuần sau
              </button>
            </div>
          </div>

          {/* Card Bảng Kế Hoạch Trong Tuần */}
          <div className="overflow-x-auto rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2 text-sm font-bold text-gray-800">
              <svg className="h-5 w-5 text-[#133e29]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Kế hoạch trong tuần</span>
            </div>

            {/* Grid Bảng Thời Gian & Ngày */}
            <div className="min-w-[640px]">
              {/* Header Ngày */}
              <div className="grid grid-cols-8 gap-1.5 pb-2 text-center text-xs">
                <div className="py-2 text-gray-400 font-medium"></div>
                {days.map((d) => (
                  <div
                    key={d.key}
                    className={`rounded-2xl py-2 font-semibold transition-all ${
                      d.active
                        ? 'bg-[#2d9354] text-white shadow-sm'
                        : 'bg-[#f0f8f3] text-gray-700'
                    }`}
                  >
                    <div>{d.key}</div>
                    <div className="text-[10px] opacity-80">{d.date}</div>
                  </div>
                ))}
              </div>

              {/* Dòng Khung Giờ */}
              <div className="divide-y divide-gray-50">
                {timeSlots.map((time) => (
                  <div key={time} className="grid grid-cols-8 gap-1.5 py-1.5 items-center text-center">
                    {/* Cột hiển thị Giờ */}
                    <div className="text-[11px] font-semibold text-gray-400">{time}</div>

                    {/* 7 Cột tương ứng 7 ngày trong tuần */}
                    {days.map((d) => {
                      const ev = activeWeekTab === 'thisWeek' ? getEvent(d.key, time) : null

                      return (
                        <div key={d.key} className="min-h-[38px] flex items-center justify-center">
                          {ev ? (
                            <div className={`w-full rounded-xl px-1.5 py-1 text-[10px] font-medium shadow-2xs ${ev.colorBg}`}>
                              <div className="font-bold flex items-center justify-center gap-1">
                                <span>{ev.icon}</span> {ev.title}
                              </div>
                              <div className="text-[9px] opacity-90">{ev.duration}</div>
                            </div>
                          ) : (
                            <button className="text-gray-300 hover:text-emerald-600 transition-colors text-xs font-light">
                              +
                            </button>
                          )}
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Cột Phải: Card Mục tiêu tuần & Banner Gợi ý (Chiếm 1 cột) */}
        <div className="space-y-5">
          {/* Card Mục Tiêu Tuần Này */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f0f8f3] text-[#133e29]">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-sm font-bold text-gray-800">Mục tiêu tuần này</h3>
              </div>
              <span className="text-xs text-gray-400 font-medium">
                {completedGoalsCount}/{goals.length} hoàn thành
              </span>
            </div>

            {/* Danh sách Mục tiêu Tích chọn */}
            <div className="space-y-2.5">
              {goals.map((g) => (
                <button
                  key={g.id}
                  onClick={() => toggleGoal(g.id)}
                  className="flex w-full items-center gap-3 text-left transition-all hover:opacity-80"
                >
                  <div
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-all ${
                      g.completed
                        ? 'border-[#133e29] bg-[#133e29] text-white'
                        : 'border-gray-300 bg-white'
                    }`}
                  >
                    {g.completed && <span className="text-[10px] font-bold">✓</span>}
                  </div>
                  <span
                    className={`text-xs ${
                      g.completed ? 'text-gray-800 font-medium' : 'text-gray-500'
                    }`}
                  >
                    {g.text}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Card Gợi Ý Hôm Nay */}
          <div className="relative rounded-3xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                <span className="text-amber-500 text-sm">💡</span> Gợi ý hôm nay
              </div>
              <span className="text-emerald-600 text-xs">🍃</span>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Bạn đã tập luyện 2 ngày liên tiếp! Hãy tiếp tục duy trì để đạt hiệu quả tốt nhất nhé!
            </p>

            <button className="inline-flex items-center gap-1.5 rounded-full bg-[#133e29] px-4 py-2 text-[11px] font-semibold text-white shadow transition-all hover:bg-emerald-900">
              Xem chi tiết <span>›</span>
            </button>
          </div>

          {/* Banner Động Lực Tập Luyện Nữ */}
          <div className="relative min-h-[160px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#e6f4ea] via-[#f0f8f3] to-emerald-100 p-5 shadow-sm">
            <div className="relative z-10 max-w-[170px] space-y-2">
              <span className="text-2xl font-serif italic text-[#133e29] font-semibold block">
                Khỏe mạnh là hạnh phúc ❤️
              </span>
              <Link
                to="/workout"
                className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-[#133e29] px-3.5 py-2 text-[11px] font-semibold text-white shadow transition-all hover:bg-emerald-900"
              >
                Xem các bài tập gợi ý <span>›</span>
              </Link>
            </div>

            {/* Minh họa người tập gym góc phải */}
            <div className="absolute -bottom-1 -right-2 z-0 h-36 w-36 opacity-90">
              <img
                src="/fitness-woman.png"
                alt="Fitness Woman"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://illustrations.pouch.cool/pack/fitness/4.png'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}