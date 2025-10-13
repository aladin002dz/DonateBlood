import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart, UserPlus, Search } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <div className="max-w-4xl mx-auto text-center">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="h-16 w-16 md:h-20 md:w-20 text-primary fill-current" />
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4 text-balance">Don de Sang DZ</h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8 text-balance">
            One donation can save three lives ❤️
          </p>
        </div>

        {/* Main Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-12">
          <Link href="/register">
            <Button
              size="lg"
              className="w-full h-24 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <UserPlus className="h-6 w-6 mr-3" />I want to donate
            </Button>
          </Link>

          <Link href="/search">
            <Button
              size="lg"
              variant="outline"
              className="w-full h-24 text-lg font-semibold border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 bg-transparent"
            >
              <Search className="h-6 w-6 mr-3" />
              Search for a donor
            </Button>
          </Link>
        </div>

        {/* Info Section */}
        <div className="bg-white rounded-xl p-6 md:p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">Why donate blood?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Save Lives</h3>
              <p className="text-sm text-muted-foreground">
                Every donation can help save up to three lives in emergency situations.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <UserPlus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Help Your Community</h3>
              <p className="text-sm text-muted-foreground">Support hospitals and medical centers across Algeria.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                <Search className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Quick & Easy</h3>
              <p className="text-sm text-muted-foreground">Find donors or register to donate in just a few clicks.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
