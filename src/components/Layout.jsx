import { Link, NavLink, Outlet } from 'react-router-dom'

export default function Layout() {
  const navItems = [
    {
      to: '/',
      label: 'Trang chủ',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
    },
    {
      to: '/onboarding',
      label: 'Hồ sơ',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
    },
    {
      to: '/schedule',
      label: 'Lịch tuần',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      to: '/workout',
      label: 'Tập luyện',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      to: '/progress',
      label: 'Tiến độ',
      icon: (
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
  ]

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans antialiased">
      {/* Sidebar Trái */}
      <aside className="fixed inset-y-0 left-0 z-20 flex w-64 flex-col justify-between bg-[#123e2a] p-6 text-white shadow-xl">
        <div className="space-y-8">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 text-2xl font-bold tracking-wide">
            <svg className="h-8 w-8 text-green-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 8C8 10 59 16.17 3.83 12 1.17 12 1 3 1s-1 11 1 12 11 11 11c0-2.83-2.17-5.5-5-5.83z" />
              <path d="M12 2C6.48 2 2 6.48 2 12c0 1.54.36 2.98.97 4.29C4.38 12.01 8.52 9.1 13.5 9c.17 0 .33.01.5.01V6.5L18 10l-4 3.5V11c-3.87.08-7.19 2.13-8.86 5.16C6.44 17.26 9.07 18 12 18c5.52 0 10-4.48 10-10S17.52 2 12 2z" />
            </svg>
            Healthy
          </Link>

          {/* Menu Điều hướng */}
          <nav className="space-y-2">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-2xl px-4 py-3.5 text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-white/15 text-white shadow-inner font-semibold'
                      : 'text-emerald-100/70 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {item.icon}
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Thông điệp Góc dưới */}
        <div className="relative overflow-hidden rounded-2xl bg-white/5 p-4 text-xs text-emerald-100/80 backdrop-blur-sm">
          <p className="italic leading-relaxed">
            &ldquo;Sức khỏe hôm nay là nền tảng cho cuộc sống tốt đẹp hơn ngày mai!&rdquo;
          </p>
        </div>
      </aside>

      {/* Container Nội dung Phải */}
      <div className="flex flex-1 flex-col pl-64">
        {/* Header Top - Đã bỏ Search Bar và Chuông Thông Báo */}
        <header className="sticky top-0 z-10 flex h-20 items-center justify-end bg-white px-8 shadow-sm">
          {/* Thông tin Người dùng */}
          <div className="flex items-center gap-3 cursor-pointer rounded-full p-1.5 hover:bg-gray-50">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-800">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Xin chào,</p>
              <p className="text-sm font-bold text-gray-800">Người dùng</p>
            </div>
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </header>

        {/* Main View Area */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}