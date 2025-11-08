"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import type { StatsOverview } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export function OverviewCards() {
  const [stats, setStats] = useState<StatsOverview | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        console.log('🔄 Fetching stats from:', `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/stats`);
        const data = await apiClient.getStats();
        console.log('✅ Stats data received:', data);
        setStats(data);
      } catch (error) {
        console.error("❌ Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-32 mb-1" />
              <Skeleton className="h-4 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const cards = [
    {
      title: "Total Spend (YTD)",
      value: `$${stats.totalSpend.current.toLocaleString()}`,
      change: stats.totalSpend.change,
      icon: "💰",
    },
    {
      title: "Total Invoices Processed",
      value: stats.invoiceCount.current.toLocaleString(),
      change: stats.invoiceCount.change,
      icon: "📄",
    },
    {
      title: "Documents Uploaded",
      value: stats.documentUploads.current.toLocaleString(),
      change: stats.documentUploads.change,
      icon: "📁",
    },
    {
      title: "Average Invoice Value",
      value: `$${stats.avgInvoiceValue.current.toLocaleString()}`,
      change: stats.avgInvoiceValue.change,
      icon: "📊",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const isPositive = card.change >= 0;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <span className="text-2xl">{card.icon}</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
              <div className="flex items-center gap-1 text-xs text-gray-600 mt-1">
                {isPositive ? (
                  <TrendingUp className="h-3 w-3 text-green-600" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-600" />
                )}
                <span className={isPositive ? "text-green-600" : "text-red-600"}>
                  {isPositive ? "+" : ""}
                  {card.change.toFixed(1)}%
                </span>
                <span>vs last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
