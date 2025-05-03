import Link from "next/link";
import { Button } from "@/components/ui/button";
import { routes } from "../../routes";

export default function ThePlanPage() {
  return (
    <div className="bg-[#f3f2f2]">
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-8 mb-8">
          <h1 className="text-4xl font-bold mb-6">The Plan</h1>
          <p className="text-gray-600 mb-4">
            Fermentum, ipsum in lacinia tempus, lorem neque tempus nisi, id
            porta quam quased tortor vitae sem finibus pharetra vitae eget sem.
            Suspendisse ipsum justo, lobortis auctor sodales in, imperdiet vitae
            ante.
          </p>
          <p className="text-gray-600 mb-4">
            Fermentum, ipsum in lacinia tempus, lorem neque tempus nisi, id
            porta quam quased tortor vitae sem finibus pharetra vitae eget sem.
            Suspendisse ipsum justo, lobortis auctor sodales in, imperdiet vitae
            ante.
          </p>
          <div className="mt-6">
            <Link href={routes.whatAreWeDoing}>
              <Button className="rounded-full">What are we doing?</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
