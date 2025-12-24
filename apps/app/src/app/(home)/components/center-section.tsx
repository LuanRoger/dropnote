import NavigateToPageForm from "@/components/navigate-to-page-form";

export default function CenterSection() {
  return (
    <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center gap-2">
      <div className="flex flex-col">
        <h1 className="font-bold text-5xl">dropnote.</h1>
        <p className="text-muted-foreground text-sm">
          Create, edit and share text instantly.
        </p>
      </div>
      <NavigateToPageForm />
    </div>
  );
}
