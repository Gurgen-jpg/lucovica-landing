// Мастера студии (макет v2, «Мастера»; стаж — с текущего сайта).

export interface Master {
  name: string
  role: string
  years: number
  /** Имя изображения в assets/img */
  photo: string
  alt: string
}

export const MASTERS: readonly Master[] = [
  { name: 'Екатерина', role: 'Основатель', years: 15, photo: 'team-ekaterina', alt: 'Мастер Екатерина — студия LUCOVICA' },
  { name: 'Татьяна', role: 'Ведущий мастер', years: 5, photo: 'team-tatiana', alt: 'Мастер Татьяна — студия LUCOVICA' },
]

export const MASTERS_STATEMENT = 'Мы не работаем на поток. Одна гостья — один мастер — одно спокойное время.'

export const HYGIENE_STANDARDS: readonly string[] = [
  'Одноразовые расходные материалы',
  'Стерилизация инструментов в автоклаве',
  'Гипоаллергенная косметика без парабенов',
]
