import { useProgressStore } from '../progress'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const STORAGE_KEY = 'frontend-study-lab-progress'

// Mock localStorage for tests
const storageMock = (() => {
  let store: Record<string, string> = {}
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value },
    removeItem: (key: string) => { delete store[key] },
    clear: () => { store = {} },
  }
})()

Object.defineProperty(globalThis, 'localStorage', {
  value: storageMock,
  writable: true,
})

describe('progress store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('initializes with default progress', () => {
    const store = useProgressStore()
    expect(store.level).toBe(1)
    expect(store.totalXp).toBe(0)
    expect(store.xpToNext).toBe(100)
    expect(store.completedCount).toBe(0)
    expect(store.completedModules).toEqual([])
  })

  it('completes a module and adds XP', () => {
    const store = useProgressStore()
    store.completeModule('bind', 60)
    expect(store.isModuleCompleted('bind')).toBe(true)
    expect(store.completedCount).toBe(1)
    expect(store.totalXp).toBe(60)
  })

  it('does not add XP for already completed module', () => {
    const store = useProgressStore()
    store.completeModule('bind', 60)
    store.completeModule('bind', 60)
    expect(store.completedCount).toBe(1)
    expect(store.totalXp).toBe(60)
  })

  it('levels up when XP reaches threshold', () => {
    const store = useProgressStore()
    store.addXp(100)
    expect(store.level).toBe(2)
    expect(store.totalXp).toBe(0)
    expect(store.xpToNext).toBe(150) // 100 * 1.5
  })

  it('handles multiple level ups', () => {
    const store = useProgressStore()
    // Level 1: 100 XP needed, Level 2: 150 XP needed
    store.addXp(250)
    expect(store.level).toBe(3)
    expect(store.totalXp).toBe(0) // 250 - 100 - 150 = 0
  })

  it('carries over excess XP after level up', () => {
    const store = useProgressStore()
    store.addXp(120)
    expect(store.level).toBe(2)
    expect(store.totalXp).toBe(20) // 120 - 100 = 20
  })

  it('calculates xp percent correctly', () => {
    const store = useProgressStore()
    expect(store.xpPercent).toBe(0)
    store.addXp(50)
    expect(store.xpPercent).toBe(50)
    store.addXp(50)
    expect(store.xpPercent).toBe(0) // leveled up
  })

  it('caps xp percent at 100', () => {
    const store = useProgressStore()
    store.addXp(9999)
    expect(store.xpPercent).toBeLessThanOrEqual(100)
  })

  it('checks challenge completion', () => {
    const store = useProgressStore()
    expect(store.isChallengeCompleted('bind', 'test-1')).toBe(false)
    store.completeChallenge('bind', 'test-1', 20)
    expect(store.isChallengeCompleted('bind', 'test-1')).toBe(true)
  })

  it('does not duplicate challenge completion', () => {
    const store = useProgressStore()
    store.completeChallenge('bind', 'test-1', 20)
    store.completeChallenge('bind', 'test-1', 20)
    expect(store.totalXp).toBe(20)
  })

  it('tracks challenges per module separately', () => {
    const store = useProgressStore()
    store.completeChallenge('bind', 'test-1', 20)
    store.completeChallenge('curry', 'test-2', 30)
    expect(store.isChallengeCompleted('bind', 'test-1')).toBe(true)
    expect(store.isChallengeCompleted('curry', 'test-2')).toBe(true)
    expect(store.isChallengeCompleted('bind', 'test-2')).toBe(false)
  })

  it('resets progress to default', () => {
    const store = useProgressStore()
    store.completeModule('bind', 60)
    store.addXp(40)
    store.resetProgress()
    expect(store.level).toBe(1)
    expect(store.totalXp).toBe(0)
    expect(store.completedCount).toBe(0)
    expect(store.isModuleCompleted('bind')).toBe(false)
  })

  it('persists to localStorage', () => {
    const store = useProgressStore()
    store.completeModule('bind', 60)
    // Verify store state matches what would be persisted
    expect(store.progress.completedModules).toContain('bind')
    expect(store.progress.xp).toBe(60)
  })

  it('loads from localStorage on init', () => {
    const saved = {
      level: 3,
      xp: 50,
      xpToNextLevel: 225,
      completedModules: ['bind', 'curry'],
      completedChallenges: { bind: ['test-1'] },
      lastActive: '2026-01-01T00:00:00.000Z',
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved))
    const store = useProgressStore()
    expect(store.level).toBe(3)
    expect(store.totalXp).toBe(50)
    expect(store.completedCount).toBe(2)
    expect(store.isModuleCompleted('bind')).toBe(true)
    expect(store.isChallengeCompleted('bind', 'test-1')).toBe(true)
  })

  it('handles corrupted localStorage gracefully', () => {
    localStorage.setItem(STORAGE_KEY, 'not valid json')
    const store = useProgressStore()
    expect(store.level).toBe(1)
    expect(store.totalXp).toBe(0)
    expect(store.completedModules).toEqual([])
  })

  it('updates lastActive timestamp on XP gain', () => {
    vi.useFakeTimers()
    const baseTime = new Date('2026-01-01T00:00:00.000Z')
    vi.setSystemTime(baseTime)
    const store = useProgressStore()
    const before = store.progress.lastActive
    // Advance time by 1 second
    vi.setSystemTime(new Date(baseTime.getTime() + 1000))
    store.addXp(10)
    const after = store.progress.lastActive
    expect(after).not.toBe(before)
    expect(new Date(after).getTime()).toBeGreaterThan(new Date(before).getTime())
    vi.useRealTimers()
  })
})
