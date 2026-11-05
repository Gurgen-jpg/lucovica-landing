// /cert — тексты перенесены из ../landing/src/components/cert/* и страницы (site)/cert.
import { formatPrice } from '../../lib/format.ts'
import type { ServicePageDef } from '../../layout/service-page.ts'
import { CERTIFICATES } from '../services.ts'

const denominations = CERTIFICATES.map((c) => ({ name: `${formatPrice(c.amount)} ₽`, short: c.desc, price: c.amount }))
const amounts = CERTIFICATES.map((c) => c.amount)

export const certPage: ServicePageDef = {
  path: '/cert',
  name: 'Подарочные сертификаты',
  sitemapPriority: 0.8,
  goalPrefix: 'cert',
  meta: {
    title: 'Подарочные сертификаты в Ростове-на-Дону — студия LUCOVICA',
    description: `Подарочные сертификаты студии LUCOVICA в центре Ростова-на-Дону — от ${Math.min(...amounts)} до ${Math.max(...amounts)} ₽ на любые услуги: шугаринг, лазерная и электроэпиляция.`,
    serviceDescription: 'Подарочный сертификат на любые услуги студии: шугаринг, лазерная и электроэпиляция.',
    pageGoal: 'cert_page_view',
  },
  hero: {
    overline: 'Подарки близким',
    title: 'Подарочные сертификаты',
    accent: 'сертификаты',
    lead: ['Подарите красоту и уход. Сертификат действует на любые услуги студии.', 'Студия LUCOVICA — просп. Соколова, 68'],
    booking: { label: 'Оформить сертификат', service: 'Подарочный сертификат' },
    secondary: { label: 'Выбрать номинал', href: '#prices' },
  },
  pricing: {
    head: { overline: 'Номиналы', title: 'Выберите сертификат', description: 'Сертификат можно использовать на любые услуги студии.' },
    groups: [{ key: 'cert', label: 'Номиналы', bookingService: 'Подарочный сертификат', items: denominations }],
    options: { itemLabel: 'Оформить', hideItemPrice: true },
  },
  cta: {
    overline: 'Оформить сертификат',
    title: 'Лучший подарок — время для себя',
    accent: 'время для себя',
    text: 'Оставьте заявку — свяжемся, поможем выбрать номинал и оформим сертификат.',
    booking: { label: 'Оформить сертификат', service: 'Подарочный сертификат' },
  },
  offers: denominations.map((d) => ({ name: `Подарочный сертификат ${d.name}`, price: d.price })),
}
