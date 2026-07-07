#!/usr/bin/env node
/**
 * 레퍼런스 일괄 등록 스크립트
 *
 * 사용법:
 *   1. 마음에 드는 이미지를 refs-inbox/ 폴더에 저장 (jpg/png/webp)
 *   2. npm run refs
 *   3. src/data/gallery.json에 자동 추가된 항목의 moods/locations/sourceUrl/memo를 채우고 커밋
 *
 * 하는 일: 1200px 리사이즈 → webp 변환 → public/gallery/ 저장 → gallery.json에 항목 추가
 * 변환 완료된 원본은 refs-inbox/done/ 으로 이동.
 */
import sharp from 'sharp'
import { existsSync, mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { basename, extname, join } from 'node:path'

const INBOX = 'refs-inbox'
const OUT_DIR = 'public/gallery'
const DATA = 'src/data/gallery.json'
const EXTS = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif'])

if (!existsSync(INBOX)) {
  mkdirSync(INBOX)
  console.log(`${INBOX}/ 폴더를 만들었어요. 이미지를 넣고 다시 실행하세요: npm run refs`)
  process.exit(0)
}

const files = readdirSync(INBOX).filter((f) => EXTS.has(extname(f).toLowerCase()))
if (files.length === 0) {
  console.log(`${INBOX}/ 에 이미지가 없어요. (지원: jpg/png/webp/avif)`)
  process.exit(0)
}

const gallery = JSON.parse(readFileSync(DATA, 'utf8'))
let nextNum = gallery.reduce((max, g) => Math.max(max, Number(g.id.slice(1)) || 0), 0) + 1
mkdirSync(join(INBOX, 'done'), { recursive: true })

for (const file of files) {
  const slug = basename(file, extname(file))
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, '-')
    .replace(/^-|-$/g, '') || 'ref'
  const id = `g${String(nextNum).padStart(3, '0')}`
  const outName = `${slug}-${id}.webp`

  await sharp(join(INBOX, file))
    .rotate() // EXIF 회전 반영
    .resize({ width: 1200, withoutEnlargement: true })
    .webp({ quality: 80 })
    .toFile(join(OUT_DIR, outName))

  gallery.push({
    id,
    image: `/gallery/${outName}`,
    moods: [],
    locations: [],
    season: '',
    timeOfDay: '',
    sourceUrl: '',
    memo: slug,
  })
  renameSync(join(INBOX, file), join(INBOX, 'done', file))
  console.log(`✓ ${file} → ${outName} (${id})`)
  nextNum++
}

writeFileSync(DATA, JSON.stringify(gallery, null, 2) + '\n')
console.log(`\n${files.length}장 추가 완료. ${DATA}에서 moods/locations/memo를 채워주세요.`)
console.log(`무드: 따뜻한/청량한/필름감성/시네마틱/미니멀/러블리`)
console.log(`장소: 한강/공원·수목원/카페/바다/골목·도심/스튜디오·실내/야외`)
