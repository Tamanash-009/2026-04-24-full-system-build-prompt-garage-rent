"use client";

import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatMonthLabel } from "@/lib/utils";

export function RentTrendChart({
  data
}: {
  data: Array<{ month: string; paid: number; pending: number }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Rent trend</CardTitle>
      </CardHeader>
      <CardContent className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="paid" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0891b2" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#0891b2" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="pending" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" vertical={false} />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonthLabel}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              tickFormatter={(value) => `₹${Math.round(value / 1000)}k`}
              tickLine={false}
              axisLine={false}
              tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
              labelFormatter={(value) => formatMonthLabel(value)}
              contentStyle={{
                borderRadius: "18px",
                border: "1px solid rgba(255,255,255,0.7)",
                background: "rgba(255,255,255,0.92)"
              }}
            />
            <Area type="monotone" dataKey="paid" stroke="#0891b2" fill="url(#paid)" strokeWidth={3} />
            <Area
              type="monotone"
              dataKey="pending"
              stroke="#f59e0b"
              fill="url(#pending)"
              strokeWidth={3}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
