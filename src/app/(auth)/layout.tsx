// Minimal layout for auth pages — no navbar/footer, just the
// full-screen split-screen experience.
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen">{children}</div>;
}
