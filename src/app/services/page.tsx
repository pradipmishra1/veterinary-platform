import { prisma } from "@/lib/db";
import ServicesPage from "@/components/ServicesPage";

export const dynamic = "force-dynamic";

export default async function Services() {
  const services = await prisma.service.findMany({ orderBy: { createdAt: "desc" } });

  const serializable = services.map((s) => ({
    ...s,
    price: Number(s.price)
  }));

  return <ServicesPage services={serializable} />;
}
