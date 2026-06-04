import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginPage from '../../pages/LoginPage'
import { AuthContext } from '../../context/AuthContext'
import api from '../../api/axios'

// mock axios
vi.mock('../../api/axios')

// mock useNavigate
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockLogin = vi.fn()

const renderLogin = () =>
  render(
    <AuthContext.Provider value={{ login: mockLogin }}>
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    </AuthContext.Provider>
  )

describe('LoginPage', () => {

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the login form', () => {
    renderLogin()
    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('••••••••')).toBeInTheDocument()
    expect(screen.getByText('Sign in →')).toBeInTheDocument()
  })

  it('shows validation error when identifier is empty', async () => {
    renderLogin()
    fireEvent.click(screen.getByText('Sign in →'))
    await waitFor(() => {
      expect(screen.getByText(/Email, username or phone is required/i)).toBeInTheDocument()
    })
  })

  it('shows validation error when password is empty', async () => {
    renderLogin()
    await userEvent.type(screen.getByPlaceholderText('john@example.com'), 'john@test.com')
    fireEvent.click(screen.getByText('Sign in →'))
    await waitFor(() => {
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument()
    })
  })

  it('shows error when password is less than 6 characters', async () => {
    renderLogin()
    await userEvent.type(screen.getByPlaceholderText('john@example.com'), 'john')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), '123')
    fireEvent.click(screen.getByText('Sign in →'))
    await waitFor(() => {
      expect(screen.getByText(/at least 6 characters/i)).toBeInTheDocument()
    })
  })

  it('shows API error on wrong credentials', async () => {
    api.post.mockRejectedValueOnce({
      response: { status: 400, data: { message: 'Invalid credentials' } }
    })
    renderLogin()
    await userEvent.type(screen.getByPlaceholderText('john@example.com'), 'john@test.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'wrongpass')
    fireEvent.click(screen.getByText('Sign in →'))
    await waitFor(() => {
      expect(screen.getByText(/Incorrect email\/username or password/i)).toBeInTheDocument()
    })
  })

  it('calls login and navigates on success', async () => {
    api.post.mockResolvedValueOnce({
      data: { data: { token: 'jwt123', username: 'johndoe', email: 'john@test.com' } }
    })
    renderLogin()
    await userEvent.type(screen.getByPlaceholderText('john@example.com'), 'john@test.com')
    await userEvent.type(screen.getByPlaceholderText('••••••••'), 'pass123')
    fireEvent.click(screen.getByText('Sign in →'))
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        { username: 'johndoe', email: 'john@test.com' }, 'jwt123'
      )
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })
})