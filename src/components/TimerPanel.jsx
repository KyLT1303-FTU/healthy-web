import { useEffect, useRef, useState } from 'react'
import { remainingMs, isFinished, pauseTimer, resumeTimer, addSeconds, formatClock } from '../logic/workout.js'
import { beep } from './sound.js'

/**
 * Bảng đồng hồ đếm ngược (nghỉ giữa hiệp hoặc đếm ngược thời gian tập).
 * timer: xem startTimer() trong logic/workout.js. Có timer.kind = 'work' | 'rest'.
 */
export default function TimerPanel({ timer, soundOn, onChange, onFinish, onSkip }) {
  const [now, setNow] = useState(() => Date.now())
  const firedRef = useRef(false)
  const onFinishRef = useRef(onFinish)

  useEffect(() => {
    onFinishRef.current = onFinish
  })

  // Mỗi khi có đồng hồ mới: cập nhật giờ hiện tại và cho phép báo hết giờ một lần
  useEffect(() => {
    firedRef.current = false
    setNow(Date.now())
  }, [timer])

  // Chỉ dùng setInterval để "gõ nhịp" làm mới màn hình; thời gian còn lại luôn tính từ Date.now()
  useEffect(() => {
    if (!timer) return undefined
    const id = setInterval(() => {
      const t = Date.now()
      setNow(t)
      if (!firedRef.current && isFinished(timer, t)) {
        firedRef.current = true
        if (soundOn) beep()
        onFinishRef.current(timer)
      }
    }, 250)
    return () => clearInterval(id)
  }, [timer, soundOn])

  if (!timer) return null

  const finished = isFinished(timer, now)
  const isWork = timer.kind === 'work'
  const color = finished ? 'bg-amber-500' : isWork ? 'bg-green-600' : 'bg-sky-600'
  const btn = 'rounded-lg bg-white/20 px-3 py-2 text-sm font-semibold hover:bg-white/30'

  return (
    <div role="timer" className={`sticky top-2 z-20 rounded-2xl p-4 text-white shadow-lg md:top-16 ${color}`}>
      <p className="text-sm opacity-90">
        {finished && !isWork ? 'Hết giờ nghỉ, sẵn sàng cho hiệp tiếp theo!' : timer.label}
      </p>
      <p className="text-4xl font-bold tabular-nums">{formatClock(remainingMs(timer, now))}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {!finished && (
          <button type="button" className={btn} onClick={() => onChange(timer.paused ? resumeTimer(timer, Date.now()) : pauseTimer(timer, Date.now()))}>
            {timer.paused ? 'Tiếp tục' : 'Tạm dừng'}
          </button>
        )}
        {!finished && !isWork && (
          <button type="button" className={btn} onClick={() => onChange(addSeconds(timer, Date.now(), 15))}>
            +15 giây
          </button>
        )}
        {!finished && (
          <button type="button" className={btn} onClick={() => onSkip(timer)}>
            {isWork ? 'Xong sớm' : 'Bỏ qua nghỉ'}
          </button>
        )}
        {finished && (
          <button type="button" className={btn} onClick={() => onChange(null)}>
            Đóng
          </button>
        )}
      </div>
    </div>
  )
}