import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function LoginPage() {
  return (
    <div className="space-y-5">
      <AuthForm mode="login" />
      <p className="text-center text-sm text-slate-400">
        Need an account?{" "}
        <Link href="/register" className="text-primary">
          Register
        </Link>
      </p>
    </div>
  );
}
