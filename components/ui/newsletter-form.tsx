import { Button } from "@/components/ui/button"
import { Send } from "lucide-react"

export function NewsletterForm() {
  return (
    <form className="flex w-full">
      <input
        type="email"
        placeholder="olivia@untitledui.com"
        className="flex-1 bg-white border-0 rounded-l-md px-4 py-2 text-sm text-black focus:outline-none"
        required
      />
      <Button type="submit" className="rounded-r-md rounded-l-none" size="sm">
        <Send className="h-4 w-4 mr-2" />
        <span>Send</span>
      </Button>
    </form>
  )
}
