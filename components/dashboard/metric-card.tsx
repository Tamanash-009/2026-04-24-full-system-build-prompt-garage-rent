import { LucideIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  badge
}: {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  badge?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <CardTitle className="mt-3 text-3xl">{value}</CardTitle>
        </div>
        <div className="rounded-2xl bg-slate-100 p-3 text-slate-900">
          <Icon className="h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3">
        <p className="text-sm text-slate-600">{detail}</p>
        {badge ? <Badge variant="outline">{badge}</Badge> : null}
      </CardContent>
    </Card>
  );
}
