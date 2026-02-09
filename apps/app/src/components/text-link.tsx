import { cn } from "@repo/design-system/lib/utils";
import Link from "next/link";

type TextLinkProps = React.ComponentProps<typeof Link>;

export default function TextLink({
  children,
  className,
  ...props
}: TextLinkProps) {
  return (
    <Link className={cn("hover:underline", className)} {...props}>
      {children}
    </Link>
  );
}
