"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEditorSelector } from "platejs/react";

export default function BottomStatus() {
  const nodes = useEditorSelector((editor) => editor.children, []);
  const nodeCount = nodes.length;

  return (
    <div className="w-full rounded-lg border border-border p-2 text-sm font-mono uppercase text-muted-foreground overflow-clip">
      <p className="flex items-center gap-2">
        <span>Blocks:</span>

        <span className="relative inline-flex h-5 min-w-[2ch] items-center justify-center overflow-hidden">
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.span
              key={nodeCount}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
            >
              {nodeCount}
            </motion.span>
          </AnimatePresence>
        </span>
      </p>
    </div>
  );
}
