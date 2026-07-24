import { AuthExperience } from "@/components/auth/AuthExperience";

export const metadata = { title: "Create Account — ÉLANORA" };

export default function SignupPage() {
  return <AuthExperience initialMode="signup" />;
}
