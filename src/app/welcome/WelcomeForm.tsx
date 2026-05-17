'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Chip, YesNo, NavButtons, Checkbox } from '@/components/ui'
import { isValidPhone, formatPhone } from '@/lib/validation'
import { track } from '@/lib/analytics'
import {
  DRINKS,
  MILK_OPTIONS,
  COFFEE_IDS,
  MILK_TRIGGER,
  KID_NEEDS,
  SOURCES,
  CONTRAINDICATIONS_NEW,
} from '@/lib/welcome-options'

// ─── Types ────────────────────────────────────────────────────────────────────

type AddressForm = 'ty' | 'vy' | ''

interface FormData {
  name: string
  address_form: AddressForm
  phone: string
  drink: string
  milk: string
  sugar: boolean | null
  cream: boolean | null
  extra_drink_wish: string
  car: boolean | null
  car_number: string
  talk_mode: string
  with_kid: boolean | null
  kid_age: string
  kid_needs: string[]
  contraindications: string[]
  tan: boolean | null
  skin_notes: string
  source: string
  extra_notes: string
  privacy_consent: boolean
}

const INITIAL: FormData = {
  name: '',
  address_form: '',
  phone: '',
  drink: '',
  milk: '',
  sugar: null,
  cream: null,
  extra_drink_wish: '',
  car: null,
  car_number: '',
  talk_mode: '',
  with_kid: null,
  kid_age: '',
  kid_needs: [],
  contraindications: [],
  tan: null,
  skin_notes: '',
  source: '',
  extra_notes: '',
  privacy_consent: false,
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function WelcomeForm() {
  const params = useSearchParams()
  const initialName = params.get('name') ?? ''
  const initialPhone = params.get('phone') ?? ''

  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [data, setData] = useState<FormData>({
    ...INITIAL,
    name: initialName,
    phone: initialPhone ? formatPhone(initialPhone) : '',
  })

  const vy = data.address_form === 'vy'
  const TOTAL = 6

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setData(d => ({ ...d, [key]: value }))

  const goTo = (target: number) => {
    setStep(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const goNext = () => {
    const next = step + 1
    if (next >= 1 && next <= TOTAL) track(`welcome_step_${next}`)
    goTo(next)
  }
  const goBack = () => goTo(step - 1)

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return data.name.trim().length > 0 && isValidPhone(data.phone) && data.address_form !== ''
      case 2:
        return data.drink !== ''
      case 3:
        return data.car !== null
      case 4:
        return data.talk_mode !== '' && data.with_kid !== null
      case 5:
        return data.contraindications.length > 0 && data.tan !== null
      case 6:
        return data.source !== '' && data.privacy_consent
      default:
        return true
    }
  }

  const handleSubmit = async () => {
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await fetch('/api/welcome', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, visit_type: 'new', _hp: '' }),
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error ?? 'Ошибка отправки')
      track('welcome_submitted')
      goTo(7)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Что-то пошло не так. Попробуй ещё раз.')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleContraindication = (item: string) => {
    if (item === 'Ничего из перечисленного') {
      set('contraindications', data.contraindications.includes(item) ? [] : [item])
    } else {
      const without = data.contraindications.filter(c => c !== 'Ничего из перечисленного')
      set('contraindications', without.includes(item) ? without.filter(c => c !== item) : [...without, item])
    }
  }

  const toggleKidNeed = (item: string) =>
    set(
      'kid_needs',
      data.kid_needs.includes(item) ? data.kid_needs.filter(n => n !== item) : [...data.kid_needs, item],
    )

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-mist px-5 py-4 flex items-center justify-between shrink-0">
        <span className="font-bold text-lg tracking-wide text-dark">LUCOVICA</span>
        {step > 0 && step < 7 && (
          <span className="text-xs text-dark/40 uppercase tracking-widest">
            {step} / {TOTAL}
          </span>
        )}
      </header>

      {/* Progress bar */}
      {step > 0 && step < 7 && (
        <div className="h-[3px] bg-mist shrink-0">
          <div
            className="h-full bg-dark transition-all duration-500 ease-out"
            style={{ width: `${(step / TOTAL) * 100}%` }}
          />
        </div>
      )}

      {/* Content */}
      <main className="flex-1 flex flex-col max-w-md mx-auto w-full px-5 py-8">
        <div key={step} className="flex-1 flex flex-col animate-fade-up">

          {/* ── SCREEN 0: Welcome ── */}
          {step === 0 && (
            <>
              <div className="flex-1 flex flex-col justify-center">
                <h1 className="text-3xl font-normal text-dark mb-4 leading-snug">
                  Привет, наша звёздочка ✨
                </h1>
                <p className="text-dark/60 text-base mb-8 leading-relaxed">
                  {data.name
                    ? `${data.name}, давай познакомимся ближе — расскажи о себе, и мы подготовим визит так, как тебе будет комфортно. Это займёт 3 минуты.`
                    : 'Давай познакомимся ближе — расскажи о себе, и мы подготовим визит так, как тебе будет комфортно. Это займёт 3 минуты.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    track('welcome_started')
                    goTo(1)
                  }}
                  className="btn-primary w-full text-base py-4"
                >
                  Начнём
                </button>
              </div>
              <p className="text-center mt-8">
                <Link href="/privacy" className="text-xs text-dark/40 hover:text-dark/60 transition">
                  Политика конфиденциальности
                </Link>
              </p>
            </>
          )}

          {/* ── SCREEN 1: Name / Address form / Phone ── */}
          {step === 1 && (
            <>
              <h2 className="section-title mb-6">Знакомство</h2>
              <div className="space-y-5 flex-1">
                <div>
                  <label className="block text-xs text-dark/50 uppercase tracking-widest mb-2">
                    Как к тебе обращаться?
                  </label>
                  <input
                    type="text"
                    value={data.name}
                    onChange={e => set('name', e.target.value)}
                    placeholder="Например, Рита"
                    className="form-input"
                  />
                </div>
                <div>
                  <label className="block text-xs text-dark/50 uppercase tracking-widest mb-2">
                    Комфортнее на «ты» или на «вы»?
                  </label>
                  <div className="flex gap-3">
                    {(['ty', 'vy'] as const).map(form => (
                      <button
                        key={form}
                        type="button"
                        onClick={() => set('address_form', form)}
                        className={`flex-1 py-4 rounded-2xl border text-sm transition-all duration-150 active:scale-[0.98] ${data.address_form === form
                          ? 'bg-dark text-white border-dark'
                          : 'bg-white text-dark border-mist hover:border-dark/40'
                          }`}
                      >
                        {form === 'ty' ? 'На «ты»' : 'На «вы»'}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-dark/50 uppercase tracking-widest mb-2">
                    Номер для связи
                  </label>
                  <input
                    type="tel"
                    inputMode="tel"
                    value={data.phone}
                    onChange={e => set('phone', formatPhone(e.target.value))}
                    placeholder="+7 (___) ___-__-__"
                    className="form-input"
                  />
                  {data.phone.length > 2 && !isValidPhone(data.phone) && (
                    <p className="mt-1.5 text-xs text-red-500">Введи полный номер телефона</p>
                  )}
                </div>
              </div>
              <NavButtons onNext={goNext} onBack={goBack} canNext={canProceed()} showBack={false} />
            </>
          )}

          {/* ── SCREEN 2: Drink ── */}
          {step === 2 && (
            <>
              <h2 className="section-title mb-1">Что приготовить?</h2>
              <p className="text-dark/60 text-sm mb-5">
                Угостим {vy ? 'вас' : 'тебя'} кофе или чаем — что {vy ? 'будете' : 'будешь'}?
              </p>
              <div className="space-y-2 flex-1">
                {DRINKS.map(d => (
                  <Chip
                    key={d.id}
                    selected={data.drink === d.id}
                    onClick={() => {
                      set('drink', d.id)
                      if (!MILK_TRIGGER.has(d.id)) { set('milk', ''); set('sugar', null); set('cream', null) }
                      if (!COFFEE_IDS.has(d.id)) { set('sugar', null); set('cream', null) }
                    }}
                  >
                    <span className="text-lg leading-none">{d.emoji}</span>
                    <span>{d.label}</span>
                  </Chip>
                ))}

                {data.drink && MILK_TRIGGER.has(data.drink) && (
                  <div className="pt-3">
                    <p className="text-xs text-dark/50 uppercase tracking-widest mb-2">Молоко</p>
                    <div className="space-y-2">
                      {MILK_OPTIONS.map(m => (
                        <Chip key={m.id} selected={data.milk === m.id} onClick={() => set('milk', m.id)}>
                          <span className="text-lg leading-none">{m.emoji}</span>
                          <span>{m.label}</span>
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}

                {data.drink && COFFEE_IDS.has(data.drink) && (
                  <div className="pt-3 space-y-4">
                    <div>
                      <p className="text-xs text-dark/50 uppercase tracking-widest mb-2">Сахар?</p>
                      <YesNo value={data.sugar} onChange={v => set('sugar', v)} />
                    </div>
                    <div>
                      <p className="text-xs text-dark/50 uppercase tracking-widest mb-2">Сливки?</p>
                      <YesNo value={data.cream} onChange={v => set('cream', v)} />
                    </div>
                  </div>
                )}

                <div className="pt-3">
                  <p className="text-xs text-dark/40 leading-relaxed">
                    Сиропов у нас пока нет — но если хочется чего-то особенного, напиши ниже 🌿
                  </p>
                  <textarea
                    value={data.extra_drink_wish}
                    onChange={e => set('extra_drink_wish', e.target.value)}
                    placeholder="Опционально"
                    rows={2}
                    className="mt-2 form-textarea"
                  />
                </div>
              </div>
              <NavButtons onNext={goNext} onBack={goBack} canNext={canProceed()} />
            </>
          )}

          {/* ── SCREEN 3: Transport ── */}
          {step === 3 && (
            <>
              <h2 className="section-title mb-5">Как доберёшься?</h2>
              <div className="space-y-4 flex-1">
                <YesNo
                  value={data.car}
                  onChange={v => { set('car', v); if (!v) set('car_number', '') }}
                  labelYes="На машине"
                  labelNo="Без машины"
                />
                {data.car && (
                  <div>
                    <label className="block text-xs text-dark/50 uppercase tracking-widest mb-2">
                      Номер автомобиля
                    </label>
                    <input
                      type="text"
                      value={data.car_number}
                      onChange={e => set('car_number', e.target.value)}
                      placeholder="А123БВ 161"
                      className="form-input"
                    />
                    <p className="mt-1.5 text-xs text-dark/40">
                      Предупредим, чтобы у входа было свободно
                    </p>
                  </div>
                )}
              </div>
              <NavButtons onNext={goNext} onBack={goBack} canNext={canProceed()} />
            </>
          )}

          {/* ── SCREEN 4: Comfort ── */}
          {step === 4 && (
            <>
              <h2 className="section-title mb-5">Комфорт</h2>
              <div className="space-y-6 flex-1">
                <div>
                  <p className="text-sm text-dark/60 mb-3">
                    {vy ? 'Хотите разговаривать' : 'Хочешь разговаривать'} или побыть в тишине?
                  </p>
                  <div className="space-y-2">
                    {[
                      { id: 'chat', label: 'Поболтаем' },
                      { id: 'silent', label: 'Тишина, я отдохну' },
                      { id: 'any', label: 'Как пойдёт' },
                    ].map(opt => (
                      <Chip
                        key={opt.id}
                        selected={data.talk_mode === opt.id}
                        onClick={() => set('talk_mode', opt.id)}
                      >
                        {opt.label}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-dark/60 mb-3">
                    {vy ? 'Придёте' : 'Придёшь'} с ребёнком?
                  </p>
                  <YesNo
                    value={data.with_kid}
                    onChange={v => { set('with_kid', v); if (!v) { set('kid_age', ''); set('kid_needs', []) } }}
                  />
                  {data.with_kid && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="block text-xs text-dark/50 uppercase tracking-widest mb-2">
                          Сколько лет?
                        </label>
                        <input
                          type="number"
                          min={0}
                          max={17}
                          value={data.kid_age}
                          onChange={e => set('kid_age', e.target.value)}
                          placeholder="Возраст"
                          className="form-input"
                        />
                      </div>
                      <div>
                        <p className="text-xs text-dark/50 uppercase tracking-widest mb-2">Что подготовить?</p>
                        <div className="space-y-2">
                          {KID_NEEDS.map(item => (
                            <Chip
                              key={item}
                              selected={data.kid_needs.includes(item)}
                              onClick={() => toggleKidNeed(item)}
                            >
                              {item}
                            </Chip>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <NavButtons onNext={goNext} onBack={goBack} canNext={canProceed()} />
            </>
          )}

          {/* ── SCREEN 5: Health ── */}
          {step === 5 && (
            <>
              <h2 className="section-title mb-1">Здоровье 🏥</h2>
              <p className="text-dark/60 text-sm mb-5">
                Это важная часть. Лазер не подходит при некоторых состояниях —{' '}
                {vy ? 'отметьте' : 'отметь'}, что относится к {vy ? 'вам' : 'тебе'}.
              </p>
              <div className="space-y-5 flex-1">
                <div className="space-y-2">
                  {CONTRAINDICATIONS_NEW.map(item => (
                    <Chip
                      key={item}
                      selected={data.contraindications.includes(item)}
                      onClick={() => toggleContraindication(item)}
                    >
                      {item}
                    </Chip>
                  ))}
                </div>
                <div>
                  <p className="text-sm text-dark/60 mb-3">
                    {vy ? 'Загорали' : 'Загорала'} или {vy ? 'были' : 'была'} в солярии в последние 2 недели?
                  </p>
                  <YesNo value={data.tan} onChange={v => set('tan', v)} />
                </div>
                <div>
                  <label className="block text-xs text-dark/50 uppercase tracking-widest mb-2">
                    Аллергии или особенности кожи
                  </label>
                  <textarea
                    value={data.skin_notes}
                    onChange={e => set('skin_notes', e.target.value)}
                    placeholder="Опционально — если есть, что нам важно знать"
                    rows={3}
                    className="form-textarea"
                  />
                </div>
              </div>
              <NavButtons onNext={goNext} onBack={goBack} canNext={canProceed()} />
            </>
          )}

          {/* ── SCREEN 6: Final ── */}
          {step === 6 && (
            <>
              <h2 className="section-title mb-5">Почти готово</h2>
              <div className="space-y-5 flex-1">
                <div>
                  <p className="text-sm text-dark/60 mb-3">
                    Откуда {vy ? 'узнали' : 'узнала'} о нас?
                  </p>
                  <div className="space-y-2">
                    {SOURCES.map(s => (
                      <Chip key={s} selected={data.source === s} onClick={() => set('source', s)}>
                        {s}
                      </Chip>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-dark/50 uppercase tracking-widest mb-2">
                    {vy ? 'Хотите' : 'Хочешь'} что-то ещё рассказать?
                  </label>
                  <textarea
                    value={data.extra_notes}
                    onChange={e => set('extra_notes', e.target.value)}
                    placeholder="Опционально"
                    rows={3}
                    className="form-textarea"
                  />
                </div>
                {/* Consent */}
                <Checkbox checked={data.privacy_consent} onChange={v => set('privacy_consent', v)}>
                  <p className="text-xs text-dark/60 leading-relaxed">
                    Я ознакомлена с{' '}
                    <Link
                      href="/privacy"
                      className="underline hover:text-dark transition"
                      target="_blank"
                      onClick={e => e.stopPropagation()}
                    >
                      Политикой конфиденциальности
                    </Link>{' '}
                    и согласна на обработку персональных данных, включая сведения о состоянии здоровья, в целях подготовки и проведения процедуры.
                  </p>
                </Checkbox>
              </div>

              {submitError && (
                <p className="mt-4 text-sm text-red-500 text-center">{submitError}</p>
              )}

              <NavButtons
                onNext={handleSubmit}
                onBack={goBack}
                canNext={canProceed() && !submitting}
                nextLabel={submitting ? 'Отправляем...' : 'Отправить'}
              />
            </>
          )}

          {/* ── SCREEN 7: Thank you ── */}
          {step === 7 && (
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="text-5xl mb-5">✨</div>
              <h2 className="text-3xl font-normal text-dark mb-3">Всё записали</h2>
              <p className="text-dark/60 text-base mb-10 leading-relaxed">
                Готовимся к {vy ? 'вашему' : 'твоему'} визиту. До встречи!
              </p>
              <div className="w-full space-y-3">
                <a
                  href="https://yandex.ru/maps/?text=%D0%A0%D0%BE%D1%81%D1%82%D0%BE%D0%B2-%D0%BD%D0%B0-%D0%94%D0%BE%D0%BD%D1%83%2C+%D0%BF%D1%80%D0%BE%D1%81%D0%BF%D0%B5%D0%BA%D1%82+%D0%A1%D0%BE%D0%BA%D0%BE%D0%BB%D0%BE%D0%B2%D0%B0+68"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4"
                >
                  📍 Построить маршрут
                </a>
                <a
                  href="https://wa.me/79770169775"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full flex items-center justify-center gap-2 py-4"
                >
                  💬 Написать в WhatsApp
                </a>
                <a
                  href="https://t.me/+79770169775"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full flex items-center justify-center gap-2 py-4"
                >
                  ✈️ Написать в Telegram
                </a>
                <a
                  href={process.env.NEXT_PUBLIC_MAX_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline w-full flex items-center justify-center gap-2 py-4"
                >
                  💬 Написать в Max
                </a>
                <a
                  href={`tel:${process.env.NEXT_PUBLIC_PHONE}`}
                  className="btn-outline w-full flex items-center justify-center gap-2 py-4"
                >
                  📞 Позвонить
                </a>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
