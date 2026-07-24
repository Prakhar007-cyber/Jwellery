import NextAuth, { type DefaultSession, type NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { connectDB } from "./db";
import { User } from "./models/User";

/*
  Authentication (Auth.js / NextAuth v5).
  ------------------------------------------------------------
  - Credentials provider: email + password checked against a
    bcrypt hash stored in MongoDB.
  - Google provider: optional social login (only active when the
    GOOGLE_CLIENT_ID / SECRET env vars are set).
  - Sessions use JWT (stateless). We copy the user's id and role
    into the token, then expose them on `session.user` so the app
    can do role-based checks (e.g. admin).
*/

// Extend the session type so `session.user.id` / `.role` are typed.
declare module "next-auth" {
  interface Session {
    user: { id: string; role: "customer" | "admin" } & DefaultSession["user"];
  }
}

// Only enable Google when credentials are configured.
const providers: NextAuthConfig["providers"] = [
  Credentials({
    credentials: { email: {}, password: {} },
    async authorize(creds) {
      const email = String(creds?.email || "").toLowerCase().trim();
      const password = String(creds?.password || "");
      if (!email || !password) return null;

      await connectDB();
      const user = await User.findOne({ email });
      if (!user || !user.passwordHash) return null;

      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) return null;

      // Returned object becomes the basis of the JWT.
      return {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
      };
    },
  }),
];

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers,
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    // For Google sign-ins, make sure a matching User document exists.
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        await connectDB();
        const existing = await User.findOne({ email: user.email });
        if (!existing) {
          await User.create({
            name: user.name || "ÉLANORA Member",
            email: user.email,
            image: user.image,
            role: "customer",
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      // On first sign-in, persist id + role onto the token.
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as { role?: string }).role || "customer";
      }
      // For Google, look up role from the DB once.
      if (!token.role && token.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email });
        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = (token.role as "customer" | "admin") || "customer";
      return session;
    },
  },
});
