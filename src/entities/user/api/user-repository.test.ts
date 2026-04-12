import { describe, it, expect, beforeEach } from 'vitest'
import { getUserFromRepo, saveUserFromRepo } from './user-repository'
import type { IUser } from '../model/user'

const mockUser: IUser = {
  id: 'test-id-1234',
  displayName: 'Matheus',
  pictureUrl: 'https://example.com/avatar.png',
}

describe('user-repository', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when no user is stored', () => {
    expect(getUserFromRepo()).toBeNull()
  })

  it('saves user to localStorage and returns it', () => {
    saveUserFromRepo(mockUser)
    const raw = localStorage.getItem('local-user')
    expect(raw).not.toBeNull()
    expect(JSON.parse(raw!)).toEqual(mockUser)
  })

  it('retrieves the saved user from localStorage', () => {
    saveUserFromRepo(mockUser)
    const retrieved = getUserFromRepo()
    expect(retrieved).toEqual(mockUser)
  })

  it('persists all three fields including pictureUrl', () => {
    saveUserFromRepo(mockUser)
    const retrieved = getUserFromRepo()
    expect(retrieved?.pictureUrl).toBe('https://example.com/avatar.png')
  })
})
