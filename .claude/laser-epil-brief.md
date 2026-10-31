# Техбриф: страница `/laser-epil`
**Проект:** lucovica-landing · Next.js 14 App Router + TypeScript + Tailwind v3  
**Репо:** https://github.com/Gurgen-jpg/lucovica-landing.git  
**Задача:** создать SEO-посадочную страницу `/laser-epil` для запроса «лазерная эпиляция Ростов» (1729/мес)

---

## 1. Файловая структура

```
src/
  app/
    laser-epil/
      page.tsx          ← точка входа страницы (Server Component)
      layout.tsx        ← метаданные + JSON-LD для /laser-epil
  components/
    laser-epil/
      LaserEpilHero.tsx
      LaserEpilWhy.tsx
      LaserEpilHow.tsx
      LaserEpilZones.tsx
      LaserEpilDevice.tsx
      LaserEpilContraindications.tsx
      LaserEpilResults.tsx
      LaserEpilReviews.tsx
      LaserEpilPricing.tsx
      LaserEpilFAQ.tsx
      LaserEpilCTA.tsx
      index.ts          ← barrel-экспорт всех компонентов
```

> Все компоненты страницы живут в `src/components/laser-epil/` — отдельная папка, не в корне `components/`.  
> Реиспользуемые UI-примитивы берём из `src/components/ui/` (уже есть: `SectionHeader`, `Badge`, `TagPill`).

---

## 2. Соглашения по компонентам

**Правило из CLAUDE.md:** Server Components по умолчанию. `'use client'` — только если нужны хуки или обработчики событий.

| Компонент | Тип | Причина |
|---|---|---|
| `LaserEpilHero` | `'use client'` | кнопка открывает `LeadForm` (useState) |
| `LaserEpilFAQ` | `'use client'` | аккордеон (useState) — по образцу `FAQ.tsx` |
| `LaserEpilZones` | Server | статический список зон |
| Все остальные | Server | нет интерактивности |

**Импорт UI-примитивов:**
```tsx
import { SectionHeader, Badge, TagPill } from '@/components/ui'
```

**Импорт LeadForm (для CTA-кнопок):**
```tsx
import LeadForm from '@/components/LeadForm'
```

---

## 3. Метаданные и JSON-LD (`src/app/laser-epil/layout.tsx`)

### 3.1 Metadata (Next.js)

```tsx
import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lucovica.ru'

export const metadata: Metadata = {
  title: 'Лазерная эпиляция в Ростове-на-Дону — студия Lucovica',
  description:
    'Лазерная эпиляция на диодном лазере в Ростове-на-Дону. Результат с первой процедуры. Все зоны: бикини, ноги, подмышки, лицо. Цены, отзывы, онлайн-запись — студия Lucovica, просп. Соколова 68.',
  keywords: [
    'лазерная эпиляция Ростов-на-Дону',
    'лазерная эпиляция Ростов',
    'диодный лазер эпиляция Ростов',
    'лазерная эпиляция бикини Ростов',
    'лазерная эпиляция цена Ростов',
    'студия лазерной эпиляции Ростов-на-Дону',
  ],
  alternates: {
    canonical: `${SITE_URL}/laser-epil`,
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: `${SITE_URL}/laser-epil`,
    title: 'Лазерная эпиляция в Ростове-на-Дону — студия Lucovica',
    description:
      'Диодный лазер. Результат с первой процедуры. Все зоны — бикини, ноги, подмышки. Онлайн-запись.',
  },
  robots: { index: true, follow: true },
}
```

### 3.2 JSON-LD (FAQPage + BreadcrumbList)

Вставляем в `<head>` через `<script type="application/ld+json">` — по образцу из `src/app/layout.tsx`.

**FAQPage** — данные берём из того же массива `faqs`, что используется в `LaserEpilFAQ`. Выносим массив в отдельный файл `src/components/laser-epil/LaserEpilFAQ.data.ts` и импортируем и в компонент, и в layout.

