export const TZ = 'Asia/Tbilisi'

export const dateKey = (d: Date) =>
  d.toLocaleDateString('en-CA', { timeZone: TZ })

export const getToday = () => dateKey(new Date())

export const getDateOffset = (days: number) =>
  dateKey(new Date(Date.now() + days * 86_400_000))

// "YYYY-MM-DD" 
export const formatDay = (date: string, options: Intl.DateTimeFormatOptions) =>
  new Date(`${date}T00:00:00Z`).toLocaleDateString('en-GB', { ...options, timeZone: 'UTC' })

export type WallClock = { date: string; time: string } // "2026-10-09", "22:00"

// "Fri 09 Oct · 22:00"
export const formatSessionDate = (s: WallClock) =>
  `${formatDay(s.date, { weekday: 'short', day: '2-digit', month: 'short' })} · ${s.time}`

// the date strip 
export type DayOption = { key: string; weekday: string; day: string }

export const getNextDays = (count = 7): DayOption[] =>
  Array.from({ length: count }, (_, i) => {
    const key = getDateOffset(i)
    return {
      key,
      weekday: formatDay(key, { weekday: 'short' }),
      day: formatDay(key, { day: 'numeric' }),
    }
  })

// a wall-clock value as ms: only meaningful when compared with another wall-clock value
const wallMs = ({ date, time }: WallClock) => Date.parse(`${date}T${time}:00Z`)

// the current moment on Tbilisi's clock
export const cinemaNow = (): WallClock => {
  const now = new Date()
  return {
    date: dateKey(now),
    // hourCycle h23: midnight is "00:05", not "24:05"
    time: now.toLocaleTimeString('en-GB', {
      timeZone: TZ,
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    }),
  }
}

export const hasStarted = (s: WallClock) => wallMs(s) <= wallMs(cinemaNow())

// ms from now until the session starts (negative once it has started)
export const msUntilStart = (s: WallClock) => wallMs(s) - wallMs(cinemaNow())

// the same wall-clock value moved by some ms; crossing midnight is handled
export const shiftWallClock = (s: WallClock, ms: number): WallClock => {
  const iso = new Date(wallMs(s) + ms).toISOString()
  return { date: iso.slice(0, 10), time: iso.slice(11, 16) }
}