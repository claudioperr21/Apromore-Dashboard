import { Card } from "@/components/ui/card"
import { Users, Activity, Clock, Folder, MousePointer, Keyboard, List, TrendingUp, Gauge, Pause } from "lucide-react"

interface MetricTileProps {
  title: string
  value: string
  subtitle?: string
  icon: string
  color: string
}

const iconMap = {
  users: Users,
  activity: Activity,
  clock: Clock,
  folder: Folder,
  "mouse-pointer": MousePointer,
  keyboard: Keyboard,
  list: List,
  "trending-up": TrendingUp,
  gauge: Gauge,
  pause: Pause,
}

export function MetricTile({ title, value, subtitle, icon, color }: MetricTileProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Activity

  return (
    <Card className="p-6 border-l-4" style={{ borderLeftColor: `var(--${color})` }}>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold" style={{ color: `var(--${color})` }}>
            {value}
          </p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <IconComponent className="h-8 w-8 text-muted-foreground" />
      </div>
    </Card>
  )
}
