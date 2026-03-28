import { notFound } from "next/navigation";
import { getNoteByCode } from "@/app/actions/notes";
import { getProducts } from "@/app/actions/payments";
import { getNoteOwnedFeatures } from "@/utils/notes";
import { serializeProduct } from "@/utils/payments";
import { obfuscateEmail } from "@/utils/email";
import EmptyProducts from "./components/empty-products";
import { UpgradePageClient } from "./components/upgrade-page-client";

export default async function Page({ params }: PageProps<"/[code]/upgrade">) {
  // TODO: Uncomment when Stripe is ready
  notFound();

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

  const ownerEmail = note.ownerEmail ?? undefined;

  return (
    <div className="flex flex-col gap-8 py-2">
      <div className="flex flex-col gap-2">
        <h1 className="font-bold text-2xl">Upgrade your note</h1>
        <p className="text-muted-foreground text-sm">
          Enhance your note with powerful add-ons. Pick what you need and pay
          once — no subscriptions, no surprises.
        </p>
        {ownerEmail && (
          <p className="text-muted-foreground text-sm">
            This note is owned by{" "}
            <span className="font-medium font-mono text-foreground">
              {obfuscateEmail(ownerEmail)}
            </span>{" "}
            . Only the owner can purchase upgrades for this note.
          </p>
        )}
      </div>

      {hasProductsToOffer ? (
        <UpgradePageClient
          noteCode={code}
          ownerEmail={ownerEmail}
          products={productsToOffer}
        />
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
