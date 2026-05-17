'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Chip, YesNo, NavButtons, Checkbox } from '@/components/ui'
import { formatPhone } from '@/lib/validation'
import { track } from '@/lib/analytics'
import {
  DRINKS,
  MILK_OPTIONS,
  COFFEE_IDS,
  MILK_TRIGGER,
  CONTRAINDICATIONS_BASE,
} from '@/lib/welcome-options'

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  name: string
  phone: string
  health_changed: boolean | null
  health_notes: string
  contraindications: string[]
  tan: boolean | null
  drink: string
  milk: string
  sugar: boolean | null
  cream: boolean | null
  extra_drink_wish: string
  extra_notes: string
  privacy_consent: boolean
}

const INITIAL: FormData = {
  name: '',
  phone: '',
  health_changed: null,
  health_notes: '',
  contraindications: [],
  tan: null,
  drink: '',
  milk: '',
  sugar: null,
  cream: null,
  extra_drink_wish: '',
  extra_notes: '',
  privacy_consent: false,
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BackForm() {
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

  const TOTAL = 3

  const set = <K extends keyof FormData>(key: K, value: FormData[K]) =>
    setData(d => ({ ...d, [key]: value }))

  const goTo = (target: number) => {
    setStep(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const goNext = () => goTo(step + 1)
  const goBack = () => goTo(step - 1)

  const canProceed = (): boolean => {
    switch (step) {
      case 1:
        return data.health_changed !== null &&
          (data.health_changed === false || data.contraindications.length > 0)
      case 2:
        return data.drink !== ''
      case 3:
        return data.privacy_consent
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
        body: JSON.stringify({
          ...data,
          visit_type: 'back',
          address_form: '',
          car: null,
          car_number: '',
          talk_mode: '',
          with_kid: null,
          kid_age: '',
          kid_needs: [],
          tan: null,
          skin_notes: '',
          source: '',
          _hp: '',
        }),
      })
      const json = await res.json()
      if (!json.ok) throw new Error(json.error ?? 'Ошибка отправки')
      track('welcome_submitted')
      goTo(4)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : 'Что-то пошло не так. Попробуй ещё раз.')
    } finally {
      setSubmitting(false)
    }
  }

  const toggleContraindication = (item: string) =>
    set(
      'contraindications',
      data.contraindications.includes(item)
        ? data.contraindications.filter(c => c !== item)
        : [...data.contraindications, item],
    )

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-mist px-5 py-4 flex items-center justify-between shrink-0">
        <span className="font-bold text-lg tracking-wide text-dark">LUCOVICA</span>
        {step > 0 && step < 4 && (
          <span className="text-xs text-dark/40 uppercase tracking-widest">
            {step} / {TOTAL}
          </span>
        )}
      </header>

      {/* Progress bar */}
      {step > 0 && step < 4 && (
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

          {/* ── SCREEN 0: Welcome back ── */}
          {step === 0 && (
            <>
              <div className="flex-1 flex flex-col justify-center">
                <h1 className="text-3xl font-normal text-dark mb-4 leading-snug">
                  {data.name ? `С возвращением, ${data.name} 💛` : 'С возвращением 💛'}
                </h1>
                <p className="text-dark/60 text-base mb-8 leading-relaxed">
                  Пара вопросов, чтобы подготовиться так, как ты любишь.
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

          {/* ── SCREEN 1: Health ── */}
          {step === 1 && (
            <>
              <h2 className="section-title mb-1">Здоровье</h2>
              <p className="text-dark/60 text-sm mb-5">
                Что-то изменилось в здоровье с прошлого визита?
              </p>
              <div className="space-y-5 flex-1">
                <YesNo
                  value={data.health_changed}
                  onChange={v => {
                    set('health_changed', v)
                    if (!v) set('contraindications', [])
                  }}
                  labelYes="Да, расскажу"
                  labelNo="Нет, всё как было"
                />
                {data.health_changed && (
                  <div className="space-y-3">
                    <textarea
                      value={data.health_notes}
                      onChange={e => set('health_notes', e.target.value)}
                      placeholder="Расскажи, что изменилось..."
                      rows={3}
                      className="form-textarea"
                    />
                    <p className="text-xs text-dark/50 uppercase tracking-widest">
                      Отметь, если появилось
                    </p>
                    <div className="space-y-2">
                      {CONTRAINDICATIONS_BASE.map(item => (
                        <Chip
                          key={item}
                          selected={data.contraindications.includes(item)}
                          onClick={() => toggleContraindication(item)}
                        >
                          {item}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <NavButtons onNext={goNext} onBack={goBack} canNext={canProceed()} showBack={false} />
            </>
          )}

          {/* ── SCREEN 2: Drink ── */}
          {step === 2 && (
            <>
              <h2 className="section-title mb-1">Что сегодня хочется?</h2>
              <p className="text-dark/60 text-sm mb-5">Угостим тебя — что будешь?</p>
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

          {/* ── SCREEN 3: Extra notes + consent ── */}
          {step === 3 && (
            <>
              <h2 className="section-title mb-5">Что-то особенное?</h2>
              <div className="space-y-5 flex-1">
                <textarea
                  value={data.extra_notes}
                  onChange={e => set('extra_notes', e.target.value)}
                  placeholder="Пожелания, уточнения — всё что хочешь передать мастеру"
                  rows={4}
                  className="form-textarea"
                />
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

          {/* ── SCREEN 4: Thank you ── */}
          {step === 4 && (
            <div className="flex-1 flex flex-col justify-center items-center text-center">
              <div className="text-5xl mb-5">💛</div>
              <h2 className="text-3xl font-normal text-dark mb-3">Ждём тебя</h2>
              <p className="text-dark/60 text-base mb-10 leading-relaxed">
                Готовимся к твоему визиту. До встречи!
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
