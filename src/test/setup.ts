import '@testing-library/jest-dom'
import { vi, afterEach } from 'vitest'

class IntersectionObserverMock {
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
}

vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)

afterEach(() => {
  vi.restoreAllMocks()
})
