// Minh hoạ SVG tự vẽ cho banner Trang chủ: núi, mặt trời, đường mòn, lá cây.
// Không dùng ảnh chụp/illustration tải từ nơi khác để tránh vấn đề bản quyền.
// Nếu bạn có ảnh riêng, thay bằng thẻ <img src="/img/hero.jpg" ... /> ngay chỗ dùng component này.
export default function HeroIllustration({ className = '' }) {
  return (
    <svg viewBox="0 0 400 240" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#dcfce7" />
          <stop offset="100%" stopColor="#f0fdf4" />
        </linearGradient>
        <linearGradient id="hillFar" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
        <linearGradient id="hillNear" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#15803d" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" rx="24" fill="url(#sky)" />
      <circle cx="290" cy="75" r="34" fill="#fde68a" opacity="0.9" />
      <path d="M0 150 Q80 100 160 140 T400 120 V240 H0 Z" fill="url(#hillFar)" opacity="0.85" />
      <path d="M0 190 Q100 140 220 175 T400 160 V240 H0 Z" fill="url(#hillNear)" />
      <path d="M40 240 C60 190 110 170 150 165 C210 158 260 190 300 175" fill="none" stroke="#fef9c3" strokeWidth="5" strokeLinecap="round" strokeDasharray="1 14" opacity="0.8" />
      <g stroke="#166534" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.9">
        <path d="M350 205c-4-14 4-24 18-26" />
        <path d="M368 179c8 4 10 14 6 22" />
        <path d="M356 201c10-2 16 4 18 14" />
      </g>
    </svg>
  )
}