```ts
// src/components/laser-epil/LaserEpilFAQ.data.ts
export const laserEpilFaqs = [
  {
    q: 'Больно ли делать лазерную эпиляцию?',
    a: 'Диодный лазер оснащён системой охлаждения — большинство клиентов описывают ощущение как лёгкое тепло или покалывание. Болезненность зависит от зоны и порога чувствительности.',
  },
  {
    q: 'Сколько процедур нужно?',
    a: 'Курс — 6–10 сеансов с интервалом 4–8 недель. Результат заметен уже после первой процедуры: снижение плотности волос на 20–30%.',
  },
  {
    q: 'Что такое диодный лазер и чем он лучше других?',
    a: 'Диодный лазер с длиной волны 808 нм проникает в фолликул на нужную глубину и эффективно работает с тёмными, светлыми и пушковыми волосами на любом фототипе кожи.',
  },
  {
    q: 'Можно ли делать лазерную эпиляцию при загаре?',
    a: 'Нет, загорелая кожа — противопоказание. Нужно воздержаться от солярия и активного загара за 2 недели до процедуры.',
  },
  {
    q: 'Как подготовиться к лазерной эпиляции?',
    a: 'Сбрить волосы в зоне за 1–3 дня до процедуры. Не загорать 2 недели. Не использовать ретиноиды и кислоты за неделю. На процедуру прийти без крема и дезодоранта.',
  },
  {
    q: 'Какие зоны можно обрабатывать?',
    a: 'Все: ноги полностью, бикини (классическое, глубокое, тотальное), подмышки, руки, лицо, спина, живот, грудь, шея. Работаем с женщинами и мужчинами.',
  },
  {
    q: 'Есть ли противопоказания?',
    a: 'Беременность и лактация, активный загар, обострение кожных заболеваний, онкология, приём фотосенсибилизирующих препаратов. Полный список уточнит мастер на консультации.',
  },
  {
    q: 'Когда выпадут волосы после процедуры?',
    a: 'Обработанные волосы выпадают в течение 10–21 дня. В этот период допустимо аккуратно бриться — волосы выходят самостоятельно, не нужно их выдёргивать.',
  },
]
```

**JSON-LD в layout.tsx:**

```tsx
const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: laserEpilFaqs.map(({ q, a }) => ({
    '@type': 'Question',
    name: q,
    acceptedAnswer: { '@type': 'Answer', text: a },
  })),
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE_URL },
    { '@type': 'ListItem', position: 2, name: 'Лазерная эпиляция', item: `${SITE_URL}/laser-epil` },
  ],
}

// В JSX:
<head>
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
  <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
</head>
```

---

## 4. Точка входа (`src/app/laser-epil/page.tsx`)

```tsx
import {
  LaserEpilHero,
  LaserEpilWhy,
  LaserEpilHow,
  LaserEpilZones,
  LaserEpilDevice,
  LaserEpilContraindications,
  LaserEpilResults,
  LaserEpilReviews,
  LaserEpilPricing,
  LaserEpilFAQ,
  LaserEpilCTA,
} from '@/components/laser-epil'
import Footer from '@/components/Footer'
import FloatingCTA from '@/components/FloatingCTA'
import MessengerWidgets from '@/components/MessengerWidgets'

export default function LaserEpilPage() {
  return (
    <>
      <LaserEpilHero />
      <LaserEpilWhy />
      <LaserEpilHow />
      <LaserEpilZones />
      <LaserEpilDevice />
      <LaserEpilContraindications />
      <LaserEpilResults />
      <LaserEpilReviews />
      <LaserEpilPricing />
      <LaserEpilFAQ />
      <LaserEpilCTA />
      <Footer />
      <FloatingCTA />
      <MessengerWidgets />
    </>
  )
}
```

---

## 5. Дизайн-система

Все классы — только из Tailwind + существующих CSS-классов проекта. Никаких новых библиотек.

| Токен | Значение | Использование |
|---|---|---|
| `dark` | `#25272C` | основной цвет текста, тёмный фон |
| `cream` | `#F5F0C6` | акцентный (кнопки, выделения) |
| `mist` | `#D9E4EB` | светлый фон секций, бордеры |
| `white` | `#FFFFFF` | основной фон |

**Готовые классы:**
```
btn-primary    → кнопка на cream-фоне (основная CTA)
btn-outline    → кнопка-граница тёмная
btn-outline-light → кнопка-граница белая (на тёмном фоне)
section-title  → h2 заголовок секции
section-sub    → надпись над заголовком (uppercase, мелкий)
card           → белая карточка с тенью и border-mist
```

