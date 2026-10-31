// Точка входа браузерного кода.
import { initPrimitives } from '../ds/init.client.ts'
import { initAnalytics } from './analytics.ts'
import { initBooking } from './booking.ts'
import { initFloating } from './floating.ts'
import { initShowcase } from './showcase.ts'
import { captureUtm } from './utm.ts'
import { initWelcome } from './welcome.ts'

captureUtm()
initPrimitives()
initAnalytics()
initBooking()
initFloating()
initShowcase()
initWelcome()
