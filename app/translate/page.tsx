"use client"

import { useState } from "react"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Clock, Utensils, Send, Bot, User } from "lucide-react"

// Mock data for demonstration
const mockPrescriptionData = {
  medication: {
    name: "Lisinopril",
    dosage: "10mg",
    frequency: "Once daily",
    purpose: "Blood pressure management and heart health protection",
  },
  usage: {
    instructions: "Take one tablet by mouth every morning with or without food",
    duration: "Continue as prescribed by your doctor",
    timing: "Best taken at the same time each day",
  },
  sideEffects: {
    common: ["Dry cough", "Dizziness", "Headache", "Fatigue"],
    severe: ["Severe allergic reaction", "Kidney problems", "High potassium levels"],
  },
  restrictions: {
    foods: ["Avoid excessive salt", "Limit potassium-rich foods (bananas, oranges)", "Moderate alcohol consumption"],
    activities: ["Avoid sudden position changes", "Stay hydrated", "Monitor blood pressure regularly"],
  },
}

const mockChatHistory = [
  {
    role: "assistant",
    content:
      "I've analyzed your prescription for Lisinopril. This medication is commonly used to treat high blood pressure and protect your heart. Below you'll find a detailed explanation of how to use it safely.",
  },
]

export default function TranslatePage() {
  const [chatMessages, setChatMessages] = useState(mockChatHistory)
  const [inputMessage, setInputMessage] = useState("")

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return

    const newMessages = [
      ...chatMessages,
      { role: "user", content: inputMessage },
      {
        role: "assistant",
        content:
          "Thank you for your question. Based on your prescription, I can provide more specific guidance. This is a simulated response - in a real application, this would be powered by AI analysis of your specific medication.",
      },
    ]

    setChatMessages(newMessages)
    setInputMessage("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-black">
      <SidebarNavigation />

      <div className="md:ml-64">
        <main className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Your HealthWise Explanation</h1>
              <p className="text-muted-foreground">
                Here's a simplified breakdown of your prescription in plain language.
              </p>
            </div>

            {/* AI Introduction Message */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-medium">AI Assistant</p>
                    <p className="text-sm text-muted-foreground">{mockChatHistory[0].content}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medication Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-primary rounded flex items-center justify-center">
                    <span className="text-xs font-bold text-primary-foreground">Rx</span>
                  </div>
                  <span>Medication Overview</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Medication</h4>
                    <p className="text-lg font-medium">{mockPrescriptionData.medication.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {mockPrescriptionData.medication.dosage} - {mockPrescriptionData.medication.frequency}
                    </p>
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">Purpose</h4>
                    <p className="text-sm">{mockPrescriptionData.medication.purpose}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage Instructions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-primary" />
                  <span>How to Take This Medication</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Instructions</h4>
                  <p className="text-sm text-muted-foreground">{mockPrescriptionData.usage.instructions}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Timing</h4>
                  <p className="text-sm text-muted-foreground">{mockPrescriptionData.usage.timing}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Duration</h4>
                  <p className="text-sm text-muted-foreground">{mockPrescriptionData.usage.duration}</p>
                </div>
              </CardContent>
            </Card>

            {/* Side Effects */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <AlertTriangle className="h-5 w-5 text-accent" />
                  <span>Potential Side Effects</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Common Side Effects</h4>
                  <div className="flex flex-wrap gap-2">
                    {mockPrescriptionData.sideEffects.common.map((effect, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
                <Separator />
                <div>
                  <h4 className="font-medium mb-3 text-destructive">
                    Serious Side Effects (Contact Doctor Immediately)
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {mockPrescriptionData.sideEffects.severe.map((effect, index) => (
                      <Badge key={index} variant="destructive" className="text-xs">
                        {effect}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Dietary Restrictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Utensils className="h-5 w-5 text-primary" />
                  <span>Dietary & Lifestyle Guidelines</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-medium mb-3">Food & Drink Considerations</h4>
                  <ul className="space-y-2">
                    {mockPrescriptionData.restrictions.foods.map((restriction, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {restriction}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium mb-3">Activity Guidelines</h4>
                  <ul className="space-y-2">
                    {mockPrescriptionData.restrictions.activities.map((activity, index) => (
                      <li key={index} className="text-sm text-muted-foreground flex items-start">
                        <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        {activity}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Chat Interface */}
            <Card>
              <CardHeader>
                <CardTitle>Ask Follow-up Questions</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Have questions about your medication? Ask me anything for more detailed explanations.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <ScrollArea className="h-64 w-full border rounded-md p-4">
                  <div className="space-y-4">
                    {chatMessages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`flex items-start space-x-2 max-w-[80%] ${message.role === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                        >
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                              message.role === "user" ? "bg-secondary" : "bg-primary"
                            }`}
                          >
                            {message.role === "user" ? (
                              <User className="h-4 w-4 text-secondary-foreground" />
                            ) : (
                              <Bot className="h-4 w-4 text-primary-foreground" />
                            )}
                          </div>
                          <div
                            className={`rounded-lg p-3 ${
                              message.role === "user"
                                ? "bg-secondary text-secondary-foreground"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                <div className="flex space-x-2">
                  <Input
                    placeholder="Ask about dosage, side effects, interactions..."
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  )
}
