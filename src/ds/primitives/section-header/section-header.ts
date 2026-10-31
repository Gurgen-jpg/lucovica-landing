import { html, raw, type HtmlValue, type SafeHtml } from '../../../lib/html.ts'
import { attrs } from '../../attrs.ts'

export interface SectionHeaderProps {
  overline?: string
  title: string
  /** Слово или словосочетание из title, набираемое курсивом (не более одного) */
  accent?: string
  description?: HtmlValue
  /** Уровень заголовка; по умолчанию h2 */
  level?: 1 | 2 | 3
  /** Класс размера заголовка; по умолчанию ds-h2 (для h1 — ds-h1) */
  size?: 'ds-display-xl' | 'ds-display-l' | 'ds-h1' | 'ds-h2' | 'ds-h3'
  id?: string
  align?: 'start' | 'center'
}

/** Заголовок с курсивным акцентом: «Часто <em>спрашивают</em>». */
export function titleWithAccent(title: string, accent?: string): SafeHtml {
  if (!accent) return html`${title}`
  const at = title.indexOf(accent)
  if (at < 0) throw new Error(`Акцент «${accent}» не найден в заголовке «${title}»`)
  return html`${title.slice(0, at)}<em>${accent}</em>${title.slice(at + accent.length)}`
}

export function sectionHeader(props: SectionHeaderProps): SafeHtml {
  const level = props.level ?? 2
  const size = props.size ?? (level === 1 ? 'ds-h1' : level === 3 ? 'ds-h3' : 'ds-h2')
  // level — только 1/2/3 из типа, поэтому имя тега безопасно
  const tag = raw(`h${level}`)
  const title = titleWithAccent(props.title, props.accent)
  return html`<header class="ds-section-header"${attrs({ 'data-align': props.align === 'center' ? 'center' : null })}>
${props.overline ? html`<p class="ds-overline">${props.overline}</p>` : null}
<${tag} class="${size}"${attrs({ id: props.id })}>${title}</${tag}>
${props.description ? html`<p class="ds-lead ds-section-header__description">${props.description}</p>` : null}
</header>`
}
