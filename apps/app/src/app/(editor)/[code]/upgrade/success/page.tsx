import { fulfillCheckout } from "@/app/actions/fulfillment";
import {
  FulfillOrderAlreadyFulfilledError,
  FulfillOrderNotFoundError,
  FulfillOrderUnpaidError,
  FulfillSessionIdNotValidError,
} from "@/types/errors/fulfillment";
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
  switch (result) {
    case "not_found":
      throw new FulfillOrderNotFoundError();
    case "already_fulfilled":
      throw new FulfillOrderAlreadyFulfilledError();
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
        <EmptyDescription>
          Your note has been successfully upgraded! You can now enjoy the new
          features and improvements. Thank you for your purchase and support!
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Link href={`/${code}`}>
          <Button>Go back to note</Button>
        </Link>
      </EmptyContent>
    </Empty>
  );
}
