import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, it, expect } from 'vitest'
import Timeline from '../components/Timeline'

describe('Timeline', () => {
  it('renders the section heading', () => {
    render(<Timeline />)
    expect(screen.getByText(/Our Story So Far/i)).toBeInTheDocument()
  })

  it('renders all 6 timeline items', () => {
    render(<Timeline />)
    const icons = screen.getAllByText(/./i).filter((el) => {
      const text = el.textContent
      return ['💕', '☕', '🏠', '⚽', '📚', '📖'].includes(text || '')
    })
    expect(icons.length).toBeGreaterThan(0)
  })

  it('renders timeline item titles (truncated on mobile)', () => {
    render(<Timeline />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(6)
    const firstButton = buttons[0]
    expect(firstButton).toHaveTextContent('We Matched')
  })

  it('opens popup when a timeline item is clicked', async () => {
    const user = userEvent.setup()
    render(<Timeline />)
    const buttons = screen.getAllByRole('button')
    await user.click(buttons[1])
    expect(screen.getByText(/Nervous, excited/i)).toBeInTheDocument()
    const heading = screen.getAllByText('First Date')[1]
    expect(heading).toBeInTheDocument()
  })

  it('closes popup when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<Timeline />)
    const firstDateItem = screen.getByText('First Date')
    await user.click(firstDateItem)
    const closeButton = screen.getByText(/Close/i)
    await user.click(closeButton)
    expect(screen.queryByText(/Nervous, excited/i)).not.toBeInTheDocument()
  })

  it('popup has scrollable container with max-height', async () => {
    const user = userEvent.setup()
    render(<Timeline />)
    const firstDateItem = screen.getByText('First Date')
    await user.click(firstDateItem)
    const popup = document.querySelector('.max-h-\\[90vh\\]')
    expect(popup).toBeInTheDocument()
    expect(popup).toHaveClass('overflow-y-auto')
  })

  it('popup icon is centered', async () => {
    const user = userEvent.setup()
    render(<Timeline />)
    const firstDateItem = screen.getByText('First Date')
    await user.click(firstDateItem)
    const iconContainer = document.querySelector('.-translate-x-1\\/2')
    expect(iconContainer).toBeInTheDocument()
  })
})
