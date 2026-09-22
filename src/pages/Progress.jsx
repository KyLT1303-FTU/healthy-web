import { useState } from 'react'

export default function Progress() {
  // Logic 1: Dữ liệu chỉ số sức khỏe hàng ngày
  const [dailyStats, setDailyStats] = useState({
    calories: 320, // kcal
    steps: 6450, // bước
    activeMinutes: 45, // phút
    water: 1.8, // lít
    sleep: 7.5, // giờ
  })

  // Logic 2: Quản lý Cân nặng (Hiện tại & Mục tiêu)
  const [weightData, setWeightData] = useState({
    current: 55,
    target: 50,
  })
  const [isEditingWeight, setIsEditingWeight] = useState(false)
  const [tempWeight, setTempWeight] = useState(55)
  const [savedSuccessMsg, setSavedSuccessMsg] = useState(false)

  const handleSaveWeight = () => {
    setWeightData((prev) => ({ ...prev, current: Number(tempWeight) }))
    setIsEditingWeight(false)
    setSavedSuccessMsg(true)
    setTimeout(() => setSavedSuccessMsg(false), 3000)
  }

  // Logic 3: Thay thế "Huấn luyện nâng cao" bằng "Các huy hiệu đã đạt được"
  const [badgeFilter, setBadgeFilter] = useState('all') // 'all' | 'unlocked' | 'locked'

  const [badges, setBadges] = useState([
    {
      id: 'b1',
      title: 'Người dậy sớm',
      desc: 'Tập thể dục trước 7:00 sáng trong 3 ngày liên tiếp',
      icon: '🌅',
      unlocked: true,
      unlockedDate: '18/09/2026',
      progress: '3/3',
    },
    {
      id: 'b2',
      title: 'Chiến thần Cardio',
      desc: 'Đốt cháy trên 300 kcal trong một buổi tập',
      icon: '🔥',
      unlocked: true,
      unlockedDate: '20/09/2026',
      progress: '320/300 kcal',
    },
    {
      id: 'b3',
      title: 'Uống đủ 2L nước',
      desc: 'Duy trì thói quen uống đủ 2L nước trong 5 ngày',
      icon: '💧',
      unlocked: true,
      unlockedDate: '21/09/2026',
      progress: '5/5 ngày',
    },
    {
      id: 'b4',
      title: 'Chăm chỉ 7 ngày',
      desc: 'Đăng nhập và hoàn thành mục tiêu 7 ngày liên tiếp',
      icon: '🏆',
      unlocked: true,
      unlockedDate: '22/09/2026',
      progress: '7/7 ngày',
    },
    {
      id: 'b5',
      title: 'Chinh phục 10k bước',
      desc: 'Đi bộ đạt mốc 10.000 bước trong một ngày',
      icon: '👟',
      unlocked: false,
      progress: '6.450 / 10.000 bước',
    },
    {
      id: 'b6',
      title: 'Yogi kiên trì',
      desc: 'Hoàn thành 5 bài tập Yoga thư giãn',
      icon: '🧘‍♀️',
      unlocked: false,
      progress: '2/5 buổi',
    },
    {
      id: 'b7',
      title: 'Ngủ đủ 8 tiếng',
      desc: 'Duy trì giấc ngủ từ 7-8 tiếng trong 7 ngày',
      icon: '🌙',
      unlocked: true,
      unlockedDate: '15/09/2026',
      progress: '7/7 ngày',
    },
    {
      id: 'b8',
      title: 'Giữ vững kỷ luật',
      desc: 'Hoàn thành 100% mục tiêu tuần đặt ra',
      icon: '🎯',
      unlocked: false,
      progress: '3/5 mục tiêu',
    },
  ])

  // Lọc danh sách huy hiệu
  const filteredBadges = badges.filter((b) => {
    if (badgeFilter === 'unlocked') return b.unlocked
    if (badgeFilter === 'locked') return !b.unlocked
    return true
  })

  const unlockedCount = badges.filter((b) => b.unlocked).length

  return (
    <div className="relative space-y-6">
      {/* Trang trí họa tiết chùm lá góc trên bên phải */}
      <div className="pointer-events-none absolute -right-8 -top-8 z-0 opacity-80">
        <svg className="h-36 w-36 text-emerald-300/40" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0C50 0 55 25 75 35C95 45 100 70 100 70C100 70 75 65 65 45C55 25 50 0 50 0Z" />
          <path d="M30 20C30 20 40 40 60 50C80 60 85 85 85 85C85 85 60 75 50 55C40 35 30 20 30 20Z" />
        </svg>
      </div>

      {/* --- PHẦN 1: TIẾN ĐỘ THÔNG SỐ HÀNG NGÀY --- */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#133e29] text-white shadow-sm">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Tiến độ</h1>
            <p className="text-xs text-gray-500">
              Theo dõi hành trình chăm sóc sức khỏe của bạn mỗi ngày!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
          {/* 5 Thẻ Chỉ Số */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-5 lg:col-span-9">
            {/* Calo đã đốt */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-3.5 text-center transition-all hover:bg-emerald-50/30">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                🔥
              </div>
              <p className="mt-2 text-[11px] text-gray-500 font-medium">Calo đã đốt</p>
              <p className="text-base font-bold text-gray-800">{dailyStats.calories} <span className="text-xs font-normal">kcal</span></p>
              <p className="text-[10px] text-gray-400">Hôm nay</p>
            </div>

            {/* Số bước chân */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-3.5 text-center transition-all hover:bg-emerald-50/30">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
                👟
              </div>
              <p className="mt-2 text-[11px] text-gray-500 font-medium">Số bước chân</p>
              <p className="text-base font-bold text-gray-800">{dailyStats.steps.toLocaleString()} <span className="text-xs font-normal">bước</span></p>
              <p className="text-[10px] text-gray-400">Hôm nay</p>
            </div>

            {/* Thời gian vận động */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-3.5 text-center transition-all hover:bg-emerald-50/30">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                ⏱
              </div>
              <p className="mt-2 text-[11px] text-gray-500 font-medium">Thời gian vận động</p>
              <p className="text-base font-bold text-gray-800">{dailyStats.activeMinutes} <span className="text-xs font-normal">phút</span></p>
              <p className="text-[10px] text-gray-400">Hôm nay</p>
            </div>

            {/* Lượng nước */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-3.5 text-center transition-all hover:bg-emerald-50/30">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-100 text-cyan-600">
                💧
              </div>
              <p className="mt-2 text-[11px] text-gray-500 font-medium">Lượng nước</p>
              <p className="text-base font-bold text-gray-800">{dailyStats.water} <span className="text-xs font-normal">lít</span></p>
              <p className="text-[10px] text-gray-400">Hôm nay</p>
            </div>

            {/* Giấc ngủ */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-3.5 text-center transition-all hover:bg-emerald-50/30">
              <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                😊
              </div>
              <p className="mt-2 text-[11px] text-gray-500 font-medium">Giấc ngủ</p>
              <p className="text-base font-bold text-gray-800">{dailyStats.sleep} <span className="text-xs font-normal">giờ</span></p>
              <p className="text-[10px] text-gray-400">Hôm nay</p>
            </div>
          </div>

          {/* Banner Động Lực "Cố lên! Bạn đang làm rất tốt!" */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#e6f4ea] via-[#f0f8f3] to-emerald-100 p-4 lg:col-span-3 flex items-center justify-between">
            <div className="space-y-1 z-10 max-w-[130px]">
              <p className="text-sm font-serif italic text-[#133e29] font-bold leading-tight">
                Cố lên! Bạn đang làm rất tốt! ❤️
              </p>
            </div>
            <div className="h-24 w-24 shrink-0">
              <img
                src="/drinking-water-woman.png"
                alt="Drinking water"
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

      {/* --- PHẦN 2: THAY THẾ "HUẤN LUYỆN NÂNG CAO" BẰNG "CÁC HUY HIỆU ĐÃ ĐẠT ĐƯỢC" --- */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        {/* Header Của Khu Vực Huy Hiệu */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#133e29] text-white shadow-sm">
              <span className="text-lg">🏅</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-gray-900">Các huy hiệu đã đạt được</h2>
                <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800">
                  {unlockedCount}/{badges.length}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                Ghi nhận những cột mốc kỷ luật và nỗ lực tuyệt vời của bạn!
              </p>
            </div>
          </div>

          {/* Bộ lọc Huy Hiệu */}
          <div className="flex rounded-2xl bg-gray-100/80 p-1 text-xs font-semibold">
            <button
              onClick={() => setBadgeFilter('all')}
              className={`rounded-xl px-3 py-1.5 transition-all ${
                badgeFilter === 'all'
                  ? 'bg-[#133e29] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Tất cả ({badges.length})
            </button>
            <button
              onClick={() => setBadgeFilter('unlocked')}
              className={`rounded-xl px-3 py-1.5 transition-all ${
                badgeFilter === 'unlocked'
                  ? 'bg-[#133e29] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Đã mở ({unlockedCount})
            </button>
            <button
              onClick={() => setBadgeFilter('locked')}
              className={`rounded-xl px-3 py-1.5 transition-all ${
                badgeFilter === 'locked'
                  ? 'bg-[#133e29] text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Chưa mở ({badges.length - unlockedCount})
            </button>
          </div>
        </div>

        {/* Danh Sách Huy Hiệu (Grid 4 cột) */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filteredBadges.map((badge) => (
            <div
              key={badge.id}
              className={`relative flex items-start gap-3 rounded-2xl border p-3.5 transition-all ${
                badge.unlocked
                  ? 'border-emerald-100 bg-gradient-to-b from-[#f0f8f3] to-white hover:border-emerald-300 shadow-2xs'
                  : 'border-gray-100 bg-gray-50/60 opacity-60'
              }`}
            >
              {/* Badge Icon */}
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-2xs ${
                  badge.unlocked
                    ? 'bg-white text-emerald-800 border border-emerald-100'
                    : 'bg-gray-200 grayscale'
                }`}
              >
                {badge.icon}
              </div>

              {/* Thông tin Huy Hiệu */}
              <div className="min-w-0 flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h3 className="truncate text-xs font-bold text-gray-800">{badge.title}</h3>
                  {badge.unlocked ? (
                    <span className="text-[10px] text-emerald-700 font-bold">✓ Đã đạt</span>
                  ) : (
                    <span className="text-[10px] text-gray-400">🔒 Khóa</span>
                  )}
                </div>

                <p className="text-[10px] text-gray-500 leading-tight line-clamp-2">{badge.desc}</p>

                <div className="pt-1 text-[10px] font-medium text-gray-400">
                  {badge.unlocked ? (
                    <span className="text-emerald-700/80">Ngày đạt: {badge.unlockedDate}</span>
                  ) : (
                    <span>Tiến độ: {badge.progress}</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- PHẦN 3: CÂN NẶNG --- */}
      <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#133e29] text-white shadow-sm">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 18h12l3-18H3z" />
            </svg>
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Cân nặng</h2>
            <p className="text-xs text-gray-500">
              Theo dõi cân nặng để đánh giá hiệu quả quá trình tập luyện và dinh dưỡng.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-12 items-center">
          {/* Form / Khung Cân Nặng Hiện Tại & Mục Tiêu */}
          <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-4 lg:col-span-8 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              {/* Cân nặng hiện tại */}
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Cân nặng hiện tại</p>
                {isEditingWeight ? (
                  <div className="flex items-center gap-1 mt-1">
                    <input
                      type="number"
                      value={tempWeight}
                      onChange={(e) => setTempWeight(e.target.value)}
                      className="w-16 rounded-xl border border-emerald-500 px-2 py-1 text-sm font-bold text-gray-800 outline-none"
                    />
                    <span className="text-xs font-bold text-gray-600">kg</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-gray-800">{weightData.current} <span className="text-xs font-normal">kg</span></p>
                    <button
                      onClick={() => setIsEditingWeight(true)}
                      className="text-gray-400 hover:text-emerald-700 transition-colors"
                      title="Chỉnh sửa cân nặng"
                    >
                      ✏️
                    </button>
                  </div>
                )}
              </div>

              <div className="h-8 w-px bg-gray-200"></div>

              {/* Mục tiêu */}
              <div>
                <p className="text-[11px] text-gray-400 font-medium">Mục tiêu</p>
                <div className="flex items-center gap-1.5">
                  <p className="text-xl font-bold text-gray-800">{weightData.target} <span className="text-xs font-normal">kg</span></p>
                  <span className="text-emerald-600 text-xs">🎯</span>
                </div>
              </div>
            </div>

            {/* Nút Lưu Cân Nặng */}
            <div className="flex items-center gap-3">
              {savedSuccessMsg && (
                <span className="text-xs font-medium text-emerald-700 animate-fade-in">
                  ✓ Đã lưu thành công!
                </span>
              )}
              <button
                onClick={handleSaveWeight}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#2d9354] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition-all hover:bg-emerald-800"
              >
                <span>💾</span> Lưu cân nặng
              </button>
            </div>
          </div>

          {/* Banner Động Lực Cân Nặng Góc Phải */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#e6f4ea] via-[#f0f8f3] to-emerald-100 p-4 lg:col-span-4 flex items-center justify-between">
            <div className="space-y-1 z-10 max-w-[150px]">
              <p className="text-xs font-serif italic text-[#133e29] font-semibold leading-relaxed">
                Mỗi kg giảm đi là một bước tiến gần hơn đến phiên bản tốt hơn của bạn! ❤️
              </p>
            </div>
            <div className="h-20 w-20 shrink-0">
              <img
                src="/weight-scale.png"
                alt="Weight scale"
                className="h-full w-full object-contain"
                onError={(e) => {
                  e.target.onerror = null
                  e.target.src = 'https://illustrations.pouch.cool/pack/fitness/6.png'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}