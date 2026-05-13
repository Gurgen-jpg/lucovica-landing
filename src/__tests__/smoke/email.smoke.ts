/**
 * Smoke-тест: реальная отправка email через Timeweb SMTP.
 * Запуск: npx tsx src/__tests__/smoke/email.smoke.ts
 */
import { sendLeadEmail, sendWelcomeEmail } from '../../lib/sendEmail'

async function run() {
  console.log('📧 Отправляю тестовую заявку...')
  await sendLeadEmail({
    name: 'Тест Заявки',
    phone: '+79991234567',
    service: 'Шугаринг',
    time: 'Утром',
    utm_source: 'test',
    utm_medium: 'smoke',
  })
  console.log('✅ Lead email отправлен')

  console.log('📧 Отправляю тестовую Welcome-анкету...')
  await sendWelcomeEmail({
    visit_type: 'new',
    name: 'Тест Велком',
    phone: '+79991234567',
    address_form: 'ty',
    drink: 'cappuccino',
    milk: 'regular',
    sugar: false,
    cream: false,
    extra_drink_wish: '',
    car: true,
    car_number: 'А123БВ',
    talk_mode: 'chat',
    with_kid: false,
    kid_age: '',
    kid_needs: [],
    contraindications: ['Беременность'],
    health_changed: null,
    health_notes: '',
    tan: false,
    skin_notes: 'Чувствительная кожа',
    source: 'Instagram',
    extra_notes: 'Тестовое сообщение',
    privacy_consent: true,
  })
  console.log('✅ Welcome email отправлен')
  console.log('\n🎉 Оба письма успешно отправлены на', process.env.NOTIFY_EMAIL)
}

run().catch(err => {
  console.error('❌ Ошибка:', err.message)
  process.exit(1)
})
