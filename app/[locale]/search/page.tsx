"use client"

import { searchDonors, type DonorData, type SearchFilters } from "@/actions/search"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { getCommunes, getDairas, getWilayas } from "@/lib/locations"
import { Clock, Heart, Loader2, MapPin, Phone, Search, SlidersHorizontal } from "lucide-react"
import { useLocale, useTranslations } from 'next-intl'
import { useEffect, useMemo, useState } from "react"

export default function SearchPage() {
  const locale = useLocale()
  const t = useTranslations('Search')
  const tProfile = useTranslations('Profile')
  const [filters, setFilters] = useState<SearchFilters>({
    bloodGroup: "",
    wilaya: "",
    daira: "",
    commune: "",
    donationType: "",
    emergencyOnly: false,
  })
  const [isFiltersOpen, setIsFiltersOpen] = useState(false)

  // Get location data
  const wilayas = useMemo(() => getWilayas(locale), [locale])

  // Get current wilaya code from name for filtering
  const currentWilayaCode = useMemo(() => {
    if (!filters.wilaya) return null
    const wilaya = wilayas.find(w => w.name === filters.wilaya || w.code === filters.wilaya)
    return wilaya?.code || null
  }, [filters.wilaya, wilayas])

  const availableDairas = useMemo(() => {
    if (!currentWilayaCode) return []
    return getDairas(locale, currentWilayaCode)
  }, [locale, currentWilayaCode])

  const availableCommunes = useMemo(() => {
    if (!currentWilayaCode || !filters.daira) return []
    return getCommunes(locale, currentWilayaCode, filters.daira)
  }, [locale, currentWilayaCode, filters.daira])

  const [donors, setDonors] = useState<DonorData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const donationTypes = ["Blood", "Blood & Platelets"]

  // Helper function to translate donation type
  const getDonationTypeTranslation = (type: string | null): string => {
    if (!type) return ""
    const translationKey = type === "Blood" ? "donationTypeBlood" : "donationTypeBloodPlatelets"
    return tProfile(translationKey)
  }

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

    // Clear dependent fields when parent changes
    if (field === 'wilaya') {
      newFilters.daira = ""
      newFilters.commune = ""
    } else if (field === 'daira') {
      newFilters.commune = ""
    }

    setFilters(newFilters)
  }

  const handleWilayaChange = (wilayaCode: string) => {
    const wilaya = wilayas.find(w => w.code === wilayaCode)
    handleFilterChange('wilaya', wilaya?.name || wilayaCode)
  }

  const clearFilters = () => {
    setFilters({
      bloodGroup: "",
      wilaya: "",
      daira: "",
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
          <h1 className="text-2xl md:text-3xl font-bold text-primary mb-2">{t('title')}</h1>
          <p className="text-muted-foreground">{t('subtitle')}</p>
        </div>

        {/* Filter Toggle Button */}
        <div className="flex justify-start mb-6">
          <Button
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 flex items-center gap-2 font-medium"
          >
            <SlidersHorizontal className="h-5 w-5" />
            {t('filters')}
          </Button>
        </div>

        {/* Search Filters */}
        {isFiltersOpen && (
          <Card className="mb-8 shadow-lg animate-in slide-in-from-top-4 duration-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                {t('searchFilters')}
              </CardTitle>
              <CardDescription>{t('searchFiltersDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4 min-w-0
    lg:[grid-template-columns:repeat(5,minmax(12rem,1fr))]">
                {/* Blood group */}
                <div className="space-y-2 min-w-0">
                  <Label htmlFor="bloodGroup">{t('bloodGroup')}</Label>
                  <Select
                    value={filters.bloodGroup || ""}
                    onValueChange={(value) => handleFilterChange("bloodGroup", value)}
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <SelectTrigger id="bloodGroup" className="w-full rounded-lg">
                      <SelectValue placeholder={t('anyBloodGroup')} />
                    </SelectTrigger>
                    <SelectContent className="z-50" position="popper" sideOffset={4}>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>{group}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Wilaya */}
                <div className="space-y-2 min-w-0">
                  <Label htmlFor="wilaya">{t('wilaya')}</Label>
                  <Select value={currentWilayaCode || ""} onValueChange={handleWilayaChange} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
                    <SelectTrigger id="wilaya" className="w-full rounded-lg">
                      <SelectValue placeholder={t('enterWilaya')}>
                        {currentWilayaCode ? wilayas.find(w => w.code === currentWilayaCode)?.display : ""}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent className="z-50" position="popper" sideOffset={4} >
                      {wilayas.map((wilaya) => (
                        <SelectItem key={wilaya.code} value={wilaya.code} >
                          {wilaya.display}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Daira */}
                <div className="space-y-2 min-w-0">
                  <Label htmlFor="daira">{t('daira')}</Label>
                  <Select
                    value={filters.daira || ""}
                    onValueChange={(value) => handleFilterChange("daira", value)}
                    disabled={!currentWilayaCode}
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <SelectTrigger id="daira" className="w-full rounded-lg">
                      <SelectValue placeholder={currentWilayaCode ? t('enterDaira') : t('selectWilayaFirst')} />
                    </SelectTrigger>
                    <SelectContent className="z-50" position="popper" sideOffset={4}>
                      {availableDairas.map((daira) => (
                        <SelectItem key={daira.name} value={daira.name}>{daira.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Commune */}
                <div className="space-y-2 min-w-0">
                  <Label htmlFor="commune">{t('commune')}</Label>
                  <Select
                    value={filters.commune || ""}
                    onValueChange={(value) => handleFilterChange("commune", value)}
                    disabled={!currentWilayaCode || !filters.daira}
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <SelectTrigger id="commune" className="w-full rounded-lg">
                      <SelectValue placeholder={filters.daira ? t('enterCommune') : t('selectDairaFirst')} />
                    </SelectTrigger>
                    <SelectContent className="z-50" position="popper" sideOffset={4}>
                      {availableCommunes.map((commune) => (
                        <SelectItem key={commune} value={commune}>{commune}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Donation Type */}
                <div className="space-y-2 min-w-0">
                  <Label htmlFor="donationType">{t('donationType')}</Label>
                  <Select
                    value={filters.donationType || ""}
                    onValueChange={(value) => handleFilterChange("donationType", value)}
                    dir={locale === 'ar' ? 'rtl' : 'ltr'}
                  >
                    <SelectTrigger id="donationType" className="w-full rounded-lg">
                      <SelectValue placeholder={t('anyType')} />
                    </SelectTrigger>
                    <SelectContent className="z-50" position="popper" sideOffset={4}>
                      {donationTypes.map((type) => (
                        <SelectItem key={type} value={type}>{getDonationTypeTranslation(type)}</SelectItem>
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
                  {t('emergencyOnly')}
                </Label>
              </div>

              <div className="flex gap-2 items-center">
                <Button onClick={clearFilters} variant="outline" className="rounded-lg bg-transparent">
                  {t('clearFilters')}
                </Button>
                {loading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {t('loading')}
                  </div>
                ) : (
                  <div className="text-lg font-bold text-primary">
                    {t('found')} <span>{donors.length}</span> {donors.length !== 1 ? t('foundDonorsPlural') : t('foundDonors')}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results */}
        {error && (
          <div className="text-center py-8">
            <div className="text-red-500 mb-2">{t('error')} {error}</div>
            <Button onClick={() => window.location.reload()} variant="outline">
              {t('tryAgain')}
            </Button>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <Loader2 className="h-16 w-16 text-muted-foreground mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-foreground mb-2">{t('loadingDonors')}</h3>
            <p className="text-muted-foreground">{t('loadingDonorsDesc')}</p>
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
                            {donor.emergencyAvailable ? t('available') : t('unavailable')}
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
                        {[donor.commune, donor.daira, donor.wilaya].filter(Boolean).join(', ')}
                      </span>
                    </div>

                    {donor.lastDonation && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{t('lastDonation')} {new Date(donor.lastDonation).toLocaleDateString()}</span>
                      </div>
                    )}

                    {donor.donationType && (
                      <div className="text-sm">
                        <span className="font-medium">{t('type')}</span> {getDonationTypeTranslation(donor.donationType)}
                      </div>
                    )}

                    <Button
                      onClick={() => handleContact(donor)}
                      disabled={!donor.emergencyAvailable || !donor.phone}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Phone className="h-4 w-4 mr-2" />
                      {donor.phone ? t('contactDonor') : t('noContactInfo')}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {donors.length === 0 && (
              <div className="text-center py-12">
                <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">{t('noDonorsFound')}</h3>
                <p className="text-muted-foreground">{t('noDonorsFoundDesc')}</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
