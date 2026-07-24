import { AuthExperience } from "@/components/auth/AuthExperience";

export const metadata = { title: "Sign In — ÉLANORA" };

export default function LoginPage() {
  return <AuthExperience initialMode="login" />;
}
