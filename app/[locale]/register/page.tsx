"use client"


import { registerUser } from "@/actions/register"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { zodResolver } from "@hookform/resolvers/zod"
import { Heart, Loader2, UserPlus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import { useTranslations } from 'next-intl'

// Schema will be defined inside component to use translations

export default function RegisterPage() {
  const t = useTranslations('Auth.Register')
  const v = useTranslations('Validation')
  const [loading, setLoading] = useState(false)

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const donationTypes = ["Blood", "Blood & Platelets"]

  const registrationSchema = z.object({
    fullName: z
      .string()
      .min(2, v('minName2'))
      .max(100, v('maxName100'))
      .regex(/^[a-zA-Z\s]+$/, v('nameAlpha')),

    bloodGroup: z
      .string()
      .min(1, v('bloodRequired'))
      .refine((val) => ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(val), {
        message: v('bloodInvalid')
      }),

    email: z
      .string()
      .min(1, v('emailRequired'))
      .email(v('emailInvalid')),

    password: z
      .string()
      .min(8, v('passwordMin8'))
      .max(100, v('passwordMax100'))
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, v('passwordComplex')),

    confirmPassword: z.string(),

    phone: z
      .string()
      .min(1, v('phoneRequired'))
      .regex(/^(\+?[1-9]\d{1,14}|0\d{9,14})$/, v('phoneInvalid')),

    wilaya: z
      .string()
      .min(2, v('wilayaMin2'))
      .max(50, v('wilayaMax50')),

    commune: z
      .string()
      .min(2, v('communeMin2'))
      .max(50, v('communeMax50')),

    lastDonation: z
      .string()
      .optional()
      .refine((val) => {
        if (!val) return true;
        const date = new Date(val);
        const today = new Date();
        return date <= today;
      }, v('lastDonationFuture')),

    donationType: z
      .string()
      .min(1, v('donationTypeRequired'))
      .refine((val) => ["Blood", "Blood & Platelets"].includes(val), {
        message: v('donationTypeInvalid')
      }),

    emergencyAvailable: z.boolean()
  }).refine((data) => data.password === data.confirmPassword, {
    message: v('passwordsMismatch'),
    path: ["confirmPassword"]
  });

  type RegistrationFormData = z.infer<typeof registrationSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<RegistrationFormData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      fullName: "",
      bloodGroup: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      wilaya: "",
      commune: "",
      lastDonation: "",
      donationType: "",
      emergencyAvailable: false,
    }
  });

  const watchedValues = watch();

  const onSubmit = async (data: RegistrationFormData) => {
    console.log("onSubmit======================================")
    setLoading(true)

    try {
      const formDataObj = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        formDataObj.append(key, value.toString())
      })

      const result = await registerUser(formDataObj)

      if (result?.success === false) {
        toast.error(result.error || t('toastFail'))
      } else if (result?.success === true) {
        toast.success(t('toastSuccess'))
        reset() // Reset form after successful submission

        // Handle redirect on client side
        if (result.redirectTo) {
          window.location.href = result.redirectTo
        }
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error(t('toastGeneric'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-12 w-12 text-primary fill-current" />
            </div>
            <CardTitle className="text-2xl md:text-3xl text-primary">{t('title')}</CardTitle>
            <CardDescription className="text-base">
              {t('description')}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">{t('personalInfo')}</h3>

                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('fullNameLabel')}</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder={t('fullNamePlaceholder')}
                    {...register("fullName")}
                    className={`rounded-lg ${errors.fullName ? 'border-red-500' : ''}`}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">{t('bloodGroupLabel')}</Label>
                  <Select
                    value={watchedValues.bloodGroup}
                    onValueChange={(value) => setValue("bloodGroup", value)}
                  >
                    <SelectTrigger className={`rounded-lg ${errors.bloodGroup ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder={t('bloodGroupPlaceholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {bloodGroups.map((group) => (
                        <SelectItem key={group} value={group}>
                          {group}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bloodGroup && (
                    <p className="text-sm text-red-500">{errors.bloodGroup.message}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('emailLabel')}</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder={t('emailPlaceholder')}
                      {...register("email")}
                      className={`rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">{t('phoneLabel')}</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder={t('phonePlaceholder')}
                      {...register("phone")}
                      className={`rounded-lg ${errors.phone ? 'border-red-500' : ''}`}
                    />
                    {errors.phone && (
                      <p className="text-sm text-red-500">{errors.phone.message}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">{t('passwordLabel')}</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder={t('passwordPlaceholder')}
                      {...register("password")}
                      className={`rounded-lg ${errors.password ? 'border-red-500' : ''}`}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('confirmPasswordLabel')}</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder={t('confirmPasswordPlaceholder')}
                      {...register("confirmPassword")}
                      className={`rounded-lg ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    />
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">{t('location')}</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wilaya">{t('wilayaLabel')}</Label>
                    <Input
                      id="wilaya"
                      type="text"
                      placeholder={t('wilayaPlaceholder')}
                      {...register("wilaya")}
                      className={`rounded-lg ${errors.wilaya ? 'border-red-500' : ''}`}
                    />
                    {errors.wilaya && (
                      <p className="text-sm text-red-500">{errors.wilaya.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commune">{t('communeLabel')}</Label>
                    <Input
                      id="commune"
                      type="text"
                      placeholder={t('communePlaceholder')}
                      {...register("commune")}
                      className={`rounded-lg ${errors.commune ? 'border-red-500' : ''}`}
                    />
                    {errors.commune && (
                      <p className="text-sm text-red-500">{errors.commune.message}</p>
                    )}
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
                      {...register("lastDonation")}
                      className={`rounded-lg ${errors.lastDonation ? 'border-red-500' : ''}`}
                    />
                    {errors.lastDonation && (
                      <p className="text-sm text-red-500">{errors.lastDonation.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="donationType">{t('donationTypeLabel')}</Label>
                    <Select
                      value={watchedValues.donationType}
                      onValueChange={(value) => setValue("donationType", value)}
                    >
                      <SelectTrigger className={`rounded-lg ${errors.donationType ? 'border-red-500' : ''}`}>
                        <SelectValue placeholder={t('donationTypePlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {donationTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.donationType && (
                      <p className="text-sm text-red-500">{errors.donationType.message}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="emergencyAvailable"
                    checked={watchedValues.emergencyAvailable}
                    onCheckedChange={(checked) => setValue("emergencyAvailable", checked as boolean)}
                  />
                  <Label
                    htmlFor="emergencyAvailable"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {t('emergencyAvailable')}
                  </Label>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg h-12 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    {t('submitting')}
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" />
                    {t('submit')}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
