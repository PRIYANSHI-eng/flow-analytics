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
    <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const isPositive = card.change >= 0;
        return (
          <Card 
            key={index} 
            className="stat-card border-l-4 border-l-primary/50 dark:border-l-primary/70 bg-gradient-to-br from-card to-card/50 dark:from-card dark:to-card/80"
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground dark:text-muted-foreground/90">
                {card.title}
              </CardTitle>
              <div className="p-2.5 rounded-xl bg-primary/10 dark:bg-primary/20">
                <span className="text-2xl">{card.icon}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold tracking-tight text-foreground mb-2">{card.value}</div>
              <div className="flex items-center gap-1.5 text-xs">
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${
                  isPositive 
                    ? "bg-emerald-100 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400" 
                    : "bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-400"
                }`}>
                  {isPositive ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  <span className="font-medium">
                    {isPositive ? "+" : ""}
                    {card.change.toFixed(1)}%
                  </span>
                </div>
                <span className="text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
