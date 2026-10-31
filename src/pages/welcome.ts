import type { Page } from '../lib/page.ts'
import { welcomeNew } from '../sections/welcome/welcome.ts'

// Анкета нового гостя: ссылка рассылается вручную, без каркаса сайта и индексации
export const page: Page = {
  path: '/welcome',
  meta: { title: 'Добро пожаловать — LUCOVICA', description: 'Анкета гостя студии LUCOVICA перед первым визитом.', noindex: true },
  render: () => welcomeNew(),
}
