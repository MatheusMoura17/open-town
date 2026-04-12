import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useUser } from './use-user'

describe('useUser', () => {
  beforeEach(() => {
    localStorage.clear()
    // Reset the Zustand store between tests
    vi.resetModules()
  })

  it('generates a new id on first saveUser call', () => {
    const { result } = renderHook(() => useUser())

    act(() => {
      result.current.saveUser('Matheus', 'https://example.com/avatar.png')
    })

    expect(result.current.user?.id).toBeTruthy()
    expect(result.current.user?.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    )
  })

  it('sets displayName and pictureUrl on save', () => {
    const { result } = renderHook(() => useUser())

    act(() => {
      result.current.saveUser('Matheus', 'https://example.com/avatar.png')
    })

    expect(result.current.user?.displayName).toBe('Matheus')
    expect(result.current.user?.pictureUrl).toBe('https://example.com/avatar.png')
  })

  it('preserves the existing id on a second saveUser call', () => {
    const { result } = renderHook(() => useUser())

    act(() => {
      result.current.saveUser('Matheus', '')
    })

    const originalId = result.current.user?.id

    act(() => {
      result.current.saveUser('Matheus Updated', 'https://example.com/new.png')
    })

    expect(result.current.user?.id).toBe(originalId)
    expect(result.current.user?.displayName).toBe('Matheus Updated')
  })

  it('persists user to localStorage after saveUser', () => {
    const { result } = renderHook(() => useUser())

    act(() => {
      result.current.saveUser('Matheus', '')
    })

    const stored = localStorage.getItem('local-user')
    expect(stored).not.toBeNull()
    expect(JSON.parse(stored!).displayName).toBe('Matheus')
  })

  it('loads user from localStorage on mount', () => {
    localStorage.setItem(
      'local-user',
      JSON.stringify({ id: 'stored-id', displayName: 'Stored', pictureUrl: '' })
    )

    const { result } = renderHook(() => useUser())

    // Wait for useEffect to fire
    expect(result.current.user?.displayName).toBe('Stored')
  })
})
