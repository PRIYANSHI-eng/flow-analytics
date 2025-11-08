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
      <div className="space-y-6">
        {/* Debug Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-semibold text-blue-900">
            ℹ️ API URL: {process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001'}
          </p>
          <p className="text-xs text-blue-700 mt-1">
            Open browser console (F12) to see data fetching logs
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
