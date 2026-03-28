import { useState } from "react"
import type { DashboardFilters, PeriodPreset } from "@/app/models/types"
import { getVehicles } from "@/app/services/dataService"
import { Button } from "@/views/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/views/components/ui/select"
import { Input } from "@/views/components/ui/input"
import { Label } from "@/views/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/views/components/ui/card"
import { FilterX } from "lucide-react"

interface AdvancedFiltersProps {
  onFilterChange: (filters: DashboardFilters) => void
  onReset: () => void
}

const vehicles = [
  { id: "all", label: "Todos os Veículos" },
  ...getVehicles().map((vehicle) => ({
    id: vehicle.id,
    label: `${vehicle.model} - ${vehicle.plate}`,
  })),
]

const periods: Array<{ id: PeriodPreset; label: string }> = [
  { id: "all", label: "Todo o período" },
  { id: "9d", label: "Últimos 9 dias" },
  { id: "30d", label: "Últimos 30 dias" },
  { id: "90d", label: "Últimos 90 dias" },
  { id: "custom", label: "Personalizado" },
]

const statuses = [
  { id: "all", label: "Todos os Status" },
  { id: "active", label: "Em Operação" },
  { id: "maintenance", label: "Em Manutenção" },
  { id: "inactive", label: "Inativo" },
]

function toInputDate(date: Date) {
  return date.toISOString().split("T")[0]
}

function buildPeriodRange(period: PeriodPreset) {
  if (period === "all") {
    return { dateFrom: "", dateTo: "" }
  }

  if (period === "custom") {
    return { dateFrom: "", dateTo: "" }
  }

  const today = new Date()
  const days = Number.parseInt(period.replace("d", ""), 10)
  const start = new Date(today)
  start.setDate(today.getDate() - (days - 1))

  return {
    dateFrom: toInputDate(start),
    dateTo: toInputDate(today),
  }
}

export function AdvancedFilters({ onFilterChange, onReset }: AdvancedFiltersProps) {
  const [filters, setFilters] = useState<DashboardFilters>(() => ({
    period: "90d",
    vehicle: "all",
    status: "all",
    ...buildPeriodRange("90d"),
  }))

  const handleFilterChange = (key: keyof DashboardFilters, value: string) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFilterChange(newFilters)
  }

  const handlePeriodChange = (period: PeriodPreset) => {
    const nextFilters: DashboardFilters = {
      ...filters,
      period,
      ...buildPeriodRange(period),
    }
    setFilters(nextFilters)
    onFilterChange(nextFilters)
  }

  const handleManualDateChange = (key: "dateFrom" | "dateTo", value: string) => {
    const nextFilters: DashboardFilters = {
      ...filters,
      period: "custom",
      [key]: value,
    }
    setFilters(nextFilters)
    onFilterChange(nextFilters)
  }

  const handleReset = () => {
    const emptyFilters: DashboardFilters = {
      period: "90d",
      vehicle: "all",
      status: "all",
      ...buildPeriodRange("90d"),
    }
    setFilters(emptyFilters)
    onFilterChange(emptyFilters)
    onReset()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Filtros Avançados</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
          <div className="space-y-2">
            <Label htmlFor="period">Período</Label>
            <Select value={filters.period} onValueChange={(value) => handlePeriodChange(value as PeriodPreset)}>
              <SelectTrigger id="period">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {periods.map((period) => (
                  <SelectItem key={period.id} value={period.id}>
                    {period.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-from">Data Inicial</Label>
            <Input
              id="date-from"
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleManualDateChange("dateFrom", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date-to">Data Final</Label>
            <Input
              id="date-to"
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleManualDateChange("dateTo", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="vehicle">Veículo</Label>
            <Select value={filters.vehicle} onValueChange={(v) => handleFilterChange("vehicle", v)}>
              <SelectTrigger id="vehicle">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {vehicles.map((v) => (
                  <SelectItem key={v.id} value={v.id}>
                    {v.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={filters.status} onValueChange={(s) => handleFilterChange("status", s)}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button
              onClick={handleReset}
              variant="outline"
              size="sm"
              className="w-full"
            >
              <FilterX className="mr-2 h-4 w-4" />
              Limpar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
