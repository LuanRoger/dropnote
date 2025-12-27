export default function EditorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="h-screen p-2">{children}</div>;
}
