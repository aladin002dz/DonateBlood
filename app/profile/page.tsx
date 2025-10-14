"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Heart, Save, Trash2, AlertTriangle } from "lucide-react"

export default function ProfilePage() {
  const [isAvailable, setIsAvailable] = useState(true)
  const [profileData, setProfileData] = useState({
    fullName: "Ahmed Benali",
    bloodGroup: "O+",
    email: "ahmed.benali@email.com",
    phone: "0555 123 456",
    wilaya: "Algiers",
    commune: "Bab Ezzouar",
    lastDonation: "2024-01-15",
    donationType: "Blood",
    emergencyAvailable: true,
  })

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const donationTypes = ["Blood", "Blood & Platelets"]

  const handleInputChange = (field: string, value: string | boolean) => {
    setProfileData((prev) => ({ ...prev, [field]: value }))
  }

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Updated profile data:", profileData)
    alert("Profile updated successfully! (This is a static prototype)")
  }

  const handleDeleteAccount = () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      alert("Account deleted! (This is a static prototype)")
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
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
                    className={`text-sm px-4 py-2 ${
                      isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
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
                      {profileData.bloodGroup}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Last Donation:</span>
                    <span>{new Date(profileData.lastDonation).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="text-right">
                      {profileData.commune}, {profileData.wilaya}
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
                        value={profileData.fullName}
                        onChange={(e) => handleInputChange("fullName", e.target.value)}
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">Blood Group</Label>
                      <Select
                        value={profileData.bloodGroup}
                        onValueChange={(value) => handleInputChange("bloodGroup", value)}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue />
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
                          value={profileData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={profileData.phone}
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
                          value={profileData.wilaya}
                          onChange={(e) => handleInputChange("wilaya", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="commune">Commune (City)</Label>
                        <Input
                          id="commune"
                          type="text"
                          value={profileData.commune}
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
                          value={profileData.lastDonation}
                          onChange={(e) => handleInputChange("lastDonation", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="donationType">Donation Type</Label>
                        <Select
                          value={profileData.donationType}
                          onValueChange={(value) => handleInputChange("donationType", value)}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue />
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
                      className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Save className="h-5 w-5 mr-2" />
                      Update Profile
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
