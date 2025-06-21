import { GitHubIcon } from "@/components/icons";
import KeyboardKey from "@/components/keyboard-key";
import NavigateToPageForm from "@/components/navigate-to-page-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative w-screen h-screen p-4">
      <div className="flex flex-row justify-between">
        <Link
          href="https://github.com/LuanRoger/dropnote"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Button variant="ghost" size="icon">
            <GitHubIcon className="size-5" />
          </Button>
        </Link>
        <div className="flex flex-row gap-2 items-center text-muted-foreground">
          Created by <Link href="https://github.com/LuanRoger" className="hover:underline">Luan Roger</Link>
        </div>
      </div>
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-4 items-center justify-center">
        <h1 className="text-4xl font-bold">Dropnote</h1>
        <p className="font-geist-mono text-muted-foreground">
          Create, edit, and share text instantly.
        </p>
        <NavigateToPageForm />
      </div>
      <div className="absolute inset-x-4 bottom-4 flex flex-row">
        <div className="flex flex-col items-center">
          <h2 className="font-semibold uppercase text-sm text-muted-foreground">
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
