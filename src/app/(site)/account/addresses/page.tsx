import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { User } from "@/lib/models/User";

// Saved addresses. Addresses are stored on the User document; here
// we simply display them (they're captured during checkout).
export default async function AddressesPage() {
  const session = await auth();
  await connectDB();
  const user = session?.user?.id
    ? await User.findById(session.user.id).lean<{ addresses?: Record<string, string>[] }>()
    : null;
  const addresses = user?.addresses || [];

  return (
    <div>
      <h2 className="font-serif text-2xl">Addresses</h2>

      {addresses.length === 0 ? (
        <p className="mt-6 text-espresso-soft">
          You have no saved addresses yet. Addresses you use at checkout will appear here.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {addresses.map((a, i) => (
            <div key={i} className="border border-line p-6 text-sm">
              <p className="font-serif text-lg">{a.name}</p>
              <p className="mt-2 text-espresso-soft">
                {a.line1}, {a.city}, {a.state} {a.postalCode}, {a.country}
              </p>
              <p className="mt-1 text-espresso-soft">{a.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
