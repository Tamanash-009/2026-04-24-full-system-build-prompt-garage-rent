"use client";

import { useState, useTransition } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { createTenancyAction } from "@/lib/actions/operations";
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
import type { PropertyRow, UserRow } from "@/lib/types";

export function TenancyFormDialog({
  tenants,
  properties
}: {
  tenants: UserRow[];
  properties: PropertyRow[];
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [userId, setUserId] = useState("");
  const [propertyId, setPropertyId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [advancePaid, setAdvancePaid] = useState("0");
  const [monthlyRent, setMonthlyRent] = useState("0");
  const [status, setStatus] = useState("active");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="h-4 w-4" />
          Add tenancy
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create tenancy</DialogTitle>
          <DialogDescription>
            This also generates all pending rent months from the start date up to the current month.
          </DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              const result = await createTenancyAction({
                userId,
                propertyId,
                startDate,
                advancePaid: Number(advancePaid),
                monthlyRent: Number(monthlyRent),
                status
              });

              if (result?.error) {
                toast.error(result.error);
                return;
              }

              toast.success(result?.success ?? "Tenancy created.");
              setOpen(false);
              setUserId("");
              setPropertyId("");
              setStartDate("");
              setAdvancePaid("0");
              setMonthlyRent("0");
              setStatus("active");
            });
          }}
        >
          <div className="grid gap-2">
            <Label>Tenant</Label>
            <Select value={userId} onValueChange={setUserId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose tenant" />
              </SelectTrigger>
              <SelectContent>
                {tenants.map((tenant) => (
                  <SelectItem key={tenant.id} value={tenant.id}>
                    {tenant.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>Property</Label>
            <Select value={propertyId} onValueChange={setPropertyId}>
              <SelectTrigger>
                <SelectValue placeholder="Choose property" />
              </SelectTrigger>
              <SelectContent>
                {properties.map((property) => (
                  <SelectItem key={property.id} value={property.id}>
                    {property.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Start date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">active</SelectItem>
                  <SelectItem value="paused">paused</SelectItem>
                  <SelectItem value="inactive">inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="advancePaid">Advance paid</Label>
              <Input
                id="advancePaid"
                type="number"
                min="0"
                value={advancePaid}
                onChange={(event) => setAdvancePaid(event.target.value)}
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="monthlyRent">Monthly rent</Label>
              <Input
                id="monthlyRent"
                type="number"
                min="1"
                value={monthlyRent}
                onChange={(event) => setMonthlyRent(event.target.value)}
                required
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isPending || !userId || !propertyId}>
              {isPending ? "Saving..." : "Save tenancy"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
