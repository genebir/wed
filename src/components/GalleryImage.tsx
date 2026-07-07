import { useState } from 'react'
import { assetUrl, galleryImageUrl } from '../lib/assets'
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

  // 전부 자체 호스팅: 그리드 400px, 라이트박스 1000px (Unsplash는 폴백)
  const hosted = variant === 'thumb' ? item.thumb : item.full
  const src = hosted ? assetUrl(hosted) : galleryImageUrl(item.image, variant)
  // 라이트박스: 이미 캐시된 썸네일을 배경으로 먼저 보여줘 체감 즉시 오픈
  const blurUp =
    variant === 'full' && item.thumb
      ? { backgroundImage: `url(${assetUrl(item.thumb)})`, backgroundSize: 'cover' }
      : undefined

  return (
    <img
      src={src}
      alt={item.memo ?? item.moods.join(', ')}
      width={item.w}
      height={item.h}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      style={blurUp}
      className={`h-auto w-full bg-beige-100 ${className}`}
    />
  )
}
