import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import RegisterPage from '../../pages/RegisterPage'
import { AuthContext } from '../../context/AuthContext'
import api from '../../api/axios'

vi.mock('../../api/axios')

const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockLogin = vi.fn()

const renderRegister = () =>
  render(
    <AuthContext.Provider value={{ login: mockLogin }}>
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    </AuthContext.Provider>
  )

describe('RegisterPage', () => {
  beforeEach(() => vi.clearAllMocks())

  it('renders all form fields', () => {
    renderRegister()
    expect(screen.getByPlaceholderText('johndoe')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('john@example.com')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('+1 234 567 890')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Min 6 characters')).toBeInTheDocument()
  })

  it('shows error when username is empty', async () => {
    renderRegister()
    fireEvent.click(screen.getByText('Create account →'))
    await waitFor(() => {
      expect(screen.getByText(/Username is required/i)).toBeInTheDocument()
    })
  })

  it('shows error when neither email nor phone provided', async () => {
    renderRegister()
    await userEvent.type(screen.getByPlaceholderText('johndoe'), 'testuser')
    await userEvent.type(screen.getByPlaceholderText('Min 6 characters'), 'pass123')
    fireEvent.click(screen.getByText('Create account →'))
    await waitFor(() => {
      expect(screen.getByText(/Please provide an email or phone number/i)).toBeInTheDocument()
    })
  })

  it('shows error for invalid email format', async () => {
    renderRegister()
    await userEvent.type(screen.getByPlaceholderText('johndoe'), 'testuser')
    await userEvent.type(screen.getByPlaceholderText('john@example.com'), 'notanemail')
    await userEvent.type(screen.getByPlaceholderText('Min 6 characters'), 'pass123')
    fireEvent.click(screen.getByText('Create account →'))

    // Wait for the error message - now guaranteed to appear
    const errorMessage = await screen.findByText(/Please enter a valid email address/i)
    expect(errorMessage).toBeInTheDocument()
  })

  it('does not send phone number when field is empty', async () => {
    api.post.mockResolvedValueOnce({
      data: { data: { token: 'tok', username: 'testuser', email: 'test@test.com' } }
    })
    renderRegister()
    await userEvent.type(screen.getByPlaceholderText('johndoe'), 'testuser')
    await userEvent.type(screen.getByPlaceholderText('john@example.com'), 'test@test.com')
    await userEvent.type(screen.getByPlaceholderText('Min 6 characters'), 'pass123')
    fireEvent.click(screen.getByText('Create account →'))
    await waitFor(() => {
      const call = api.post.mock.calls[0][1]
      expect(call.phoneNumber).toBeNull()
    })
  })

  it('calls login and navigates on success', async () => {
    api.post.mockResolvedValueOnce({
      data: { data: { token: 'tok', username: 'testuser', email: 'test@test.com' } }
    })
    renderRegister()
    await userEvent.type(screen.getByPlaceholderText('johndoe'), 'testuser')
    await userEvent.type(screen.getByPlaceholderText('john@example.com'), 'test@test.com')
    await userEvent.type(screen.getByPlaceholderText('Min 6 characters'), 'pass123')
    fireEvent.click(screen.getByText('Create account →'))
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled()
      expect(mockNavigate).toHaveBeenCalledWith('/dashboard')
    })
  })
})