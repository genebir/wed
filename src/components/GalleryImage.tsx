import { useState } from 'react'
import { galleryImageUrl } from '../lib/assets'
import type { GalleryItem } from '../types'

interface GalleryImageProps {
  item: GalleryItem
  className?: string
  /** thumb: 그리드용 400px, full: 라이트박스용 1200px */
  variant?: 'thumb' | 'full'
}

/** 이미지가 없거나 로드 실패하면 그라데이션 폴백을 보여준다 */
export function GalleryImage({ item, className = '', variant = 'thumb' }: GalleryImageProps) {
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
      src={galleryImageUrl(item.image, variant)}
      alt={item.memo ?? item.moods.join(', ')}
      width={item.w}
      height={item.h}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={`h-auto w-full bg-beige-100 ${className}`}
    />
  )
}
