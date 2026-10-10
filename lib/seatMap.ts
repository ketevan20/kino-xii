import type { SeatMap } from '@/types/api'

export function markSold(map: SeatMap, codes: string[]): SeatMap {
  return {
    ...map,
    sections: map.sections.map((section) => ({
      ...section,
      rows: section.rows.map((row) => ({
        ...row,
        seats: row.seats.map((seat) =>
          codes.includes(seat.code) ? { ...seat, state: 'sold' as const } : seat
        ),
      })),
    })),
  }
}