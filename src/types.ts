export interface WeddingInfo {
  serviceName: string
  weddingDate: string
  totalBudget: number
  snapMode: 'self'
}

export interface TimelineItem {
  id: string
  month: string // 'yyyy-MM'
  monthEnd?: string // 기간 항목일 때 (예: 2026-09~10 촬영)
  title: string
  done?: boolean
  tips?: string[]
}

export type ChecklistCategory = '촬영' | '예복·드레스' | '청첩장' | '예산' | '본식' | '행정'

export interface ChecklistItem {
  id: string
  month: string // 'yyyy-MM'
  title: string
  detail?: string
  category: ChecklistCategory
  done: boolean
}

export interface GalleryItem {
  id: string
  image: string
  moods: string[]
  locations: string[]
  season?: string
  timeOfDay?: string
  sourceUrl?: string
  memo?: string
  /** A7C II 기준 촬영 세팅 팁 */
  shootingTip?: string
  /** 원본 픽셀 크기 — 그리드 공간 예약(lazy loading 최적화)용 */
  w?: number
  h?: number
}

export interface BudgetItem {
  category: string
  planned: number
  spent: number
  memo?: string
}

export type VendorStatus = '알아보는중' | '상담예약' | '계약완료'

export interface Vendor {
  name: string
  category: string
  status: VendorStatus
  visitDate?: string
  memo?: string
  link?: string
}

export interface SnapLocation {
  id: string
  name: string
  address?: string
  permitRequired?: boolean
  goldenHourNote?: string
  memo?: string
}

export interface SnapGearItem {
  id: string
  name: string
}

export interface SnapShot {
  id: string
  title: string
  galleryRef?: string
  location?: string
  note?: string
}

export interface SnapPlan {
  locations: SnapLocation[]
  gear: SnapGearItem[]
  shots: SnapShot[]
  sunsetLink?: string
  rainPlan?: string
}
