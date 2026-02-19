import { ViewportContainer } from "@/components/viewport-container";

export default function EditorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <ViewportContainer>{children}</ViewportContainer>;
}
