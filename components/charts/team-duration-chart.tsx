"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { team: "Sales - Enterprise", duration: 2.4 },
  { team: "Sales - SMB", duration: 1.8 },
  { team: "Sales - Inside", duration: 3.2 },
  { team: "Account Mgrs - Ent", duration: 2.1 },
  { team: "Account Mgrs - SMB", duration: 1.9 },
  { team: "Analytics Team", duration: 2.7 },
  { team: "Customer Support", duration: 4.1 },
  { team: "Operations", duration: 1.6 },
]

export function TeamDurationChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="team" angle={-45} textAnchor="end" height={80} fontSize={12} />
          <YAxis label={{ value: "Hours", angle: -90, position: "insideLeft" }} />
          <Tooltip formatter={(value) => [`${value}h`, "Duration"]} />
          <Bar dataKey="duration" fill="#ec4899" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
