import { useState } from 'react'
import { assetUrl } from '../lib/assets'
import type { GalleryItem } from '../types'

interface GalleryImageProps {
  item: GalleryItem
  className?: string
}

/** 이미지가 아직 없으면(placeholder) 그라데이션 폴백을 보여준다 */
export function GalleryImage({ item, className = '' }: GalleryImageProps) {
  const [failed, setFailed] = useState(false)

  if (failed) {
    return (
      <div
        className={`flex aspect-[3/4] flex-col items-center justify-center gap-2 bg-gradient-to-br from-blush-100 to-beige-100 ${className}`}
      >
        <span className="text-3xl">📸</span>
        <span className="px-3 text-center text-xs text-muted">{item.moods.join(' · ')}</span>
      </div>
    )
  }

  return (
    <img
      src={assetUrl(item.image)}
      alt={item.memo ?? item.moods.join(', ')}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`w-full ${className}`}
    />
  )
}
