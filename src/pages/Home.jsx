import { useState } from 'react'
import { Link } from 'react-router-dom'
import useLocalStorage from '../store/useLocalStorage'

export default function Home() {
  // Logic 1: Đọc dữ liệu hồ sơ thực tế từ LocalStorage
  const [profile] = useLocalStorage('profile', {
    name: 'Người dùng',
    goal: 'Tăng cơ',
    sessionsPerWeek: '3',
    weight: '55',
  })

  // Logic 2: Quản lý trạng thái đánh dấu bài tập trong ngày
  const [todayExercises, setTodayExercises] = useState([
    { id: 1, title: 'Khởi động & Cardio nhẹ', duration: '10 phút', level: 'Dễ', done: true },
    { id: 2, title: 'Tập cơ ngực & Tay sau', duration: '15 phút', level: 'Trung bình', done: false },
    { id: 3, title: 'Giãn cơ & Hồi phục', duration: '5 phút', level: 'Dễ', done: false },
  ])

  // Hàm toggle trạng thái bài tập (Hoàn thành / Chưa hoàn thành)
  const toggleExercise = (id) => {
    setTodayExercises((prev) =>
      prev.map((ex) => (ex.id === id ? { ...ex, done: !ex.done } : ex))
    )
  }

  // Dữ liệu chỉ số trong ngày
  const dailyStats = [
    {
      title: 'Calo tiêu thụ',
      value: '420 / 600',
      unit: 'kcal',
      percent: 70,
      icon: (
        <svg className="h-5 w-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
    },
    {
      title: 'Thời gian tập',
      value: '25 / 30',
      unit: 'phút',
      percent: 83,
      icon: (
        <svg className="h-5 w-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Số bước chân',
      value: '6,450',
      unit: 'bước',
      percent: 64,
      icon: (
        <svg className="h-5 w-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Nước đã uống',
      value: '1.8 / 2.5',
      unit: 'Lít',
      percent: 72,
      icon: (
        <svg className="h-5 w-5 text-emerald-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L5.6 15.12a2 2 0 00-1.282.234l-.458.275a2 2 0 00-.73 2.548l.2.399A10 10 0 0012 22a10 10 0 008.67-4.944l.2-.399a2 2 0 00-.73-2.548l-.712-.427z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="relative space-y-6">
      {/* Trang trí họa tiết chùm lá góc trên bên phải */}
      <div className="pointer-events-none absolute -right-8 -top-8 z-0 opacity-80">
        <svg className="h-36 w-36 text-emerald-300/40" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0C50 0 55 25 75 35C95 45 100 70 100 70C100 70 75 65 65 45C55 25 50 0 50 0Z" />
          <path d="M30 20C30 20 40 40 60 50C80 60 85 85 85 85C85 85 60 75 50 55C40 35 30 20 30 20Z" />
        </svg>
      </div>

      {/* Header Trang chủ */}
      <div className="relative z-10 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Xin chào, <span className="text-[#133e29]">{profile?.name || 'Người dùng'}</span> 👋
          </h1>
          <p className="mt-0.5 text-xs text-gray-500">
            Hôm nay là một ngày tuyệt vời để duy trì thói quen lành mạnh!
          </p>
        </div>

        <div className="hidden md:flex flex-col items-end">
          <span className="text-2xl font-serif italic text-[#133e29] font-medium tracking-wide">
            Khỏe mạnh là hạnh phúc ❤️
          </span>
        </div>
      </div>

      {/* Banner Chào Mừng & Động Lực Tập Luyện */}
      <div className="relative z-10 overflow-hidden rounded-3xl bg-gradient-to-r from-[#133e29] via-[#1b5037] to-[#2d9354] p-6 text-white shadow-sm">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs text-emerald-100 backdrop-blur-md">
            <span>🍃</span> Thói quen hôm nay • Mục tiêu {profile?.goal || 'Tăng cơ'}
          </div>
          <h2 className="text-xl font-bold leading-tight sm:text-2xl">
            Sẵn sàng cho buổi tập {profile?.sessionsPerWeek || 3} buổi/tuần của bạn chưa?
          </h2>
          <p className="text-xs text-emerald-100/90 leading-relaxed">
            Kiên trì nhỏ mỗi ngày sẽ mang đến sự thay đổi lớn cho sức khỏe và vóc dáng của bạn.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Link
              to="/workout"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-xs font-bold text-[#133e29] shadow transition-all hover:bg-emerald-50"
            >
              <span>▶</span> Bắt đầu tập ngay
            </Link>
            <Link
              to="/schedule"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-2.5 text-xs font-semibold text-white backdrop-blur-sm transition-all hover:bg-white/20"
            >
              Xem lịch tuần
            </Link>
          </div>
        </div>

        {/* Họa tiết vòng tròn chìm góc dưới */}
        <div className="absolute -bottom-10 -right-10 h-60 w-60 rounded-full bg-white/5 pointer-events-none"></div>
      </div>

      {/* Lưới 4 Thẻ Chỉ Số Nhanh trong Ngày */}
      <div className="relative z-10 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {dailyStats.map((item, idx) => (
          <div key={idx} className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#f0f8f3]">
                {item.icon}
              </div>
              <span className="text-[11px] font-semibold text-emerald-800 bg-[#f0f8f3] px-2 py-0.5 rounded-full">
                {item.percent}%
              </span>
            </div>
            <div>
              <p className="text-[11px] text-gray-400">{item.title}</p>
              <p className="text-base font-bold text-gray-900 mt-0.5">
                {item.value} <span className="text-xs font-normal text-gray-500">{item.unit}</span>
              </p>
            </div>
            {/* Thanh tiến trình Progress Bar */}
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-[#2d9354] transition-all duration-500"
                style={{ width: `${item.percent}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Bố cục 2 Cột Main */}
      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cột Trái: Lộ trình hôm nay (Chiếm 2 cột) */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#133e29] text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-800">Lộ trình hôm nay</h2>
                  <p className="text-[11px] text-gray-400">3 bài tập được đề xuất riêng cho bạn</p>
                </div>
              </div>
              <Link to="/workout" className="text-xs font-semibold text-[#2d9354] hover:underline">
                Xem tất cả →
              </Link>
            </div>

            {/* Danh sách bài tập có tương tác click toggle */}
            <div className="divide-y divide-gray-50 pt-2">
              {todayExercises.map((ex) => (
                <div key={ex.id} className="flex items-center justify-between py-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleExercise(ex.id)}
                      className={`flex h-8 w-8 items-center justify-center rounded-xl text-xs font-bold transition-all ${
                        ex.done
                          ? 'bg-[#f0f8f3] text-emerald-800'
                          : 'bg-gray-100 text-gray-500 hover:bg-emerald-100'
                      }`}
                    >
                      {ex.done ? '✓' : ex.id}
                    </button>
                    <div>
                      <p className={`text-xs font-semibold ${ex.done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                        {ex.title}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        ⏱ {ex.duration} • Độ khó: {ex.level}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleExercise(ex.id)}
                    className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                      ex.done
                        ? 'bg-gray-100 text-gray-400'
                        : 'bg-[#f0f8f3] text-[#133e29] hover:bg-[#2d9354] hover:text-white'
                    }`}
                  >
                    {ex.done ? 'Hoàn thành' : 'Tập ngay'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cột Phải: Mẹo dinh dưỡng & Card Truyền động lực (Chiếm 1 cột) */}
        <div className="space-y-5">
          {/* Card Mẹo Dinh Dưỡng */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-[#133e29]">
              <span className="text-emerald-600">🥗</span> Mẹo dinh dưỡng trong ngày
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">
              Uống đủ 1 ly nước ấm ngay sau khi thức dậy giúp kích hoạt hệ tiêu hóa và tăng cường trao đổi chất tốt hơn.
            </p>
            <div className="rounded-2xl bg-[#f0f8f3] p-3 text-[11px] text-emerald-900 font-medium">
              💡 Bổ sung đủ đạm cho mục tiêu <strong>{profile?.goal || 'Tăng cơ'}</strong> sau mỗi buổi tập.
            </div>
          </div>

          {/* Banner Động lực Tập Luyện */}
          <div className="relative min-h-[150px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#e6f4ea] via-[#f0f8f3] to-emerald-100 p-5 shadow-sm">
            <div className="relative z-10 max-w-[170px] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                <span className="text-emerald-600">🍃</span> Hãy tiếp tục
              </div>
              <h4 className="text-sm font-extrabold text-[#133e29]">
                vì sức khỏe của bạn!
              </h4>
              <p className="text-[11px] leading-relaxed text-emerald-900/80">
                Mỗi lựa chọn lành mạnh hôm nay đều là một bước tiến cho tương lai.
              </p>
              <Link
                to="/progress"
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#133e29] px-3.5 py-2 text-[11px] font-semibold text-white shadow transition-all hover:bg-emerald-900"
              >
                <span>📊</span> Theo dõi tiến độ
              </Link>
            </div>

            {/* Ảnh minh họa vận động viên */}
            <div className="absolute -bottom-1 -right-2 z-0 h-36 w-36 opacity-90">
              <img
                src="/fitness-man.png"
                alt="Fitness"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://illustrations.pouch.cool/pack/fitness/3.png'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}