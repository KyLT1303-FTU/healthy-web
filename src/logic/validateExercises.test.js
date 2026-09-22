import { describe, it, expect } from 'vitest'
import { validateExercises } from './validateExercises.js'
import realExercises from '../data/exercises.sample.json'

const base = () => ({
  id: 'a', name: 'A', type: 'strength', phases: ['main'], equipment: ['bodyweight'],
  level: 1, goals: ['weight_loss'], primaryMuscle: 'legs', trackingType: 'reps', avoidIfInjury: [],
})

describe('Kiểm tra khuôn kho bài tập', () => {
  it('bài đúng khuôn → không lỗi', () => {
    expect(validateExercises([base()])).toEqual([])
  })
  it('thiếu avoidIfInjury → báo lỗi rõ ràng (đây là điểm an toàn quan trọng nhất)', () => {
    const ex = base(); delete ex.avoidIfInjury
    expect(validateExercises([ex])[0]).toMatch(/THIẾU avoidIfInjury/)
  })
  it('avoidIfInjury viết sai tên (vd "lower-back" thay vì "lower_back") → bắt được', () => {
    const ex = { ...base(), avoidIfInjury: ['lower-back'] }
    expect(validateExercises([ex])[0]).toMatch(/không khớp danh sách chấn thương/)
  })
  it('trùng id → báo lỗi', () => {
    expect(validateExercises([base(), { ...base() }])[0]).toMatch(/trùng/)
  })
  it('type, level, trackingType sai → báo lỗi', () => {
    expect(validateExercises([{ ...base(), type: 'vui-choi' }])[0]).toMatch(/type/)
    expect(validateExercises([{ ...base(), level: 4 }])[0]).toMatch(/level/)
    expect(validateExercises([{ ...base(), trackingType: 'gio' }])[0]).toMatch(/trackingType/)
  })
  it('bài tính giờ mà thiếu baseDurationSec → báo lỗi', () => {
    expect(validateExercises([{ ...base(), trackingType: 'time' }])[0]).toMatch(/baseDurationSec/)
  })
  it('easierVariantId trỏ tới bài không tồn tại → báo lỗi', () => {
    expect(validateExercises([{ ...base(), easierVariantId: 'khong-ton-tai' }])[0]).toMatch(/easierVariantId/)
  })
  it('easierVariantId hợp lệ → không lỗi', () => {
    expect(validateExercises([base(), { ...base(), id: 'b', easierVariantId: 'a' }])).toEqual([])
  })
  it('KHO BÀI THẬT ĐANG DÙNG (exercises.sample.json) phải sạch, không lỗi', () => {
    expect(validateExercises(realExercises)).toEqual([])
  })
})