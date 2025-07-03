
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User, ExternalLink } from "lucide-react"

export interface Build {
  id: string
  jobName: string
  buildNumber: number
  status: 'SUCCESS' | 'FAILURE' | 'RUNNING' | 'ABORTED'
  startTime: string
  duration: number
  author: string
  branch: string
  url: string
}

interface BuildCardProps {
  build: Build
}

const statusColors = {
  SUCCESS: 'bg-green-500',
  FAILURE: 'bg-red-500', 
  RUNNING: 'bg-yellow-500',
  ABORTED: 'bg-gray-500'
}

const statusLabels = {
  SUCCESS: 'Erfolgreich',
  FAILURE: 'Fehlgeschlagen',
  RUNNING: 'Läuft',
  ABORTED: 'Abgebrochen'
}

export function BuildCard({ build }: BuildCardProps) {
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('de-DE')
  }

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">{build.jobName}</CardTitle>
          <Badge 
            className={`${statusColors[build.status]} text-white`}
            variant="secondary"
          >
            {statusLabels[build.status]}
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          Build #{build.buildNumber}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(build.startTime)}</span>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>{formatDuration(build.duration)}</span>
        </div>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{build.author}</span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <Badge variant="outline" className="text-xs">
            {build.branch}
          </Badge>
          <Button variant="outline" size="sm" asChild>
            <a href={build.url} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-4 w-4 mr-1" />
              Jenkins
            </a>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
