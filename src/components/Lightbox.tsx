import { useEffect } from 'react'
import { ExternalLink, X } from 'lucide-react'
import { GalleryImage } from './GalleryImage'
import type { GalleryItem } from '../types'

interface LightboxProps {
  item: GalleryItem
  onClose: () => void
}

export function Lightbox({ item, onClose }: LightboxProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/70 p-5 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-2xl bg-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <GalleryImage item={item} className="rounded-t-2xl" />
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 backdrop-blur transition-transform hover:scale-105"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-3 p-5">
          <div className="flex flex-wrap gap-1.5">
            {[...item.moods, ...item.locations].map((tag) => (
              <span key={tag} className="rounded-full bg-beige-100 px-2.5 py-1 text-xs text-muted">
                {tag}
              </span>
            ))}
            {item.season && (
              <span className="rounded-full bg-blush-100 px-2.5 py-1 text-xs text-muted">
                {item.season}
              </span>
            )}
            {item.timeOfDay && (
              <span className="rounded-full bg-blush-100 px-2.5 py-1 text-xs text-muted">
                {item.timeOfDay}
              </span>
            )}
          </div>
          {item.memo && <p className="text-sm">{item.memo}</p>}
          {item.sourceUrl && (
            <a
              href={item.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted underline underline-offset-2 hover:text-ink"
            >
              원본 출처 <ExternalLink size={13} />
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
