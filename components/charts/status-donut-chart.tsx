"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const COLORS = ["#0891b2", "#f59e0b"];

export function StatusDonutChart({
  data
}: {
  data: Array<{ name: string; value: number }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Paid vs pending</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-[1fr_0.8fr] md:items-center">
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                stroke="transparent"
              >
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid gap-3">
          {data.map((entry, index) => (
            <div key={entry.name} className="rounded-2xl border border-white/50 bg-white/70 p-4">
              <div className="flex items-center gap-3">
                <span
                  className="h-3.5 w-3.5 rounded-full"
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                />
                <p className="text-sm font-semibold text-slate-900">{entry.name}</p>
              </div>
              <p className="mt-2 text-2xl font-semibold">{formatCurrency(entry.value)}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
