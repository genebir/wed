import { differenceInCalendarDays, parseISO } from 'date-fns'

export function useDday(targetDate: string): number {
  return differenceInCalendarDays(parseISO(targetDate), new Date())
}
