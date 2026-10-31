import { html, type HtmlValue, type SafeHtml } from '../../../lib/html.ts'
import { titleWithAccent } from '../section-header/section-header.ts'

export interface DialogProps {
  id: string
  title: string
  /** Курсивное слово заголовка */
  accent?: string
  overline?: string
  body: HtmlValue
  closeLabel?: string
}

export const CLOSE_ICON = html`<svg width="14" height="14" viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1"/></svg>`

/**
 * Модальный диалог на нативном <dialog>. Открывается кнопкой с data-dialog-open="<id>",
 * закрывается элементами с data-dialog-close, Escape и кликом по подложке.
 */
export function dialog(props: DialogProps): SafeHtml {
  const titleId = `${props.id}-title`
  return html`<dialog class="ds-dialog" id="${props.id}" aria-labelledby="${titleId}" data-ds="dialog">
<div class="ds-dialog__panel">
<div class="ds-dialog__header">
<div class="ds-dialog__heading">
${props.overline ? html`<p class="ds-overline">${props.overline}</p>` : null}
<h2 class="ds-dialog__title" id="${titleId}">${titleWithAccent(props.title, props.accent)}</h2>
</div>
<button class="ds-dialog__close" type="button" aria-label="${props.closeLabel ?? 'Закрыть'}" data-dialog-close>${CLOSE_ICON}</button>
</div>
<div class="ds-dialog__body">${props.body}</div>
</div>
</dialog>`
}
