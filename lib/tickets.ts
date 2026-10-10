export function summarizeTickets(items: { ticketType: { name: string } }[]): string {
    const counts = new Map<string, number>()
    items.forEach((i) => counts.set(i.ticketType.name, (counts.get(i.ticketType.name) ?? 0) + 1))
    return [...counts].map(([name, n]) => `${n} x ${name}`).join(', ')
}