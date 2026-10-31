// Поведение всех примитивов ДС: каждый навешивается на элементы с data-ds="<name>".
import { init as accordion } from './primitives/accordion/accordion.client.ts'
import { init as carousel } from './primitives/carousel/carousel.client.ts'
import { init as chips } from './primitives/choice/chips.client.ts'
import { init as dialog } from './primitives/dialog/dialog.client.ts'
import { init as form } from './primitives/field/field.client.ts'
import { init as tabs } from './primitives/tabs/tabs.client.ts'
import { init as toast } from './primitives/toast/toast.client.ts'
import { init as tooltip } from './primitives/tooltip/tooltip.client.ts'

export function initPrimitives(root: ParentNode = document): void {
  accordion(root)
  tabs(root)
  carousel(root)
  chips(root)
  form(root)
  dialog(root)
  tooltip(root)
  toast()
}
