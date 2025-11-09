import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { OverviewCards } from "@/components/dashboard/overview-cards";
import { InvoiceTrendChart } from "@/components/dashboard/invoice-trend-chart";
import { VendorSpendChart } from "@/components/dashboard/vendor-spend-chart";
import { CategorySpendChart } from "@/components/dashboard/category-spend-chart";
import { CashOutflowChart } from "@/components/dashboard/cash-outflow-chart";
import { InvoicesTable } from "@/components/dashboard/invoices-table";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Page Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Welcome back! Here's your invoice analytics overview
          </p>
        </div>

        {/* Overview Cards */}
        <OverviewCards />

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <InvoiceTrendChart />
          <VendorSpendChart />
          <CategorySpendChart />
          <CashOutflowChart />
        </div>

        {/* Invoices Table */}
        <InvoicesTable />
      </div>
    </DashboardLayout>
  );
}
