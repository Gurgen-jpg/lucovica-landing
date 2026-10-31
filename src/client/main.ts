// Точка входа браузерного кода.
import { initPrimitives } from '../ds/init.client.ts'
import { initAnalytics } from './analytics.ts'
import { initFloating } from './floating.ts'
import { initShowcase } from './showcase.ts'

initPrimitives()
initAnalytics()
initFloating()
initShowcase()
