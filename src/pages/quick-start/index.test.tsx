import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { QuickStartPage } from './index'
import { useUserStore } from '../../entities/user/model/user-store'

const renderWithRouter = (initialEntry = '/quick-start') =>
  render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/quick-start" element={<QuickStartPage />} />
        <Route path="/" element={<div data-testid="home-page">Home</div>} />
      </Routes>
    </MemoryRouter>
  )

describe('QuickStartPage', () => {
  beforeEach(() => {
    localStorage.clear()
    useUserStore.setState({ user: undefined })
  })

  it('renders the identification form when no user is saved', () => {
    renderWithRouter()
    expect(screen.getByPlaceholderText(/informe seu nome/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/url da imagem/i)).toBeInTheDocument()
  })

  it('displays a UID on page load', () => {
    renderWithRouter()
    expect(screen.getByText(/uid:/i)).toBeInTheDocument()
  })

  it('does not submit the form when displayName is empty', async () => {
    renderWithRouter()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /salvar/i }))
    expect(screen.getByPlaceholderText(/informe seu nome/i)).toBeInTheDocument()
  })

  it('shows an error message when trying to submit with empty name', async () => {
    renderWithRouter()
    const user = userEvent.setup()
    await user.click(screen.getByRole('button', { name: /salvar/i }))
    expect(screen.getByText(/nome é obrigatório/i)).toBeInTheDocument()
  })

  it('redirects to / after successful form submission', async () => {
    renderWithRouter()
    const user = userEvent.setup()
    await user.type(screen.getByPlaceholderText(/informe seu nome/i), 'Matheus')
    await user.click(screen.getByRole('button', { name: /salvar/i }))
    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })
  })

  it('redirects to / when user already has a displayName', async () => {
    localStorage.setItem(
      'local-user',
      JSON.stringify({ id: 'existing-id', displayName: 'Existing User', pictureUrl: '' })
    )
    renderWithRouter()
    await waitFor(() => {
      expect(screen.getByTestId('home-page')).toBeInTheDocument()
    })
  })

  // US3: UID visibility tests
  it('displays the UID and it matches what gets saved', async () => {
    renderWithRouter()
    const user = userEvent.setup()

    const uidText = screen.getByText(/uid:/i).textContent ?? ''
    const displayedUid = uidText.replace(/uid:\s*/i, '').trim()

    await user.type(screen.getByPlaceholderText(/informe seu nome/i), 'Matheus')
    await user.click(screen.getByRole('button', { name: /salvar/i }))

    await waitFor(() => {
      const stored = localStorage.getItem('local-user')
      expect(stored).not.toBeNull()
      expect(JSON.parse(stored!).id).toBe(displayedUid)
    })
  })
})
