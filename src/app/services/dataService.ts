// Serviço de Dados da Aplicação

import type {
  ConsumptionPoint,
  DashboardFilters,
  DashboardMetrics,
  DashboardTrends,
  FleetDashboardData,
  FuelPurchase,
  FuelStationPoint,
  KilometerPoint,
  Trip,
  Vehicle,
  VehicleSeries,
  VehicleStatusPoint,
} from "@/app/models/types"

const TODAY = new Date("2026-03-25T12:00:00")

const vehicleSeries: VehicleSeries[] = [
  { key: "scania", label: "Scania", color: "#8884d8" },
  { key: "volvo", label: "Volvo", color: "#82ca9d" },
  { key: "man", label: "MAN", color: "#ffc658" },
]

const vehicleKeyMap: Record<string, string> = {
  v1: "scania",
  v2: "volvo",
  v3: "man",
}

const statusColors: Record<string, string> = {
  "Em Operação": "#22c55e",
  Manutenção: "#f97316",
  Disponível: "#3b82f6",
  Inativo: "#ef4444",
}

export const mockVehicles: Vehicle[] = [
  {
    id: "v1",
    plate: "ABC-1234",
    model: "Scania R440",
    status: "active",
    km: 245000,
    lastMaintenance: new Date("2026-02-15"),
  },
  {
    id: "v2",
    plate: "XYZ-5678",
    model: "Volvo FH16",
    status: "active",
    km: 189000,
    lastMaintenance: new Date("2026-03-01"),
  },
  {
    id: "v3",
    plate: "DEF-9012",
    model: "MAN TGX",
    status: "maintenance",
    km: 156000,
    lastMaintenance: new Date("2026-03-10"),
  },
  {
    id: "v4",
    plate: "GHI-3456",
    model: "Mercedes Actros",
    status: "available",
    km: 98000,
    lastMaintenance: new Date("2026-03-05"),
  },
  {
    id: "v5",
    plate: "JKL-7890",
    model: "DAF XF",
    status: "inactive",
    km: 301000,
    lastMaintenance: new Date("2025-12-20"),
  },
]

const tripSeeds = [
  ["t1", "v1", "2026-03-24", 420, 39, 498],
  ["t2", "v2", "2026-03-23", 380, 34, 439],
  ["t3", "v1", "2026-03-21", 510, 46, 593],
  ["t4", "v2", "2026-03-19", 360, 32, 414],
  ["t5", "v3", "2026-03-16", 280, 29, 385],
  ["t6", "v1", "2026-03-14", 470, 43, 551],
  ["t7", "v2", "2026-03-12", 395, 36, 468],
  ["t8", "v1", "2026-03-09", 450, 41, 529],
  ["t9", "v3", "2026-03-05", 260, 27, 359],
  ["t10", "v2", "2026-02-28", 405, 37, 481],
  ["t11", "v1", "2026-02-24", 490, 44, 568],
  ["t12", "v2", "2026-02-18", 370, 34, 442],
  ["t13", "v3", "2026-02-12", 310, 31, 411],
  ["t14", "v1", "2026-02-05", 520, 48, 621],
  ["t15", "v2", "2026-01-28", 390, 35, 455],
  ["t16", "v1", "2026-01-20", 460, 42, 540],
  ["t17", "v3", "2026-01-12", 295, 28, 370],
  ["t18", "v2", "2025-12-30", 415, 38, 493],
  ["t19", "v1", "2025-12-15", 505, 45, 579],
  ["t20", "v3", "2025-11-28", 275, 26, 341],
] as const

const stationRotation = [
  { name: "Vibra Energia", price: 5.78 },
  { name: "BR Distribuidora", price: 5.85 },
  { name: "Ipiranga", price: 5.92 },
  { name: "Shell", price: 5.95 },
  { name: "Chevron", price: 6.02 },
]

export const mockTrips: Trip[] = tripSeeds.map(([id, vehicleId, date, kmTraveled, fuelConsumed, cost], index) => ({
  id,
  vehicleId,
  driverId: `d${(index % 3) + 1}`,
  startDate: new Date(`${date}T08:00:00`),
  endDate: new Date(`${date}T18:00:00`),
  kmTraveled,
  fuelConsumed,
  cost,
}))

