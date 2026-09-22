// Bộ icon dùng chung, vẽ tay bằng SVG để đồng bộ phong cách (nét tròn, độ dày đều)
// thay cho emoji vốn không đồng nhất giữa các hệ điều hành.
const base = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const IconTarget = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="4" /><circle cx="12" cy="12" r="0.6" fill="currentColor" /></svg>
)
export const IconShield = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z" /><path d="M9 12l2 2 4-4" /></svg>
)
export const IconCalendar = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><rect x="3.5" y="5" width="17" height="15" rx="3" /><path d="M8 3v4M16 3v4M3.5 10h17" /></svg>
)
export const IconTrend = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M3 17l6-6 4 4 8-8" /><path d="M15 7h6v6" /></svg>
)
export const IconFlame = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 3s5 4.5 5 9a5 5 0 1 1-10 0c0-1 .4-2 1-3 .3 1 1 1.5 1.5 1 .5-2-1-3-1-5.5C9.5 3 12 3 12 3z" /></svg>
)
export const IconPlay = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M10 8.5l6 3.5-6 3.5v-7z" fill="currentColor" stroke="none" /></svg>
)
export const IconLeaf = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M6 20c8 0 13-5 13-13 0-1 0-2-.3-2.8C10.5 4.8 6 9.5 6 17.5V20z" /><path d="M6 20c0-4 2-7 5-9" /></svg>
)
export const IconMoon = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5z" /></svg>
)
export const IconCheckBadge = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 3l2.2 1.3 2.5-.3 1.1 2.3 2.2 1.3-.3 2.5L21 12l-1.3 2.2.3 2.5-2.2 1.1-1.1 2.2-2.5-.3L12 21l-2.2-1.3-2.5.3-1.1-2.2-2.2-1.1.3-2.5L3 12l1.3-2.2-.3-2.5 2.2-1.1 1.1-2.3 2.5.3L12 3z" /><path d="M8.5 12.5l2.3 2.3L16 10" /></svg>
)
export const IconSparkle = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.5 5.5l2 2M16.5 16.5l2 2M5.5 18.5l2-2M16.5 7.5l2-2" /></svg>
)
export const IconArrowRight = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
)
export const IconDumbbell = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><path d="M4 9v6M7 7v10M17 7v10M20 9v6M7 12h10" /></svg>
)
export const IconSun = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2 12h2M20 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" /></svg>
)
export const IconUser = (p) => (
  <svg viewBox="0 0 24 24" {...base} {...p}><circle cx="12" cy="8" r="3.5" /><path d="M4.5 20c1.5-4 4-6 7.5-6s6 2 7.5 6" /></svg>
)