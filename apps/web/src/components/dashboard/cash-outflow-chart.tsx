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
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">Cash Outflow by Amount Range</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="range" 
              tick={{ fontSize: 12 }}
              stroke="#888"
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              stroke="#888"
              label={{ value: 'Total Amount ($)', angle: -90, position: 'insideLeft', style: { fontSize: 12 } }}
              tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              stroke="#888"
              label={{ value: 'Invoice Count', angle: 90, position: 'insideRight', style: { fontSize: 12 } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'white', 
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                fontSize: 12
              }}
              formatter={(value: number, name: string) => {
                if (name === 'Total Amount') {
                  return `$${value.toLocaleString()}`;
                }
                return value;
              }}
            />
            <Legend wrapperStyle={{ fontSize: 12 }} />
            <Bar 
              yAxisId="left"
              dataKey="amount" 
              fill="#3b82f6" 
              name="Total Amount"
              radius={[4, 4, 0, 0]}
            />
            <Bar 
              yAxisId="right"
              dataKey="count" 
              fill="#10b981" 
              name="Invoice Count"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
