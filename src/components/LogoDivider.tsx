import Image from 'next/image'

type Props = {
  width?: number
  height?: number
  sourse: string
}

export default function LogoDivider({
  width = 40,
  height = 40,
  sourse,
}: Props) {
  return (
    // <div className="py-10 px-5 bg-white flex items-center justify-center gap-8">
    // <div className="h-px flex-1 max-w-40 bg-dark/10" />
    <Image
      src={sourse}
      alt="LUCOVICA"
      width={width}
      height={height}
      priority
      className="w-auto object-contain"
    />
    // <div className="h-px flex-1 max-w-40 bg-dark/10" />
    // </div>
  )
}
