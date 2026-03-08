import { Badge } from "@/components/ui/badge";

export function RoleBadge({ role }: { role: "CANDIDATE" | "INTERVIEWER" }) {
  return <Badge className={role === "CANDIDATE" ? "border-primary/40 bg-primary/10 text-primary" : "border-accent/40 bg-cyan-500/10 text-cyan-200"}>{role === "CANDIDATE" ? "Candidate" : "Interviewer"}</Badge>;
}
