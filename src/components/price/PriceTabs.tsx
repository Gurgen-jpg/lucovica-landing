'use client'

import { useEffect, useRef, useState, type KeyboardEvent } from 'react'
import LeadForm from '@/components/LeadForm'
import { track } from '@/lib/analytics'
import PriceGroupCard from './PriceGroupCard'
import type { Audience, PriceGroup, PriceRow } from './price-list.config'

type Props = {
  groups: PriceGroup[]
  electro: PriceRow[]
  electroService: string
}

const TABS: { id: Audience; label: string; hash: string }[] = [
  { id: 'women', label: 'Девушкам', hash: '' },
  { id: 'men', label: 'Мужчинам', hash: '#men' },
]

export default function PriceTabs({ groups, electro, electroService }: Props) {
  const [active, setActive] = useState<Audience>('women')
  const [open, setOpen] = useState(false)
  const [service, setService] = useState<string | undefined>()
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Ссылка /price#men сразу открывает мужской прайс
  useEffect(() => {
    if (window.location.hash === '#men') setActive('men')
  }, [])

  const select = (id: Audience) => {
    setActive(id)
    const { hash } = TABS.find((t) => t.id === id)!
    history.replaceState(null, '', window.location.pathname + window.location.search + hash)
  }

  const onTabKey = (e: KeyboardEvent, index: number) => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return
    e.preventDefault()
    const next = (index + (e.key === 'ArrowRight' ? 1 : -1) + TABS.length) % TABS.length
    select(TABS[next].id)
    tabRefs.current[next]?.focus()
  }

  const book = (formService?: string) => {
    track('price_cta_click')
    setService(formService)
    setOpen(true)
  }

  return (
    <>
      <div role="tablist" aria-label="Для кого" className="grid grid-cols-2 gap-1 rounded-full bg-mist/40 p-1">
        {TABS.map((tab, i) => {
          const selected = active === tab.id
          return (
            <button
              key={tab.id}
              ref={(el) => { tabRefs.current[i] = el }}
              type="button"
              role="tab"
              id={`tab-${tab.id}`}
              aria-controls={`panel-${tab.id}`}
              aria-selected={selected}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(tab.id)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={`rounded-full py-2.5 text-sm transition ${
                selected ? 'bg-dark text-white shadow-sm' : 'text-dark/60'
              }`}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {TABS.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={active !== tab.id}
          className="mt-4 space-y-4"
        >
          {groups
            .filter((g) => g.audience === tab.id)
            .map((g) => (
              <PriceGroupCard key={g.id} title={g.title} rows={g.rows} onBook={() => book(g.formService)} />
            ))}
        </div>
      ))}

      <div className="mt-4">
        <PriceGroupCard
          title="Электроэпиляция"
          note="Для девушек и мужчин · цена за время работы"
          rows={electro}
          onBook={() => book(electroService)}
        />
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-mist bg-white/95 px-5 py-3 backdrop-blur">
        <button type="button" onClick={() => book()} className="btn-primary w-full max-w-md mx-auto flex">
          Записаться
        </button>
      </div>

      <LeadForm isOpen={open} onClose={() => setOpen(false)} defaultService={service} />
    </>
  )
}
