"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { apiClient } from "@/lib/api-client";
import type { VendorSpend } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export function VendorSpendChart() {
  const [data, setData] = useState<VendorSpend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const vendors = await apiClient.getTopVendors(10);
        setData(vendors);
      } catch (error) {
        console.error("Failed to fetch vendor spend:", error);
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
          🏢 Top Vendors by Spend
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart 
            data={data} 
            layout="vertical"
            margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.005 264)" className="dark:opacity-20" />
            <XAxis 
              type="number" 
              tick={{ fontSize: 12, fill: "oklch(0.50 0.01 264)" }}
              stroke="oklch(0.92 0.005 264)"
              className="dark:stroke-border"
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <YAxis 
              type="category" 
              dataKey="vendorName" 
              tick={{ fontSize: 12, fill: "oklch(0.50 0.01 264)" }}
              stroke="oklch(0.92 0.005 264)"
              className="dark:stroke-border"
              width={90}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'oklch(1 0 0)', 
                border: '1px solid oklch(0.92 0.005 264)',
                borderRadius: '12px',
                fontSize: 12,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Total Spend']}
            />
            <Bar 
              dataKey="totalSpend" 
              fill="oklch(0.6 0.22 264)" 
              radius={[0, 8, 8, 0]}
              label={{ 
                position: 'right',
                formatter: (value: unknown) => {
                  const numValue = typeof value === 'number' ? value : 0;
                  return `${((numValue / data.reduce((sum, item) => sum + item.totalSpend, 0)) * 100).toFixed(1)}%`;
                },
                fontSize: 11,
                fill: "oklch(0.50 0.01 264)"
              }}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
