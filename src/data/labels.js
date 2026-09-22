// Mọi nhãn hiển thị dùng chung nhiều nơi trong web. Muốn đổi câu chữ, thêm/bớt
// lựa chọn (thêm một loại chấn thương, dụng cụ...) thì chỉ sửa ở file này.

export const GOALS = [
  { value: 'weight_loss', label: 'Giảm cân', desc: 'Đốt năng lượng, giảm mỡ' },
  { value: 'muscle_gain', label: 'Tăng cơ', desc: 'Tập sức mạnh, săn chắc cơ thể' },
  { value: 'flexibility', label: 'Giãn cơ', desc: 'Dẻo dai, giảm cứng cơ' },
]

export const LEVELS = [
  { value: 'beginner', label: 'Mới bắt đầu', desc: 'Ít hoặc chưa từng tập đều đặn' },
  { value: 'intermediate', label: 'Trung bình', desc: 'Đã tập đều được vài tháng' },
  { value: 'advanced', label: 'Nâng cao', desc: 'Tập đều đặn hơn 1 năm' },
]

// value phải khớp CHÍNH XÁC với avoidIfInjury trong kho bài tập (src/data/exercises.js).
// Thêm một dòng ở đây thôi chưa đủ: phải gắn value đó vào avoidIfInjury của các bài liên quan.
export const INJURIES = [
  { value: 'lower_back', label: 'Đau lưng dưới' },
  { value: 'knee', label: 'Đau gối' },
  { value: 'shoulder', label: 'Đau vai' },
  { value: 'wrist', label: 'Đau cổ tay' },
  { value: 'ankle', label: 'Đau cổ chân' },
  { value: 'neck', label: 'Đau cổ' },
]

export const EQUIPMENT = [{ value: 'dumbbell', label: 'Tạ đơn' }]

export const PERIODS = [
  { value: 'any', label: 'Lúc nào cũng được' },
  { value: 'morning', label: 'Sáng (6h - 12h)' },
  { value: 'afternoon', label: 'Chiều (12h - 17h)' },
  { value: 'evening', label: 'Tối (17h - 22h)' },
]

export const DAY_NAMES = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'Chủ nhật']
export const DAY_NAMES_SHORT = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

export const PHASES = [
  ['warmup', 'Khởi động'],
  ['main', 'Tập chính'],
  ['cooldown', 'Thả lỏng'],
]

export const TIERS = { mini: 'Buổi ngắn', short: 'Buổi vừa', full: 'Buổi đầy đủ' }

export const FEEDBACK = [
  { value: 'too_easy', label: 'Quá dễ', desc: 'Mình còn thừa sức' },
  { value: 'just_right', label: 'Vừa sức', desc: 'Đủ mệt, làm được hết' },
  { value: 'too_hard', label: 'Quá khó', desc: 'Mình rất mệt hoặc không theo kịp' },
]

/** Tra nhãn từ value, dùng cho mọi danh sách {value,label} ở trên. */
export function labelOf(list, value) {
  return list.find((x) => x.value === value)?.label ?? value
}

// Tra nhanh: 'knee' -> 'Đau gối'
export const INJURY_LABELS = Object.fromEntries(INJURIES.map((i) => [i.value, i.label]))