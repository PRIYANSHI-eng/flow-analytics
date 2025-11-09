"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { apiClient } from "@/lib/api-client";
import type { InvoiceTrend } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export function InvoiceTrendChart() {
  const [data, setData] = useState<InvoiceTrend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const trends = await apiClient.getInvoiceTrends();
        setData(trends);
      } catch (error) {
        console.error("Failed to fetch invoice trends:", error);
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
          📈 Invoice Trends (Last 12 Months)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 264)" className="dark:opacity-20" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12, fill: "oklch(0.50 0.01 264)" }}
              stroke="oklch(0.92 0.005 264)"
              className="dark:stroke-border"
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12, fill: "oklch(0.50 0.01 264)" }}
              stroke="oklch(0.92 0.005 264)"
              className="dark:stroke-border"
              label={{ value: 'Invoice Count', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: "oklch(0.50 0.01 264)" } }}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12, fill: "oklch(0.50 0.01 264)" }}
              stroke="oklch(0.92 0.005 264)"
              className="dark:stroke-border"
              label={{ value: 'Total Spend ($)', angle: 90, position: 'insideRight', style: { fontSize: 12, fill: "oklch(0.50 0.01 264)" } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'oklch(1 0 0)', 
                border: '1px solid oklch(0.92 0.005 264)',
                borderRadius: '12px',
                fontSize: 12,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: number) => value.toLocaleString()}
            />
            <Legend wrapperStyle={{ fontSize: 12, paddingTop: 16 }} />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="invoiceCount" 
              stroke="oklch(0.6 0.22 264)" 
              strokeWidth={3}
              name="Invoice Count"
              dot={{ fill: 'oklch(0.6 0.22 264)', r: 5, strokeWidth: 2, stroke: 'white' }}
              activeDot={{ r: 7 }}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="totalSpend" 
              stroke="oklch(0.65 0.20 180)" 
              strokeWidth={3}
              name="Total Spend"
              dot={{ fill: 'oklch(0.65 0.20 180)', r: 5, strokeWidth: 2, stroke: 'white' }}
              activeDot={{ r: 7 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
