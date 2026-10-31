// Кнопка записи (design.md D3 изменения home-page): data-booking + data-service.
// Обработчик booking-pipeline открывает диалог с предвыбором; до его появления это ссылка на форму в контактах.
import type { BookingService } from '../content/services.ts'
import { button, type ButtonVariant } from '../ds/primitives/button/button.ts'
import type { SafeHtml } from '../lib/html.ts'

export const BOOKING_FALLBACK_HREF = '/#contacts'

export interface BookingButtonProps {
  label?: string
  service?: BookingService
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
    attrs: { 'data-booking': true, 'data-service': props.service, 'data-goal': props.goal },
  })
}
