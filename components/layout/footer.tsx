import Link from "next/link"
import { Facebook, Linkedin, Twitter } from "lucide-react"
import { NewsletterForm } from "@/components/ui/newsletter-form"

export function Footer() {
  return (
    <footer className="bg-black text-white">
      <div className="container mx-auto py-8 px-4">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 pb-8">
          <div className="md:col-span-2">
            <Link href="/" className="font-bold text-xl">
              humanity_
            </Link>
          </div>
          <div>
            <FooterNavColumn title="The Plan" links={[{ label: "Overview", href: "/the-plan" }]} />
          </div>
          <div>
            <FooterNavColumn
              title="Questions"
              links={[
                { label: "Browse", href: "/questions" },
                { label: "Answers", href: "/answers" },
              ]}
            />
          </div>
          <div>
            <FooterNavColumn title="Articles" links={[{ label: "Latest", href: "/articles" }]} />
          </div>
          <div>
            <FooterNavColumn title="About" links={[{ label: "Contact", href: "/contact" }]} />
          </div>
        </div>

        <div className="mb-8">
          <div className="max-w-md">
            <h3 className="font-medium mb-2">Join us for the latest questions, answers, reviews and news.</h3>
            <NewsletterForm />
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex gap-4">
              <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
                Terms
              </Link>
              <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
                Privacy
              </Link>
              <Link href="/cookies" className="text-sm text-gray-400 hover:text-white">
                Cookies
              </Link>
            </div>
            <div className="flex gap-4">
              <Link href="https://linkedin.com" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5 text-gray-400 hover:text-white" />
              </Link>
              <Link href="https://facebook.com" aria-label="Facebook">
                <Facebook className="h-5 w-5 text-gray-400 hover:text-white" />
              </Link>
              <Link href="https://twitter.com" aria-label="Twitter">
                <Twitter className="h-5 w-5 text-gray-400 hover:text-white" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

interface FooterLink {
  label: string
  href: string
}

function FooterNavColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div>
      <h3 className="font-medium mb-3">{title}</h3>
      <ul className="space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-gray-400 hover:text-white text-sm">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
