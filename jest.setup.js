import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    query: {},
    pathname: '/'
  })
}))

// Mock MultiversX SDK
jest.mock('@multiversx/sdk-dapp', () => ({
  useGetLoginInfo: () => ({
    isLoggedIn: false,
    loginMethod: null
  }),
  useGetAccount: () => ({
    address: '',
    balance: '0'
  }),
  DappProvider: ({ children }) => children,
  NotificationModal: () => null,
  SignTransactionsModal: () => null,
  TransactionsToastList: () => null
}))

// Mock environment variables
process.env.NODE_ENV = 'test'
process.env.NEXT_PUBLIC_ENVIRONMENT = 'test'

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn()
  }))
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
}

// Setup for AI/ML mocks
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: {
          text: () => 'Mock AI response'
        }
      })
    })
  }))
}))

jest.mock('@huggingface/inference', () => ({
  HfInference: jest.fn().mockImplementation(() => ({
    textGeneration: jest.fn().mockResolvedValue({
      generated_text: 'Mock HF response'
    })
  }))
}))
