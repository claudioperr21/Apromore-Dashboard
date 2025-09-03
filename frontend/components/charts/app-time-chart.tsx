"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { app: "Salesforce CRM", time: 45 },
  { app: "Email Client", time: 23 },
  { app: "Calendar", time: 12 },
  { app: "Slack", time: 18 },
  { app: "Excel", time: 15 },
  { app: "Browser", time: 32 },
]

export function AppTimeChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="app" />
          <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} />
          <Tooltip formatter={(value) => [`${value} min`, "Time"]} />
          <Bar dataKey="time" fill="#a16207" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
