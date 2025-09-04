"use client";

import { useProcessMiningData } from "@/hooks/use-process-mining-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, CheckCircle, AlertCircle, Database, FileText } from "lucide-react";

export function DataLoader() {
  const { loaded, loading, error, getStatistics, reload } = useProcessMiningData();

  const handleReload = () => {
    reload();
  };

  const getStatusIcon = () => {
    if (loading) return <Loader2 className="h-5 w-5 animate-spin text-blue-600" />;
    if (error) return <AlertCircle className="h-5 w-5 text-red-600" />;
    if (loaded) return <CheckCircle className="h-5 w-5 text-green-600" />;
    return <Database className="h-5 w-5 text-gray-600" />;
  };

  const getStatusText = () => {
    if (loading) return "Loading data...";
    if (error) return "Error loading data";
    if (loaded) return "Data loaded successfully";
    return "No data loaded";
  };

  const getStatusColor = () => {
    if (loading) return "bg-blue-100 text-blue-800";
    if (error) return "bg-red-100 text-red-800";
    if (loaded) return "bg-green-100 text-green-800";
    return "bg-gray-100 text-gray-800";
  };

  const renderStatistics = () => {
    if (!loaded) return null;

    try {
      const stats = getStatistics();
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          {/* Amadeus Statistics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Amadeus Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Records:</span>
                <Badge variant="secondary">{stats.amadeus.totalRecords.toLocaleString()}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Cases:</span>
                <Badge variant="secondary">{stats.amadeus.totalCases.toLocaleString()}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Agents:</span>
                <Badge variant="secondary">{stats.amadeus.totalAgents.toLocaleString()}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Duration:</span>
                <Badge variant="secondary">
                  {Math.round(stats.amadeus.totalDuration / 60)} min
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Applications:</span>
                <Badge variant="secondary">{stats.amadeus.applications.length}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Salesforce Statistics */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Database className="h-4 w-4" />
                Salesforce Data
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Records:</span>
                <Badge variant="secondary">{stats.salesforce.totalRecords.toLocaleString()}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Teams:</span>
                <Badge variant="secondary">{stats.salesforce.totalTeams.toLocaleString()}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Resources:</span>
                <Badge variant="secondary">{stats.salesforce.totalResources.toLocaleString()}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Cases:</span>
                <Badge variant="secondary">{stats.salesforce.totalCases.toLocaleString()}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Duration:</span>
                <Badge variant="secondary">
                  {Math.round(stats.salesforce.totalDuration)} hours
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    } catch (error) {
      return (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            Statistics calculation failed. Please reload the data.
          </p>
        </div>
      );
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getStatusIcon()}
            <div>
              <CardTitle className="text-lg">Process Mining Data</CardTitle>
              <CardDescription>
                {getStatusText()}
              </CardDescription>
            </div>
          </div>
          <Badge className={getStatusColor()}>
            {getStatusText()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm font-medium">Error:</span>
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}

        {renderStatistics()}

        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleReload}
            disabled={loading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {loading ? 'Loading...' : 'Reload Data'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
