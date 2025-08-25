"use client"

const steps = ["Login", "Search", "Create Case", "Update Status", "Add Notes", "Close Case"]
const teams = ["Sales - Ent", "Sales - SMB", "Inside Sales", "Acct Mgrs", "Analytics", "Support", "Operations"]

const heatmapData = [
  [12, 8, 15, 6, 9, 18, 4],
  [9, 12, 11, 8, 7, 22, 6],
  [15, 18, 20, 12, 14, 25, 8],
  [8, 10, 12, 15, 11, 19, 7],
  [6, 7, 9, 8, 12, 16, 5],
  [10, 13, 16, 11, 9, 21, 6],
]

export function StepsTeamHeatmap() {
  const maxValue = Math.max(...heatmapData.flat())

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        <div className="grid grid-cols-8 gap-1 text-sm">
          <div></div>
          {teams.map((team) => (
            <div key={team} className="p-2 text-center font-medium text-xs">
              {team}
            </div>
          ))}

          {steps.map((step, stepIndex) => (
            <>
              <div key={step} className="p-2 font-medium text-xs flex items-center">
                {step}
              </div>
              {heatmapData[stepIndex].map((value, teamIndex) => {
                const intensity = value / maxValue
                return (
                  <div
                    key={`${stepIndex}-${teamIndex}`}
                    className="p-2 text-center text-xs font-medium rounded"
                    style={{
                      backgroundColor: `rgba(8, 145, 178, ${intensity})`,
                      color: intensity > 0.5 ? "white" : "black",
                    }}
                  >
                    {value}
                  </div>
                )
              })}
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
