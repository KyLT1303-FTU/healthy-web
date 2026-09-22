import { Link } from 'react-router-dom'
import useLocalStorage from '../store/useLocalStorage'

export default function Onboarding() {
  const [profile, setProfile] = useLocalStorage('profile', {
    name: 'Người dùng',
    gender: 'Nam',
    dob: '—',
    height: '165',
    weight: '55',
    goal: 'Tăng cơ',
    healthStatus: 'Mới bắt đầu',
    sportsInterest: 'Không có',
    sessionsPerWeek: '3',
    durationPerSession: '30',
    preferredGear: 'Lọc nào cũng được',
    joinedDate: '22/09/2026',
  })

  const handleReset = () => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hồ sơ và làm lại không?')) {
      setProfile(null)
    }
  }

  // Danh sách 11 dòng thông tin chi tiết
  const rows = [
    {
      icon: (
        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      label: 'Tên người dùng',
      value: profile?.name || 'Người dùng',
    },
    {
      icon: (
        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      label: 'Giới tính',
      value: profile?.gender || 'Nam',
    },
    {
      icon: (
        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Ngày sinh',
      value: profile?.dob || '—',
    },
    {
      icon: (
        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
      label: 'Chiều cao',
      value: `${profile?.height || 165} cm`,
    },
    {
      icon: (
        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5 0 006 0l-3-9zm0 0h12m0 0l3 1m0 0l-3 9a5 0 01-6 0l3-9z" />
        </svg>
      ),
      label: 'Cân nặng',
      value: `${profile?.weight || 55} kg`,
    },
    {
      icon: (
        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Mục tiêu',
      value: profile?.goal || 'Tăng cơ',
    },
    {
      icon: (
        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      label: 'Tình trạng sức khỏe',
      value: profile?.healthStatus || 'Mới bắt đầu',
    },
    {
      icon: (
        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      label: 'Sở thích thể thao',
      value: profile?.sportsInterest || 'Không có',
    },
    {
      icon: (
        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: 'Số buổi mỗi tuần',
      value: `${profile?.sessionsPerWeek || 3} buổi`,
    },
    {
      icon: (
        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Thời lượng mỗi buổi',
      value: `${profile?.durationPerSession || 30} phút`,
    },
    {
      icon: (
        <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        </svg>
      ),
      label: 'Dụng cụ ưa thích',
      value: profile?.preferredGear || 'Lọc nào cũng được',
    },
  ]

  return (
    <div className="relative space-y-6">
      {/* Hình trang trí lá cây góc trên phải */}
      <div className="pointer-events-none absolute -right-8 -top-8 z-0 opacity-80">
        <svg className="h-36 w-36 text-emerald-300/40" viewBox="0 0 100 100" fill="currentColor">
          <path d="M50 0C50 0 55 25 75 35C95 45 100 70 100 70C100 70 75 65 65 45C55 25 50 0 50 0Z" />
          <path d="M30 20C30 20 40 40 60 50C80 60 85 85 85 85C85 85 60 75 50 55C40 35 30 20 30 20Z" />
        </svg>
      </div>

      {/* Header Trang Hồ Sơ */}
      <div className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#133e29] text-white shadow-md">
            <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hồ sơ của bạn</h1>
            <p className="text-xs text-gray-500">
              Quản lý thông tin cá nhân và theo dõi tình trạng sức khỏe của bạn.
            </p>
          </div>
        </div>

        {/* Chữ nghệ thuật góc phải */}
        <div className="hidden md:flex flex-col items-end">
          <span className="text-2xl font-serif italic text-[#133e29] font-medium tracking-wide">
            Khỏe mạnh là hạnh phúc ❤️
          </span>
        </div>
      </div>

      {/* Bố cục 2 Cột Main */}
      <div className="relative z-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Cột Trái: Bảng Chi Tiết Thông Tin (Chiếm 2 cột) */}
        <div className="space-y-4 lg:col-span-2">
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            {/* Header Thẻ Bảng */}
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#133e29] text-white">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div>
                  <h2 className="text-sm font-bold text-gray-800">Thông tin cá nhân</h2>
                  <p className="text-[11px] text-gray-400">Cập nhật thông tin để có trải nghiệm tốt nhất</p>
                </div>
              </div>
              <button className="flex items-center gap-1.5 rounded-xl border border-gray-200 px-3 py-1 text-xs font-medium text-gray-700 hover:bg-gray-50">
                <svg className="h-3.5 w-3.5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Chỉnh sửa
              </button>
            </div>

            {/* 11 Dòng Thông tin */}
            <div className="divide-y divide-gray-50 py-1">
              {rows.map((row, idx) => (
                <div key={idx} className="flex items-center justify-between py-2.5 text-xs">
                  <div className="flex items-center gap-3">
                    {row.icon}
                    <span className="text-gray-600">{row.label}</span>
                  </div>
                  <span className="font-semibold text-gray-800">{row.value}</span>
                </div>
              ))}
            </div>

            {/* Bottom Buttons */}
            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 pt-2">
              <button className="flex items-center justify-center gap-2 rounded-2xl bg-[#2d9354] py-3 text-xs font-semibold text-white shadow-sm transition-all hover:bg-[#237d44]">
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Chỉnh sửa hồ sơ
              </button>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 rounded-2xl border border-gray-300 py-3 text-xs font-semibold text-gray-600 transition-all hover:bg-gray-50 hover:text-red-600"
              >
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Xóa hồ sơ và làm lại
              </button>
            </div>
          </div>
        </div>

        {/* Cột Phải: Card Tóm Tắt & Banner Động Lực (Chiếm 1 cột) */}
        <div className="space-y-5">
          {/* Card Tóm tắt Hồ sơ */}
          <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
            {/* Avatar Người Dùng */}
            <div className="relative mx-auto h-20 w-20">
              <div className="h-full w-full overflow-hidden rounded-full bg-emerald-100 ring-4 ring-emerald-50">
                <img
                  src="/avatar.png"
                  alt="User Avatar"
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    // Fallback nếu chưa thêm ảnh vào public
                    e.target.onerror = null
                    e.target.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
                  }}
                />
              </div>
              <button className="absolute bottom-0 right-0 rounded-full bg-[#133e29] p-1.5 text-white shadow hover:bg-emerald-800">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            {/* Tên & Ngày tham gia */}
            <div className="mt-3 text-center">
              <h3 className="text-base font-bold text-gray-800">{profile?.name || 'Người dùng'}</h3>
              <p className="text-[11px] text-gray-400">Thành viên từ {profile?.joinedDate || '22/09/2026'}</p>
            </div>

            {/* Slogan Pill */}
            <div className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#f0f8f3] px-3 py-2 text-[11px] text-emerald-900 font-medium">
              <span className="text-emerald-600">🍃</span>
              <span>Cùng nhau xây dựng thói quen lành mạnh và phiên bản tốt hơn mỗi ngày!</span>
            </div>

            {/* Grid 4 Chỉ số Nhanh */}
            <div className="mt-4 grid grid-cols-2 gap-2.5">
              <div className="rounded-2xl bg-[#f0f8f3] p-3 text-center">
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg text-emerald-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5 0 006 0l-3-9zm0 0h12m0 0l3 1m0 0l-3 9a5 0 01-6 0l3-9z" />
                  </svg>
                </div>
                <p className="mt-1 text-[10px] text-gray-400">Cân nặng</p>
                <p className="text-xs font-bold text-gray-800">{profile?.weight || 55} kg</p>
              </div>

              <div className="rounded-2xl bg-[#f0f8f3] p-3 text-center">
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg text-emerald-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </div>
                <p className="mt-1 text-[10px] text-gray-400">Chiều cao</p>
                <p className="text-xs font-bold text-gray-800">{profile?.height || 165} cm</p>
              </div>

              <div className="rounded-2xl bg-[#f0f8f3] p-3 text-center">
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg text-emerald-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="mt-1 text-[10px] text-gray-400">Mục tiêu</p>
                <p className="text-xs font-bold text-gray-800">{profile?.goal || 'Tăng cơ'}</p>
              </div>

              <div className="rounded-2xl bg-[#f0f8f3] p-3 text-center">
                <div className="mx-auto flex h-7 w-7 items-center justify-center rounded-lg text-emerald-700">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <p className="mt-1 text-[10px] text-gray-400">Tần suất</p>
                <p className="text-xs font-bold text-gray-800">{profile?.sessionsPerWeek || 3} buổi/tuần</p>
              </div>
            </div>
          </div>

          {/* Banner Động Lực Tập Luyện */}
          <div className="relative min-h-[160px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#e6f4ea] via-[#f0f8f3] to-emerald-100 p-5 shadow-sm">
            <div className="relative z-10 max-w-[170px] space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-950">
                <span className="text-emerald-600">🍃</span> Hãy tiếp tục
              </div>
              <h4 className="text-sm font-extrabold text-[#133e29]">
                vì sức khỏe của bạn!
              </h4>
              <p className="text-[11px] leading-relaxed text-emerald-900/80">
                Mỗi lựa chọn lành mạnh hôm nay đều là một bước tiến cho tương lai của bạn.
              </p>
              <Link
                to="/workout"
                className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#133e29] px-3.5 py-2 text-[11px] font-semibold text-white shadow transition-all hover:bg-emerald-900"
              >
                <span>▶</span> Bắt đầu tập luyện
              </Link>
            </div>

            {/* Minh họa người đàn ông tập thể thao góc phải */}
            <div className="absolute -bottom-1 -right-2 z-0 h-36 w-36 opacity-90">
              <img
                src="/fitness-man.png"
                alt="Fitness Man"
                className="h-full w-full object-contain"
                onError={(e) => {
                  // Fallback minh họa
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