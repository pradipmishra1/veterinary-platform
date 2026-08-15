import { prisma } from "@/lib/db";
import SiteHeader from "@/components/SiteHeader";

export const dynamic = "force-dynamic";

function formatPrice(value: unknown) {
  const n = Number(value);
  return "$" + n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default async function HomePage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <>
      <SiteHeader
        title="Everything your pet needs"
        subtitle="Food, health essentials and accessories."
        active="shop"
      />

      <div className="wrap">
        {products.length === 0 ? (
          <div className="empty">No products yet. Add some from the admin dashboard.</div>
        ) : (
          <div className="grid">
            {products.map((p, i) => (
              <div className="card" key={p.id} style={{ animationDelay: `${i * 0.05}s` }}>
                {p.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={p.imageUrl} alt={p.name} />
                ) : (
                  <div style={{ height: 150, background: "#eee" }} />
                )}
                <div className="body">
                  {p.category && <span className="badge">{p.category}</span>}
                  <h3>{p.name}</h3>
                  {p.description && <p className="desc">{p.description}</p>}
                  <div className="price">{formatPrice(p.price)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}