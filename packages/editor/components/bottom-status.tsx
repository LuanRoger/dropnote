"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEditorPlugin, useEditorSelector } from "platejs/react";
import { useMemo } from "react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@repo/design-system/components/ui/hover-card";
import { AlertCircleIcon, ClockAlertIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@repo/design-system/components/ui/tooltip";
import { BottomStatusPlugin } from "../plugins/bottom-status-plugin";
import { countBodyLength } from "../utils/nodes";
import { Badge } from "@repo/design-system/components/ui/badge";
import { Separator } from "@repo/design-system/components/ui/separator";

export default function BottomStatus() {
  const noteExpiringIndicator = <NoteExpireAt />;
  const doesHaveIndicators = !!noteExpiringIndicator;

  return (
    <div className="flex justify-between w-full flex-none rounded-md border border-border p-1 md:p-2 text-xs font-mono uppercase text-muted-foreground">
      <div className="flex items-center gap-3">
        <CharactersBlockCount />
        {doesHaveIndicators && <Separator orientation="vertical" />}
        {noteExpiringIndicator}
      </div>
      <NoteBadges />
    </div>
  );
}

function CharactersBlockCount() {
  const { plugin } = useEditorPlugin(BottomStatusPlugin);
  const nodes = useEditorSelector((editor) => editor.children, []);
  const textLenght = useMemo(() => countBodyLength(nodes), [nodes]);

  const maxCharactersLength = plugin.options.maxLength;
  const nodeCount = nodes.length;
  const reachCharacterLimit = maxCharactersLength
    ? textLenght >= maxCharactersLength
    : false;

  return (
    <p className="flex items-center gap-2">
      <HoverCard>
        <HoverCardTrigger>
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
            <span>:</span>
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
            <span className="font-bold">Characters:Blocks</span>
            <span>
              This page have a limit of {maxCharactersLength} characters.
            </span>
          </p>
        </HoverCardContent>
      </HoverCard>
      {reachCharacterLimit && (
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 10, opacity: 0 }}
            >
              <AlertCircleIcon size={14} />
            </motion.div>
          </TooltipTrigger>
          <TooltipContent>
            You have reached the character limit of this note.
          </TooltipContent>
        </Tooltip>
      )}
    </p>
  );
}

function NoteExpireAt() {
  const { plugin } = useEditorPlugin(BottomStatusPlugin);
  const expireAt = plugin.options.expireAt;

  if (!expireAt) {
    return null;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ClockAlertIcon size={14} style={{ color: "var(--destructive)" }} />
      </TooltipTrigger>
      <TooltipContent>
        This note will expire and be deleted at {expireAt.toLocaleString()}.
      </TooltipContent>
    </Tooltip>
  );
}

function NoteBadges() {
  const { plugin } = useEditorPlugin(BottomStatusPlugin);
  const badges = plugin.options.badges;

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center">
      {badges.map(({ label, color, description }, index) => {
        const badge = (
          <Badge
            className="text-white ring-2 ring-background hover:z-10 transition-transform hover:scale-105"
            style={{
              backgroundColor: color,
              zIndex: badges.length - index,
              marginLeft: index === 0 ? 0 : "-0.3rem",
            }}
          >
            {label}
          </Badge>
        );

        return (
          <HoverCard key={`badge-${label}`}>
            <HoverCardTrigger>{badge}</HoverCardTrigger>
            <HoverCardContent side="top" className="flex flex-col gap-2">
              {badge}
              {description}
            </HoverCardContent>
          </HoverCard>
        );
      })}
    </div>
  );
}
