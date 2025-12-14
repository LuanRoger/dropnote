"use server";

import { cacheTag, revalidateTag } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { AUTH_TAGS_KEY } from "./constants";
import { auth } from "./server";

export async function currentUser() {
  "use cache: private";
  cacheTag(AUTH_TAGS_KEY.USER_LOGOUT);

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return session?.user;
}

export async function signInEmail(email: string, password: string) {
  const result = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
  });

  if (!result.user) {
    return null;
  }

  return result.user;
}

export async function signUpEmail(
  name: string,
  username: string,
  email: string,
  password: string
) {
  const result = await auth.api.signUpEmail({
    body: {
      displayUsername: name,
      username,
      name,
      email,
      password,
    },
  });

  if (!result.token) {
    return null;
  }

  return result.user;
}

export async function signOut() {
  await auth.api.signOut({
    headers: await headers(),
  });

  revalidateTag(AUTH_TAGS_KEY.USER_LOGOUT, "max");
}

export async function requireAuthenticatedUser(redirectTo: string) {
  const user = await currentUser();

  if (!user) {
    redirect(redirectTo);
  }

  return user;
}

export async function requireUnauthenticatedUser(redirectTo: string) {
  const user = await currentUser();

  if (user) {
    redirect(redirectTo);
  }

  return;
}
