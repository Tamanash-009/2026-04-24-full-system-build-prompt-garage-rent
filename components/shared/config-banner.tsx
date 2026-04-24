import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ConfigBanner({ ready }: { ready: boolean }) {
  return (
    <Card className="border-dashed">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            {ready ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            )}
            Platform configuration
          </CardTitle>
          <CardDescription>
            The app renders safely without Supabase keys, but production workflows unlock once the
            environment variables are added.
          </CardDescription>
        </div>
        <Badge variant={ready ? "success" : "warning"}>{ready ? "Connected" : "Setup needed"}</Badge>
      </CardHeader>
      <CardContent className="grid gap-2 text-sm text-slate-600">
        <p>`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` power Google sign-in with Clerk.</p>
        <p>`NEXT_PUBLIC_SUPABASE_URL` and a publishable key power data, exports, and realtime.</p>
        <p>`SUPABASE_SERVICE_ROLE_KEY` enables protected exports and the rent sync cron route.</p>
        <p>`CRON_SECRET` secures the Vercel monthly auto-generation endpoint.</p>
      </CardContent>
    </Card>
  );
}
