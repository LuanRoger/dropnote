"use client";

import { CaptionPlugin } from "@platejs/caption/react";
import {
  AudioPlugin,
  FilePlugin,
  ImagePlugin,
  MediaEmbedPlugin,
  VideoPlugin,
} from "@platejs/media/react";
import { KEYS } from "platejs";

import { AudioElement } from "../components/media-audio-node";
import { MediaEmbedElement } from "../components/media-embed-node";
import { FileElement } from "../components/media-file-node";
import { ImageElement } from "../components/media-image-node";
import { MediaPreviewDialog } from "../components/media-preview-dialog";
import { VideoElement } from "../components/media-video-node";

export const MediaKit = [
  ImagePlugin.configure({
    options: { disableUploadInsert: true },
    render: { afterEditable: MediaPreviewDialog, node: ImageElement },
  }),
  MediaEmbedPlugin.withComponent(MediaEmbedElement),
  VideoPlugin.withComponent(VideoElement),
  AudioPlugin.withComponent(AudioElement),
  FilePlugin.withComponent(FileElement),
  CaptionPlugin.configure({
    options: {
      query: {
        allow: [KEYS.img, KEYS.video, KEYS.audio, KEYS.file, KEYS.mediaEmbed],
      },
    },
  }),
];
