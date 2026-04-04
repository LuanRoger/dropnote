import { cn } from "@repo/design-system/lib/utils";

type IconContainerProps = Omit<React.ComponentProps<"div">, "aria-hiden">;

export default function IconContainer({
  className,
  children,
  ...props
}: IconContainerProps) {
  return (
    <div
      {...props}
      aria-hidden
      className={cn(
        "flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary ring ring-ring",
        className,
      )}
    >
      {children}
    </div>
  );
}
