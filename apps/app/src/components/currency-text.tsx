import { formatCurrency } from "@/utils/currency";
import { cn } from "@repo/design-system/lib/utils";

type CurrencyTextProps = React.ComponentProps<"span"> & {
  amount: number;
  currency: string;
};

export default function CurrencyText({
  amount,
  currency,
  className,
  ...props
}: CurrencyTextProps) {
  return (
    <span className={cn("font-mono", className)} {...props}>
      {formatCurrency(amount, currency.toUpperCase())}
    </span>
  );
}
