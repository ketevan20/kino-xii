export const TZ = 'Asia/Tbilisi'

export const dateKey = (d: Date) =>
  d.toLocaleDateString('en-CA', { timeZone: TZ }) 

export const getToday = () => dateKey(new Date())

export const getDateOffset = (days: number) =>
  dateKey(new Date(Date.now() + days * 86_400_000))