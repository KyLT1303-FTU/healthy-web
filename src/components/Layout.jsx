import { NavLink, Outlet } from 'react-router-dom'

// Danh sách menu: muốn thêm/bớt trang thì sửa ở đây
const links = [
  { to: '/', label: 'Trang chủ', icon: '🏠' },
  { to: '/onboarding', label: 'Hồ sơ', icon: '📝' },
  { to: '/schedule', label: 'Lịch tuần', icon: '📅' },
  { to: '/workout', label: 'Tập', icon: '💪' },
  { to: '/progress', label: 'Tiến độ', icon: '📈' },
]

export default function Layout() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Menu trên cùng: chỉ hiện trên máy tính */}
      <header className="sticky top-0 z-10 hidden border-b border-gray-200 bg-white md:block">
        <nav className="mx-auto flex max-w-4xl items-center gap-2 px-4 py-3">
          <span className="mr-4 text-lg font-bold text-green-500">Healthy</span>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm font-medium ${
                  isActive ? 'bg-green-500 text-white' : 'text-gray-600 hover:bg-gray-100'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
      </header>

      {/* Nội dung từng trang hiện ở đây */}
      <main className="mx-auto max-w-4xl px-4 pb-32 pt-6 md:pb-12">
        <Outlet />
        <p className="mt-10 text-center text-xs text-gray-400">
          Nội dung mang tính tham khảo, không thay thế tư vấn của bác sĩ hoặc huấn luyện viên.
        </p>
      </main>

      {/* Menu dưới cùng: chỉ hiện trên điện thoại */}
      <nav className="fixed inset-x-0 bottom-0 z-10 grid grid-cols-5 border-t border-gray-200 bg-white md:hidden">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            end={l.to === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center py-2 text-xs ${
                isActive ? 'font-semibold text-green-600' : 'text-gray-500'
              }`
            }
          >
            <span className="text-xl">{l.icon}</span>
            {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  )
}