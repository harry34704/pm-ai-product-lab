import Link from "next/link";

export function AuthRequired() {
  return (
    <div className="rounded-[30px] border border-white/10 bg-slate-950/55 p-8 text-center backdrop-blur">
      <p className="text-xs uppercase tracking-[0.35em] text-cyan-300/70">Authentication required</p>
      <h3 className="mt-3 text-3xl font-semibold text-white">Launch the PM90 workspace first.</h3>
      <p className="mx-auto mt-4 max-w-xl text-slate-300">
        Sign in with your PM90 account or use the seeded demo user to explore the full 90-day product learning platform.
      </p>
      <Link href="/auth" className="mt-6 inline-flex rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-300 px-5 py-3 text-sm font-medium text-slate-950">
        Open auth
      </Link>
    </div>
  );
}
