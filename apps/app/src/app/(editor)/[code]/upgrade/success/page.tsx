import { Button } from "@repo/design-system/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@repo/design-system/components/ui/empty";
import { CheckIcon } from "lucide-react";
import Link from "next/link";
import { fulfillCheckout } from "@/app/actions/fulfillment";
import {
  FulfillOrderUnpaidError,
  FulfillSessionIdNotValidError,
} from "@/types/errors/fulfillment";

export default async function Page({
  params,
  searchParams,
}: PageProps<"/[code]/upgrade/success">) {
  const { code } = await params;
  const { session_id: sessionId } = await searchParams;
  if (!sessionId || typeof sessionId !== "string") {
    throw new FulfillSessionIdNotValidError();
  }

  const result = await fulfillCheckout(sessionId);

  let description = (
    <EmptyDescription>
      Your note has been successfully upgraded! You can now enjoy the new
      features and improvements. Thank you for your purchase and support!
    </EmptyDescription>
  );
  switch (result) {
    case "already_fulfilled":
      description = (
        <EmptyDescription>
          This order has already been fulfilled. If you have any issues with the
          upgrade, enter in contact.
        </EmptyDescription>
      );
      break;
    case "unpaid":
      throw new FulfillOrderUnpaidError();
    default:
      break;
  }

  return (
    <Empty className="size-full">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CheckIcon />
        </EmptyMedia>
        <EmptyTitle>Success</EmptyTitle>
        {description}
      </EmptyHeader>
      <EmptyContent>
        <Link href={`/${code}`}>
          <Button>Go back to note</Button>
        </Link>
      </EmptyContent>
    </Empty>
  );
}
