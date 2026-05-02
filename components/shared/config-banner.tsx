import { AlertTriangle, CheckCircle2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { shouldExposeTechnicalSetupDetails } from "@/lib/env";

export function ConfigBanner({ ready }: { ready: boolean }) {
  const showTechnicalDetails = shouldExposeTechnicalSetupDetails();

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
            {ready
              ? "The platform is connected and ready for live rent, payment, and export workflows."
              : showTechnicalDetails
                ? "The app renders safely without service keys, but production workflows unlock once the environment variables are added."
                : "The platform is being prepared for live sign-in and data sync. Please check back shortly."}
          </CardDescription>
        </div>
        <Badge variant={ready ? "success" : "warning"}>{ready ? "Connected" : "Setup needed"}</Badge>
      </CardHeader>
      {ready ? null : (
        <CardContent className="grid gap-2 text-sm text-slate-600">
          {showTechnicalDetails ? (
            <>
              <p>`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` power Google sign-in with Clerk.</p>
              <p>`NEXT_PUBLIC_SUPABASE_URL` and a publishable key power data, exports, and realtime.</p>
              <p>`SUPABASE_SERVICE_ROLE_KEY` enables protected exports and the rent sync cron route.</p>
              <p>`CRON_SECRET` secures the Vercel monthly auto-generation endpoint.</p>
            </>
          ) : (
            <>
              <p>Sign-in and live records are temporarily unavailable while the production services finish connecting.</p>
              <p>The interface stays online so the launch URL, branding, and installable app shell remain available.</p>
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}
