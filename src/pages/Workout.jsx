import { useState } from 'react'
import { Link } from 'react-router-dom'

export default function Workout() {
  // Logic 1: Quản lý chuyển đổi giữa Tuần này và Tuần sau
  const [activeWeekTab, setActiveWeekTab] = useState('thisWeek')

  // Logic 2: Danh sách lịch tập luyện trong tuần (có chức năng Bắt đầu / Đánh dấu hoàn thành)
  const [workouts, setWorkouts] = useState([
    {
      id: 1,
      dayKey: 'T2',
      date: '21/09',
      title: 'Tập thể dục',
      time: '06:00 - 07:00',
      duration: '30 phút',
      category: 'Cardio nhẹ',
      iconType: 'run',
      completed: true,
    },
    {
      id: 2,
      dayKey: 'T4',
      date: '23/09',
      title: 'Tập gym',
      time: '18:00 - 19:00',
      duration: '45 phút',
      category: 'Toàn thân',
      iconType: 'gym',
      completed: false,
    },
    {
      id: 3,
      dayKey: 'T6',
      date: '25/09',
      title: 'Yoga',
      time: '06:30 - 07:30',
      duration: '60 phút',
      category: 'Thư giãn',
      iconType: 'yoga',
      completed: false,
    },
    {
      id: 4,
      dayKey: 'CN',
      date: '27/09',
      title: 'Chạy bộ',
      time: '05:30 - 06:30',
      duration: '60 phút',
      category: 'Cardio',
      iconType: 'run',
      completed: false,
    },
  ])

  // Tính số buổi đã hoàn thành
  const completedCount = workouts.filter((w) => w.completed).length
  const totalCount = 5 // Target 5 buổi/tuần

  // Hàm chuyển đổi trạng thái hoàn thành bài tập
  const toggleWorkoutStatus = (id) => {
    setWorkouts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    )
  }

  // Render SVG Icon tương ứng
  const renderWorkoutIcon = (type) => {
    switch (type) {
      case 'gym':
        return (
          <svg className="h-5 w-5 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6h2m14 0h2M5 6v12m14-12v12M7 10h10M7 14h10" />
          </svg>
        )
      case 'yoga':
        return (
          <svg className="h-5 w-5 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4a2 2 0 100-4 2 2 0 000 4zM12 22s8-4 8-10A8 8 0 004 12c0 6 8 10 8 10z" />
          </svg>
        )
      default:
        return (
          <svg className="h-5 w-5 text-emerald-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        )
    }
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

      {/* Banner Top Header Tập Luyện */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#e6f4ea] via-[#f0f8f3] to-emerald-100 p-6 shadow-sm">
        <div className="relative z-10 flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <div className="space-y-3 max-w-xl">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#133e29] text-white shadow-sm">
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Tập luyện mỗi ngày</h1>
                <p className="text-xs text-gray-600">Khỏe hơn, dẻo dai hơn, phiên bản tốt hơn của bạn!</p>
              </div>
            </div>

            {/* 3 Thẻ đặc điểm */}
            <div className="flex flex-wrap gap-2 pt-1">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-emerald-900 shadow-2xs backdrop-blur-sm">
                <span>💚</span> Cải thiện sức khỏe tim mạch
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-emerald-900 shadow-2xs backdrop-blur-sm">
                <span>⚡</span> Tăng cường sức bền
              </div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-[11px] font-medium text-emerald-900 shadow-2xs backdrop-blur-sm">
                <span>💪</span> Nâng cao sức mạnh cơ bắp
              </div>
            </div>
          </div>

          {/* Góc phải Banner: Text nghệ thuật & Ảnh minh họa */}
          <div className="relative flex items-center justify-end">
            <span className="hidden lg:block text-lg font-serif italic text-[#133e29] font-semibold pr-4">
              Vận động là yêu thương bản thân ❤️
            </span>
            <div className="h-28 w-28 shrink-0">
              <img
                src="/yoga-woman.png"
                alt="Stretch"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://illustrations.pouch.cool/pack/fitness/1.png'
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bố cục Main 2 Cột */}
      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cột Trái: Danh Sách Lịch Tập (Chiếm 2 cột) */}
        <div className="space-y-4 lg:col-span-2">
          {/* Header nhóm & Xem chi tiết */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900">Lịch tập của bạn</h2>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-gray-500">🎯 Mục tiêu tuần này: <strong>{completedCount}/{totalCount} buổi</strong></span>
              <Link to="/schedule" className="font-semibold text-[#2d9354] hover:underline">
                Xem chi tiết →
              </Link>
            </div>
          </div>

          {/* Thanh chọn Tuần */}
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

          {/* Danh sách các buổi tập trong tuần */}
          <div className="space-y-3">
            {workouts.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-3xl border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-emerald-100"
              >
                <div className="flex items-center gap-4">
                  {/* Ô Ngày tháng */}
                  <div
                    className={`flex h-12 w-12 flex-col items-center justify-center rounded-2xl text-xs font-bold transition-all ${
                      item.completed
                        ? 'bg-[#2d9354] text-white'
                        : 'bg-[#f0f8f3] text-gray-700'
                    }`}
                  >
                    <span>{item.dayKey}</span>
                    <span className="text-[10px] opacity-80">{item.date}</span>
                    {item.completed && <span className="text-[9px]">✓</span>}
                  </div>

                  {/* Icon loại bài tập */}
                  <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f0f8f3]">
                    {renderWorkoutIcon(item.iconType)}
                  </div>

                  {/* Thông tin bài tập */}
                  <div>
                    <h3 className="text-sm font-bold text-gray-800">{item.title}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {item.time} • {item.duration} • {item.category}
                    </p>
                  </div>
                </div>

                {/* Nút Hành Động */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWorkoutStatus(item.id)}
                    className={`inline-flex items-center gap-1 rounded-2xl px-4 py-2 text-xs font-semibold transition-all ${
                      item.completed
                        ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        : 'bg-[#133e29] text-white hover:bg-emerald-900 shadow-sm'
                    }`}
                  >
                    {item.completed ? 'Đã hoàn thành' : 'Bắt đầu'}
                    <span className="text-xs">›</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Link sang trang lịch tuần */}
          <div className="pt-2">
            <Link
              to="/schedule"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-600 hover:text-[#133e29]"
            >
              <span>📅 Xem lịch tuần →</span>
            </Link>
          </div>
        </div>

        {/* Cột Phải: Tiến Độ + Bài Tập Gợi Ý + Quote (Chiếm 1 cột) */}
        <div className="space-y-5">
          {/* Card Tiến độ tập luyện */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                <svg className="h-4 w-4 text-[#133e29]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Tiến độ tập luyện</span>
              </div>
              <span className="text-xs font-bold text-gray-500">
                {completedCount}/{totalCount} buổi
              </span>
            </div>

            {/* Thanh Progress */}
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#2d9354] transition-all duration-500"
                style={{ width: `${(completedCount / totalCount) * 100}%` }}
              ></div>
            </div>

            {/* Tip box */}
            <div className="rounded-2xl bg-[#f0f8f3] p-3 text-[11px] text-emerald-900 leading-relaxed font-medium">
              💡 <strong>Bạn đang làm rất tốt!</strong> Cố gắng hoàn thành {totalCount - completedCount} buổi còn lại trong tuần này nhé!
            </div>
          </div>

          {/* Card Bài Tập Gợi Ý Hôm Nay */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                <span className="text-emerald-700">🏋️</span> Bài tập gợi ý hôm nay
              </div>
              <span className="text-gray-400 text-xs">›</span>
            </div>

            {/* Khung minh họa Plank */}
            <div className="flex items-center gap-3 rounded-2xl bg-[#f0f8f3] p-3">
              <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-white p-1">
                <img
                  src="/plank-exercise.png"
                  alt="Plank"
                  className="h-full w-full object-contain"
                  onError={(e) => {
                    e.target.onerror = null
                    e.target.src = 'https://illustrations.pouch.cool/pack/fitness/2.png'
                  }}
                />
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-800">Plank cơ bản</h4>
                <p className="text-[10px] text-gray-500 mt-1">⏱ 3 hiệp • ⏱ 30 giây</p>
              </div>
            </div>

            <button className="w-full rounded-2xl bg-[#133e29] py-2.5 text-center text-xs font-semibold text-white shadow transition-all hover:bg-emerald-900">
              Xem chi tiết ›
            </button>
          </div>

          {/* Banner Động Lực "Tập Luyện Đúng Cách" */}
          <div className="relative min-h-[140px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#e6f4ea] via-[#f0f8f3] to-emerald-100 p-5 shadow-sm">
            <div className="relative z-10 max-w-[170px] space-y-1">
              <span className="text-base font-serif italic text-[#133e29] font-bold block leading-snug">
                Tập luyện đúng cách = Kết quả rõ rệt!
              </span>
            </div>

            {/* Minh họa dụng cụ tập gym */}
            <div className="absolute -bottom-2 -right-2 z-0 h-32 w-32 opacity-90">
              <img
                src="/gym-equipments.png"
                alt="Equipments"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://illustrations.pouch.cool/pack/fitness/5.png'
                }}
              />
            </div>
          </div>

          {/* Box Quote Truyền Cảm Hứng */}
          <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm space-y-2">
            <div className="flex items-center gap-1 text-xs text-emerald-700">
              <span>🍃</span>
            </div>
            <p className="text-xs text-gray-600 italic leading-relaxed">
              "Không có giới hạn nào cho những gì bạn có thể đạt được khi bạn chăm sóc sức khỏe của mình."
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}