export const mockFuelPurchases: FuelPurchase[] = tripSeeds.map(
  ([id, vehicleId, date, , fuelConsumed], index) => {
    const station = stationRotation[index % stationRotation.length]
    const liters = fuelConsumed + (index % 4)

    return {
      id: `f-${id}`,
      vehicleId,
      stationName: station.name,
      date: new Date(`${date}T07:00:00`),
      liters,
      pricePerLiter: station.price,
      totalCost: Number((liters * station.price).toFixed(2)),
    }
  }
)

function formatDateLabel(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
  }).format(date)
}

function formatMonthLabel(date: Date) {
  const month = new Intl.DateTimeFormat("pt-BR", { month: "long" }).format(date)
  return month.charAt(0).toUpperCase() + month.slice(1)
}

function subtractDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() - days)
  return next
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
}

function resolveDateRange(filters: DashboardFilters) {
  if (filters.period === "custom" && filters.dateFrom && filters.dateTo) {
    return {
      start: startOfDay(new Date(filters.dateFrom)),
      end: endOfDay(new Date(filters.dateTo)),
    }
  }

  if (filters.period === "all") {
    return {
      start: startOfDay(new Date("2025-11-01T00:00:00")),
      end: endOfDay(TODAY),
    }
  }

  const days = Number.parseInt(filters.period.replace("d", ""), 10)
  return {
    start: startOfDay(subtractDays(TODAY, days - 1)),
    end: endOfDay(TODAY),
  }
}

function resolveVehicleIds(filters: DashboardFilters) {
  return mockVehicles
    .filter((vehicle) => {
      const matchesVehicle = filters.vehicle === "all" || vehicle.id === filters.vehicle
      const matchesStatus = filters.status === "all" || vehicle.status === filters.status
      return matchesVehicle && matchesStatus
    })
    .map((vehicle) => vehicle.id)
}

function filterTrips(filters: DashboardFilters, start: Date, end: Date) {
  const allowedVehicleIds = new Set(resolveVehicleIds(filters))
  return mockTrips.filter(
    (trip) =>
      allowedVehicleIds.has(trip.vehicleId) &&
      trip.startDate >= start &&
      trip.startDate <= end
  )
}

function filterFuelPurchases(filters: DashboardFilters, start: Date, end: Date) {
  const allowedVehicleIds = new Set(resolveVehicleIds(filters))
  return mockFuelPurchases.filter(
    (purchase) =>
      allowedVehicleIds.has(purchase.vehicleId) &&
      purchase.date >= start &&
      purchase.date <= end
  )
}

function filterVehicles(filters: DashboardFilters) {
  const allowedVehicleIds = new Set(resolveVehicleIds(filters))
  return mockVehicles.filter((vehicle) => allowedVehicleIds.has(vehicle.id))
}

function calculateOperationalPercentage(vehicles: Vehicle[]) {
  if (vehicles.length === 0) {
    return 0
  }

  const operational = vehicles.filter(
    (vehicle) => vehicle.status === "active" || vehicle.status === "available"
  ).length
  return Math.round((operational / vehicles.length) * 100)
}

function percentageChange(current: number, previous: number) {
  if (previous === 0) {
    return 0
  }
  return Number((((current - previous) / previous) * 100).toFixed(1))
}

function calculateMetricsFromTrips(
  trips: Trip[],
  vehicles: Vehicle[]
): DashboardMetrics {
  const totalCost = trips.reduce((sum, trip) => sum + trip.cost, 0)
  const totalKM = trips.reduce((sum, trip) => sum + trip.kmTraveled, 0)

  return {
    averageConsumption: totalKM === 0 ? 0 : Number((totalCost / totalKM).toFixed(2)),
    totalKMThisMonth: totalKM,
    tripsThisMonth: trips.length,
    fleetOperationalPercentage: calculateOperationalPercentage(vehicles),
  }
}

function calculateTrends(filters: DashboardFilters, currentMetrics: DashboardMetrics): DashboardTrends {
  const currentRange = resolveDateRange(filters)
  const rangeDuration = currentRange.end.getTime() - currentRange.start.getTime()
  const previousEnd = new Date(currentRange.start.getTime() - 1)
  const previousStart = new Date(previousEnd.getTime() - rangeDuration)
  const previousTrips = filterTrips(filters, previousStart, previousEnd)
  const previousVehicles = filterVehicles(filters)
  const previousMetrics = calculateMetricsFromTrips(previousTrips, previousVehicles)

  return {
    averageConsumption: percentageChange(
      currentMetrics.averageConsumption,
      previousMetrics.averageConsumption
    ),
    totalKM: percentageChange(currentMetrics.totalKMThisMonth, previousMetrics.totalKMThisMonth),
    trips: percentageChange(currentMetrics.tripsThisMonth, previousMetrics.tripsThisMonth),
  }
}

