"use client";

import { TogglePlugin } from "@platejs/toggle/react";

import { IndentKit } from "../plugins/indent-kit";
import { ToggleElement } from "../components/toggle-node";

export const ToggleKit = [
  ...IndentKit,
  TogglePlugin.withComponent(ToggleElement),
];
