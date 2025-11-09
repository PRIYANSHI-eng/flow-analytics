"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { apiClient } from "@/lib/api-client";
import type { CashOutflow } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export function CashOutflowChart() {
  const [data, setData] = useState<CashOutflow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const outflow = await apiClient.getCashOutflow();
        setData(outflow);
      } catch (error) {
        console.error("Failed to fetch cash outflow:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="chart-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          💸 Cash Outflow by Amount Range
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 264)" className="dark:opacity-20" />
            <XAxis 
              dataKey="range" 
              tick={{ fontSize: 12, fill: "oklch(0.50 0.01 264)" }}
              stroke="oklch(0.92 0.005 264)"
              className="dark:stroke-border"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12, fill: "oklch(0.50 0.01 264)" }}
              stroke="oklch(0.92 0.005 264)"
              className="dark:stroke-border"
              label={{ value: 'Total Amount ($)', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: "oklch(0.50 0.01 264)" } }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: "oklch(0.50 0.01 264)" }}
              stroke="oklch(0.92 0.005 264)"
              className="dark:stroke-border"
              label={{ value: 'Invoice Count', angle: 90, position: 'insideRight', style: { fontSize: 12, fill: "oklch(0.50 0.01 264)" } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'oklch(1 0 0)', 
                border: '1px solid oklch(0.92 0.005 264)',
                borderRadius: '12px',
                fontSize: 12,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: number, name: string) => {
                if (name === 'Total Amount') {
                  return `$${value.toLocaleString()}`;
                }
                return value;
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
            <Bar 
              yAxisId="left"
              dataKey="amount" 
              fill="oklch(0.6 0.22 264)" 
              name="Total Amount"
              radius={[8, 8, 0, 0]}
            />
            <Bar 
              yAxisId="right"
              dataKey="count" 
              fill="oklch(0.65 0.20 180)" 
              name="Invoice Count"
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
