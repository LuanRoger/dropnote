"use client";

import { Spinner } from "@repo/design-system/components/ui/spinner";
import { cn } from "@repo/design-system/lib/utils";
import { Loader2Icon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

type LoadingSpinnerProps = {
  className?: string;
  show?: boolean;
  animated?: boolean;
};

export default function LoadingSpinner({
  className,
  show,
  animated,
}: LoadingSpinnerProps) {
  if (!animated) {
    return <Loader2Icon className={cn("size-4 animate-spin", className)} />;
  }

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          animate={{ opacity: 0.4 }}
          className={className}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Spinner />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
