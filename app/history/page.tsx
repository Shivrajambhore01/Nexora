"use client"

import { useState } from "react"
import { SidebarNavigation } from "@/components/sidebar-navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Eye, Download, Calendar, FileText, Filter } from "lucide-react"

// Mock translation history data
const translationHistory = [
  {
    id: 1,
    documentType: "Prescription",
    documentName: "Lisinopril 10mg",
    dateTranslated: "2024-01-15",
    status: "Completed",
    category: "Blood Pressure",
  },
  {
    id: 2,
    documentType: "Blood Test Results",
    documentName: "Complete Blood Count",
    dateTranslated: "2024-01-12",
    status: "Completed",
    category: "Lab Results",
  },
  {
    id: 3,
    documentType: "MRI Report",
    documentName: "Brain MRI Scan",
    dateTranslated: "2024-01-10",
    status: "Completed",
    category: "Imaging",
  },
  {
    id: 4,
    documentType: "Prescription",
    documentName: "Metformin 500mg",
    dateTranslated: "2024-01-08",
    status: "Completed",
    category: "Diabetes",
  },
  {
    id: 5,
    documentType: "Lab Report",
    documentName: "Lipid Panel",
    dateTranslated: "2024-01-05",
    status: "Completed",
    category: "Lab Results",
  },
  {
    id: 6,
    documentType: "Prescription",
    documentName: "Atorvastatin 20mg",
    dateTranslated: "2024-01-03",
    status: "Completed",
    category: "Cholesterol",
  },
  {
    id: 7,
    documentType: "X-Ray Report",
    documentName: "Chest X-Ray",
    dateTranslated: "2024-01-01",
    status: "Completed",
    category: "Imaging",
  },
  {
    id: 8,
    documentType: "Prescription",
    documentName: "Amoxicillin 875mg",
    dateTranslated: "2023-12-28",
    status: "Completed",
    category: "Antibiotics",
  },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case "Completed":
      return "default"
    case "Processing":
      return "secondary"
    case "Failed":
      return "destructive"
    default:
      return "default"
  }
}

const getCategoryColor = (category: string) => {
  const colors = {
    "Blood Pressure": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "Lab Results": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Imaging: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Diabetes: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
    Cholesterol: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
    Antibiotics: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  }
  return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
}

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterCategory, setFilterCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

  // Filter and search logic
  const filteredHistory = translationHistory.filter((item) => {
    const matchesSearch =
      item.documentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.documentType.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === "all" || item.category === filterCategory
    return matchesSearch && matchesCategory
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage)

  // Get unique categories for filter
  const categories = Array.from(new Set(translationHistory.map((item) => item.category)))

  return (
    <div className="min-h-screen bg-background">
      <SidebarNavigation />

      <div className="md:ml-64">
        <main className="p-6">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Translation History</h1>
              <p className="text-muted-foreground">View and manage all your translated medical documents.</p>
            </div>

            {/* Search and Filter Controls */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search documents..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterCategory} onValueChange={setFilterCategory}>
                    <SelectTrigger className="w-full md:w-48">
                      <Filter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Translation History Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {paginatedHistory.map((item) => (
                <Card key={item.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{item.documentType}</CardTitle>
                      </div>
                      <Badge variant={getStatusColor(item.status) as any}>{item.status}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-sm mb-1">{item.documentName}</h4>
                      <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(item.dateTranslated).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div>
                      <Badge className={`text-xs ${getCategoryColor(item.category)}`}>{item.category}</Badge>
                    </div>

                    <div className="flex space-x-2 pt-2">
                      <Button size="sm" className="flex-1">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredHistory.length)} of{" "}
                      {filteredHistory.length} results
                    </p>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        Previous
                      </Button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      ))}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Empty State */}
            {filteredHistory.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium mb-2">No translations found</h3>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || filterCategory !== "all"
                      ? "Try adjusting your search or filter criteria."
                      : "Start by translating your first medical document."}
                  </p>
                  <Button>
                    <FileText className="h-4 w-4 mr-2" />
                    New Translation
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
