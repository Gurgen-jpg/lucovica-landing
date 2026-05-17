type Props = {
  sub: string
  title: string
  description?: string
  spacing?: 'sm' | 'md'
}

export function SectionHeader({ sub, title, description, spacing = 'md' }: Props) {
  return (
    <div className={`text-center ${spacing === 'sm' ? 'mb-10' : 'mb-12'}`}>
      <p className="section-sub">{sub}</p>
      <h2 className="section-title">{title}</h2>
      {description && (
        <p className="text-dark/60 max-w-xl mx-auto text-sm md:text-base">{description}</p>
      )}
    </div>
  )
}
