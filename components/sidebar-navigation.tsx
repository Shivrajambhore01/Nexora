"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Home, FileText, History, User, Menu, X } from "lucide-react"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Translate", href: "/translate", icon: FileText },
  { name: "History", href: "/history", icon: History },
  { name: "Profile", href: "/profile", icon: User },
]

export function SidebarNavigation() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
    
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden bg-card"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 border-r border-sidebar-border transform transition-transform duration-200 ease-in-out md:translate-x-0",
          "bg-[#10151c]", // 🌟 Gradient applied here
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full text-white">
          {/* Logo */}
          <div className="flex items-center px-6 py-8">
            <div className="flex items-center space-x-2">
              <img 
                src="/logo.png" // 🔥 Replace with your logo path
                alt="HealthSpeak Logo"
                className="h-12 w-12 rounded-md"
              />
              <span className="text-xl font-bold">HealthSpeak</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    isActive
                      ? "bg-teal-600 text-white"
                      : "text-gray-300 hover:bg-teal-700 hover:text-white",
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/20">
            <p className="text-xs text-gray-400 text-center">HealthSpeak v1.0</p>
          </div>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  )
}
