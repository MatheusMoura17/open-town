import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AuthGuard } from './router'
import { useUserStore } from '../entities/user/model/user-store'

const renderAuthGuard = (initialEntry = '/') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route
          path="/"
          element={
            <AuthGuard>
              <div data-testid="protected-content">Protected</div>
            </AuthGuard>
          }
        />
        <Route path="/quick-start" element={<div data-testid="quick-start-page">Quick Start</div>} />
      </Routes>
    </MemoryRouter>
  )

describe('AuthGuard', () => {
  beforeEach(() => {
    localStorage.clear()
    useUserStore.setState({ user: undefined })
  })

  it('redirects to /quick-start when no user is saved', async () => {
    renderAuthGuard()
    await waitFor(() => {
      expect(screen.getByTestId('quick-start-page')).toBeInTheDocument()
    })
  })

  it('renders protected content when user has a displayName', async () => {
    localStorage.setItem(
      'local-user',
      JSON.stringify({ id: 'test-id', displayName: 'Matheus', pictureUrl: '' })
    )
    renderAuthGuard()
    await waitFor(() => {
      expect(screen.getByTestId('protected-content')).toBeInTheDocument()
    })
  })

  it('does not render protected content when displayName is absent', async () => {
    localStorage.setItem(
      'local-user',
      JSON.stringify({ id: 'test-id', displayName: '', pictureUrl: '' })
    )
    renderAuthGuard()
    await waitFor(() => {
      expect(screen.getByTestId('quick-start-page')).toBeInTheDocument()
    })
  })
})
