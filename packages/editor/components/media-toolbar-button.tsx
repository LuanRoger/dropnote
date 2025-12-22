"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@repo/design-system/components/ui/alert-dialog";
import { Button } from "@repo/design-system/components/ui/button";
import {
  Field,
  FieldError,
  FieldLabel,
} from "@repo/design-system/components/ui/field";
import { Input } from "@repo/design-system/components/ui/input";
import { FilmIcon, ImageIcon } from "lucide-react";
import { KEYS } from "platejs";
import { useEditorRef } from "platejs/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  type MediaToolbarSchema,
  mediaToolbarSchema,
} from "../utils/schemas/media-toolbar";
import { ToolbarSplitButton, ToolbarSplitButtonPrimary } from "./toolbar";

const MEDIA_CONFIG: Record<
  string,
  {
    accept: string[];
    icon: React.ReactNode;
    title: string;
    tooltip: string;
  }
> = {
  [KEYS.img]: {
    accept: ["image/*"],
    icon: <ImageIcon className="size-4" />,
    title: "Insert Image",
    tooltip: "Image",
  },
  [KEYS.video]: {
    accept: ["video/*"],
    icon: <FilmIcon className="size-4" />,
    title: "Insert Video",
    tooltip: "Video",
  },
};

export function MediaToolbarButton({ nodeType }: { nodeType: string }) {
  const currentConfig = MEDIA_CONFIG[nodeType];

  const [open, setOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <ToolbarSplitButton
        onClick={() => setDialogOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setOpen(true);
          }
        }}
        pressed={open}
        tooltip={currentConfig.tooltip}
      >
        <ToolbarSplitButtonPrimary>
          {currentConfig.icon}
        </ToolbarSplitButtonPrimary>
      </ToolbarSplitButton>

      <AlertDialog onOpenChange={setDialogOpen} open={dialogOpen}>
        <AlertDialogContent className="gap-6">
          <MediaUrlDialogContent
            currentConfig={currentConfig}
            nodeType={nodeType}
            setOpen={setDialogOpen}
          />
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

function MediaUrlDialogContent({
  currentConfig,
  nodeType,
  setOpen,
}: {
  currentConfig: (typeof MEDIA_CONFIG)[string];
  nodeType: string;
  setOpen: (value: boolean) => void;
}) {
  const form = useForm<MediaToolbarSchema>({
    resolver: zodResolver(mediaToolbarSchema),
    defaultValues: {
      url: "",
    },
  });
  const editor = useEditorRef();

  function handleSubmit(data: MediaToolbarSchema) {
    const { url } = data;

    setOpen(false);
    editor.tf.insertNodes({
      children: [{ text: "" }],
      name: nodeType === KEYS.file ? url.split("/").pop() : undefined,
      type: nodeType,
      url,
    });
  }

  return (
    <form className="contents" onSubmit={form.handleSubmit(handleSubmit)}>
      <AlertDialogHeader>
        <AlertDialogTitle>{currentConfig.title}</AlertDialogTitle>
      </AlertDialogHeader>

      <AlertDialogDescription className="group relative w-full">
        <Controller
          control={form.control}
          name="url"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor="url">URL</FieldLabel>
              <Input
                {...field}
                autoFocus
                className="w-full"
                id="url"
                placeholder="URL"
                type="url"
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </AlertDialogDescription>

      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <Button type="submit">Confirm</Button>
      </AlertDialogFooter>
    </form>
  );
}
