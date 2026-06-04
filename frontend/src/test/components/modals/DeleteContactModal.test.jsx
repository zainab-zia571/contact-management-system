import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import DeleteContactModal from '../../../components/modals/DeleteContactModal'
import api from '../../../api/axios'

vi.mock('../../../api/axios')

const mockOnClose   = vi.fn()
const mockOnDeleted = vi.fn()

const testContact = {
  id: 1,
  firstName: 'Jane',
  lastName: 'Smith',
}

const renderModal = (open = true) =>
  render(
    <DeleteContactModal
      open={open}
      onClose={mockOnClose}
      onDeleted={mockOnDeleted}
      contact={testContact}
    />
  )

describe('DeleteContactModal', () => {

  beforeEach(() => vi.clearAllMocks())

  it('renders when open is true', () => {
    renderModal()
    expect(screen.getByText('Delete contact?')).toBeInTheDocument()
  })

  it('does not render when open is false', () => {
    renderModal(false)
    expect(screen.queryByText('Delete contact?')).not.toBeInTheDocument()
  })

  it('shows contact name in the message', () => {
    renderModal()
    expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument()
  })

  it('calls onClose when Cancel is clicked', () => {
    renderModal()
    fireEvent.click(screen.getByText('Cancel'))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('calls api.delete and onDeleted when Delete is confirmed', async () => {
    api.delete.mockResolvedValueOnce({})
    renderModal()
    fireEvent.click(screen.getByText('Delete'))
    await waitFor(() => {
      expect(api.delete).toHaveBeenCalledWith('/contacts/1')
      expect(mockOnDeleted).toHaveBeenCalled()
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  it('shows deleting text while loading', async () => {
    api.delete.mockImplementation(
      () => new Promise(resolve => setTimeout(resolve, 500))
    )
    renderModal()
    fireEvent.click(screen.getByText('Delete'))
    await waitFor(() => {
      expect(screen.getByText('Deleting...')).toBeInTheDocument()
    })
  })
})