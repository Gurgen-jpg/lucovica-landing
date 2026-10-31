// Навигация каркаса: ссылки хедера, мобильного меню и футера.

export const HEADER_NAV = [
  { label: 'Услуги', href: '/#services' },
  { label: 'Цены', href: '/#prices' },
  { label: 'Мастера', href: '/#masters' },
  { label: 'Вопросы', href: '/#faq' },
] as const

export const SERVICE_PAGES = [
  { label: 'Лазерная эпиляция', href: '/laser-epil' },
  { label: 'Шугаринг', href: '/sugaring' },
  { label: 'Электроэпиляция', href: '/electro-epil' },
  { label: 'Комплексы', href: '/complex' },
  { label: 'Подарочный сертификат', href: '/cert' },
] as const
