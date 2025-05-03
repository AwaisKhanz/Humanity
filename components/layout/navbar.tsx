"use client"

import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { routes } from "@/app/routes"
import { useAuth } from "@/contexts/auth-context"
import { Avatar } from "@/components/ui/avatar"
import { SearchBar } from "@/components/search/search-bar"

export function Navbar() {
  const { user, logout } = useAuth()

  const menuItems = [
    {
      label: "The Plan",
      href: routes.thePlan,
      items: [{ label: "What are we doing?", href: routes.whatAreWeDoing }],
    },
    {
      label: "Questions",
      href: routes.questions.index,
      items: [{ label: "Question 1", href: routes.questions.question("1") }],
    },
    {
      label: "Authors",
      href: "/authors",
      items: [],
    },
    {
      label: "News",
      href: routes.news.index,
      items: [{ label: "All Posts", href: routes.news.posts }],
    },
    {
      label: "About",
      href: routes.about.index,
      items: [
        { label: "Who is behind it?", href: routes.about.whoIsBehind },
        { label: "Admin", href: routes.about.admin },
      ],
    },
  ]

  return (
    <header className="bg-white border-b sticky top-0 z-10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">Humanity</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-4">
            {/* Add the search bar here */}
            <SearchBar className="mr-4" />

            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Navigation */}
          <div className="md:hidden flex items-center">{/* <MobileMenu routes={routes} user={user} /> */}</div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === "admin" && (
                  <Link href={routes.about.admin}>
                    <Button variant="outline" className="rounded-full">
                      Admin
                    </Button>
                  </Link>
                )}
                <div className="flex items-center gap-2">
                  <Avatar src={user.profileImageUrl} alt={user.name} size="sm" />
                  <span className="hidden md:inline">{user.name}</span>
                </div>
                <Button variant="default" className="rounded-full" onClick={() => logout()}>
                  Logout
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  href="/login"
                  className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log in
                </Link>
                <Link
                  href="/register"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

function NavItemWithDropdown({
  label,
  href,
  items,
}: {
  label: string
  href: string
  items: { label: string; href: string }[]
}) {
  return (
    <div className="relative group">
      <Link href={href} className="flex items-center px-3 py-2 text-sm font-medium hover:text-primary/80">
        {label}
        {items.length > 0 && <ChevronDown className="ml-1 h-4 w-4" />}
      </Link>
      {items.length > 0 && (
        <div className="absolute left-0 mt-1 w-48 bg-white shadow-lg rounded-md overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
          {items.map((item, index) => (
            <Link key={index} href={item.href} className="block px-4 py-2 text-sm hover:bg-gray-100">
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
