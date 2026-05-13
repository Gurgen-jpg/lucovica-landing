import { vi } from 'vitest'

// Env variables for all tests
process.env.TELEGRAM_BOT_TOKEN = 'test-token'
process.env.TELEGRAM_CHAT_ID = '-1001234567890'
process.env.SMTP_USER = 'info@lucovica.ru'
process.env.SMTP_PASS = 'test-pass'
process.env.NOTIFY_EMAIL = 'info@lucovica.ru'

// Mock nodemailer globally
vi.mock('nodemailer', () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn().mockResolvedValue({ messageId: 'test-id' }),
    })),
  },
}))
