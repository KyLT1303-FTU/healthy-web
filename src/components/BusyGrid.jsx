import { ROWS, CELL_MIN, cellsToSlots, slotsToCells } from '../logic/busyCells.js'
import { DAY_NAMES_SHORT as DAY_NAMES } from '../data/labels.js'

const rowOf = (hhmm) => (timeToMin(hhmm) - DAY_START_MIN) / CELL_MIN
const rowTime = (r) => minToTime(DAY_START_MIN + r * CELL_MIN)

function fmtDuration(min) {
  const h = Math.floor(min / 60)
  const m = min % 60
  if (!h) return `${m}p`
  return m ? `${h}h${m}p` : `${h}h`
}

export default function BusyGrid() {
  const [saved, setSaved] = useLocalStorage('busySlots', null)
  const [cells, setCells] = useState(() => slotsToCells(Array.isArray(saved) ? saved : []))
  const [lockScroll, setLockScroll] = useState(true)
  const drag = useRef(null) // null = không kéo; true/false = đang tô / đang xoá

  // Kết thúc kéo khi nhả chuột hoặc nhấc ngón tay ở bất kỳ đâu
  useEffect(() => {
    const stop = () => { drag.current = null }
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
    return () => {
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
  }, [])

  const slots = useMemo(() => cellsToSlots(cells), [cells])
  const free = useMemo(() => findFreeSlotsByDay(slots), [slots])
  const dirty = JSON.stringify(slots) !== JSON.stringify(Array.isArray(saved) ? saved : [])

  function setCell(d, r, value) {
    setCells((prev) => {
      if (prev[d][r] === value) return prev
      const next = prev.map((col) => col.slice())
      next[d][r] = value
      return next
    })
  }

  function startDrag(e, d, r) {
    if (e.button > 0) return // bỏ qua chuột phải
    e.preventDefault()
    try { e.currentTarget.releasePointerCapture(e.pointerId) } catch { /* không sao */ }
    const value = !cells[d][r] // ô đang trống thì kéo = tô; ô đang bận thì kéo = xoá
    drag.current = value
    setCell(d, r, value)
  }

  function enterCell(e, d, r) {
    if (drag.current === null) return
    if (e.buttons === 0) { drag.current = null; return } // đã nhả chuột ngoài cửa sổ
    setCell(d, r, drag.current)
  }

  function toggleDay(d) {
    setCells((prev) => {
      const next = prev.map((col) => col.slice())
      next[d] = Array(ROWS).fill(!prev[d].every(Boolean))
      return next
    })
  }

  function addWorkHours() {
    setCells((prev) => {
      const next = prev.map((col) => col.slice())
      for (let d = 0; d < 5; d++) for (let r = rowOf('08:00'); r < rowOf('17:00'); r++) next[d][r] = true
      return next
    })
  }

  const clearAll = () => setCells(slotsToCells([]))
  const save = () => setSaved(slots)

  let status = 'Chưa lưu'
  let statusColor = 'text-gray-500'
  if (saved !== null && !dirty) { status = 'Đã lưu ✓'; statusColor = 'text-green-600' }
  else if (dirty) { status = 'Có thay đổi chưa lưu'; statusColor = 'text-amber-600' }

  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-bold">Khung giờ bận của bạn</h2>
        <p className="mt-1 text-sm text-gray-600">
          Bấm hoặc kéo để tô <span className="font-semibold text-red-600">đỏ</span> những lúc bạn bận
          (đi làm, đi học, ngủ...). Bấm vào tên ngày (T2, T3...) để tô hoặc bỏ cả ngày.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={addWorkHours} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100">
          Thêm giờ làm T2–T6 (08:00–17:00)
        </button>
        <button type="button" onClick={clearAll} className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-100">
          Xoá hết
        </button>
      </div>

      <label className="flex items-start gap-2 text-sm text-gray-600">
        <input type="checkbox" checked={lockScroll} onChange={(e) => setLockScroll(e.target.checked)} className="mt-0.5" />
        <span>Kéo bằng ngón tay để tô (điện thoại). Bỏ tick nếu muốn cuộn trang khi chạm vào bảng.</span>
      </label>

      {/* Bảng 7 cột x 32 hàng */}
      <div
        className="select-none"
        onContextMenu={(e) => e.preventDefault()}
        style={{
          touchAction: lockScroll ? 'none' : 'pan-y',
          display: 'grid',
          gridTemplateColumns: '2.75rem repeat(7, minmax(0, 1fr))',
          gap: '2px',
        }}
      >
        <div />
        {DAY_NAMES.map((n, d) => (
          <button key={n} type="button" onClick={() => toggleDay(d)} className="rounded-md bg-gray-100 py-1 text-xs font-semibold text-gray-700 hover:bg-gray-200">
            {n}
          </button>
        ))}
        {Array.from({ length: ROWS }, (_, r) => (
          <Fragment key={r}>
            <div className="flex h-6 items-start justify-end pr-1 text-[10px] leading-none text-gray-400">
              {r % 2 === 0 ? rowTime(r) : ''}
            </div>
            {DAY_NAMES.map((n, d) => {
              const busy = cells[d][r]
              return (
                <button
                  key={n}
                  type="button"
                  aria-label={`${n} ${rowTime(r)}`}
                  aria-pressed={busy}
                  onPointerDown={(e) => startDrag(e, d, r)}
                  onPointerEnter={(e) => enterCell(e, d, r)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      setCell(d, r, !busy)
                    }
                  }}
                  className={`h-6 rounded-sm border ${
                    busy ? 'border-red-500 bg-red-500' : r % 2 === 0 ? 'border-gray-300 bg-white' : 'border-gray-200 bg-white'
                  }`}
                />
              )
            })}
          </Fragment>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={save} className="rounded-xl bg-green-500 px-5 py-3 font-semibold text-white hover:bg-green-600">
          Lưu lịch bận
        </button>
        <span className={`text-sm font-medium ${statusColor}`}>{status}</span>
      </div>
      {slots.length === 0 && (
        <p className="text-sm text-gray-500">Bạn chưa tô ô nào, nghĩa là bạn rảnh cả tuần (06:00 - 22:00).</p>
      )}

      {/* Kết quả của thuật toán tìm khoảng rảnh */}
      <div className="rounded-2xl border border-gray-200 bg-white p-4">
        <h3 className="mb-2 text-sm font-bold">Khung giờ rảnh hệ thống tìm được</h3>
        <ul className="space-y-1 text-sm">
          {DAY_NAMES.map((n, d) => {
            const list = free[d + 1]
            const total = list.reduce((s, f) => s + f.duration, 0)
            return (
              <li key={n} className="flex gap-3">
                <span className="w-8 font-semibold">{n}</span>
                <span className="text-gray-700">
                  {list.length
                    ? `${list.map((f) => `${f.start}–${f.end}`).join(' · ')} (${fmtDuration(total)})`
                    : 'Kín lịch'}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}