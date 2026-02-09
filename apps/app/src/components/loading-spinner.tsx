"use client";

import { Spinner } from "@repo/design-system/components/ui/spinner";
import { AnimatePresence, motion } from "motion/react";

interface LoadingSpinnerProps {
  className?: string;
  show?: boolean;
}

export default function LoadingSpinner({
  className,
  show,
}: LoadingSpinnerProps) {
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
