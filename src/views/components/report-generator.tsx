import type { DashboardFilters } from "@/app/models/types"
import { Button } from "@/views/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/views/components/ui/card"
import { FileDownIcon, Printer } from "lucide-react"

interface ReportGeneratorProps {
  filters?: DashboardFilters
}

export function ReportGenerator({ filters }: ReportGeneratorProps) {
  const handleExportPDF = () => {
    // Implementar exportação para PDF
    console.log("Exportando PDF com filtros:", filters)
    alert("Relatório em PDF será gerado com as informações atuais")
  }

  const handleExportCSV = () => {
    // Implementar exportação para CSV
    console.log("Exportando CSV com filtros:", filters)
    alert("Relatório em CSV será gerado com as informações atuais")
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gerar Relatório</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Exporte a visualização atual do dashboard com todos os filtros aplicados
        </p>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button onClick={handleExportPDF} className="flex-1" variant="default">
            <FileDownIcon className="mr-2 h-4 w-4" />
            Exportar PDF
          </Button>
          <Button onClick={handleExportCSV} className="flex-1" variant="outline">
            <FileDownIcon className="mr-2 h-4 w-4" />
            Exportar CSV
          </Button>
          <Button onClick={handlePrint} className="flex-1" variant="outline">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
