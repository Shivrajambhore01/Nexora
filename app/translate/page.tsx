"use client"

import { useState, useEffect } from "react"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, Clock, Utensils, Send, Bot, User, Loader2 } from "lucide-react" // ✅ Added Loader2

const mockChatHistory = [
  {
    role: "assistant",
    content:
      "I've analyzed your prescription for Lisinopril. This medication is commonly used to treat high blood pressure and protect your heart. Below you'll find a detailed explanation of how to use it safely.",
  },
]

function transformGoogleNLPApiData(apiData) {
  const findEntity = (type) => apiData.entities.find((e) => e.type === type)?.name || ""

  return {
    medication: {
      name: findEntity("MEDICINE"),
      dosage: findEntity("STRENGTH"),
      frequency: findEntity("FREQUENCY"),
      purpose: "For blood pressure and heart health",
    },
    usage: {
      instructions: "Take one tablet by mouth every morning",
      duration: "Continue as prescribed by your doctor",
      timing: "Best taken at the same time each day",
    },
    sideEffects: {
      common: ["Dry cough", "Dizziness", "Headache", "Fatigue"],
      severe: ["Severe allergic reaction", "Kidney problems", "High potassium levels"],
    },
    restrictions: {
      foods: ["Avoid excessive salt", "Limit potassium-rich foods", "Moderate alcohol"],
      activities: ["Avoid sudden position changes", "Stay hydrated"],
    },
  }
}

export default function TranslatePage() {
  const [prescriptionData, setPrescriptionData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [chatMessages, setChatMessages] = useState(mockChatHistory)
  const [inputMessage, setInputMessage] = useState("")
  const [saving, setSaving] = useState(false) // ✅ For save button state

  useEffect(() => {
    const fetchPrescriptionDirectly = async () => {
      setIsLoading(true)
      setError(null)

      const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY
      const API_URL = `https://language.googleapis.com/v1/documents:analyzeEntities?key=${API_KEY}`

      const prescriptionText = "Take Lisinopril 10mg once daily for high blood pressure."

      try {
        if (!API_KEY) {
          throw new Error(
            "API Key is missing. Make sure you have a .env.local file with NEXT_PUBLIC_GOOGLE_API_KEY."
          )
        }

        const response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            document: {
              content: prescriptionText,
              type: "PLAIN_TEXT",
            },
            encodingType: "UTF8",
          }),
        })

        if (!response.ok) {
          const errorBody = await response.json()
          throw new Error(`Google API Error: ${errorBody.error.message}`)
        }

        const data = await response.json()
        const formattedData = transformGoogleNLPApiData(data)
        setPrescriptionData(formattedData)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchPrescriptionDirectly()
  }, [])

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

  const handleSave = async () => {
    if (!prescriptionData) return
    setSaving(true)
    try {
      const response = await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentType: "Prescription",
          documentName: prescriptionData.medication?.name || "Unknown",
          dateTranslated: new Date().toISOString(),
          status: "Completed",
          category: "Blood Pressure",
        }),
      })

      const data = await response.json()
      if (data.success) {
        alert("Saved to MongoDB! ✅")
      } else {
        alert("Failed to save ❌")
      }
    } catch (err) {
      console.error(err)
      alert("Error saving ❌")
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <AlertTriangle className="h-12 w-12 text-destructive" />
        <p className="ml-4 text-destructive">{error}</p>
      </div>
    )
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

            {/* AI Introduction */}
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
            {prescriptionData && (
              <>
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
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Medication
                        </h4>
                        <p className="text-lg font-medium">{prescriptionData.medication.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {prescriptionData.medication.dosage} - {prescriptionData.medication.frequency}
                        </p>
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                          Purpose
                        </h4>
                        <p className="text-sm">{prescriptionData.medication.purpose}</p>
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
                      <p className="text-sm text-muted-foreground">{prescriptionData.usage.instructions}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Timing</h4>
                      <p className="text-sm text-muted-foreground">{prescriptionData.usage.timing}</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Duration</h4>
                      <p className="text-sm text-muted-foreground">{prescriptionData.usage.duration}</p>
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
                        {prescriptionData.sideEffects.common.map((effect, index) => (
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
                        {prescriptionData.sideEffects.severe.map((effect, index) => (
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
                        {prescriptionData.restrictions.foods.map((restriction, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground flex items-start"
                          >
                            <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {restriction}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium mb-3">Activity Guidelines</h4>
                      <ul className="space-y-2">
                        {prescriptionData.restrictions.activities.map((activity, index) => (
                          <li
                            key={index}
                            className="text-sm text-muted-foreground flex items-start"
                          >
                            <span className="w-2 h-2 bg-accent rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            {activity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* ✅ Save Button */}
                <div className="flex justify-end">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-4 px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg"
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              </>
            )}

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
                      <div
                        key={index}
                        className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`flex items-start space-x-2 max-w-[80%] ${
                            message.role === "user" ? "flex-row-reverse space-x-reverse" : ""
                          }`}
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
