export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="size-full p-2">{children}</div>;
}
