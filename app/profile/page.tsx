"use client"

import type React from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useSession } from "@/lib/auth-client"
import { AlertTriangle, Heart, Loader2, Save, Trash2, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface UserProfile {
  id: string
  name: string
  email: string | null
  phone: string
  emailVerified: boolean
  phoneVerified: boolean
  bloodGroup: string | null
  wilaya: string | null
  commune: string | null
  lastDonation: string | null
  donationType: string | null
  emergencyAvailable: boolean | null
  createdAt: string
  updatedAt: string
}

export default function ProfilePage() {
  const { data: session, isPending: sessionLoading } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [profileData, setProfileData] = useState<UserProfile | null>(null)
  const [isAvailable, setIsAvailable] = useState(false)

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const donationTypes = ["Blood", "Blood & Platelets"]

  // Redirect if not authenticated
  useEffect(() => {
    if (!sessionLoading && !session) {
      router.push("/signin")
    }
  }, [session, sessionLoading, router])

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!session?.user) return

      try {
        setLoading(true)
        const response = await fetch('/api/profile')

        if (!response.ok) {
          throw new Error('Failed to fetch profile data')
        }

        const data = await response.json()
        setProfileData(data)
        setIsAvailable(data.emergencyAvailable || false)
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error('Failed to load profile data')
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [session])

  const handleInputChange = (field: string, value: string | boolean) => {
    if (!profileData) return

    setProfileData((prev) => {
      if (!prev) return prev
      return { ...prev, [field]: value }
    })
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileData) return

    try {
      setUpdating(true)

      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: profileData.name,
          phone: profileData.phone,
          email: profileData.email,
          bloodGroup: profileData.bloodGroup,
          wilaya: profileData.wilaya,
          commune: profileData.commune,
          lastDonation: profileData.lastDonation,
          donationType: profileData.donationType,
          emergencyAvailable: isAvailable,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update profile')
      }

      toast.success('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Failed to update profile')
    } finally {
      setUpdating(false)
    }
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      toast.error("Account deletion not implemented yet")
    }
  }

  // Show loading state
  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">Loading profile...</p>
        </div>
      </div>
    )
  }

  // Show nothing if not authenticated (will redirect)
  if (!session || !profileData) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <User className="h-12 w-12 text-primary" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">Donor Profile</h1>
          <p className="text-muted-foreground">Manage your donor information and availability</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Availability Status */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  Availability Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="availability" className="text-sm font-medium">
                    Available for donation
                  </Label>
                  <Switch id="availability" checked={isAvailable} onCheckedChange={setIsAvailable} />
                </div>

                <div className="text-center">
                  <Badge
                    variant={isAvailable ? "default" : "secondary"}
                    className={`text-sm px-4 py-2 ${isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {isAvailable ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Blood Group:</span>
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      {profileData.bloodGroup || "Not specified"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Donation:</span>
                    <span>{profileData.lastDonation ? new Date(profileData.lastDonation).toLocaleDateString() : "Not specified"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-right">
                      {profileData.commune && profileData.wilaya
                        ? `${profileData.commune}, ${profileData.wilaya}`
                        : "Not specified"
                      }
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Profile Form */}
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Update Profile Information</CardTitle>
                <CardDescription>Keep your information up to date to help others find you when needed</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleUpdate} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">Personal Information</h3>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={profileData.name || ""}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select
                        value={profileData.bloodGroup || ""}
                        onValueChange={(value) => handleInputChange("bloodGroup", value)}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder="Select blood group" />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email || ""}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone || ""}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Location Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">Location</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="wilaya">Wilaya (Province)</Label>
                        <Input
                          id="wilaya"
                          type="text"
                          value={profileData.wilaya || ""}
                          onChange={(e) => handleInputChange("wilaya", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="commune">Commune (City)</Label>
                        <Input
                          id="commune"
                          type="text"
                          value={profileData.commune || ""}
                          onChange={(e) => handleInputChange("commune", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Donation Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">Donation Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lastDonation">Date of Last Donation</Label>
                        <Input
                          id="lastDonation"
                          type="date"
                          value={profileData.lastDonation || ""}
                          onChange={(e) => handleInputChange("lastDonation", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="donationType">Donation Type</Label>
                        <Select
                          value={profileData.donationType || ""}
                          onValueChange={(value) => handleInputChange("donationType", value)}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder="Select donation type" />
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
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                      type="submit"
                      disabled={updating}
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {updating ? (
                        <>
                          <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          Update Profile
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      className="flex-1 sm:flex-none rounded-lg h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Trash2 className="h-5 w-5 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Warning Card */}
            <Card className="mt-6 border-orange-200 bg-orange-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-orange-600 mt-0.5" />
                  <div className="text-sm">
                    <p className="font-medium text-orange-800 mb-1">Important Reminder</p>
                    <p className="text-orange-700">
                      Please keep your information updated and accurate. This helps ensure that people can reach you
                      when blood donations are urgently needed.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
