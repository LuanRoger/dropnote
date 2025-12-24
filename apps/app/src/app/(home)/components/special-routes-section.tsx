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
      <span className="inline-flex">
        <Link href="/no-save">
          <Kbd>no-save</Kbd>
        </Link>{" "}
        <p className="text-muted-foreground text-sm">
          - Create a new document without saving it.
        </p>
      </span>
    </div>
  );
}
