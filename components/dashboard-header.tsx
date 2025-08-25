export function DashboardHeader() {
  return (
    <header className="border-b bg-card">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Salesforce Task Mining Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Interactive insights into Salesforce Office Case Handling with a teams-first perspective
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-primary rounded-full"></div>
            <span className="text-sm text-muted-foreground">Live Data</span>
          </div>
        </div>
      </div>
    </header>
  )
}
