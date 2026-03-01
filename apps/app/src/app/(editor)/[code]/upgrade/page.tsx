import { notFound } from "next/navigation";
import { getNoteByCode } from "@/app/actions/notes";
import { getProducts } from "@/app/actions/payments";
import { getNoteOwnedFeatures } from "@/utils/notes";
import { serializeProduct } from "@/utils/payments";
import EmptyProducts from "./components/empty-products";
import { UpgradePageClient } from "./components/upgrade-page-client";

export default async function Page({ params }: PageProps<"/[code]/upgrade">) {
  const { code } = await params;

  const [products, note] = await Promise.all([
    getProducts(),
    getNoteByCode(code),
  ]);

  if (!note) {
    notFound();
  }

  const ownedFeatures = getNoteOwnedFeatures(note);
  const serializedProducts = products.map((p) =>
    serializeProduct(p, ownedFeatures),
  );
  const productsToOffer = serializedProducts.filter(
    (products) => !products.owned,
  );
  const hasProductsToOffer = productsToOffer.length > 0;

  return (
    <div className="flex flex-col gap-8 py-2">
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-1.5">
          <h1 className="font-bold text-2xl">Upgrade your note</h1>
          <p className="max-w-sm text-muted-foreground text-sm leading-relaxed">
            Enhance your note with powerful add-ons. Pick what you need and pay
            once — no subscriptions, no surprises.
          </p>
        </div>
      </div>

      {hasProductsToOffer ? (
        <UpgradePageClient noteCode={code} products={productsToOffer} />
      ) : (
        <EmptyProducts href={`/${code}`} />
      )}

      <p className="text-center text-muted-foreground/70 text-xs">
        Payments are processed securely by Stripe. All purchases are one-time
        and tied to note{" "}
        <span className="font-medium font-mono text-muted-foreground">
          {code}
        </span>
        .
      </p>
    </div>
  );
}
