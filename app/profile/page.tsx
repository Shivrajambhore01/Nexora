import { SidebarNavigation } from "@/components/sidebar-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Calendar, FileText, Shield, Settings } from "lucide-react"

// Mock user data
const userData = {
  name: "Dr. Sarah Johnson",
  email: "sarah.johnson@email.com",
  avatar: "/professional-woman-doctor.png",
  memberSince: "January 2024",
  totalTranslations: 47,
  accountType: "Professional",
  lastActive: "2 hours ago",
}

const recentActivity = [
  { action: "Translated prescription", document: "Metformin prescription", time: "2 hours ago" },
  { action: "Viewed translation", document: "Blood test results", time: "1 day ago" },
  { action: "Translated prescription", document: "Lisinopril prescription", time: "3 days ago" },
  { action: "Updated profile", document: "Account settings", time: "1 week ago" },
]

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-900 via-slate-900 to-black">
      <SidebarNavigation />

      <div className="md:ml-64">
        <main className="p-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Profile</h1>
              <p className="text-muted-foreground">Manage your account settings and view your activity.</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Profile Information */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center space-x-4">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src={userData.avatar || "/placeholder.svg"} alt={userData.name} />
                        <AvatarFallback className="text-lg">
                          {userData.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <h3 className="text-xl font-semibold">{userData.name}</h3>
                        <p className="text-muted-foreground">{userData.email}</p>
                        <Badge variant="secondary" className="w-fit">
                          {userData.accountType}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Member Since</p>
                          <p className="text-sm text-muted-foreground">{userData.memberSince}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Total Translations</p>
                          <p className="text-sm text-muted-foreground">{userData.totalTranslations}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <Button>
                        <Settings className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Button>
                      <Button variant="outline">Change Password</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity, index) => (
                        <div key={index} className="flex items-center justify-between py-2">
                          <div className="flex items-center space-x-3">
                            <div className="w-2 h-2 bg-primary rounded-full"></div>
                            <div>
                              <p className="text-sm font-medium">{activity.action}</p>
                              <p className="text-xs text-muted-foreground">{activity.document}</p>
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Account Stats */}
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Shield className="h-5 w-5" />
                      <span>Account Status</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Shield className="h-8 w-8 text-primary" />
                      </div>
                      <p className="font-medium">Verified Account</p>
                      <p className="text-sm text-muted-foreground">Professional healthcare provider</p>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Last Active</span>
                        <span className="text-muted-foreground">{userData.lastActive}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Account Type</span>
                        <span className="text-muted-foreground">{userData.accountType}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <FileText className="h-4 w-4 mr-2" />
                      New Translation
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Calendar className="h-4 w-4 mr-2" />
                      View History
                    </Button>
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
