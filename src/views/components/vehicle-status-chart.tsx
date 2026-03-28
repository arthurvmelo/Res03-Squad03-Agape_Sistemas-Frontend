import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts"
import type { VehicleStatusPoint } from "@/app/models/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/views/components/ui/card"
import { Badge } from "@/views/components/ui/badge"

export function VehicleStatusChart({
  data,
  operationalPercentage,
}: {
  data: VehicleStatusPoint[]
  operationalPercentage: number
}) {
  const hasData = data.some((item) => item.value > 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status dos Veículos</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center gap-4 md:flex-row">
          <div className="w-full md:w-1/2">
            {hasData ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex h-[250px] items-center justify-center text-sm text-muted-foreground">
                Nenhum veículo encontrado para os filtros atuais.
              </div>
            )}
          </div>

          <div className="space-y-3 md:w-1/2">
            <div className="rounded-lg border border-green-200 bg-green-50 p-3">
              <p className="text-sm font-medium text-gray-700">Disponibilidade da Frota</p>
              <p className="text-2xl font-bold text-green-600">{operationalPercentage}% Operacional</p>
              <p className="text-xs text-gray-600">Frota em bom estado operacional</p>
            </div>

            <div className="space-y-2">
              {data.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{item.name}</span>
                  </div>
                  <Badge variant="secondary">{item.value}%</Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
