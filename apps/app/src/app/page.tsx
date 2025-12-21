import { Button } from "@repo/design-system/components/ui/button";
import Link from "next/link";
import { GitHubIcon } from "@/components/icons";
import KeyboardKey from "@/components/keyboard-key";
import NavigateToPageForm from "@/components/navigate-to-page-form";

export default function Home() {
  return (
    <main className="relative h-screen w-screen p-4">
      <div className="flex flex-row justify-between">
        <Link
          href="https://github.com/LuanRoger/dropnote"
          rel="noopener noreferrer"
          target="_blank"
        >
          <Button size="icon" variant="ghost">
            <GitHubIcon className="size-5" />
          </Button>
        </Link>
        <div className="flex flex-row items-center gap-2 text-muted-foreground">
          Created by{" "}
          <Link
            className="hover:underline"
            href="https://www.luanroger.dev"
            rel="noopener noreferrer"
            target="_blank"
          >
            Luan Roger
          </Link>
        </div>
      </div>
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center gap-4">
        <h1 className="font-bold text-4xl">Dropnote</h1>
        <p className="font-geist-mono text-muted-foreground">
          Create, edit and share text instantly.
        </p>
        <NavigateToPageForm />
      </div>
      <div className="absolute inset-x-4 bottom-4 flex flex-row">
        <div className="flex flex-col items-center">
          <h2 className="font-semibold text-muted-foreground text-sm uppercase">
            Special routes
          </h2>
          <div>
            <KeyboardKey>no-save</KeyboardKey> - Create a new document without
            saving it.
          </div>
        </div>
      </div>
    </main>
  );
}
