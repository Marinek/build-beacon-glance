
import { Badge } from "@/components/ui/badge"

interface BuildFilterProps {
  selectedStatus: string | null
  onStatusFilter: (status: string | null) => void
  buildCounts: {
    total: number
    success: number
    failure: number
    running: number
    aborted: number
  }
}

export function BuildFilter({ selectedStatus, onStatusFilter, buildCounts }: BuildFilterProps) {
  const filterOptions = [
    { status: null, label: 'Alle', count: buildCounts.total, color: 'bg-gray-500' },
    { status: 'SUCCESS', label: 'Erfolgreich', count: buildCounts.success, color: 'bg-green-500' },
    { status: 'FAILURE', label: 'Fehlgeschlagen', count: buildCounts.failure, color: 'bg-red-500' },
    { status: 'RUNNING', label: 'Läuft', count: buildCounts.running, color: 'bg-yellow-500' },
    { status: 'ABORTED', label: 'Abgebrochen', count: buildCounts.aborted, color: 'bg-gray-500' }
  ]

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {filterOptions.map((option) => (
        <Badge
          key={option.status || 'all'}
          variant={selectedStatus === option.status ? "default" : "outline"}
          className={`cursor-pointer px-3 py-2 text-sm ${
            selectedStatus === option.status 
              ? `${option.color} text-white hover:opacity-80` 
              : 'hover:bg-muted'
          }`}
          onClick={() => onStatusFilter(option.status)}
        >
          {option.label} ({option.count})
        </Badge>
      ))}
    </div>
  )
}
