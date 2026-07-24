import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { AccountNav } from "@/components/account/AccountNav";

/*
  Account layout. Protected server-side: if there is no session we
  redirect to /login. Renders a sidebar shared by all account pages.
*/
export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="px-6 pb-24 pt-32 lg:px-14">
      <div className="mx-auto max-w-[1300px]">
        <header className="mb-12 border-b border-line pb-8">
          <span className="eyebrow text-gold">My ÉLANORA</span>
          <h1 className="display mt-3 text-5xl lg:text-6xl">
            {session.user.name ? `Hello, ${session.user.name.split(" ")[0]}.` : "Your Account"}
          </h1>
        </header>
        <div className="grid gap-12 lg:grid-cols-[220px_1fr]">
          <AccountNav isAdmin={session.user.role === "admin"} />
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
