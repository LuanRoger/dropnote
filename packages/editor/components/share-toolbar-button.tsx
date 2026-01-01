/** biome-ignore-all lint/performance/noImgElement: Editor do not depends on Next */
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design-system/components/ui/popover";
import { Skeleton } from "@repo/design-system/components/ui/skeleton";
import { CheckIcon, CopyIcon, Share2Icon } from "lucide-react";
import { toDataURL } from "qrcode";
import { useEffect, useState, useTransition } from "react";
import { useClipboard } from "react-haiku";
import { ToolbarButton } from "./toolbar";

export default function ShareToolbarButton() {
  const url = typeof window !== "undefined" ? window.location.href : "";

  const { copied, copy } = useClipboard({ timeout: 2000 });
  const [isPending, generateQrCode] = useTransition();
  const [qrCodeData, setQrCodeData] = useState<string | undefined>();

  useEffect(() => {
    generateQrCode(async () => {
      const data = await toDataURL(url, {
        color: {
          dark: "#ffffff",
          light: "#000000",
        },
        margin: 1,
        errorCorrectionLevel: "H",
        type: "image/webp",
      });
      setQrCodeData(data);
    });
  }, [url]);

  return (
    <Popover>
      <PopoverTrigger>
        <ToolbarButton tooltip="Share">
          <Share2Icon />
        </ToolbarButton>
      </PopoverTrigger>
      <PopoverContent className="flex w-96 flex-col gap-2">
        <span className="flex flex-col gap-1">
          <h3 className="font-medium text-lg leading-none">Share Link</h3>
          <p className="text-muted-foreground text-sm">
            Share this link to give others access to this note.
          </p>
        </span>
        <div className="flex flex-row items-center gap-2">
          <div className="flex flex-col gap-2">
            <Input readOnly value={url} />
            <Button onClick={() => copy(url)} variant="outline">
              Copy Link
              {copied ? <CheckIcon /> : <CopyIcon />}
            </Button>
          </div>
          <div className="mt-4 flex justify-center">
            {isPending ? (
              <QRCodeLoading />
            ) : (
              qrCodeData && (
                <div className="size-32 rounded-md border border-border p-2">
                  <img
                    alt="QR Code"
                    className="size-full rounded-md object-contain"
                    height={128}
                    src={qrCodeData}
                    width={128}
                  />
                </div>
              )
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function QRCodeLoading() {
  return <Skeleton className="size-32" />;
}
