import type { LucideIcon } from 'lucide-react'
import { FadeUp } from '../components/FadeUp'

interface ComingSoonProps {
  icon: LucideIcon
  title: string
  description: string
}

/** 아직 만들지 않은 페이지의 임시 화면 */
export function ComingSoon({ icon: Icon, title, description }: ComingSoonProps) {
  return (
    <FadeUp>
      <div className="flex flex-col items-center py-40 text-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blush-100">
          <Icon size={28} className="text-blush-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 max-w-sm text-muted">{description}</p>
        <p className="mt-8 rounded-full bg-beige-100 px-4 py-1.5 text-xs text-muted">
          곧 만들어질 페이지예요 ✨
        </p>
      </div>
    </FadeUp>
  )
}
