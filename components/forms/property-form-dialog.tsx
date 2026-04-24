"use client";

import { useState, useTransition } from "react";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { createPropertyAction } from "@/lib/actions/operations";
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

export function PropertyFormDialog() {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary">
          <PlusCircle className="h-4 w-4" />
          Add property
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create property</DialogTitle>
          <DialogDescription>Add a new garage property before assigning tenancies.</DialogDescription>
        </DialogHeader>
        <form
          className="grid gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              const result = await createPropertyAction({ name, location });
              if (result?.error) {
                toast.error(result.error);
                return;
              }

              toast.success(result?.success ?? "Property created.");
              setName("");
              setLocation("");
              setOpen(false);
            });
          }}
        >
          <div className="grid gap-2">
            <Label htmlFor="propertyName">Property name</Label>
            <Input
              id="propertyName"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="North Gate Garage"
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="propertyLocation">Location</Label>
            <Input
              id="propertyLocation"
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              placeholder="Bengaluru - Indiranagar"
              required
            />
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save property"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
