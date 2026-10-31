import type { Page } from '../lib/page.ts'
import { welcomeBack } from '../sections/welcome/welcome.ts'

// Анкета повторного гостя: ссылка рассылается вручную, без каркаса сайта и индексации
export const page: Page = {
  path: '/welcome/back',
  meta: { title: 'С возвращением — LUCOVICA', description: 'Анкета гостя студии LUCOVICA перед повторным визитом.', noindex: true },
  render: () => welcomeBack(),
}
