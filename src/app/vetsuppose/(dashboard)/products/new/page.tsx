import ProductForm from "@/components/ProductForm";

export default function NewProductPage() {
  return (
    <>
      <h2 className="section">Add product</h2>
      <p className="sub">This will appear immediately on the public shop page.</p>
      <ProductForm />
    </>
  );
}