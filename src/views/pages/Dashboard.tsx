import { useState } from "react"
import { Bar, Line } from "react-chartjs-2"

import {
  dashboardMetrics,
  fuelConsumptionData,
  fuelStationsData,
  initialDashboardFilters,
  kilometrageData,
  lineChartOptions,
  periodOptions,
  stackedBarOptions,
  vehicleOptions,
  verticalBarOptions,
} from "@/app/config/dashboard"
import { DashboardFilterBar } from "@/views/components/dashboard/dashboard-filter-bar"
import { DashboardMetricCard } from "@/views/components/dashboard/dashboard-metric-card"
import { DashboardShellCard } from "@/views/components/dashboard/dashboard-shell-card"
import { DashboardStatusPanel } from "@/views/components/dashboard/dashboard-status-panel"

export default function Dashboard() {
  const [filters, setFilters] = useState(initialDashboardFilters)

  const handleDateChange = (field: "dateFrom" | "dateTo", value: string) => {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  const handleGenerateReport = () => {
    window.alert("Relatorio gerado com a visualizacao atual.")
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex max-w-7xl flex-col space-y-6 p-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold text-slate-900">Gestão de Frota</h1>
            <p className="text-xs text-slate-400">Acompanhe indicadores e desempenho operacional da frota</p>
          </div>

          <DashboardFilterBar
            filters={filters}
            periods={periodOptions}
            vehicles={vehicleOptions}
            onPeriodChange={(value) => setFilters((current) => ({ ...current, period: value }))}
            onVehicleChange={(value) => setFilters((current) => ({ ...current, vehicle: value }))}
            onDateChange={handleDateChange}
            onGenerateReport={handleGenerateReport}
          />
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {dashboardMetrics.map((metric) => (
            <DashboardMetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DashboardShellCard
            title="Evolução do Consumo de Combustível"
            subtitle="Monitoramento mensal do custo operacional"
          >
            <div className="h-[260px] w-full">
              <Line data={fuelConsumptionData} options={lineChartOptions} />
            </div>
          </DashboardShellCard>

          <DashboardShellCard
            title="Postos com Melhor Preço"
            subtitle="Comparativo entre fornecedores ativos"
          >
            <div className="h-[260px] w-full">
              <Bar data={fuelStationsData} options={verticalBarOptions} />
            </div>
          </DashboardShellCard>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DashboardShellCard
            title="Quilometragem Percorrida"
            subtitle="Consolidado mensal por tipo de frota"
          >
            <div className="h-[260px] w-full">
              <Bar data={kilometrageData} options={stackedBarOptions} />
            </div>
          </DashboardShellCard>

          <DashboardStatusPanel />
        </section>
      </div>
    </div>
  )
}
