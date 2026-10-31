import { html, type HtmlValue, type SafeHtml } from '../../../lib/html.ts'
import { attrs, cx, type Attrs } from '../../attrs.ts'

export type ButtonVariant = 'solid' | 'outline' | 'link' | 'inverse' | 'champagne'

interface ButtonBase {
  label: HtmlValue
  variant?: ButtonVariant
  /** 3 — 52px, 2 — 40px */
  size?: 2 | 3
  className?: string
  attrs?: Attrs
}

export interface LinkButtonProps extends ButtonBase {
  /** Ведёт на другой URL — рендерится ссылкой */
  href: string
  external?: boolean
}

export interface ActionButtonProps extends ButtonBase {
  href?: undefined
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}

export type ButtonProps = LinkButtonProps | ActionButtonProps

export function button(props: ButtonProps): SafeHtml {
  const variant = props.variant ?? 'solid'
  const size = props.size ?? 3
  const cls = cx('ds-button', props.className)

  if (props.href !== undefined) {
    const ext = props.external ? { target: '_blank', rel: 'noopener noreferrer' } : {}
    return html`<a class="${cls}" data-variant="${variant}" data-size="${size}" href="${props.href}"${attrs({ ...ext, ...props.attrs })}>${props.label}</a>`
  }
  return html`<button class="${cls}" type="${props.type ?? 'button'}" data-variant="${variant}" data-size="${size}"${attrs({ disabled: props.disabled, ...props.attrs })}>${props.label}</button>`
}
