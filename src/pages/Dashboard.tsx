import { useState, useMemo } from "react"
import { BuildCard } from "@/components/BuildCard"
import { BuildFilter } from "@/components/BuildFilter"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Activity, CheckCircle, XCircle, Clock, Settings, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useJenkinsBuilds, useJenkinsConnection } from "@/hooks/useJenkinsData"
import { useJenkinsConfig } from "@/hooks/useJenkinsConfig"

export default function Dashboard() {
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)
  const { isConfigured } = useJenkinsConfig()
  const { data: isConnected } = useJenkinsConnection()
  const { data: builds, isLoading, error } = useJenkinsBuilds()

  const filteredBuilds = useMemo(() => {
    if (!builds) return []
    if (!selectedStatus) return builds
    return builds.filter(build => build.status === selectedStatus)
  }, [builds, selectedStatus])

  const buildCounts = useMemo(() => {
    if (!builds) {
      return {
        total: 0,
        success: 0,
        failure: 0,
        running: 0,
        aborted: 0
      }
    }
    
    return {
      total: builds.length,
      success: builds.filter(b => b.status === 'SUCCESS').length,
      failure: builds.filter(b => b.status === 'FAILURE').length,
      running: builds.filter(b => b.status === 'RUNNING').length,
      aborted: builds.filter(b => b.status === 'ABORTED').length
    }
  }, [builds])

  const successRate = buildCounts.total > 0 ? Math.round((buildCounts.success / buildCounts.total) * 100) : 0

  if (!isConfigured) {
    return (
      <div className="p-6">
        <Alert>
          <Settings className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Jenkins ist noch nicht konfiguriert. Bitte konfigurieren Sie zuerst Ihre Jenkins-Verbindung.</span>
            <Button asChild variant="outline" size="sm">
              <Link to="/settings">Zu den Einstellungen</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (isConnected === false) {
    return (
      <div className="p-6">
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>Verbindung zu Jenkins fehlgeschlagen. Überprüfen Sie Ihre Konfiguration.</span>
            <Button asChild variant="outline" size="sm">
              <Link to="/settings">Einstellungen überprüfen</Link>
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Jenkins Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Übersicht über alle Build-Prozesse und deren Status
            {isLoading && (
              <span className="inline-flex items-center ml-2">
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
                Lade Daten...
              </span>
            )}
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

      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>
            Fehler beim Laden der Build-Daten: {error.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Filter */}
      <BuildFilter
        selectedStatus={selectedStatus}
        onStatusFilter={setSelectedStatus}
        buildCounts={buildCounts}
      />

      {/* Build-Karten */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="ml-2">Lade Jenkins-Builds...</span>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBuilds.map((build) => (
            <BuildCard key={build.id} build={build} />
          ))}
        </div>
      )}

      {!isLoading && filteredBuilds.length === 0 && builds && builds.length > 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Keine Builds mit dem gewählten Status gefunden.
          </p>
        </div>
      )}

      {!isLoading && (!builds || builds.length === 0) && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">
            Keine Builds gefunden. Überprüfen Sie Ihre Jenkins-Konfiguration.
          </p>
        </div>
      )}
    </div>
  )
}
