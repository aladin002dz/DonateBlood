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

// Zod validation schema
const registrationSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100, "Full name must be less than 100 characters")
    .regex(/^[a-zA-Z\s]+$/, "Full name can only contain letters and spaces"),

  bloodGroup: z
    .string()
    .min(1, "Blood group is required")
    .refine((val) => ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].includes(val), {
      message: "Please select a valid blood group"
    }),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, "Password must contain at least one uppercase letter, one lowercase letter, and one number"),

  confirmPassword: z.string(),

  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\+?[1-9]\d{1,14}$/, "Please enter a valid phone number (e.g., +1234567890)"),

  wilaya: z
    .string()
    .min(2, "Wilaya must be at least 2 characters")
    .max(50, "Wilaya must be less than 50 characters"),

  commune: z
    .string()
    .min(2, "Commune must be at least 2 characters")
    .max(50, "Commune must be less than 50 characters"),

  lastDonation: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true; // Optional field
      const date = new Date(val);
      const today = new Date();
      return date <= today;
    }, "Last donation date cannot be in the future"),

  donationType: z
    .string()
    .min(1, "Donation type is required")
    .refine((val) => ["Blood", "Blood & Platelets"].includes(val), {
      message: "Please select a valid donation type"
    }),

  emergencyAvailable: z.boolean()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegistrationFormData = z.infer<typeof registrationSchema>;

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]
  const donationTypes = ["Blood", "Blood & Platelets"]

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
        toast.error(result.error || 'Registration failed')
      } else {
        toast.success('Registration successful!')
        reset() // Reset form after successful submission
      }
    } catch (error) {
      console.error('Registration error:', error)
      toast.error('An error occurred during registration')
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
            <CardTitle className="text-2xl md:text-3xl text-primary">Donor Registration</CardTitle>
            <CardDescription className="text-base">
              Join our community of life-savers. Register to become a blood donor.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Personal Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Enter your full name"
                    {...register("fullName")}
                    className={`rounded-lg ${errors.fullName ? 'border-red-500' : ''}`}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-red-500">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bloodGroup">Blood Group *</Label>
                  <Select
                    value={watchedValues.bloodGroup}
                    onValueChange={(value) => setValue("bloodGroup", value)}
                  >
                    <SelectTrigger className={`rounded-lg ${errors.bloodGroup ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select your blood group" />
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
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      {...register("email")}
                      className={`rounded-lg ${errors.email ? 'border-red-500' : ''}`}
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="0555 123 456"
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
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Create a secure password"
                      {...register("password")}
                      className={`rounded-lg ${errors.password ? 'border-red-500' : ''}`}
                    />
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirm your password"
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
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Location</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="wilaya">Wilaya (Province) *</Label>
                    <Input
                      id="wilaya"
                      type="text"
                      placeholder="e.g., Algiers, Oran, Constantine"
                      {...register("wilaya")}
                      className={`rounded-lg ${errors.wilaya ? 'border-red-500' : ''}`}
                    />
                    {errors.wilaya && (
                      <p className="text-sm text-red-500">{errors.wilaya.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="commune">Commune (City) *</Label>
                    <Input
                      id="commune"
                      type="text"
                      placeholder="e.g., Bab Ezzouar, Bir Mourad Rais"
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
                <h3 className="text-lg font-semibold text-foreground border-b pb-2">Donation Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="lastDonation">Date of Last Donation</Label>
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
                    <Label htmlFor="donationType">Donation Type *</Label>
                    <Select
                      value={watchedValues.donationType}
                      onValueChange={(value) => setValue("donationType", value)}
                    >
                      <SelectTrigger className={`rounded-lg ${errors.donationType ? 'border-red-500' : ''}`}>
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
                    Available for emergency donations
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
                    Registering...
                  </>
                ) : (
                  <>
                    <UserPlus className="h-5 w-5 mr-2" />
                    Register as Donor
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
