import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Политика конфиденциальности',
  description: 'Политика обработки персональных данных студии LUCOVICA',
  robots: { index: false, follow: false },
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lucovica.ru'
const PHONE = '+7 (977) 016-97-75'

export default function PrivacyPage() {
  const today = new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b border-mist px-5 md:px-12 py-4 flex items-center justify-between">
        <Link href="/" className="text-dark font-bold text-lg tracking-wide">
          LUCOVICA
        </Link>
        <Link href="/" className="text-sm text-dark/60 hover:text-dark transition">
          ← На главную
        </Link>
      </header>

      <main className="max-w-3xl mx-auto px-5 md:px-8 py-12">
        <h1 className="text-3xl font-extrabold text-dark mb-2">
          Политика конфиденциальности
        </h1>
        <p className="text-dark/50 text-sm mb-10">
          Последнее обновление: {today}
        </p>

        <div className="space-y-8 text-dark/80 text-sm leading-relaxed">

          {/* 1 */}
          <section>
            <h2 className="text-lg font-bold text-dark mb-3">1. Общие положения</h2>
            <p className="mb-3">
              Настоящая Политика конфиденциальности (далее — «Политика») определяет порядок
              обработки и защиты персональных данных физических лиц (далее — «Пользователи»),
              которые используют сайт <a href={SITE_URL} className="text-dark underline">{SITE_URL}</a>
              {' '}(далее — «Сайт»), принадлежащий студии эпиляции LUCOVICA
              (далее — «Оператор»).
            </p>
            <p className="mb-3">
              Настоящая Политика разработана в соответствии с требованиями
              Федерального закона от 27.07.2006 № 152-ФЗ «О персональных данных»
              и иными нормативными правовыми актами Российской Федерации.
            </p>
            <p>
              Используя Сайт и оставляя свои данные через форму записи,
              Пользователь даёт согласие на обработку персональных данных на условиях
              настоящей Политики.
            </p>
          </section>

          {/* 2 */}
          <section>
            <h2 className="text-lg font-bold text-dark mb-3">2. Сведения об операторе</h2>
            <div className="bg-white rounded-2xl border border-mist p-5 space-y-1.5">
              <p><span className="font-semibold">Наименование:</span> Студия эпиляции LUCOVICA</p>
              <p><span className="font-semibold">Адрес:</span> Ростов-на-Дону, просп. Соколова, 68/118Вс1, этаж 1</p>
              <p><span className="font-semibold">Телефон:</span>{' '}
                <a href={`tel:${PHONE}`} className="text-dark">{PHONE}</a>
              </p>
              <p><span className="font-semibold">Сайт:</span>{' '}
                <a href={SITE_URL} className="text-dark">{SITE_URL}</a>
              </p>
            </div>
          </section>

          {/* 3 */}
          <section>
            <h2 className="text-lg font-bold text-dark mb-3">3. Состав собираемых персональных данных</h2>
            <p className="mb-3">
              При заполнении формы записи, обратной связи или анкеты гостя (Welcome List)
              на Сайте Оператор собирает следующие персональные данные:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>Имя (имя и фамилия) Пользователя;</li>
              <li>Номер контактного телефона;</li>
              <li>Запрашиваемая услуга и удобное время записи;</li>
              <li>
                <span className="font-semibold">Специальные категории персональных данных о состоянии здоровья</span> —
                при заполнении анкеты гостя (Welcome List): сведения о противопоказаниях к лазерной
                процедуре (беременность, лактация, онкология, диабет, эпилепсия, приём ретиноидов
                и антибиотиков, фотодерматит, ОРВИ), загар за последние 2 недели, аллергии
                и особенности кожи. Обработка производится исключительно в целях обеспечения
                безопасности косметологической процедуры на основании письменного согласия
                субъекта (ст. 10 ч. 2 п. 4 ФЗ-152).
              </li>
              <li>Технические данные: IP-адрес, параметры браузера, UTM-метки (источник перехода).</li>
            </ul>
          </section>

          {/* 4 */}
          <section>
            <h2 className="text-lg font-bold text-dark mb-3">4. Цели обработки персональных данных</h2>
            <p className="mb-3">Персональные данные обрабатываются в целях:</p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>подтверждения и ведения записи Пользователя на процедуру;</li>
              <li>обратной связи с Пользователем по вопросам предоставления услуг;</li>
              <li>
                <span className="font-semibold">обеспечения безопасности проведения косметологической процедуры</span> —
                выявление медицинских противопоказаний до начала процедуры и подготовка
                кабинета с учётом индивидуальных предпочтений клиента;
              </li>
              <li>информирования об акциях, специальных предложениях (при наличии согласия);</li>
              <li>улучшения качества работы Сайта и анализа пользовательского поведения;</li>
              <li>соблюдения требований законодательства РФ.</li>
            </ul>
          </section>

          {/* 5 */}
          <section>
            <h2 className="text-lg font-bold text-dark mb-3">5. Правовые основания обработки</h2>
            <p className="mb-3">
              Обработка персональных данных осуществляется на следующих основаниях:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <span className="font-semibold">Согласие субъекта</span> (ст. 6 ч. 1 п. 1 ФЗ-152) —
                Пользователь добровольно заполняет форму и нажимает кнопку «Записаться» / «Отправить»;
              </li>
              <li>
                <span className="font-semibold">Исполнение договора</span> (ст. 6 ч. 1 п. 5 ФЗ-152) —
                обработка необходима для предоставления услуги, на которую записывается Пользователь;
              </li>
              <li>
                <span className="font-semibold">Письменное согласие на обработку специальных категорий ПДн</span>{' '}
                (ст. 10 ч. 2 п. 4 ФЗ-152) — при заполнении анкеты гостя Пользователь даёт
                явное согласие на обработку данных о состоянии здоровья в целях обеспечения
                безопасности косметологической процедуры. Согласие подтверждается установкой
                соответствующего флажка в форме;
              </li>
              <li>
                <span className="font-semibold">Законный интерес</span> (ст. 6 ч. 1 п. 7 ФЗ-152) —
                аналитика и улучшение работы Сайта в рамках разумных ожиданий Пользователей.
              </li>
            </ul>
          </section>

          {/* 6 */}
          <section>
            <h2 className="text-lg font-bold text-dark mb-3">6. Порядок обработки и хранения данных</h2>
            <p className="mb-3">
              Обработка персональных данных осуществляется смешанным способом (с использованием
              средств автоматизации и без таковых) сотрудниками Оператора.
            </p>
            <p className="mb-3">
              Данные, полученные через форму записи, передаются Оператору посредством
              защищённого API-запроса (HTTPS) и доставляются в корпоративный мессенджер.
              Данные не хранятся в открытых базах данных на стороне Сайта.
            </p>
            <p className="mb-3">
              Срок хранения персональных данных — не более <span className="font-semibold">3 лет</span>
              {' '}с момента последнего взаимодействия с Пользователем, если иное не предусмотрено
              применимым законодательством.
            </p>
            <p>
              По истечении срока хранения либо при отзыве согласия данные уничтожаются
              в порядке, предусмотренном внутренними процедурами Оператора.
            </p>
          </section>

          {/* 7 */}
          <section>
            <h2 className="text-lg font-bold text-dark mb-3">7. Передача персональных данных третьим лицам</h2>
            <p className="mb-3">
              Оператор не передаёт персональные данные третьим лицам без согласия
              Пользователя, за исключением случаев, предусмотренных законодательством РФ.
            </p>
            <p className="mb-3">
              В целях обеспечения работы Сайта Оператор использует следующие сервисы-обработчики:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>
                <span className="font-semibold">Яндекс.Метрика</span> (АО «Яндекс», Россия) —
                анализ посещаемости Сайта. Политика конфиденциальности:{' '}
                <a href="https://yandex.ru/legal/confidential/" target="_blank"
                   rel="noopener noreferrer" className="text-dark underline">
                  yandex.ru/legal/confidential
                </a>;
              </li>
              <li>
                <span className="font-semibold">Telegram</span> (Telegram FZ-LLC) —
                доставка уведомлений о заявках операторам студии.
              </li>
            </ul>
            <p className="mt-3">
              Указанные сервисы действуют в соответствии со своими политиками
              конфиденциальности и не вправе использовать данные в собственных целях.
            </p>
          </section>

          {/* 8 */}
          <section>
            <h2 className="text-lg font-bold text-dark mb-3">8. Права субъекта персональных данных</h2>
            <p className="mb-3">
              В соответствии со ст. 14–17 Федерального закона № 152-ФЗ Пользователь вправе:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>получить информацию об обработке своих персональных данных;</li>
              <li>потребовать уточнения, блокирования или уничтожения неточных данных;</li>
              <li>
                отозвать согласие на обработку — направив письменный запрос на контактный
                телефон или адрес Оператора; после отзыва данные будут удалены в течение
                <span className="font-semibold"> 30 рабочих дней</span>;
              </li>
              <li>
                обжаловать действия или бездействие Оператора в уполномоченный орган —
                Роскомнадзор (<a href="https://rkn.gov.ru" target="_blank" rel="noopener noreferrer"
                  className="text-dark underline">rkn.gov.ru</a>).
              </li>
            </ul>
          </section>

          {/* 9 */}
          <section>
            <h2 className="text-lg font-bold text-dark mb-3">9. Файлы cookie</h2>
            <p className="mb-3">
              Сайт использует файлы cookie — небольшие текстовые файлы, сохраняемые в браузере
              Пользователя. Cookie применяются для:
            </p>
            <ul className="list-disc pl-5 space-y-1.5">
              <li>обеспечения работоспособности Сайта;</li>
              <li>сбора статистики посещаемости (Яндекс.Метрика);</li>
              <li>сохранения пользовательских предпочтений.</li>
            </ul>
            <p className="mt-3">
              Пользователь вправе настроить браузер таким образом, чтобы отказаться от приёма
              cookie или получать уведомления об их отправке. Отключение cookie может привести
              к ограничению функциональности Сайта.
            </p>
          </section>

          {/* 10 */}
          <section>
            <h2 className="text-lg font-bold text-dark mb-3">10. Защита персональных данных</h2>
            <p>
              Оператор принимает организационные и технические меры для защиты персональных
              данных от несанкционированного доступа, уничтожения, изменения, блокирования,
              копирования, предоставления, распространения, а также от иных неправомерных
              действий в отношении персональных данных. Передача данных осуществляется
              по защищённому протоколу HTTPS (TLS 1.2 и выше).
            </p>
          </section>

          {/* 11 */}
          <section>
            <h2 className="text-lg font-bold text-dark mb-3">11. Изменение Политики</h2>
            <p>
              Оператор вправе вносить изменения в настоящую Политику в одностороннем порядке.
              Новая редакция вступает в силу с момента её публикации на Сайте. Актуальная
              версия Политики всегда доступна по адресу{' '}
              <a href={`${SITE_URL}/privacy`} className="text-dark underline">
                {SITE_URL}/privacy
              </a>.
              Продолжение использования Сайта после публикации изменений означает согласие
              с обновлённой Политикой.
            </p>
          </section>

          {/* 12 */}
          <section>
            <h2 className="text-lg font-bold text-dark mb-3">12. Контакты</h2>
            <p className="mb-3">
              По всем вопросам, связанным с обработкой персональных данных, вы можете обратиться:
            </p>
            <div className="bg-white rounded-2xl border border-mist p-5 space-y-2">
              <p>Телефон: <a href={`tel:${PHONE}`} className="text-dark font-semibold">{PHONE}</a></p>
              <p>Адрес: Ростов-на-Дону, просп. Соколова, 68/118Вс1, этаж 1</p>
              <p className="text-dark/50 text-xs">
                Ответ на обращение предоставляется в срок не позднее 30 рабочих дней
                со дня получения запроса (ст. 20 ФЗ № 152-ФЗ).
              </p>
            </div>
          </section>

        </div>

        {/* Footer nav */}
        <div className="mt-12 pt-8 border-t border-mist flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link href="/" className="btn-outline text-sm">
            ← Вернуться на главную
          </Link>
          <p className="text-xs text-dark/40">
            © 2026 LUCOVICA · ФЗ-152 «О персональных данных»
          </p>
        </div>
      </main>
    </div>
  )
}
