"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { apiClient } from "@/lib/api-client";
import type { CategorySpend } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

const COLORS = ['oklch(0.6 0.22 264)', 'oklch(0.65 0.20 180)', 'oklch(0.7 0.18 310)', 'oklch(0.75 0.16 140)', 'oklch(0.68 0.19 40)', 'oklch(0.72 0.22 310)', 'oklch(0.78 0.18 140)', 'oklch(0.73 0.21 40)'];

export function CategorySpendChart() {
  const [data, setData] = useState<CategorySpend[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const categories = await apiClient.getCategorySpend();
        setData(categories);
      } catch (error) {
        console.error("Failed to fetch category spend:", error);
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

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);

    if (percent < 0.05) return null; // Don't show labels for small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card className="chart-card">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          🎯 Spend by Category
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data as any}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={105}
              fill="#8884d8"
              dataKey="amount"
              nameKey="category"
              strokeWidth={2}
              stroke="oklch(1 0 0)"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'oklch(1 0 0)', 
                border: '1px solid oklch(0.92 0.005 264)',
                borderRadius: '12px',
                fontSize: 12,
                boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
              }}
              formatter={(value: number) => `$${value.toLocaleString()}`}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ fontSize: 12, paddingTop: 16 }}
              formatter={(value, entry: any) => `${value} (${entry.payload.percentage.toFixed(1)}%)`}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
