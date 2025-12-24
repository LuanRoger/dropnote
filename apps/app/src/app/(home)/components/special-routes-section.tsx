import { Kbd } from "@repo/design-system/components/ui/kbd";
import { Separator } from "@repo/design-system/components/ui/separator";
import Link from "next/link";

export default function SpecialRoutesSection() {
  return (
    <div className="flex w-full flex-col lg:w-fit">
      <div className="inline-flex items-center gap-2">
        <h2 className="flex-none font-semibold uppercase">Special routes</h2>
        <Separator className="flex-1" />
      </div>
      <RouteInfo
        description="Create a new document without saving it"
        route="/no-save"
        routeName="no-save"
      />
    </div>
  );
}

function RouteInfo({
  route,
  routeName,
  description,
}: {
  route: string;
  routeName: string;
  description: string;
}) {
  return (
    <span className="flex items-center">
      <Link href={route}>
        <Kbd>{routeName}</Kbd>
      </Link>
      <p className="text-muted-foreground text-sm"> - {description}.</p>
    </span>
  );
}
