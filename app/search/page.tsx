"use client"

import { searchDonors, type DonorData, type SearchFilters } from "@/actions/search"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Clock, Heart, Loader2, MapPin, Phone, Search } from "lucide-react"
import { useEffect, useState } from "react"

export default function SearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    bloodGroup: "",
    wilaya: "",
    commune: "",
    donationType: "",
    emergencyOnly: false,
  })

  const [donors, setDonors] = useState<DonorData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const donationTypes = ["Blood", "Blood & Platelets"]

  // Load initial data
  useEffect(() => {
    const loadDonors = async () => {
      setLoading(true)
      setError(null)
      try {
        const result = await searchDonors(filters)
        if (result.success && result.data) {
          setDonors(result.data as DonorData[])
        } else {
          setError(result.error || 'Failed to load donors')
        }
      } catch (err) {
        setError('Failed to load donors')
        console.error('Error loading donors:', err)
      } finally {
        setLoading(false)
      }
    }

    loadDonors()
  }, [filters])

  const handleFilterChange = (field: keyof SearchFilters, value: string) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
  }

  const clearFilters = () => {
    setFilters({
      bloodGroup: "",
      wilaya: "",
      commune: "",
      donationType: "",
      emergencyOnly: false,
    })
  }

  const handleContact = (donor: DonorData) => {
    if (donor.phone) {
      alert(`Contacting ${donor.name} at ${donor.phone}`)
    } else {
      alert(`Contact information for ${donor.name} is not available`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Search className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Find Blood Donors</h1>
          <p className="text-muted-foreground">Search for available donors in your area</p>
        </div>

        {/* Search Filters */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Search Filters
            </CardTitle>
            <CardDescription>Use the filters below to find donors that match your requirements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="space-y-2">
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Select value={filters.bloodGroup || ""} onValueChange={(value) => handleFilterChange("bloodGroup", value)}>
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Any blood group" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodGroups.map((group) => (
                      <SelectItem key={group} value={group}>
                        {group}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="wilaya">Wilaya</Label>
                <Input
                  id="wilaya"
                  type="text"
                  placeholder="Enter wilaya"
                  value={filters.wilaya || ""}
                  onChange={(e) => handleFilterChange("wilaya", e.target.value)}
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="commune">Commune</Label>
                <Input
                  id="commune"
                  type="text"
                  placeholder="Enter commune"
                  value={filters.commune || ""}
                  onChange={(e) => handleFilterChange("commune", e.target.value)}
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="donationType">Donation Type</Label>
                <Select
                  value={filters.donationType || ""}
                  onValueChange={(value) => handleFilterChange("donationType", value)}
                >
                  <SelectTrigger className="rounded-lg">
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    {donationTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2 mb-4">
              <Switch
                id="emergencyOnly"
                checked={filters.emergencyOnly || false}
                onCheckedChange={(checked) => setFilters({ ...filters, emergencyOnly: checked })}
              />
              <Label htmlFor="emergencyOnly" className="text-sm font-medium">
                Show only emergency available donors
              </Label>
            </div>

            <div className="flex gap-2">
              <Button onClick={clearFilters} variant="outline" className="rounded-lg bg-transparent">
                Clear Filters
              </Button>
              <div className="text-sm text-muted-foreground flex items-center">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </div>
                ) : (
                  `Found ${donors.length} donor${donors.length !== 1 ? "s" : ""}`
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {error && (
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">Error: {error}</div>
            <Button onClick={() => window.location.reload()} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Loading donors...</h3>
            <p className="text-muted-foreground">Please wait while we fetch the latest donor information.</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {donors.map((donor) => (
                <Card key={donor.id} className="shadow-lg hover:shadow-xl transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{donor.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge
                            variant="secondary"
                            className="bg-primary text-primary-foreground font-bold text-sm px-3 py-1"
                          >
                            {donor.bloodGroup}
                          </Badge>
                          <Badge
                            variant={donor.emergencyAvailable ? "default" : "secondary"}
                            className={donor.emergencyAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                          >
                            {donor.emergencyAvailable ? "Available" : "Unavailable"}
                          </Badge>
                        </div>
                      </div>
                      <Heart className="h-6 w-6 text-primary fill-current" />
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {donor.commune}, {donor.wilaya}
                      </span>
                    </div>

                    {donor.lastDonation && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Last donation: {new Date(donor.lastDonation).toLocaleDateString()}</span>
                      </div>
                    )}

                    {donor.donationType && (
                      <div className="text-sm">
                        <span className="font-medium">Type:</span> {donor.donationType}
                      </div>
                    )}

                    <Button
                      onClick={() => handleContact(donor)}
                      disabled={!donor.emergencyAvailable || !donor.phone}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {donor.phone ? "Contact Donor" : "No Contact Info"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {donors.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">No donors found</h3>
                <p className="text-muted-foreground">Try adjusting your search filters to find more donors in your area.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
