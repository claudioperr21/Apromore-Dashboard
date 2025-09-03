"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

const data = [
  { team: "Sales - Enterprise", frequency: 45 },
  { team: "Sales - SMB", frequency: 38 },
  { team: "Sales - Inside", frequency: 52 },
  { team: "Account Mgrs - Ent", frequency: 29 },
  { team: "Account Mgrs - SMB", frequency: 34 },
  { team: "Analytics Team", frequency: 41 },
  { team: "Customer Support", frequency: 67 },
  { team: "Operations", frequency: 23 },
]

const teamColors = {
  "Sales - Enterprise": "#4E79A7",
  "Sales - SMB": "#F28E2B",
  "Sales - Inside": "#E15759",
  "Account Mgrs - Ent": "#76B7B2",
  "Account Mgrs - SMB": "#59A14F",
  "Analytics Team": "#EDC948",
  "Customer Support": "#B07AA1",
  Operations: "#FF9DA7",
}

export function TeamActivityChart() {
  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="team" angle={-45} textAnchor="end" height={80} fontSize={12} />
          <YAxis />
          <Tooltip />
          <Bar dataKey="frequency" fill="#0891b2" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
