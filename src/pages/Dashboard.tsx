
import { useState, useMemo } from "react"
import { BuildCard, Build } from "@/components/BuildCard"
import { BuildFilter } from "@/components/BuildFilter"
import { mockBuilds } from "@/data/mockBuilds"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity, CheckCircle, XCircle, Clock } from "lucide-react"

export default function Dashboard() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  const filteredBuilds = useMemo(() => {
    if (!selectedStatus) return mockBuilds
    return mockBuilds.filter(build => build.status === selectedStatus)
  }, [selectedStatus])

  const buildCounts = useMemo(() => {
    return {
      total: mockBuilds.length,
      success: mockBuilds.filter(b => b.status === 'SUCCESS').length,
      failure: mockBuilds.filter(b => b.status === 'FAILURE').length,
      running: mockBuilds.filter(b => b.status === 'RUNNING').length,
      aborted: mockBuilds.filter(b => b.status === 'ABORTED').length
    }
  }, [])

  const successRate = Math.round((buildCounts.success / buildCounts.total) * 100)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Jenkins Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Übersicht über alle Build-Prozesse und deren Status
          </p>
        </div>
      </div>

      {/* Metriken-Karten */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Gesamte Builds</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{buildCounts.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Erfolgreich</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{buildCounts.success}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Fehlgeschlagen</CardTitle>
            <XCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{buildCounts.failure}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Erfolgsrate</CardTitle>
            <Clock className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{successRate}%</div>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <BuildFilter
        selectedStatus={selectedStatus}
        onStatusFilter={setSelectedStatus}
        buildCounts={buildCounts}
      />

      {/* Build-Karten */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredBuilds.map((build) => (
          <BuildCard key={build.id} build={build} />
        ))}
      </div>

      {filteredBuilds.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Keine Builds mit dem gewählten Status gefunden.
          </p>
        </div>
      )}
    </div>
  )
}
