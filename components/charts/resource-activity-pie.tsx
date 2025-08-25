"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

const data = [
  { name: "John Smith", value: 45 },
  { name: "Sarah Johnson", value: 38 },
  { name: "Mike Chen", value: 32 },
  { name: "Lisa Rodriguez", value: 28 },
  { name: "David Kim", value: 24 },
  { name: "Others", value: 33 },
]

const COLORS = ["#4E79A7", "#F28E2B", "#E15759", "#76B7B2", "#59A14F", "#EDC948"]

export function ResourceActivityPie() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
