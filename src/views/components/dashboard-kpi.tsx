import { Card, CardContent, CardHeader, CardTitle } from "@/views/components/ui/card"

interface KPIData {
  id: string
  title: string
  value: string
  unit: string
  icon: React.ReactNode
  change: number
  trend: "up" | "down" | "neutral"
}

interface DashboardKPIProps {
  data: KPIData[]
}

export function DashboardKPI({ data }: DashboardKPIProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {data.map((item) => (
        <Card key={item.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
            <p className="text-xs text-muted-foreground">
              {item.unit}
            </p>
            <div className={`mt-2 flex items-center text-xs ${
              item.trend === "up" ? "text-green-600" : 
              item.trend === "down" ? "text-red-600" : 
              "text-gray-600"
            }`}>
              {item.trend === "up" && "↑"}
              {item.trend === "down" && "↓"}
              {item.trend === "neutral" && "→"}
              {" "}{Math.abs(item.change)}% vs período anterior
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
