import { html, type HtmlValue, type SafeHtml } from '../../../lib/html.ts'

export interface TooltipProps {
  id: string
  /** Текст подсказки */
  text: string
  /** Доступное имя триггера: «Об оборудовании» */
  triggerLabel: string
  /** Видимое содержимое триггера; по умолчанию курсивная «i» */
  trigger?: HtmlValue
}

/**
 * Подсказка: показывается при наведении и фокусе (CSS), скрывается по Escape (JS),
 * связана с триггером через aria-describedby.
 */
export function tooltip(props: TooltipProps): SafeHtml {
  const tipId = `${props.id}-tip`
  return html`<span class="ds-tooltip" data-ds="tooltip">
<button class="ds-tooltip__trigger" type="button" aria-label="${props.triggerLabel}" aria-describedby="${tipId}">${props.trigger ?? 'i'}</button>
<span class="ds-tooltip__content" role="tooltip" id="${tipId}">${props.text}</span>
</span>`
}
