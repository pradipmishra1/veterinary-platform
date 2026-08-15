import ServiceForm from "@/components/ServiceForm";

export default function NewServicePage() {
  return (
    <>
      <h2 className="section">Add service</h2>
      <p className="sub">This will appear immediately on the public Services page.</p>
      <ServiceForm />
    </>
  );
}
