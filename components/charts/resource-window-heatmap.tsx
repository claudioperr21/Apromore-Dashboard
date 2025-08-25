"use client"

const windows = ["Salesforce", "Email", "Calendar", "Slack", "Excel", "Browser"]
const resources = ["John S.", "Sarah J.", "Mike C.", "Lisa R.", "David K.", "Emma W."]

const heatmapData = [
  [45, 23, 12, 18, 15, 32],
  [38, 28, 15, 22, 12, 28],
  [42, 19, 18, 16, 20, 35],
  [35, 25, 14, 20, 18, 30],
  [40, 22, 16, 19, 14, 33],
  [37, 26, 13, 21, 16, 29],
]

export function ResourceWindowHeatmap() {
  const maxValue = Math.max(...heatmapData.flat())

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[500px]">
        <div className="grid grid-cols-7 gap-1 text-sm">
          <div></div>
          {windows.map((window) => (
            <div key={window} className="p-2 text-center font-medium text-xs">
              {window}
            </div>
          ))}

          {resources.map((resource, resourceIndex) => (
            <>
              <div key={resource} className="p-2 font-medium text-xs flex items-center">
                {resource}
              </div>
              {heatmapData[resourceIndex].map((value, windowIndex) => {
                const intensity = value / maxValue
                return (
                  <div
                    key={`${resourceIndex}-${windowIndex}`}
                    className="p-2 text-center text-xs font-medium rounded"
                    style={{
                      backgroundColor: `rgba(236, 72, 153, ${intensity})`,
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
