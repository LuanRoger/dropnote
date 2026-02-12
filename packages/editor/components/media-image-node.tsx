"use client";

import { Image, ImagePlugin, useMediaState } from "@platejs/media/react";
import { ResizableProvider, useResizableValue } from "@platejs/resizable";
import type { TImageElement } from "platejs";
import type { PlateElementProps } from "platejs/react";
import { PlateElement, withHOC } from "platejs/react";

import { cn } from "../utils/tailwind";

import { Caption, CaptionTextarea } from "./caption";
import { MediaToolbar } from "./media-toolbar";
import {
  mediaResizeHandleVariants,
  Resizable,
  ResizeHandle,
} from "./resize-handle";

export const ImageElement = withHOC(
  ResizableProvider,
  function ImageElement(props: PlateElementProps<TImageElement>) {
    const { align = "center", focused, readOnly, selected } = useMediaState();
    const width = useResizableValue("width");

    return (
      <MediaToolbar plugin={ImagePlugin}>
        <PlateElement {...props} className="py-2.5">
          <figure className="group relative m-0" contentEditable={false}>
            <Resizable
              align={align}
              options={{
                align,
                readOnly,
              }}
            >
              <ResizeHandle
                className={mediaResizeHandleVariants({ direction: "left" })}
                options={{ direction: "left" }}
              />
              <Image
                alt={(props.attributes as any).alt}
                className={cn(
                  "block w-full max-w-full cursor-pointer object-cover px-0",
                  "rounded-sm",
                  focused && selected && "ring-2 ring-ring ring-offset-2",
                )}
              />
              <ResizeHandle
                className={mediaResizeHandleVariants({
                  direction: "right",
                })}
                options={{ direction: "right" }}
              />
            </Resizable>

            <Caption align={align} style={{ width }}>
              <CaptionTextarea
                onFocus={(e) => {
                  e.preventDefault();
                }}
                placeholder="Write a caption..."
                readOnly={readOnly}
              />
            </Caption>
          </figure>

          {props.children}
        </PlateElement>
      </MediaToolbar>
    );
  },
);
