// Kiểm tra kho bài tập có đúng "khuôn" không. Dùng trong validateExercises.test.js,
// và có thể gọi lại bất cứ khi nào thêm bài mới vào kho.
import { INJURIES } from '../data/labels.js'

const VALID_INJURIES = new Set(INJURIES.map((i) => i.value))
const VALID_TYPES = new Set(['strength', 'hiit', 'cardio', 'stretch', 'mobility'])
const VALID_PHASES = new Set(['warmup', 'main', 'cooldown'])
const VALID_EQUIPMENT = new Set(['bodyweight', 'dumbbell'])
const VALID_LEVELS = new Set([1, 2, 3])
const VALID_TRACKING = new Set(['reps', 'time'])

/** @returns mảng lỗi dạng chuỗi (rỗng nếu kho hợp lệ) */
export function validateExercises(exercises) {
  const errors = []
  const ids = new Set()

  for (const ex of exercises) {
    const tag = ex.id ?? '(thiếu id)'

    if (!ex.id || typeof ex.id !== 'string') errors.push(`${tag}: thiếu id hoặc id không phải chuỗi`)
    else if (ids.has(ex.id)) errors.push(`${tag}: id bị trùng`)
    ids.add(ex.id)

    if (!ex.name) errors.push(`${tag}: thiếu name`)
    if (!VALID_TYPES.has(ex.type)) errors.push(`${tag}: type "${ex.type}" không hợp lệ`)
    if (!Array.isArray(ex.phases) || !ex.phases.length) errors.push(`${tag}: thiếu phases`)
    else for (const p of ex.phases) if (!VALID_PHASES.has(p)) errors.push(`${tag}: phase "${p}" không hợp lệ`)

    if (!Array.isArray(ex.equipment) || !ex.equipment.length) errors.push(`${tag}: thiếu equipment`)
    else for (const eq of ex.equipment) if (!VALID_EQUIPMENT.has(eq)) errors.push(`${tag}: equipment "${eq}" không hợp lệ`)

    if (!VALID_LEVELS.has(ex.level)) errors.push(`${tag}: level phải là 1, 2 hoặc 3`)
    if (!Array.isArray(ex.goals) || !ex.goals.length) errors.push(`${tag}: thiếu goals`)
    if (!ex.primaryMuscle) errors.push(`${tag}: thiếu primaryMuscle`)

    if (!VALID_TRACKING.has(ex.trackingType)) errors.push(`${tag}: trackingType phải là "reps" hoặc "time"`)
    if (ex.trackingType === 'time' && !(ex.baseDurationSec > 0)) errors.push(`${tag}: bài tính giờ cần baseDurationSec > 0`)

    // Đây là điểm AN TOÀN quan trọng nhất: thiếu trường này thì cả kho bị hardFilter loại,
    // nhưng nếu có mặt mà GHI SAI TÊN chấn thương thì lọc an toàn sẽ không bắt được bài đó.
    if (!Array.isArray(ex.avoidIfInjury)) {
      errors.push(`${tag}: THIẾU avoidIfInjury (bắt buộc, dùng [] nếu không có chống chỉ định)`)
    } else {
      for (const inj of ex.avoidIfInjury) {
        if (!VALID_INJURIES.has(inj)) {
          errors.push(`${tag}: avoidIfInjury có giá trị "${inj}" không khớp danh sách chấn thương trong labels.js — bài này sẽ KHÔNG được loại đúng cách`)
        }
      }
    }

    if (ex.easierVariantId && !exercises.some((e) => e.id === ex.easierVariantId)) {
      errors.push(`${tag}: easierVariantId "${ex.easierVariantId}" không trỏ tới bài nào trong kho`)
    }
  }

  return errors
}