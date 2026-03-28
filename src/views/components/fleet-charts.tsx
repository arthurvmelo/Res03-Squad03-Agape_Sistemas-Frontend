import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  BarChart,
} from "recharts"
import type {
  ConsumptionPoint,
  FuelStationPoint,
  KilometerPoint,
  VehicleSeries,
} from "@/app/models/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/views/components/ui/card"

function EmptyState({ message }: { message: string }) {
  return <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">{message}</div>
}

export function ConsumptionChart({
  data,
  series,
}: {
  data: ConsumptionPoint[]
  series: VehicleSeries[]
}) {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Evolução do Consumo (R$/KM)</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState message="Nenhum dado de consumo para os filtros atuais." />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {series.map((item) => (
                <Line key={item.key} type="monotone" dataKey={item.key} stroke={item.color} name={item.label} connectNulls />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

export function FuelStationChart({ data }: { data: FuelStationPoint[] }) {
  return (
    <Card className="col-span-full lg:col-span-2">
      <CardHeader>
        <CardTitle>Preço Médio por Posto (Melhor Custo-Benefício)</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState message="Nenhum abastecimento encontrado para os filtros atuais." />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="station" type="category" width={110} />
              <Tooltip />
              <Bar dataKey="price" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}

export function KilometrageChart({
  data,
  series,
}: {
  data: KilometerPoint[]
  series: VehicleSeries[]
}) {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Quilometragem Percorrida por Veículo (Últimos 6 Meses)</CardTitle>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <EmptyState message="Nenhuma viagem encontrada para os filtros atuais." />
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              {series.map((item) => (
                <Bar key={item.key} dataKey={item.key} fill={item.color} name={item.label} />
              ))}
            </ComposedChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  )
}
