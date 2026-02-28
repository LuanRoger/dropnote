export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="p-2">{children}</div>;
}
