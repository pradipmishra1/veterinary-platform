import { prisma } from "@/lib/db";
import ProductsTable from "@/components/ProductsTable";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  const serializable = products.map((p) => ({
    ...p,
    price: Number(p.price)
  }));

  return (
    <>
      <div className="toolbar">
        <div>
          <h2 className="section">Products</h2>
          <p className="sub">{products.length} item(s) listed in the shop</p>
        </div>
        <a href="/vetsuppose/products/new" className="btn btn-primary">
          + Add product
        </a>
      </div>
      <ProductsTable initialProducts={serializable} />
    </>
  );
}