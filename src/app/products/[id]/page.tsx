import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import PublicShell from "@/components/PublicShell";
import SiteFooter from "@/components/SiteFooter";
import ProductPurchasePanel from "@/components/ProductPurchasePanel";
import ProductCard, { type StoreProduct } from "@/components/ProductCard";
import { IconArrowRight, IconPaw } from "@/components/Icons";

export const dynamic = "force-dynamic";

type Props = { params: { id: string } };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) return { title: "Product not found" };
  return {
    title: product.name,
    description: product.description || `${product.name} from the SupposeVeterinary pet shop in Kathmandu.`,
    alternates: { canonical: `/products/${product.id}` }
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const product = await prisma.product.findUnique({ where: { id: params.id } });
  if (!product) notFound();

  const catalog = await prisma.product.findMany({
    where: { id: { not: product.id } },
    orderBy: { createdAt: "desc" }
  });
  const related = [
    ...catalog.filter((item) => item.category && item.category === product.category),
    ...catalog.filter((item) => !product.category || item.category !== product.category)
  ].slice(0, 4);
  const item: StoreProduct = { ...product, price: Number(product.price) };

  return (
    <PublicShell>
      <div className="product-detail-page">
        <div className="detail-wrap">
          <nav className="breadcrumbs" aria-label="Breadcrumb">
            <a href="/">Shop</a><IconArrowRight /><span>{product.name}</span>
          </nav>
          <section className="product-detail-layout">
            <div className="product-gallery">
              {product.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={product.imageUrl} alt={product.name} />
              ) : (
                <div className="product-gallery-empty"><IconPaw /><span>Product photo</span></div>
              )}
              {product.stock > 0 && product.stock <= 5 && <span className="badge badge-warn detail-stock-badge">Only {product.stock} left</span>}
            </div>
            <ProductPurchasePanel product={item} />
          </section>
        </div>

        {related.length > 0 && (
          <section className="related-section section-wrap">
            <div className="section-heading">
              <div><span className="eyebrow">MORE FROM THE SHOP</span><h2>You may also <em>like.</em></h2></div>
              <a className="text-link" href="/">View all products <IconArrowRight /></a>
            </div>
            <div className="grid product-grid related-grid">{related.map((relatedProduct) => <ProductCard key={relatedProduct.id} product={{ ...relatedProduct, price: Number(relatedProduct.price) }} />)}</div>
          </section>
        )}
      </div>
      <SiteFooter />
    </PublicShell>
  );
}