function buildConsumptionData(trips: Trip[]): ConsumptionPoint[] {
  const grouped = new Map<string, ConsumptionPoint>()

  for (const trip of trips) {
    const key = formatDateLabel(trip.startDate)
    const vehicleKey = vehicleKeyMap[trip.vehicleId]
    if (!vehicleKey) {
      continue
    }

    if (!grouped.has(key)) {
      grouped.set(key, { date: key })
    }

    const entry = grouped.get(key) ?? { date: key }
    entry[vehicleKey] = Number((trip.cost / trip.kmTraveled).toFixed(2))
    grouped.set(key, entry)
  }

  return Array.from(grouped.values()).sort((left, right) => {
    const [leftDay, leftMonth] = `${left.date}`.split("/").map(Number)
    const [rightDay, rightMonth] = `${right.date}`.split("/").map(Number)
    return new Date(2026, leftMonth - 1, leftDay).getTime() - new Date(2026, rightMonth - 1, rightDay).getTime()
  })
}

function buildFuelStationData(purchases: FuelPurchase[]): FuelStationPoint[] {
  const grouped = new Map<string, { totalCost: number; totalLiters: number }>()

  for (const purchase of purchases) {
    const station = grouped.get(purchase.stationName) ?? { totalCost: 0, totalLiters: 0 }
    station.totalCost += purchase.totalCost
    station.totalLiters += purchase.liters
    grouped.set(purchase.stationName, station)
  }

  return Array.from(grouped.entries())
    .map(([station, values]) => ({
      station,
      price: Number((values.totalCost / values.totalLiters).toFixed(2)),
      volume: Number(values.totalLiters.toFixed(0)),
    }))
    .sort((left, right) => left.price - right.price)
}

function buildKilometerData(trips: Trip[]): KilometerPoint[] {
  const grouped = new Map<string, KilometerPoint>()

  for (const trip of trips) {
    const month = formatMonthLabel(trip.startDate)
    const vehicleKey = vehicleKeyMap[trip.vehicleId]
    if (!vehicleKey) {
      continue
    }

    if (!grouped.has(month)) {
      grouped.set(month, { month })
    }

    const entry = grouped.get(month)!
    const current = typeof entry[vehicleKey] === "number" ? Number(entry[vehicleKey]) : 0
    entry[vehicleKey] = current + trip.kmTraveled
  }

  return Array.from(grouped.values())
}

function buildStatusData(vehicles: Vehicle[]): VehicleStatusPoint[] {
  const total = vehicles.length
  const counts = {
    "Em Operação": vehicles.filter((vehicle) => vehicle.status === "active").length,
    Manutenção: vehicles.filter((vehicle) => vehicle.status === "maintenance").length,
    Disponível: vehicles.filter((vehicle) => vehicle.status === "available").length,
    Inativo: vehicles.filter((vehicle) => vehicle.status === "inactive").length,
  }

  return Object.entries(counts).map(([name, count]) => ({
    name,
    value: total === 0 ? 0 : Math.round((count / total) * 100),
    color: statusColors[name],
  }))
}

export function getVehicles() {
  return mockVehicles
}

export function getFleetDashboardData(filters: DashboardFilters): FleetDashboardData {
  const { start, end } = resolveDateRange(filters)
  const filteredTrips = filterTrips(filters, start, end)
  const filteredPurchases = filterFuelPurchases(filters, start, end)
  const filteredVehicles = filterVehicles(filters)
  const metrics = calculateMetricsFromTrips(filteredTrips, filteredVehicles)

  return {
    metrics,
    trends: calculateTrends(filters, metrics),
    consumptionData: buildConsumptionData(filteredTrips),
    fuelStationData: buildFuelStationData(filteredPurchases),
    kilometerData: buildKilometerData(filteredTrips),
    statusData: buildStatusData(filteredVehicles),
    vehicleSeries,
  }
}
