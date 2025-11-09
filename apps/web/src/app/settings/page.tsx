"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "@/contexts/theme-context";
import { Moon, Sun, Sparkles } from "lucide-react";

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-2">
            Manage your dashboard preferences and customization
          </p>
        </div>

        {/* Theme Settings */}
        <Card className="stat-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Appearance
            </CardTitle>
            <CardDescription>
              Customize how Flow Analytics looks for you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between py-4 px-4 bg-muted/50 dark:bg-muted/30 rounded-lg">
              <div className="space-y-1">
                <h3 className="font-medium">Theme</h3>
                <p className="text-sm text-muted-foreground">
                  Switch between light and dark mode
                </p>
              </div>
              
              <button
                onClick={toggleTheme}
                className="relative inline-flex h-12 w-24 items-center rounded-full bg-primary/10 transition-colors hover:bg-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-background"
                role="switch"
                aria-checked={theme === "dark"}
              >
                <span className="sr-only">Toggle theme</span>
                <span
                  className={`${
                    theme === "dark" ? "translate-x-12" : "translate-x-1"
                  } inline-flex h-10 w-10 transform items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform duration-300`}
                >
                  {theme === "dark" ? (
                    <Moon className="h-5 w-5" />
                  ) : (
                    <Sun className="h-5 w-5" />
                  )}
                </span>
                
                {/* Background icons */}
                <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
                  <Sun className={`h-4 w-4 transition-opacity ${theme === "light" ? "opacity-0" : "opacity-40"}`} />
                  <Moon className={`h-4 w-4 transition-opacity ${theme === "dark" ? "opacity-0" : "opacity-40"}`} />
                </div>
              </button>
            </div>

            {/* Current Theme Display */}
            <div className="flex items-center gap-3 py-3 px-4 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 rounded-lg border border-primary/20">
              <div className={`p-2 rounded-full ${
                theme === "dark" 
                  ? "bg-primary/20 text-primary" 
                  : "bg-primary/10 text-primary"
              }`}>
                {theme === "dark" ? (
                  <Moon className="h-5 w-5" />
                ) : (
                  <Sun className="h-5 w-5" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium">
                  Current theme: <span className="capitalize text-primary">{theme} mode</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  {theme === "dark" 
                    ? "Deep charcoal background with vibrant accents" 
                    : "Clean light background with subtle colors"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* More Features Coming Soon */}
        <Card className="chart-card border-dashed">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-muted-foreground animate-pulse" />
              More Features Coming Soon
            </CardTitle>
            <CardDescription>
              We're working on exciting new features to enhance your experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "Custom Branding", desc: "Add your company logo and colors" },
                { title: "Email Notifications", desc: "Get alerts for important updates" },
                { title: "Data Export", desc: "Export your data in multiple formats" },
                { title: "Team Management", desc: "Invite and manage team members" },
                { title: "Advanced Analytics", desc: "More detailed insights and reports" },
                { title: "API Access", desc: "Integrate with external systems" },
              ].map((feature, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-lg bg-gradient-to-br from-muted/40 to-muted/20 dark:from-muted/20 dark:to-muted/10 border border-border/50"
                >
                  <h4 className="font-medium text-sm mb-1">{feature.title}</h4>
                  <p className="text-xs text-muted-foreground">{feature.desc}</p>
                </div>
              ))}
            </div>
            
            <div className="mt-6 p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
              <p className="text-sm text-center text-muted-foreground">
                💡 Have a feature request? We'd love to hear from you!
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
