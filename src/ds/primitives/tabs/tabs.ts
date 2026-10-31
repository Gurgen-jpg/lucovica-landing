import { html, type HtmlValue, type SafeHtml } from '../../../lib/html.ts'

export interface TabItem {
  /** Короткий ключ: 'laser', 'sugaring' */
  key: string
  label: string
  panel: HtmlValue
  /** Хэш адреса для вкладки: «#men» открывает её при загрузке и ставится при выборе; пустая строка — без хэша */
  hash?: string
}

export interface TabsProps {
  /** Префикс id: уникален на странице */
  id: string
  /** Доступное имя списка вкладок: «Категории цен» */
  label: string
  tabs: readonly TabItem[]
  /** Цель Метрики при переключении вкладки (data-goal на кнопке) */
  goal?: string
}

/**
 * Вкладки WAI-ARIA. Без JS список вкладок скрыт, а все панели видимы друг под другом
 * со своими заголовками; init показывает список и оставляет одну панель.
 */
export function tabs(props: TabsProps): SafeHtml {
  return html`<div class="ds-tabs" data-ds="tabs">
<div class="ds-tabs__list" role="tablist" aria-label="${props.label}" hidden>
${props.tabs.map(
  (t, i) =>
    html`<button class="ds-tabs__tab" type="button" role="tab" id="${props.id}-tab-${t.key}" aria-controls="${props.id}-panel-${t.key}" aria-selected="${i === 0 ? 'true' : 'false'}" tabindex="${i === 0 ? 0 : -1}"${props.goal ? html` data-goal="${props.goal}"` : null}${t.hash !== undefined ? html` data-hash="${t.hash}"` : null}>${t.label}</button>`,
)}
</div>
${props.tabs.map(
  (t) =>
    html`<section class="ds-tabs__panel" role="tabpanel" id="${props.id}-panel-${t.key}" aria-labelledby="${props.id}-tab-${t.key}" tabindex="0">
<h3 class="ds-tabs__panel-title ds-overline">${t.label}</h3>
${t.panel}
</section>`,
)}
</div>`
}
