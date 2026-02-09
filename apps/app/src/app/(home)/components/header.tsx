import TextLink from "@/components/text-link";

export default function Header() {
  return (
    <div className="flex flex-row items-center gap-1 font-mono text-muted-foreground text-sm uppercase">
      <TextLink
        href="https://github.com/LuanRoger/dropnote"
        rel="noopener noreferrer"
        target="_blank"
      >
        GitHub
      </TextLink>
      <p>•</p>
      <TextLink
        href="https://www.luanroger.dev"
        rel="noopener noreferrer"
        target="_blank"
      >
        Made by Luan Roger
      </TextLink>
    </div>
  );
}
