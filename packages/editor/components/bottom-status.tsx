"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEditorPlugin, useEditorSelector } from "platejs/react";
import { useMemo } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@repo/design-system/components/ui/hover-card";
import { AlertCircleIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/design-system/components/ui/tooltip";
import { BottomStatusPlugin } from "../plugins/bottom-status-plugin";
import { countBodyLength } from "../utils/nodes";

export default function BottomStatus() {
  const { plugin } = useEditorPlugin(BottomStatusPlugin);
  const nodes = useEditorSelector((editor) => editor.children, []);
  const textLenght = useMemo(() => countBodyLength(nodes), [nodes]);

  const maxCharactersLength = plugin.options.maxLength;
  const nodeCount = nodes.length;
  const reachCharacterLimit = maxCharactersLength
    ? textLenght >= maxCharactersLength
    : false;

  return (
    <div className="flex justify-between w-full rounded-lg border border-border p-2 text-sm font-mono uppercase text-muted-foreground overflow-hidden">
      <p className="flex items-center gap-3">
        <HoverCard>
          <HoverCardTrigger className="flex gap-1">
            <AnimatePresence initial={false} mode="popLayout">
              <motion.span
                key={`textLenght-${textLenght}`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {textLenght}
              </motion.span>
              <span>/</span>
              <motion.span
                key={`nodeCount-${nodeCount}`}
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
                transition={{ duration: 0.22, ease: "easeOut" }}
              >
                {nodeCount}
              </motion.span>
            </AnimatePresence>
          </HoverCardTrigger>
          <HoverCardContent side="top" align="start">
            <p className="flex flex-col">
              <span className="font-bold">Characters / Blocks</span>
              <span>
                This page have a limit of {maxCharactersLength} characters.
              </span>
            </p>
          </HoverCardContent>
        </HoverCard>
        {reachCharacterLimit && (
          <Tooltip>
            <TooltipTrigger>
              <motion.div
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 10, opacity: 0 }}
              >
                <AlertCircleIcon size={16} />
              </motion.div>
            </TooltipTrigger>
            <TooltipContent>
              You have reached the character limit of this note.
            </TooltipContent>
          </Tooltip>
        )}
      </p>
    </div>
  );
}
