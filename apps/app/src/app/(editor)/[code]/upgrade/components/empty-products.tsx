import { Button } from "@repo/design-system/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/design-system/components/ui/empty";
import { RocketIcon } from "lucide-react";
import Link from "next/link";

type EmptyProductsProps = {
  href: string;
  className?: string;
};

export default function EmptyProducts({ href, className }: EmptyProductsProps) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <RocketIcon className="size-4" />
        </EmptyMedia>
        <EmptyTitle>No upgrades available</EmptyTitle>
        <EmptyDescription>
          It seems that you already own all the available upgrades for your
          note. If you think this is a mistake, please contact support. If not —
          great! Enjoy your enhanced note experience.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href={href}>
          <Button>Back to note</Button>
        </Link>
      </EmptyContent>
    </Empty>
  );
}
