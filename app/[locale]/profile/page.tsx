"use client"

import type React from "react"

import { getProfile, updateProfile } from "@/actions/profile"
import { DeleteAccountDialog } from "@/components/delete-account-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { useSession } from "@/lib/auth-client"
import { getCommunes, getDairas, getWilayas } from "@/lib/locations"
import { AlertTriangle, Heart, Loader2, Save, Trash2, User } from "lucide-react"
import { useLocale, useTranslations } from 'next-intl'
import { useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import { toast } from "sonner"

interface UserProfile {
  id: string
  name: string
  email: string | null
  phone: string | null
  emailVerified: boolean
  phoneVerified: boolean
  bloodGroup: string | null
  wilaya: string | null
  daira: string | null
  commune: string | null
  lastDonation: string | null
  donationType: string | null
  emergencyAvailable: boolean | null
  createdAt: Date
  updatedAt: Date
}

export default function ProfilePage() {
  const locale = useLocale()
  const t = useTranslations('Profile')
  const { data: session, isPending: sessionLoading } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [profileData, setProfileData] = useState<UserProfile | null>(null)
  const [isAvailable, setIsAvailable] = useState(false)

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const donationTypes = ["Blood", "Blood & Platelets"]

  // Get location data
  const wilayas = useMemo(() => getWilayas(locale), [locale])

  // Get current wilaya code from name for filtering
  const currentWilayaCode = useMemo(() => {
    if (!profileData?.wilaya) return null
    const wilaya = wilayas.find(w => w.name === profileData.wilaya || w.code === profileData.wilaya)
    return wilaya?.code || null
  }, [profileData?.wilaya, wilayas])

  const availableDairas = useMemo(() => {
    if (!currentWilayaCode) return []
    return getDairas(locale, currentWilayaCode)
  }, [locale, currentWilayaCode])

  const availableCommunes = useMemo(() => {
    if (!currentWilayaCode || !profileData?.daira) return []
    return getCommunes(locale, currentWilayaCode, profileData.daira)
  }, [locale, currentWilayaCode, profileData?.daira])

  // Helper function to translate donation type
  const getDonationTypeTranslation = (type: string | null): string => {
    if (!type) return ""
    const translationKey = type === "Blood" ? "donationTypeBlood" : "donationTypeBloodPlatelets"
    return t(translationKey)
  }

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
        const result = await getProfile()

        if (!result.success || !result.data) {
          throw new Error(result.error || 'Failed to fetch profile data')
        }

        setProfileData(result.data)
        setIsAvailable(result.data.emergencyAvailable || false)
      } catch (error) {
        console.error('Error fetching profile:', error)
        toast.error(t('toastLoadError'))
      } finally {
        setLoading(false)
      }
    }

    fetchProfileData()
  }, [session, t])

  const handleInputChange = (field: string, value: string | boolean) => {
    if (!profileData) return

    setProfileData((prev) => {
      if (!prev) return prev
      const updated = { ...prev, [field]: value }

      // Clear dependent fields when parent changes
      if (field === 'wilaya') {
        updated.daira = null
        updated.commune = null
      } else if (field === 'daira') {
        updated.commune = null
      }

      return updated
    })
  }

  const handleWilayaChange = (wilayaCode: string) => {
    const wilaya = wilayas.find(w => w.code === wilayaCode)
    handleInputChange('wilaya', wilaya?.name || wilayaCode)
  }

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileData) return

    try {
      setUpdating(true)

      // Create FormData object for the server action
      const formData = new FormData()
      formData.append('name', profileData.name || '')
      formData.append('phone', profileData.phone || '')
      formData.append('email', profileData.email || '')
      formData.append('bloodGroup', profileData.bloodGroup || '')
      formData.append('wilaya', profileData.wilaya || '')
      formData.append('daira', profileData.daira || '')
      formData.append('commune', profileData.commune || '')
      formData.append('lastDonation', profileData.lastDonation || '')
      formData.append('donationType', profileData.donationType || '')
      if (isAvailable) {
        formData.append('emergencyAvailable', 'on')
      }

      const result = await updateProfile(formData)

      if (!result.success) {
        throw new Error(result.error || 'Failed to update profile')
      }

      toast.success(t('toastUpdateSuccess'))
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error(t('toastUpdateFail'))
    } finally {
      setUpdating(false)
    }
  }


  // Show loading state
  if (sessionLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-muted-foreground">{t('loading')}</p>
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
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Availability Status */}
          <div className="lg:col-span-1">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-primary" />
                  {t('availabilityStatus')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="availability" className="text-sm font-medium">
                    {t('availableForDonation')}
                  </Label>
                  <Switch id="availability" checked={isAvailable} onCheckedChange={setIsAvailable} />
                </div>

                <div className="text-center">
                  <Badge
                    variant={isAvailable ? "default" : "secondary"}
                    className={`text-sm px-4 py-2 ${isAvailable ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    {isAvailable ? t('available') : t('unavailable')}
                  </Badge>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('bloodGroup')}</span>
                    <Badge variant="secondary" className="bg-primary text-primary-foreground">
                      {profileData.bloodGroup || t('notSpecified')}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('lastDonation')}</span>
                    <span>{profileData.lastDonation ? new Date(profileData.lastDonation).toLocaleDateString() : t('notSpecified')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('daira')}</span>
                    <span>{profileData.daira || t('notSpecified')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('location')}</span>
                    <span className="text-right">
                      {[profileData.commune, profileData.wilaya].filter(Boolean).length > 0
                        ? [profileData.commune, profileData.wilaya].filter(Boolean).join(', ')
                        : t('notSpecified')
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
                <CardTitle>{t('updateProfileTitle')}</CardTitle>
                <CardDescription>{t('updateProfileDesc')}</CardDescription>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleUpdate} className="space-y-6">
                  {/* Personal Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">{t('personalInfo')}</h3>

                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t('fullName')}</Label>
                      <Input
                        id="fullName"
                        type="text"
                        value={profileData.name || ""}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        className="rounded-lg"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bloodGroup">{t('bloodGroupLabel')}</Label>
                      <Select
                        value={profileData.bloodGroup || ""}
                        onValueChange={(value) => handleInputChange("bloodGroup", value)}
                      >
                        <SelectTrigger className="rounded-lg">
                          <SelectValue placeholder={t('selectBloodGroup')} />
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
                        <Label htmlFor="email">{t('email')}</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email || ""}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('phoneNumber')}</Label>
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
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">{t('locationInfo')}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="wilaya">{t('wilaya')}</Label>
                        <Select
                          value={currentWilayaCode || ""}
                          onValueChange={handleWilayaChange}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder={t('wilaya') || 'Select wilaya'}>
                              {currentWilayaCode ? wilayas.find(w => w.code === currentWilayaCode)?.display : ""}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {wilayas.map((wilaya) => (
                              <SelectItem key={wilaya.code} value={wilaya.code}>
                                {wilaya.display}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="daira">{t('daira')}</Label>
                        <Select
                          value={profileData.daira || ""}
                          onValueChange={(value) => handleInputChange("daira", value)}
                          disabled={!currentWilayaCode}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder={currentWilayaCode ? t('daira') || 'Select daira' : 'Select wilaya first'} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableDairas.map((daira) => (
                              <SelectItem key={daira.name} value={daira.name}>
                                {daira.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="commune">{t('commune')}</Label>
                        <Select
                          value={profileData.commune || ""}
                          onValueChange={(value) => handleInputChange("commune", value)}
                          disabled={!currentWilayaCode || !profileData.daira}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder={profileData.daira ? t('commune') || 'Select commune' : 'Select daira first'} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCommunes.map((commune) => (
                              <SelectItem key={commune} value={commune}>
                                {commune}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Donation Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground border-b pb-2">{t('donationInfo')}</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="lastDonation">{t('lastDonationLabel')}</Label>
                        <Input
                          id="lastDonation"
                          type="date"
                          value={profileData.lastDonation || ""}
                          onChange={(e) => handleInputChange("lastDonation", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="donationType">{t('donationType')}</Label>
                        <Select
                          value={profileData.donationType || ""}
                          onValueChange={(value) => handleInputChange("donationType", value)}
                        >
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder={t('selectDonationType')} />
                          </SelectTrigger>
                          <SelectContent>
                            {donationTypes.map((type) => (
                              <SelectItem key={type} value={type}>
                                {getDonationTypeTranslation(type)}
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
                          {t('updating')}
                        </>
                      ) : (
                        <>
                          <Save className="h-5 w-5 mr-2" />
                          {t('updateProfile')}
                        </>
                      )}
                    </Button>

                    <DeleteAccountDialog>
                      <Button
                        type="button"
                        variant="destructive"
                        className="flex-1 sm:flex-none rounded-lg h-12 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        <Trash2 className="h-5 w-5 mr-2" />
                        {t('deleteAccount')}
                      </Button>
                    </DeleteAccountDialog>
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
                    <p className="font-medium text-orange-800 mb-1">{t('importantReminder')}</p>
                    <p className="text-orange-700">
                      {t('importantReminderText')}
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
