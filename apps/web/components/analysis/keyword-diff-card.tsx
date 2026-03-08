import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function KeywordDiffCard({
  matchedKeywords,
  missingKeywords
}: {
  matchedKeywords: string[];
  missingKeywords: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Keyword alignment</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-slate-400">Matched</p>
          <div className="flex flex-wrap gap-2">
            {matchedKeywords.map((keyword) => (
              <Badge key={keyword} className="border-primary/40 bg-primary/10 text-primary">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-sm text-slate-400">Missing or weak evidence</p>
          <div className="flex flex-wrap gap-2">
            {missingKeywords.map((keyword) => (
              <Badge key={keyword} className="border-amber-400/30 bg-amber-400/10 text-amber-200">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
