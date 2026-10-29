import { defineConfig } from 'vitest/config'

// Окружение по умолчанию — node. Тестам браузерного кода
// (*.client.test.ts) нужно указать в начале файла:
//   // @vitest-environment happy-dom
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
})
