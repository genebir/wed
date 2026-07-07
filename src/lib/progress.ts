import type { ChecklistItem } from '../types'

export type DoneState = Record<string, boolean>

export function isItemDone(item: ChecklistItem, state: DoneState): boolean {
  return state[item.id] ?? item.done
}

export function progressOf(items: ChecklistItem[], state: DoneState): number {
  if (items.length === 0) return 0
  const done = items.filter((item) => isItemDone(item, state)).length
  return Math.round((done / items.length) * 100)
}
