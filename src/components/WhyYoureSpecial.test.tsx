import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import WhyYoureSpecial from '../components/WhyYoureSpecial'

describe('WhyYoureSpecial', () => {
  it('renders the section heading', () => {
    render(<WhyYoureSpecial />)
    expect(screen.getByText(/Why You're So Special/i)).toBeInTheDocument()
  })

  it('renders all 4 reason cards', () => {
    render(<WhyYoureSpecial />)
    const cards = screen.getAllByRole('heading', { level: 3 })
    expect(cards).toHaveLength(4)
  })

  it('renders cards with correct titles', () => {
    render(<WhyYoureSpecial />)
    expect(screen.getByText('Your Smile')).toBeInTheDocument()
    expect(screen.getByText('Your Laugh')).toBeInTheDocument()
    expect(screen.getByText('Your Kindness')).toBeInTheDocument()
    expect(screen.getByText('How You Make Me Feel')).toBeInTheDocument()
  })

  it('renders cards with correct descriptions', () => {
    render(<WhyYoureSpecial />)
    expect(screen.getByText(/smile lights up a room/i)).toBeInTheDocument()
    expect(screen.getByText(/laugh you try to hide/i)).toBeInTheDocument()
    expect(screen.getByText(/care about everyone/i)).toBeInTheDocument()
    expect(screen.getByText(/coming home/i)).toBeInTheDocument()
  })

  it('uses 2-column grid layout class', () => {
    const { container } = render(<WhyYoureSpecial />)
    const grid = container.querySelector('.grid')
    expect(grid).toBeInTheDocument()
    expect(grid).toHaveClass('grid-cols-1')
    expect(grid).toHaveClass('sm:grid-cols-2')
  })
})
