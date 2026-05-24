'use client'

import { useEffect, useRef, useState } from 'react'
import { SERVICE_NAMES_FOR_FORM } from '@/lib/services-data'
import { PHONE, PHONE_HREF, TG_USERNAME } from '@/lib/site-config'
import { formatDate, buildTimeString, getUtm } from './LeadForm.helpers'

type Step = 1 | 2 | 3 | 'success'

type Props = {
  isOpen: boolean
  onClose: () => void
  defaultService?: string
}

const TIME_SLOTS = ['Утро (9–12)', 'День (12–16)', 'Вечер (16–20)']

export default function LeadForm({ isOpen, onClose, defaultService }: Props) {
  const [step, setStep] = useState<Step>(1)
  const [service, setService] = useState(defaultService ?? '')
  const [timeSlot, setTimeSlot] = useState('')
  const [dateInput, setDateInput] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const overlayRef = useRef<HTMLDivElement>(null)

  const isCertificate = service === 'Подарочный сертификат'
  const totalSteps = isCertificate ? 2 : 3
  const timeSelected = !!(timeSlot || dateInput)

  const goNext = (from: Step) => {
    if (from === 1) setStep(isCertificate ? 3 : 2)
    if (from === 2) setStep(3)
  }
  const goBack = (from: Step) => {
    if (from === 3) setStep(isCertificate ? 1 : 2)
    if (from === 2) setStep(1)
  }

  const progressStep = (s: Step): number => {
    if (s === 'success') return totalSteps
    if (s === 3) return isCertificate ? 2 : 3
    if (s === 2) return 2
    return 1
  }

  useEffect(() => {
    if (isOpen) {
      setStep(1)
      setError('')
      setTimeSlot('')
      setDateInput('')
      if (defaultService) setService(defaultService)
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen, defaultService])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])

  const handleSubmit = async () => {
    if (!name.trim() || !phone.trim()) {
      setError('Пожалуйста, заполните имя и телефон')
      return
    }
    setLoading(true)
    setError('')
    const timeValue = isCertificate ? 'Подарочный сертификат' : buildTimeString(timeSlot, dateInput)
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, service, time: timeValue, ...getUtm() }),
      })
      if (!res.ok) throw new Error('Ошибка отправки')
      setStep('success')
      if (typeof window !== 'undefined' && (window as any).ym) {
        ;(window as any).ym(undefined, 'reachGoal', 'form_submit')
      }
    } catch {
      setError('Не удалось отправить заявку. Попробуйте ещё раз.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  const currentProgress = progressStep(step)

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="absolute inset-0 bg-dark/40 backdrop-blur-sm" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={isCertificate ? 'Оформление сертификата' : 'Запись на процедуру'}
        className="relative w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden"
      >

        {/* Header */}
        <div className="bg-dark px-6 pt-6 pb-8 text-white">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 transition text-sm"
            aria-label="Закрыть"
          >
            ✕
          </button>
          <p className="text-cream/70 text-xs font-semibold uppercase tracking-widest mb-1">LUCOVICA</p>
          <h2 className="text-xl font-bold">
            {isCertificate ? 'Оформление сертификата' : 'Запись на процедуру'}
          </h2>
          {step !== 'success' && (
            <div className="flex gap-2 mt-4">
              {Array.from({ length: totalSteps }).map((_, i) => (
                <div
                  key={i}
                  className={`h-0.5 flex-1 rounded-full transition-all ${
                    currentProgress > i ? 'bg-cream' : 'bg-white/20'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div className="px-6 py-6">

          {/* ── Шаг 1: Выбор услуги ── */}
          {step === 1 && (
            <div>
              <p className="font-semibold text-dark mb-4">Выберите услугу</p>
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto pr-1">
                {SERVICE_NAMES_FOR_FORM.map((s) => (
                  <button
                    key={s}
                    onClick={() => setService(s)}
                    className={`text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${
                      service === s
                        ? 'border-dark bg-dark text-white'
                        : 'border-mist hover:border-dark text-dark'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button
                onClick={() => goNext(1)}
                disabled={!service}
                className="btn-primary w-full mt-4 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Далее →
              </button>
            </div>
          )}

          {/* ── Шаг 2: Время (только не сертификат) ── */}
          {step === 2 && (
            <div>
              <p className="font-semibold text-dark mb-1">Удобное время</p>
              <p className="text-dark/50 text-xs mb-4">Можно выбрать слот, дату или и то и другое</p>

              {/* Слоты */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {TIME_SLOTS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeSlot(timeSlot === t ? '' : t)}
                    className={`py-3 px-2 rounded-xl border-2 text-sm font-medium transition-all ${
                      timeSlot === t
                        ? 'border-dark bg-dark text-white'
                        : 'border-mist hover:border-dark text-dark'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

              {/* Дата */}
              <label className="block text-sm font-medium text-dark/70 mb-1">
                Желаемая дата{dateInput ? ` · ${formatDate(dateInput)}` : ''}
              </label>
              <input
                type="date"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
                className="w-full border-2 border-mist rounded-xl px-4 py-2.5 text-dark text-sm focus:border-dark focus:outline-none mb-4"
                min={new Date().toISOString().split('T')[0]}
              />

              {timeSelected && (
                <p className="text-xs text-dark font-medium mb-3">
                  Выбрано: {buildTimeString(timeSlot, dateInput)}
                </p>
              )}

              <div className="flex gap-2">
                <button onClick={() => goBack(2)} className="btn-outline flex-1">← Назад</button>
                <button
                  onClick={() => goNext(2)}
                  disabled={!timeSelected}
                  className="btn-primary flex-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Далее →
                </button>
              </div>
            </div>
          )}

          {/* ── Шаг 3: Контакты ── */}
          {step === 3 && (
            <div>
              <p className="font-semibold text-dark mb-4">Ваши контакты</p>

              {/* Краткое резюме заказа */}
              <div className="bg-mist/30 rounded-xl px-4 py-3 mb-4 text-xs text-dark/70 space-y-0.5">
                <p><span className="font-semibold">Услуга:</span> {service}</p>
                {!isCertificate && (
                  <p><span className="font-semibold">Время:</span> {buildTimeString(timeSlot, dateInput)}</p>
                )}
              </div>

              <input
                type="text"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full border-2 border-mist rounded-xl px-4 py-3 text-dark text-sm focus:border-dark focus:outline-none mb-3"
              />
              <input
                type="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-2 border-mist rounded-xl px-4 py-3 text-dark text-sm focus:border-dark focus:outline-none mb-2"
              />
              {error && <p className="text-dark text-xs mb-2">{error}</p>}
              <p className="text-xs text-dark/50 mb-4">
                Нажимая кнопку, вы соглашаетесь с{' '}
                <a href="/privacy" target="_blank" className="underline hover:text-dark/70">
                  политикой конфиденциальности
                </a>
              </p>
              <div className="flex gap-2">
                <button onClick={() => goBack(3)} className="btn-outline flex-1">← Назад</button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="btn-primary flex-1 disabled:opacity-60"
                >
                  {loading ? 'Отправка...' : isCertificate ? 'Оформить' : 'Записаться'}
                </button>
              </div>
            </div>
          )}

          {/* ── Успех ── */}
          {step === 'success' && (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-dark mx-auto mb-4 flex items-center justify-center">
                <span className="text-cream text-lg font-bold">✓</span>
              </div>
              <h3 className="text-xl font-bold text-dark mb-2">
                {isCertificate ? 'Заявка на сертификат принята!' : 'Заявка принята!'}
              </h3>
              <p className="text-dark/70 text-sm mb-6">
                Мы свяжемся с вами в ближайшее время{isCertificate ? ' для оформления сертификата' : ' для подтверждения записи'}.
              </p>
              <p className="text-sm text-dark/60 mb-2">Также вы можете написать нам напрямую:</p>
              <div className="flex flex-col gap-2">
                <a
                  href={`tel:${PHONE_HREF}`}
                  onClick={() => { if ((window as any).ym) (window as any).ym(undefined, 'reachGoal', 'click_phone') }}
                  className="btn-outline text-sm py-2.5"
                >
                  {PHONE}
                </a>
                <a
                  href={`https://t.me/${TG_USERNAME}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => { if ((window as any).ym) (window as any).ym(undefined, 'reachGoal', 'click_telegram') }}
                  className="btn-primary text-sm py-2.5"
                >
                  Написать в Telegram
                </a>
              </div>
              <button onClick={onClose} className="mt-4 text-sm text-dark/50 hover:text-dark underline">
                Закрыть
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
