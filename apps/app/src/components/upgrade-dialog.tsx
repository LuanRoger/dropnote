"use client";

import { PRODUCT_ICONS } from "@/assets/icons";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/design-system/components/ui/dialog";
import { CheckIcon, RocketIcon } from "lucide-react";
import Link from "next/link";

type UpgradeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  upgradeHref: string;
};

export default function UpgradeDialog({
  open,
  onOpenChange,
  upgradeHref,
}: UpgradeDialogProps) {
  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="overflow-hidden">
        <div className="relative space-y-2">
          <div className="absolute -top-32 -left-32 -z-10 size-60 rounded-full bg-radial from-muted blur-2xl" />

          <DialogHeader>
            <DialogTitle className="inline-flex items-center gap-1 font-bold text-2xl tracking-tight">
              <RocketIcon />
              Upgrade your experience
            </DialogTitle>
            <DialogDescription>
              Unlock more power with premium upgrades for your notes.
            </DialogDescription>
          </DialogHeader>

          <ul className="space-y-4">
            <li>
              <strong>
                <span className="inline-flex gap-1">
                  {PRODUCT_ICONS.extended} Extended Character Limit:
                </span>
              </strong>{" "}
              Upgrade to increase your note's character limit from 1,000 to
              10,000 characters.
            </li>
            <li>
              <strong>
                <span className="inline-flex gap-1">
                  {PRODUCT_ICONS.permanent}
                  Permanent Notes:
                </span>
              </strong>{" "}
              Upgrade to create notes that never expire and are stored securely
              in the cloud.
            </li>
            <li>
              <strong>
                <span className="inline-flex gap-1">
                  {PRODUCT_ICONS.secure}
                  Password secured:
                </span>
              </strong>{" "}
              Upgrade to protect your notes with a password, ensuring only those
              you choose can access them.
            </li>
          </ul>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Maybe later</Button>
            </DialogClose>
            <Link href={upgradeHref}>
              <Button>Upgrade now</Button>
            </Link>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
