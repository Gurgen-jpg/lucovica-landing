import Image from 'next/image'
import LogoDivider from './LogoDivider'

const nav = [
  { href: '#services', label: 'Услуги' },
  { href: '#pricing', label: 'Цены' },
  { href: '#reviews', label: 'Отзывы' },
  { href: '#about', label: 'О нас' },
  { href: '#contacts', label: 'Контакты' },
  { href: '#faq', label: 'FAQ' },
]

const PHONE = '+7 (977) 016-97-75'
const PHONE_HREF = '+79770169775'
const TG_USERNAME = 'lucovica_pro_epil'

export default function Footer() {
  return (
    <footer className="bg-dark text-white/70 py-12 px-5 md:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">

          {/* Brand */}
          <div className="sm:col-span-2 md:col-span-1">
            <LogoDivider
              sourse="/Logo, symbol and 2 taglines_white.png"
              // alt="LUCOVICA"
              width={60}
              height={50}
            // className="h-8 w-auto object-contain mb-4"
            />
            <p className="text-sm leading-relaxed text-white/50">
              Студия лазерной эпиляции и шугаринга в центре Ростова-на-Дону.
            </p>
          </div>

          {/* Nav */}
          <div>
            <p className="text-white font-semibold mb-4 text-sm">Навигация</p>
            <ul className="space-y-2">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="text-sm hover:text-cream transition">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="text-white font-semibold mb-4 text-sm">Услуги</p>
            <ul className="space-y-2 text-sm">
              <li><a href="#pricing" className="hover:text-cream transition">Лазерная эпиляция</a></li>
              <li><a href="#pricing" className="hover:text-cream transition">Шугаринг</a></li>
              <li><a href="#pricing" className="hover:text-cream transition">Мужская эпиляция</a></li>
              <li><a href="#pricing" className="hover:text-cream transition">Подростки</a></li>
              <li><a href="#pricing" className="hover:text-cream transition">Электроэпиляция</a></li>
              <li><a href="#pricing" className="hover:text-cream transition">Сертификаты</a></li>
            </ul>
          </div>

          {/* Contacts */}
          <div>
            <p className="text-white font-semibold mb-4 text-sm">Контакты</p>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Адрес</p>
                <p className="text-white/60 text-xs">Ростов-на-Дону,<br />просп. Соколова, 68/118Вс1, эт. 1</p>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Телефон</p>
                <a href={`tel:${PHONE_HREF}`} className="hover:text-cream transition">{PHONE}</a>
              </div>
              <div>
                <p className="text-white/40 text-xs uppercase tracking-widest mb-0.5">Telegram</p>
                <a
                  href={`https://t.me/${TG_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-cream transition"
                >
                  @{TG_USERNAME}
                </a>
              </div>
              <p className="text-xs text-white/30">Ежедневно 10:00–21:00</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <p>© 2026 LUCOVICA. Все права защищены.</p>
          <div className="flex gap-4">
            <a href="/privacy" className="hover:text-white/70 transition">Политика конфиденциальности</a>
            <a href="/offer" className="hover:text-white/70 transition">Публичная оферта</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