**Шаблон секции:**
```tsx
<section className="py-20 px-5 md:px-12 bg-white">
  <div className="max-w-4xl mx-auto">
    <SectionHeader sub="надпись сверху" title="Заголовок секции" />
    {/* контент */}
  </div>
</section>
```

Чередование фонов: `bg-white` → `bg-mist/20` → `bg-dark` (тёмный блок) → `bg-white`.

---

## 6. Ключевые смыслы для копирайта

### Главный акцент — диодный лазер, результат с первой процедуры

- **НЕ писать:** «навсегда», «несколько сеансов», «после курса»  
- **Писать:** «результат заметен после первой процедуры», «уже после первого визита», «эффект с первой процедуры»
- **Лазер:** диодный, длина волны 808 нм, система охлаждения, работает с разными фототипами и типами волос

### SEO-ключи (вшивать органично в тексты)

```
лазерная эпиляция Ростов-на-Дону
лазерная эпиляция Ростов
диодный лазер эпиляция
лазерная эпиляция [зона]: бикини, ноги, подмышки
студия лазерной эпиляции Кировский район
просп. Соколова 68
```

### Студия

- Адрес: Ростов-на-Дону, просп. Соколова, 68, Кировский район
- Ориентир: рядом с ЦГБ им. Семашко
- Мастера: Екатерина (основатель, старший мастер), Татьяна (ведущий мастер)
- Работают с женщинами, мужчинами, подростками (с 16 лет по лазеру)

---

## 7. Блок LaserEpilDevice — детальное ТЗ

Это ключевой блок доверия. Конкуренты часто пишут «александритовый лазер» — нам нужно объяснить почему диодный не хуже, а для многих лучше.

**Содержание:**
- Название: «Наш аппарат — диодный лазер»
- Длина волны 808 нм → оптимальная для меланина в волосяном фолликуле
- Встроенная система охлаждения → комфорт во время процедуры
- Работает с 1–6 фототипами кожи (светлая → тёмная)
- Эффективен с тёмными, светлыми и пушковыми волосами
- Акцент: «результат заметен уже после первой процедуры»

---

## 8. Плейсхолдеры для фото

Реальных фото под страницу пока нет. Плейсхолдеры делаем через div с классами:

```tsx
// Плейсхолдер изображения
<div className="w-full aspect-[4/3] bg-mist/40 rounded-2xl flex items-center justify-center">
  <span className="text-dark/30 text-sm">Фото — [описание]</span>
</div>
```

Когда появятся реальные фото — плейсхолдер заменяется на `<Image>` из `next/image`.

---

## 9. Аналитика (Яндекс Метрика)

Уже подключена глобально в `layout.tsx`. На странице /laser-epil добавить дополнительные цели на кнопках CTA:

```tsx
// Пример вызова в 'use client' компоненте
declare const ym: (id: number, action: string, goal: string) => void
const YM_ID = Number(process.env.NEXT_PUBLIC_YM_ID)

// При клике на кнопку записи:
ym(YM_ID, 'reachGoal', 'laser_epil_cta_click')

// При клике на телефон:
ym(YM_ID, 'reachGoal', 'laser_epil_phone_click')
```

Существующие цели из кода: `form_submit`, `click_phone`, `click_telegram`.  
Новые цели для /laser-epil: `laser_epil_cta_click`, `laser_epil_phone_click`.

---

## 10. Чеклист перед пушем

- [ ] `src/app/laser-epil/layout.tsx` — metadata + два JSON-LD скрипта (FAQPage + BreadcrumbList)
- [ ] `src/components/laser-epil/LaserEpilFAQ.data.ts` — массив FAQ вынесен отдельно
- [ ] Все компоненты экспортируются через `src/components/laser-epil/index.ts`
- [ ] Нет `'use client'` там где не нужно (только Hero и FAQ)
- [ ] Нигде нет слова «навсегда»
- [ ] Нигде нет «александрит» или «александритовый» — только «диодный»
- [ ] Цены в формате «от X ₽»
- [ ] `npm run build` — без ошибок TypeScript
- [ ] `npm run lint` — чисто
