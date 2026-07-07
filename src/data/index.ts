import type {
  BudgetItem,
  ChecklistItem,
  GalleryItem,
  SnapPlan,
  TimelineItem,
  Vendor,
  WeddingInfo,
} from '../types'

import weddingJson from './wedding.json'
import timelineJson from './timeline.json'
import checklistJson from './checklist.json'
import galleryJson from './gallery.json'
import budgetJson from './budget.json'
import vendorsJson from './vendors.json'
import snapPlanJson from './snapPlan.json'

export const wedding = weddingJson as WeddingInfo
export const timeline = timelineJson as TimelineItem[]
export const checklist = checklistJson as ChecklistItem[]
export const gallery = galleryJson as GalleryItem[]
export const budget = budgetJson as BudgetItem[]
export const vendors = vendorsJson as Vendor[]
export const snapPlan = snapPlanJson as SnapPlan
