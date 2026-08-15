import { prisma } from "@/lib/db";
import ServicesTable from "@/components/ServicesTable";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const services = await prisma.service.findMany({ orderBy: { createdAt: "desc" } });

  const serializable = services.map((s) => ({ ...s, price: Number(s.price) }));

  return (
    <>
      <div className="toolbar">
        <div>
          <h2 className="section">Services</h2>
          <p className="sub">{services.length} service(s) listed</p>
        </div>
        <a href="/vetsuppose/services/new" className="btn btn-primary">+ Add service</a>
      </div>
      <ServicesTable initialServices={serializable} />
    </>
  );
}