import { Button } from "@repo/design-system/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { GitHubIcon } from "@/components/icons";
import lrLogo from "~/public/lr-logo.png";

export default function Header() {
  return (
    <div className="flex flex-row gap-3">
      <Button size="icon" variant="ghost">
        <Link
          href="https://github.com/LuanRoger/dropnote"
          rel="noopener noreferrer"
          target="_blank"
        >
          <GitHubIcon className="size-6" />
        </Link>
      </Button>
      <Button asChild size="icon" variant="ghost">
        <Link
          className="hover:underline"
          href="https://www.luanroger.dev"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Image
            alt="Luan Roger Logo"
            className="invert"
            height={40}
            src={lrLogo}
            width={40}
          />
        </Link>
      </Button>
    </div>
  );
}
