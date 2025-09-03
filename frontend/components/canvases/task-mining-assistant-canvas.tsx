"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { useSupabaseData } from "@/hooks/use-supabase-data"

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function TaskMiningAssistantCanvas() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hello! I\'m your AI-powered Task Mining Assistant. I can analyze your process data, identify bottlenecks, and provide intelligent insights about your workflow. What would you like to know?',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  
  const { 
    data, 
    amadeusData, 
    amadeusCaseStats, 
    amadeusAgentStats,
    getTeamStats,
    getResourceStats,
    getWindowStats,
    getActivityStats
  } = useSupabaseData()

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      // Call the AI backend
      const response = await fetch('https://dashboard-backend-2024.fly.dev/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputValue,
          context: {
            hasSalesforceData: data && data.length > 0,
            hasAmadeusData: amadeusData && amadeusData.length > 0,
            teamCount: getTeamStats().length,
            resourceCount: getResourceStats().length
          }
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (result.success) {
        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: result.data.response,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        throw new Error(result.error || 'Failed to get AI response')
      }
    } catch (error) {
      console.error('Error calling AI backend:', error)
      
      // Fallback to simulated response if AI fails
      const fallbackResponse = generateFallbackResponse(inputValue)
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, assistantMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const generateFallbackResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()
    
    // Team performance analysis
    if (input.includes('team') || input.includes('performance')) {
      const teamStats = getTeamStats()
      const topTeam = teamStats.sort((a, b) => b.count - a.count)[0]
      return `Based on the data, ${topTeam?.team || 'the top team'} has the highest activity count with ${topTeam?.count || 0} activities. The average duration per activity is ${Math.round(topTeam?.avgDuration || 0)} seconds.`
    }
    
    // Resource utilization
    if (input.includes('resource') || input.includes('utilization')) {
      const resourceStats = getResourceStats()
      const topResource = resourceStats.sort((a, b) => b.count - a.count)[0]
      return `The most active resource is ${topResource?.resource || 'unknown'} with ${topResource?.count || 0} activities. They spend an average of ${Math.round(topResource?.avgDuration || 0)} seconds per activity.`
    }
    
    // Application usage
    if (input.includes('application') || input.includes('window') || input.includes('app')) {
      const windowStats = getWindowStats()
      const topApp = windowStats.sort((a, b) => b.totalDuration - a.totalDuration)[0]
      return `The most used application is ${topApp?.window || 'unknown'} with ${topApp?.totalDuration || 0} total seconds of usage and ${topApp?.totalClicks || 0} total clicks.`
    }
    
    // Process analysis
    if (input.includes('process') || input.includes('workflow')) {
      const activityStats = getActivityStats()
      const topActivity = activityStats.sort((a, b) => b.totalDuration - a.totalDuration)[0]
      return `The most time-consuming activity is "${topActivity?.activity || 'unknown'}" with ${topActivity?.totalDuration || 0} total seconds. This might be a bottleneck in your process.`
    }
    
    // Amadeus specific analysis
    if (input.includes('amadeus') || input.includes('case')) {
      if (amadeusCaseStats.length > 0) {
        const topCase = amadeusCaseStats.sort((a, b) => b.total_duration - a.total_duration)[0]
        return `In the Amadeus dataset, case ${topCase?.Case_ID || 'unknown'} has the longest duration with ${Math.round(topCase?.total_duration || 0)} seconds and ${topCase?.total_activities || 0} activities.`
      }
      return "I can see you have Amadeus process mining data available. Ask me about case analysis, agent performance, or application usage patterns."
    }
    
    // General help
    if (input.includes('help') || input.includes('what can you do')) {
      return `I can help you analyze:
• Team performance metrics
• Resource utilization patterns
• Application usage statistics
• Process workflow analysis
• Case duration insights
• Bottleneck identification

Just ask me about any of these areas!`
    }
    
    // Default response
    return "I can help you analyze your task mining data. Try asking about team performance, resource utilization, application usage, or process analysis. What specific insights are you looking for?"
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot className="h-5 w-5" />
          Task Mining Assistant
          <Sparkles className="h-4 w-4 text-yellow-500" />
        </CardTitle>
        <CardDescription>
          AI-powered insights for your process mining data. Powered by GPT-4, I can analyze performance, identify bottlenecks, and suggest workflow optimizations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Chat Messages */}
        <ScrollArea className="h-96 w-full rounded-md border p-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                {message.role === 'assistant' && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                {message.role === 'user' && (
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-muted rounded-lg px-3 py-2">
                  <p className="text-sm">🤖 AI is thinking...</p>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        
        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your process data, bottlenecks, or workflow optimization..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isLoading || !inputValue.trim()}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        
        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputValue("How is my team performing?")}
            disabled={isLoading}
          >
            Team Performance
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputValue("What are the bottlenecks in my process?")}
            disabled={isLoading}
          >
            Find Bottlenecks
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputValue("Which applications are used most?")}
            disabled={isLoading}
          >
            App Usage
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInputValue("Analyze my Amadeus workflow")}
            disabled={isLoading}
          >
            Amadeus Analysis
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
