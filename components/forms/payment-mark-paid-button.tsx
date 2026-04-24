"use client";

import { useTransition } from "react";
import { toast } from "sonner";

import { markRentPaidAction } from "@/lib/actions/operations";
import { Button } from "@/components/ui/button";

export function PaymentMarkPaidButton({
  tenancyId,
  month,
  amount
}: {
  tenancyId: string;
  month: string;
  amount: number;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const result = await markRentPaidAction({
            tenancyId,
            month,
            amount
          });

          if (result?.error) {
            toast.error(result.error);
            return;
          }

          toast.success(result?.success ?? "Rent payment updated.");
        })
      }
    >
      {isPending ? "Saving..." : "Mark paid"}
    </Button>
  );
}
