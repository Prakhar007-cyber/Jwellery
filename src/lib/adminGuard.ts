import { auth } from "./auth";

/*
  Server-side admin check. Returns the session if the current user
  is an admin, otherwise null. Every admin API and page uses this —
  we never rely on hiding buttons in the UI for authorization.
*/
export async function requireAdmin() {
  const session = await auth();
  if (session?.user?.role === "admin") return session;
  return null;
}
