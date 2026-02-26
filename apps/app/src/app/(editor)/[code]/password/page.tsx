import UpdatePasswordCard from "../components/update-password";

export default async function NotePasswordPage({
  params,
}: PageProps<"/[code]/password">) {
  const { code } = await params;

  return (
    <UpdatePasswordCard
      className="absolute inset-0 top-1/2 mx-auto h-fit w-96 -translate-y-1/2"
      code={code}
    />
  );
}
