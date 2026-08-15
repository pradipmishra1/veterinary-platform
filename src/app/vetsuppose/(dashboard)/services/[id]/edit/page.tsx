import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ServiceForm from "@/components/ServiceForm";

export const dynamic = "force-dynamic";

export default async function EditServicePage({ params }: { params: { id: string } }) {
  const service = await prisma.service.findUnique({ where: { id: params.id } });
  if (!service) notFound();

  return (
    <>
      <h2 className="section">Edit service</h2>
      <p className="sub">Changes apply immediately on the public Services page.</p>
      <ServiceForm
        initialValues={{
          id: service.id,
          name: service.name,
          category: service.category || "",
          price: String(service.price),
          durationMin: service.durationMin ? String(service.durationMin) : "",
          description: service.description || "",
          imageUrl: service.imageUrl || ""
        }}
      />
    </>
  );
}