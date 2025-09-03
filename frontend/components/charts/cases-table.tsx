import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const casesData = [
  {
    caseId: "CASE-001",
    team: "Sales - Enterprise",
    resource: "John Smith",
    status: "Closed",
    minDuration: "1.2h",
    medianDuration: "2.1h",
    avgDuration: "2.3h",
    maxDuration: "4.1h",
  },
  {
    caseId: "CASE-002",
    team: "Customer Support",
    resource: "Sarah Johnson",
    status: "In Progress",
    minDuration: "0.8h",
    medianDuration: "1.9h",
    avgDuration: "2.1h",
    maxDuration: "3.8h",
  },
  {
    caseId: "CASE-003",
    team: "Sales - SMB",
    resource: "Mike Chen",
    status: "Resolved",
    minDuration: "1.5h",
    medianDuration: "2.4h",
    avgDuration: "2.6h",
    maxDuration: "4.2h",
  },
  {
    caseId: "CASE-004",
    team: "Analytics Team",
    resource: "Lisa Rodriguez",
    status: "New",
    minDuration: "0.9h",
    medianDuration: "1.7h",
    avgDuration: "1.9h",
    maxDuration: "3.1h",
  },
]

export function CasesTable() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Case ID</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Resource</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Min Duration</TableHead>
            <TableHead>Median Duration</TableHead>
            <TableHead>Avg Duration</TableHead>
            <TableHead>Max Duration</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {casesData.map((case_) => (
            <TableRow key={case_.caseId}>
              <TableCell className="font-medium">{case_.caseId}</TableCell>
              <TableCell>{case_.team}</TableCell>
              <TableCell>{case_.resource}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    case_.status === "Closed"
                      ? "bg-green-100 text-green-800"
                      : case_.status === "In Progress"
                        ? "bg-blue-100 text-blue-800"
                        : case_.status === "Resolved"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {case_.status}
                </span>
              </TableCell>
              <TableCell>{case_.minDuration}</TableCell>
              <TableCell>{case_.medianDuration}</TableCell>
              <TableCell>{case_.avgDuration}</TableCell>
              <TableCell>{case_.maxDuration}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
