"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/components/ui/card";
import { cn } from "@repo/design-system/lib/utils";
import { CheckIcon } from "lucide-react";
import { useId } from "react";
import { formatCurrency } from "@/utils/currency";

type UpgradeCardInteractiveProps = {
  name: string;
  description: string | null;
  amount: number;
  currency: string;
  accent: string;
  icon?: React.ReactNode;
  recurring?: string;
  className?: string;
  selected: boolean;
  onToggleAction: () => void;
};

export function UpgradeCardInteractive({
  name,
  description,
  amount,
  currency,
  accent,
  icon,
  recurring,
  className,
  selected,
  onToggleAction,
}: UpgradeCardInteractiveProps) {
  const id = useId();

  return (
    <div
      className={cn("group relative", className)}
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <input
        checked={selected}
        className="sr-only"
        id={id}
        onChange={onToggleAction}
        type="checkbox"
      />

      <label className="block cursor-pointer" htmlFor={id}>
        <div
          aria-hidden
          className={cn(
            "absolute top-3 right-3 z-10 flex size-5 items-center justify-center rounded-full ring ring-white transition-all duration-200",
            selected ? "scale-100 opacity-100" : "scale-75 opacity-0",
          )}
          style={{ background: "var(--accent)" }}
        >
          <CheckIcon className="size-3 stroke-3 text-white" />
        </div>

        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-500",
            selected ? "opacity-100" : "opacity-0 group-hover:opacity-100",
          )}
          style={{
            background:
              "linear-gradient(135deg, color-mix(in srgb, var(--accent) 10%, transparent) 0%, transparent 50%, color-mix(in srgb, var(--accent) 6%, transparent) 100%)",
          }}
        />

        <Card
          className={cn(
            "relative select-none overflow-clip border transition-all duration-200",
            selected
              ? ["border-white"]
              : [
                  "border-transparent",
                  "ring-1 ring-black/8 dark:ring-white/5",
                  "hover:shadow-[0_8px_40px_-8px_color-mix(in_srgb,var(--accent)_30%,transparent)]",
                  "hover:ring-[color-mix(in_srgb,var(--accent)_35%,transparent)]",
                ],
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -top-6 left-1/2 h-20 w-full -translate-x-1/2 rounded-full opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
            style={{ background: "var(--accent)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-6 left-0 h-10 w-40 rounded-full opacity-30 blur-2xl transition-opacity duration-500 group-hover:opacity-60"
            style={{ background: "var(--accent)" }}
          />

          <CardHeader>
            <CardTitle className="inline-flex items-center gap-2 font-semibold text-base">
              {icon && (
                <span
                  className="flex size-7 items-center justify-center rounded-lg"
                  style={{
                    background:
                      "color-mix(in srgb, var(--accent) 15%, transparent)",
                    color: "var(--accent)",
                    boxShadow:
                      "0 0 0 1px color-mix(in srgb, var(--accent) 30%, transparent)",
                  }}
                >
                  {icon}
                </span>
              )}
              <span>{name}</span>
            </CardTitle>

            {description && (
              <CardDescription className="leading-relaxed">
                {description}
              </CardDescription>
            )}
          </CardHeader>

          <CardContent>
            <div className="flex items-end gap-1.5">
              <p
                className="bg-clip-text font-bold font-mono text-2xl text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 70%, #000))",
                }}
              >
                {formatCurrency(amount, currency.toUpperCase())}
              </p>
              {recurring && (
                <span className="mb-1 text-muted-foreground text-xs">
                  /{recurring}
                </span>
              )}
            </div>
          </CardContent>
        </Card>
      </label>
    </div>
  );
}
