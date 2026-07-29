import { Geist, Geist_Mono, Raleway } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Navbar } from "@/components/navbar";

const raleway = Raleway({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
return (
<html lang="en" suppressHydrationWarning>
<body className={cn(
  "min-h-screen flex flex-col antialiased",
      fontMono.variable,
"font-sans",
      raleway.variable
    )}>
<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
<Navbar />
<main className="flex-1 w-full">
  <div className="mx-auto w-full max-w-screen-2xl px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
    {children}
  </div>
</main>
</ThemeProvider>
<Toaster position="bottom-right" />
</body>
</html>
  )
}