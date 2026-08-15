import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { service: true }
  });

  // Group by phone number
  const clientsMap = new Map<string, {
    phone: string;
    ownerName: string;
    pets: Set<string>;
    visitCount: number;
    lastVisit: string;
  }>();

  for (const b of bookings) {
    const key = b.phone;
    const existing = clientsMap.get(key);
    const dateStr = b.preferredDate.toISOString().slice(0, 10);
    if (existing) {
      existing.pets.add(b.petName);
      existing.visitCount += 1;
      if (dateStr > existing.lastVisit) existing.lastVisit = dateStr;
    } else {
      clientsMap.set(key, {
        phone: b.phone,
        ownerName: b.ownerName,
        pets: new Set([b.petName]),
        visitCount: 1,
        lastVisit: dateStr
      });
    }
  }

  const clients = Array.from(clientsMap.values()).sort((a, b) => b.lastVisit.localeCompare(a.lastVisit));

  return (
    <>
      <h2 className="section">Clients</h2>
      <p className="sub">{clients.length} client(s), built from appointment history</p>
      {clients.length === 0 ? (
        <div className="empty">No clients yet — they'll appear here once someone books an appointment.</div>
      ) : (
        <table>
          <thead>
            <tr><th>Owner</th><th>Phone</th><th>Pets</th><th>Visits</th><th>Last visit</th></tr>
          </thead>
          <tbody>
            {clients.map((c) => (
              <tr key={c.phone}>
                <td>{c.ownerName}</td>
                <td>
                  <a href={`tel:${c.phone}`} className="btn btn-sm btn-primary">
                    📞 {c.phone}
                  </a>
                </td>
                <td>{Array.from(c.pets).join(", ")}</td>
                <td>{c.visitCount}</td>
                <td>{c.lastVisit}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}