import { useMemo, useState } from "react"
import type { DashboardFilters } from "@/app/models/types"
import { getFleetDashboardData } from "@/app/services/dataService"
import { AppSidebar } from "@/views/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/views/components/ui/breadcrumb"
import { Separator } from "@/views/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/views/components/ui/sidebar"
import { DashboardKPI } from "@/views/components/dashboard-kpi"
import { AdvancedFilters } from "@/views/components/advanced-filters"
import { ConsumptionChart, FuelStationChart, KilometrageChart } from "@/views/components/fleet-charts"
import { VehicleStatusChart } from "@/views/components/vehicle-status-chart"
import { ReportGenerator } from "@/views/components/report-generator"
import { Fuel, Map, TrendingUp } from "lucide-react"

export default function Dashboard() {
  const [filters, setFilters] = useState<DashboardFilters>({
    dateFrom: "",
    dateTo: "",
    period: "90d",
    vehicle: "all",
    status: "all",
  })

  const dashboardData = useMemo(() => getFleetDashboardData(filters), [filters])

  const handleFilterChange = (newFilters: DashboardFilters) => {
    setFilters(newFilters)
  }

  const handleResetFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      period: "90d",
      vehicle: "all",
      status: "all",
    })
  }

  const kpiData = [
    {
      id: "consumption",
      title: "Média de Consumo",
      value: `R$ ${dashboardData.metrics.averageConsumption.toFixed(2).replace(".", ",")}`,
      unit: "por KM",
      icon: <Fuel className="h-4 w-4 text-yellow-600" />,
      change: dashboardData.trends.averageConsumption,
      trend: dashboardData.trends.averageConsumption >= 0 ? "up" as const : "down" as const,
    },
    {
      id: "kilometers",
      title: "Total de KM Percorridos",
      value: dashboardData.metrics.totalKMThisMonth.toLocaleString("pt-BR"),
      unit: "km no período",
      icon: <Map className="h-4 w-4 text-blue-600" />,
      change: dashboardData.trends.totalKM,
      trend: dashboardData.trends.totalKM >= 0 ? "up" as const : "down" as const,
    },
    {
      id: "trips",
      title: "Viagens Realizadas",
      value: dashboardData.metrics.tripsThisMonth.toLocaleString("pt-BR"),
      unit: "viagens no período",
      icon: <TrendingUp className="h-4 w-4 text-green-600" />,
      change: dashboardData.trends.trips,
      trend: dashboardData.trends.trips >= 0 ? "up" as const : "down" as const,
    },
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem className="hidden md:block">
                <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="hidden md:block" />
              <BreadcrumbItem>
                <BreadcrumbPage>Visão Geral de Frotas</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4">
          {/* KPI Cards */}
          <DashboardKPI data={kpiData} />

          {/* Advanced Filters */}
          <AdvancedFilters onFilterChange={handleFilterChange} onReset={handleResetFilters} />

          {/* Charts Grid */}
          <div className="grid gap-4 lg:grid-cols-4">
            <ConsumptionChart
              data={dashboardData.consumptionData}
              series={dashboardData.vehicleSeries}
            />
            <FuelStationChart data={dashboardData.fuelStationData} />
          </div>

          <div className="grid gap-4">
            <KilometrageChart
              data={dashboardData.kilometerData}
              series={dashboardData.vehicleSeries}
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <VehicleStatusChart
                data={dashboardData.statusData}
                operationalPercentage={dashboardData.metrics.fleetOperationalPercentage}
              />
            </div>
            <div>
              <ReportGenerator filters={filters} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
