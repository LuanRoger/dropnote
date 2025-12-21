"use client";

import { Loader2Icon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/utils/tailwind";

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
          className={cn("animate-spin", className)}
          exit={{ opacity: 0 }}
          initial={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <Loader2Icon />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
