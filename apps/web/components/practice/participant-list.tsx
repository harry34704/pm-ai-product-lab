import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleBadge } from "./role-badge";

export function ParticipantList({ participants }: { participants: any[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Participants</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {participants.map((participant) => (
          <div key={participant.id} className="flex items-center justify-between rounded-xl border border-border bg-slate-950/60 px-3 py-3">
            <div>
              <p className="font-medium">{participant.displayName}</p>
              <p className="text-xs text-slate-500">{participant.userId ? "Registered user" : "Guest participant"}</p>
            </div>
            <RoleBadge role={participant.role} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
