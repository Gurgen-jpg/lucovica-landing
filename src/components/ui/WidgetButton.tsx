import Image from 'next/image'

interface WidgetButtonProps {
  href: string
  icon: string
  label: string
}

export function WidgetButton({ href, icon, label }: WidgetButtonProps) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-transform duration-200 hover:scale-110 active:scale-95 overflow-hidden"
    >
      <Image src={icon} alt={label} width={48} height={48} />
    </a>
  )
}
