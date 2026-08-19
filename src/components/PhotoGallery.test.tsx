import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import PhotoGallery from '../components/PhotoGallery'

describe('PhotoGallery', () => {
  it('renders the section heading', () => {
    render(<PhotoGallery />)
    expect(screen.getByText(/Most Beautiful Person/i)).toBeInTheDocument()
  })

  it('renders all 4 photo cards', () => {
    render(<PhotoGallery />)
    const images = screen.getAllByRole('img')
    expect(images).toHaveLength(4)
  })

  it('renders photo captions', () => {
    render(<PhotoGallery />)
    expect(screen.getByText(/Just being you/i)).toBeInTheDocument()
    expect(screen.getByText(/That face/i)).toBeInTheDocument()
    expect(screen.getByText(/My favorite person/i)).toBeInTheDocument()
    expect(screen.getByText(/Always stunning/i)).toBeInTheDocument()
  })

  it('uses horizontal flex layout without wrapping', () => {
    const { container } = render(<PhotoGallery />)
    const flexContainer = container.querySelector('.flex')
    expect(flexContainer).toBeInTheDocument()
    expect(flexContainer).toHaveClass('flex-nowrap')
  })

  it('photos are sized appropriately for 1x4 row', () => {
    const { container } = render(<PhotoGallery />)
    const images = container.querySelectorAll('img')
    images.forEach((img) => {
      expect(img).toHaveClass('w-36')
      expect(img).toHaveClass('h-36')
      expect(img).toHaveClass('sm:w-44')
      expect(img).toHaveClass('sm:h-44')
    })
  })
})
