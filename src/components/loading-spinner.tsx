"use client";

import { cn } from "@/utils/tailwind";
import { Loader2Icon } from "lucide-react";
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
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className={cn("animate-spin", className)}
        >
          <Loader2Icon />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
