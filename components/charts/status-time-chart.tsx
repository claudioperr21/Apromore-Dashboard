"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { status: "New", time: 28 },
  { status: "In Progress", time: 65 },
  { status: "Pending Review", time: 22 },
  { status: "Resolved", time: 15 },
  { status: "Closed", time: 8 },
]

export function StatusTimeChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis label={{ value: "Minutes", angle: -90, position: "insideLeft" }} />
          <Tooltip formatter={(value) => [`${value} min`, "Time"]} />
          <Bar dataKey="time" fill="#4b5563" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
