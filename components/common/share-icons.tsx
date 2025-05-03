import { Facebook, Twitter, Linkedin, LinkIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ShareIconsProps {
  url: string
  title: string
}

export function ShareIcons({ url, title }: ShareIconsProps) {
  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url)
  }

  return (
    <div className="flex gap-2">
      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <Facebook className="h-5 w-5" />
      </a>
      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <Twitter className="h-5 w-5" />
      </a>
      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <Linkedin className="h-5 w-5" />
      </a>
      <Button variant="ghost" size="sm" className="p-2 hover:bg-gray-100 rounded-full" onClick={copyToClipboard}>
        <LinkIcon className="h-5 w-5" />
      </Button>
    </div>
  )
}
