"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Phone, MapPin, Clock, Heart } from "lucide-react"

// Mock donor data
const mockDonors = [
  {
    id: 1,
    name: "Ahmed Benali",
    bloodGroup: "O+",
    wilaya: "Algiers",
    commune: "Bab Ezzouar",
    donationType: "Blood",
    available: true,
    lastDonation: "2024-01-15",
    phone: "0555 123 456",
  },
  {
    id: 2,
    name: "Fatima Khelifi",
    bloodGroup: "A+",
    wilaya: "Oran",
    commune: "Es Senia",
    donationType: "Blood & Platelets",
    available: true,
    lastDonation: "2023-12-20",
    phone: "0661 789 012",
  },
  {
    id: 3,
    name: "Mohamed Saidi",
    bloodGroup: "B-",
    wilaya: "Constantine",
    commune: "El Khroub",
    donationType: "Blood",
    available: false,
    lastDonation: "2024-02-10",
    phone: "0770 345 678",
  },
  {
    id: 4,
    name: "Amina Boudjemaa",
    bloodGroup: "AB+",
    wilaya: "Algiers",
    commune: "Hydra",
    donationType: "Blood & Platelets",
    available: true,
    lastDonation: "2024-01-05",
    phone: "0555 987 654",
  },
]

export default function SearchPage() {
  const [filters, setFilters] = useState({
    bloodGroup: "",
    wilaya: "",
    commune: "",
    donationType: "",
  })

  const [filteredDonors, setFilteredDonors] = useState(mockDonors)

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const donationTypes = ["Blood", "Blood & Platelets"]

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)

    // Apply filters
    const filtered = mockDonors.filter((donor) => {
      return (
        (!newFilters.bloodGroup || donor.bloodGroup === newFilters.bloodGroup) &&
        (!newFilters.wilaya || donor.wilaya.toLowerCase().includes(newFilters.wilaya.toLowerCase())) &&
        (!newFilters.commune || donor.commune.toLowerCase().includes(newFilters.commune.toLowerCase())) &&
        (!newFilters.donationType || donor.donationType === newFilters.donationType)
      )
    })

    setFilteredDonors(filtered)
  }

  const clearFilters = () => {
    setFilters({
      bloodGroup: "",
      wilaya: "",
      commune: "",
      donationType: "",
    })
    setFilteredDonors(mockDonors)
  }

  const handleContact = (donor: (typeof mockDonors)[0]) => {
    alert(`Contacting ${donor.name} at ${donor.phone} (This is a static prototype)`)
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
                <Select value={filters.bloodGroup} onValueChange={(value) => handleFilterChange("bloodGroup", value)}>
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
                  value={filters.wilaya}
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
                  value={filters.commune}
                  onChange={(e) => handleFilterChange("commune", e.target.value)}
                  className="rounded-lg"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="donationType">Donation Type</Label>
                <Select
                  value={filters.donationType}
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

            <div className="flex gap-2">
              <Button onClick={clearFilters} variant="outline" className="rounded-lg bg-transparent">
                Clear Filters
              </Button>
              <div className="text-sm text-muted-foreground flex items-center">
                Found {filteredDonors.length} donor{filteredDonors.length !== 1 ? "s" : ""}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonors.map((donor) => (
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
                        variant={donor.available ? "default" : "secondary"}
                        className={donor.available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                      >
                        {donor.available ? "Available" : "Unavailable"}
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

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Last donation: {new Date(donor.lastDonation).toLocaleDateString()}</span>
                </div>

                <div className="text-sm">
                  <span className="font-medium">Type:</span> {donor.donationType}
                </div>

                <Button
                  onClick={() => handleContact(donor)}
                  disabled={!donor.available}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Contact Donor
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredDonors.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No donors found</h3>
            <p className="text-muted-foreground">Try adjusting your search filters to find more donors in your area.</p>
          </div>
        )}
      </div>
    </div>
  )
}
