import { createSecurityCodeForNote } from "@/app/actions/security-code";
import { NoteAlreadyHasSecurityCodeError } from "@/types/errors/security-code";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;

  const body = await request.json();
  const { email } = body;

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 });
  }

  try {
    await createSecurityCodeForNote(code, email, "create");
    return NextResponse.json(
      { message: "Security code created and sent to email successfully." },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof NoteAlreadyHasSecurityCodeError) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }

    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 },
    );
  }
}
