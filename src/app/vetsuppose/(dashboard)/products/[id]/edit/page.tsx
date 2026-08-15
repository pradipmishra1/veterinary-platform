import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import ProductForm from "@/components/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) notFound();

  return (
    <>
      <h2 className="section">Edit product</h2>
      <p className="sub">Changes apply immediately on the public shop page.</p>
      <ProductForm
        initialValues={{
          id: product.id,
          name: product.name,
          category: product.category || "",
          price: String(product.price),
          stock: String(product.stock),
          description: product.description || "",
          imageUrl: product.imageUrl || ""
        }}
      />
    </>
  );
}