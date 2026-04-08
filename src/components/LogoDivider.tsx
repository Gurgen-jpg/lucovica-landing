import Image from 'next/image'

export default function LogoDivider() {
  return (
    <div className="py-10 px-5 bg-white flex items-center justify-center gap-8">
      <div className="h-px flex-1 max-w-40 bg-dark/10" />
      <Image
        src="/logo.png"
        alt="LUCOVICA"
        width={120}
        height={42}
        className="h-8 w-auto object-contain opacity-40"
      />
      <div className="h-px flex-1 max-w-40 bg-dark/10" />
    </div>
  )
}
