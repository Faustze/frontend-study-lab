// Vitest setup: set API base URL for tests
import { vi } from 'vitest'

// Set VITE_API_URL before any module imports
vi.stubEnv('VITE_API_URL', 'http://localhost:3000/api')
