"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Briefcase, Building2, LayoutDashboard, LogOut, Menu, MessageSquare, User, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth-context";

const navItems = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Applications", href: "/applications", icon: Briefcase },
  { name: "Roles", href: "/roles", icon: Briefcase },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "Communications", href: "/communications", icon: MessageSquare },
];

export function AuthNavbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { user, isLoading, logout } = useAuth();

  // Don't show navbar on login page
  if (pathname === "/login") {
    return null;
  }

  // Don't render navbar while auth is loading to prevent flash
  if (isLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 font-bold text-lg tracking-tight">
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <span>JobTrack</span>
          </div>
          <ThemeToggle />
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand + Desktop Nav */}
        <div className="flex items-center gap-8">
          <Link 
            href="/" 
            className="flex items-center gap-2 font-bold text-lg tracking-tight shrink-0"
          >
            <div className="bg-primary text-primary-foreground p-1.5 rounded-md">
              <Briefcase className="w-5 h-5" />
            </div>
            <span>JobTrack</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-accent text-accent-foreground" 
                      : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                  )}
                >
                  <Icon className="w-4 h-4" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {user && (
            <div className="hidden sm:flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <User className="h-3.5 w-3.5" />
                </div>
                <span className="font-medium text-foreground">{user.name}</span>
              </div>
              <div className="h-5 w-px bg-border" />
            </div>
          )}
          <ThemeToggle />
          {user && (
            <Button
              variant="ghost"
              size="icon"
              onClick={logout}
              className="text-muted-foreground hover:text-destructive shrink-0"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden shrink-0"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t bg-background px-4 sm:px-6 py-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                  isActive 
                    ? "bg-accent text-accent-foreground" 
                    : "text-muted-foreground hover:bg-accent/50 hover:text-foreground"
                )}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
          {user && (
            <>
              <div className="border-t my-2" />
              <div className="flex items-center gap-3 px-3 py-2 text-sm text-muted-foreground">
                <User className="w-4 h-4" />
                <span className="font-medium text-foreground">{user.name}</span>
              </div>
              <button
                onClick={() => { setIsOpen(false); logout(); }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
