import { useEffect, useMemo, useRef, useState } from 'react'
import { format } from 'date-fns'
import { ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useSharedState } from '../hooks/useSharedState'
import { useColumnCount } from '../hooks/useColumnCount'
import { Lightbox } from './Lightbox'
import { FadeUp } from './FadeUp'
import type { GalleryItem, OurShot } from '../types'

const BUCKET = 'shots'
const SIGNED_URL_TTL = 60 * 60 * 24 * 7 // 7일

/** 브라우저에서 리사이즈 (EXIF 회전 반영) 후 webp Blob 생성 */
async function resizeImage(
  file: File,
  maxWidth = 1600,
  quality = 0.82,
): Promise<{ blob: Blob; w: number; h: number }> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' })
  const scale = Math.min(1, maxWidth / bitmap.width)
  const w = Math.round(bitmap.width * scale)
  const h = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, w, h)
  const blob = await new Promise<Blob>((resolve, reject) =>
    canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('변환 실패'))), 'image/webp', quality),
  )
  return { blob, w, h }
}

export function OurShots() {
  const [shots, setShots] = useSharedState<OurShot[]>('our-shots', [])
  const [urls, setUrls] = useState<Record<string, string>>({})
  const [uploading, setUploading] = useState(0)
  const [error, setError] = useState('')
  const [selected, setSelected] = useState<OurShot | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const columnCount = useColumnCount()

  // 비공개 버킷 → 로그인 세션으로 서명 URL 발급
  useEffect(() => {
    const missing = shots.map((s) => s.path).filter((p) => !(p in urls))
    if (missing.length === 0) return
    supabase.storage
      .from(BUCKET)
      .createSignedUrls(missing, SIGNED_URL_TTL)
      .then(({ data }) => {
        if (!data) return
        setUrls((prev) => {
          const next = { ...prev }
          data.forEach((d) => {
            if (d.path && d.signedUrl) next[d.path] = d.signedUrl
          })
          return next
        })
      })
  }, [shots, urls])

  const columns = useMemo(() => {
    const cols = Array.from({ length: columnCount }, () => ({
      items: [] as OurShot[],
      height: 0,
    }))
    for (const shot of shots) {
      const shortest = cols.reduce((a, b) => (a.height <= b.height ? a : b))
      shortest.items.push(shot)
      shortest.height += shot.h / shot.w
    }
    return cols.map((c) => c.items)
  }, [shots, columnCount])

  const onFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setError('')
    setUploading(files.length)
    for (const file of Array.from(files)) {
      try {
        const { blob, w, h } = await resizeImage(file)
        const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.webp`
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(path, blob, { contentType: 'image/webp' })
        if (upErr) throw new Error(upErr.message)
        setShots((prev) => [
          { id: path, path, w, h, uploadedAt: format(new Date(), 'yyyy-MM-dd') },
          ...prev,
        ])
      } catch (e) {
        setError(`${file.name} 업로드 실패 — ${e instanceof Error ? e.message : '알 수 없는 오류'}`)
      } finally {
        setUploading((n) => n - 1)
      }
    }
    if (fileRef.current) fileRef.current.value = ''
  }

  const remove = async (shot: OurShot) => {
    if (!window.confirm('이 사진을 삭제할까요?')) return
    await supabase.storage.from(BUCKET).remove([shot.path])
    setShots((prev) => prev.filter((s) => s.id !== shot.id))
    setSelected(null)
  }

  const toGalleryItem = (shot: OurShot): GalleryItem => ({
    id: shot.id,
    image: urls[shot.path] ?? '',
    moods: [],
    locations: [],
    memo: shot.memo ?? `${shot.uploadedAt} 업로드`,
    w: shot.w,
    h: shot.h,
  })

  return (
    <div>
      {/* 업로드 */}
      <FadeUp>
        <div className="flex flex-wrap items-center gap-3">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => onFiles(e.target.files)}
            className="hidden"
            id="shot-upload"
          />
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={uploading > 0}
            className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {uploading > 0 ? (
              <>
                <Loader2 size={16} className="animate-spin" /> {uploading}장 올리는 중…
              </>
            ) : (
              <>
                <ImagePlus size={16} /> 사진 올리기
              </>
            )}
          </button>
          <p className="text-xs text-muted">
            자동으로 1600px로 줄여 올라가요 · 두 사람만 볼 수 있어요
          </p>
        </div>
        {error && <p className="mt-3 text-sm text-blush-400">{error}</p>}
      </FadeUp>

      {/* 그리드 */}
      {shots.length === 0 ? (
        <FadeUp delay={80}>
          <div className="py-24 text-center text-muted">
            <p className="text-4xl">📸</p>
            <p className="mt-4">아직 올린 컷이 없어요.</p>
            <p className="mt-1 text-sm">촬영 다녀와서 베스트 컷을 올려보세요!</p>
          </div>
        </FadeUp>
      ) : (
        <div className="mt-8 flex gap-4">
          {columns.map((col, colIdx) => (
            <div key={colIdx} className="flex min-w-0 flex-1 flex-col gap-4">
              {col.map((shot) => {
                const url = urls[shot.path]
                return (
                  <div
                    key={shot.id}
                    className="relative overflow-hidden rounded-2xl bg-white shadow-sm transition-transform hover:scale-[1.02]"
                  >
                    <button
                      type="button"
                      onClick={() => url && setSelected(shot)}
                      className="block w-full text-left"
                    >
                      {url ? (
                        <img
                          src={url}
                          alt={shot.memo ?? '우리 컷'}
                          width={shot.w}
                          height={shot.h}
                          loading="lazy"
                          decoding="async"
                          className="h-auto w-full bg-beige-100"
                        />
                      ) : (
                        <div
                          className="w-full animate-pulse bg-beige-100"
                          style={{ aspectRatio: `${shot.w} / ${shot.h}` }}
                        />
                      )}
                      <div className="flex items-center justify-between p-3">
                        <p className="truncate text-xs text-muted">
                          {shot.memo ?? shot.uploadedAt}
                        </p>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => void remove(shot)}
                      aria-label="삭제"
                      className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/70 text-muted backdrop-blur transition-colors hover:text-ink"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      )}

      {selected && urls[selected.path] && (
        <Lightbox item={toGalleryItem(selected)} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
