// Tipos de Domínio da Aplicação

export interface Vehicle {
  id: string
  plate: string
  model: string
  status: "active" | "maintenance" | "inactive" | "available"
  km: number
  lastMaintenance: Date
}

export interface Driver {
  id: string
  name: string
  license: string
  status: "active" | "inactive"
}

export interface Trip {
  id: string
  vehicleId: string
  driverId: string
  startDate: Date
  endDate: Date
  kmTraveled: number
  fuelConsumed: number
  cost: number
}

export interface FuelPurchase {
  id: string
  vehicleId: string
  stationName: string
  date: Date
  liters: number
  pricePerLiter: number
  totalCost: number
}

export interface DashboardMetrics {
  averageConsumption: number
  totalKMThisMonth: number
  tripsThisMonth: number
  fleetOperationalPercentage: number
}

export type PeriodPreset = "all" | "9d" | "30d" | "90d" | "custom"

export interface DashboardFilters {
  dateFrom: string
  dateTo: string
  period: PeriodPreset
  vehicle: string
  status: string
}

export interface VehicleSeries {
  key: string
  label: string
  color: string
}

export interface ConsumptionPoint {
  date: string
  [key: string]: string | number | null
}

export interface KilometerPoint {
  month: string
  [key: string]: string | number
}

export interface FuelStationPoint {
  station: string
  price: number
  volume: number
}

export interface VehicleStatusPoint {
  name: string
  value: number
  color: string
}

export interface DashboardTrends {
  averageConsumption: number
  totalKM: number
  trips: number
}

export interface FleetDashboardData {
  metrics: DashboardMetrics
  trends: DashboardTrends
  consumptionData: ConsumptionPoint[]
  fuelStationData: FuelStationPoint[]
  kilometerData: KilometerPoint[]
  statusData: VehicleStatusPoint[]
  vehicleSeries: VehicleSeries[]
}
