import { format, parseISO } from 'date-fns'
import { ko } from 'date-fns/locale'

/** 현재 월 키 ('yyyy-MM') */
export function currentMonthKey(): string {
  return format(new Date(), 'yyyy-MM')
}

/** '2026-07' → '2026년 7월' */
export function formatMonthKo(monthKey: string): string {
  return format(parseISO(`${monthKey}-01`), 'yyyy년 M월')
}

/** '2027-03-20' → '2027년 3월 20일 토요일' */
export function formatDateKo(date: string): string {
  return format(parseISO(date), 'yyyy년 M월 d일 EEEE', { locale: ko })
}

/** monthKey가 현재 월보다 과거인지 */
export function isPastMonth(monthKey: string): boolean {
  return monthKey < currentMonthKey()
}

export function isCurrentMonth(monthKey: string): boolean {
  return monthKey === currentMonthKey()
}
