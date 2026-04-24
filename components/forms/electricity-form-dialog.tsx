"use client";

import { useState, useTransition } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { createElectricityBillAction } from "@/lib/actions/operations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TenancyRecord } from "@/lib/types";

export function ElectricityFormDialog({ tenancies }: { tenancies: TenancyRecord[] }) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [tenancyId, setTenancyId] = useState("");
  const [initialReading, setInitialReading] = useState("0");
  const [currentReading, setCurrentReading] = useState("0");
  const [billAmount, setBillAmount] = useState("0");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4" />
          Add electricity bill
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Record electricity</DialogTitle>
          <DialogDescription>
            Enter meter readings and GarageFlow will calculate the units used automatically.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              const result = await createElectricityBillAction({
                tenancyId,
                initialReading: Number(initialReading),
                currentReading: Number(currentReading),
                billAmount: Number(billAmount)
              });

              if (result?.error) {
                toast.error(result.error);
                return;
              }

              toast.success(result?.success ?? "Electricity bill recorded.");
              setOpen(false);
              setTenancyId("");
              setInitialReading("0");
              setCurrentReading("0");
              setBillAmount("0");
            });
          }}
        >
          <div className="grid gap-2">
            <Label>Tenancy</Label>
            <Select value={tenancyId} onValueChange={setTenancyId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose tenancy" />
              </SelectTrigger>
              <SelectContent>
                {tenancies.map((tenancy) => (
                  <SelectItem key={tenancy.id} value={tenancy.id}>
                    {tenancy.user?.name ?? "Unknown"} - {tenancy.property?.name ?? "Unknown"}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="initialReading">Initial reading</Label>
              <Input
                id="initialReading"
                type="number"
                min="0"
                value={initialReading}
                onChange={(event) => setInitialReading(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="currentReading">Current reading</Label>
              <Input
                id="currentReading"
                type="number"
                min="0"
                value={currentReading}
                onChange={(event) => setCurrentReading(event.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="billAmount">Bill amount</Label>
            <Input
              id="billAmount"
              type="number"
              min="0"
              value={billAmount}
              onChange={(event) => setBillAmount(event.target.value)}
              required
            />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending || !tenancyId}>
              {isPending ? "Saving..." : "Save electricity bill"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
