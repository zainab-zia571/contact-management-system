import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddContactModal from '../../../components/modals/AddContactModal'
import api from '../../../api/axios'

vi.mock('../../../api/axios')

const mockOnClose  = vi.fn()
const mockOnAdded  = vi.fn()

const renderModal = (open = true) =>
  render(
    <AddContactModal
      open={open}
      onClose={mockOnClose}
      onAdded={mockOnAdded}
    />
  )

describe('AddContactModal', () => {

  beforeEach(() => vi.clearAllMocks())

  it('renders when open is true', () => {
    renderModal()
    expect(screen.getByText('Add new contact')).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    renderModal(false)
    expect(screen.queryByText('Add new contact')).not.toBeInTheDocument()
  })

  it('shows error when first name is empty', async () => {
    renderModal()
    fireEvent.click(screen.getByText('Save Contact →'))
    await waitFor(() => {
      expect(screen.getByText(/First name is required/i)).toBeInTheDocument()
    })
  })

  it('shows error when last name is empty', async () => {
    renderModal()
    await userEvent.type(screen.getAllByPlaceholderText('Jane')[0], 'John')
    fireEvent.click(screen.getByText('Save Contact →'))
    await waitFor(() => {
      expect(screen.getByText(/Last name is required/i)).toBeInTheDocument()
    })
  })

  it('shows error for invalid email', async () => {
    renderModal()
    await userEvent.type(screen.getAllByPlaceholderText('Jane')[0], 'John')
    await userEvent.type(screen.getAllByPlaceholderText('Smith')[0], 'Doe')
    await userEvent.type(screen.getByPlaceholderText('email@example.com'), 'notvalid')
    fireEvent.click(screen.getByText('Save Contact →'))
    await waitFor(() => {
      expect(screen.getByText(/Enter a valid email/i)).toBeInTheDocument()
    })
  })

  it('calls api.post and onAdded on valid submit', async () => {
    api.post.mockResolvedValueOnce({ data: {} })
    renderModal()
    await userEvent.type(screen.getAllByPlaceholderText('Jane')[0], 'John')
    await userEvent.type(screen.getAllByPlaceholderText('Smith')[0], 'Doe')
    await userEvent.type(screen.getByPlaceholderText('email@example.com'), 'john@test.com')
    await userEvent.type(screen.getByPlaceholderText('+1 234 567 890'), '+1234567890')
    fireEvent.click(screen.getByText('Save Contact →'))
    await waitFor(() => {
      expect(api.post).toHaveBeenCalledWith('/contacts', expect.any(Object))
      expect(mockOnAdded).toHaveBeenCalled()
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('closes when cancel is clicked', () => {
    renderModal()
    fireEvent.click(screen.getByText('Cancel'))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('can add multiple phone number fields', async () => {
    renderModal()
    const addPhoneBtn = screen.getByText('＋ Add Phone')
    fireEvent.click(addPhoneBtn)
    const phoneInputs = screen.getAllByPlaceholderText('+1 234 567 890')
    expect(phoneInputs).toHaveLength(2)
  })

  it('can add multiple email fields', async () => {
    renderModal()
    fireEvent.click(screen.getByText('＋ Add Email'))
    const emailInputs = screen.getAllByPlaceholderText('email@example.com')
    expect(emailInputs).toHaveLength(2)
  })
})