import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function RegisterPage() {
  return (
    <div className="space-y-5">
      <AuthForm mode="register" />
      <p className="text-center text-sm text-slate-400">
        Already have an account?{" "}
        <Link href="/login" className="text-primary">
          Login
        </Link>
      </p>
    </div>
  );
}
