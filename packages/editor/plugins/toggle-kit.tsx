"use client";

import { TogglePlugin } from "@platejs/toggle/react";
import { ToggleElement } from "../components/toggle-node";
import { IndentKit } from "../plugins/indent-kit";

export const ToggleKit = [
  ...IndentKit,
  TogglePlugin.withComponent(ToggleElement),
];
