// Кнопка записи (design.md D3 изменения home-page): data-booking + data-service.
// Обработчик booking-pipeline открывает диалог с предвыбором; до его появления это ссылка на форму в контактах.
import type { BookingService } from '../content/services.ts'
import { button, type ButtonVariant } from '../ds/primitives/button/button.ts'
import type { HtmlValue, SafeHtml } from '../lib/html.ts'

export const BOOKING_FALLBACK_HREF = '/#contacts'

export interface BookingButtonProps {
  label?: HtmlValue
  service?: BookingService
  /** Уточнение к услуге: зона, позиция прайса, номинал */
  detail?: string
  /** Отметить акцию первого визита */
  promo?: boolean
  /** Доступное имя, если видимой подписи мало: «Записаться: Шугаринг» */
  ariaLabel?: string
  goal?: string
  variant?: ButtonVariant
  size?: 2 | 3
  className?: string
}

export function bookingButton(props: BookingButtonProps = {}): SafeHtml {
  return button({
    label: props.label ?? 'Записаться',
    href: BOOKING_FALLBACK_HREF,
    variant: props.variant,
    size: props.size,
    className: props.className,
    attrs: {
      'data-booking': true,
      'data-service': props.service,
      'data-detail': props.detail,
      'data-promo': props.promo,
      'data-goal': props.goal,
      'aria-label': props.ariaLabel,
    },
  })
}
