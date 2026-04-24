"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { markElectricityPaidAction } from "@/lib/actions/operations";
import { Button } from "@/components/ui/button";

export function MarkElectricityPaidButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await markElectricityPaidAction({ id });
          if (result?.error) {
            toast.error(result.error);
            return;
          }

          toast.success(result?.success ?? "Electricity bill updated.");
        })
      }
    >
      {isPending ? "Saving..." : "Mark paid"}
    </Button>
  );
}
