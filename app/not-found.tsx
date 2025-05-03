import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <div className="relative">
        <div className="text-[200px] font-bold text-gray-100 select-none">404</div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center">
            <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M60 20C60 20 45 35 45 60C45 85 60 100 60 100C60 100 75 85 75 60C75 35 60 20 60 20Z"
                stroke="black"
                strokeWidth="2"
              />
              <circle cx="50" cy="40" r="2" fill="black" />
              <circle cx="70" cy="40" r="2" fill="black" />
              <path d="M45 80C45 80 50 85 60 85C70 85 75 80 75 80" stroke="black" strokeWidth="2" />
              <rect x="45" y="100" width="10" height="15" stroke="black" strokeWidth="2" />
              <rect x="65" y="100" width="10" height="15" stroke="black" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-bold mt-8 mb-4">Page not found</h1>
      <p className="text-gray-500 mb-8 text-center max-w-md">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link href="/">
        <Button className="rounded-full bg-black text-white flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Go Home
        </Button>
      </Link>
    </div>
  )
}
