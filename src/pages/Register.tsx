import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2, CheckCircle2, Mail, Phone, ArrowLeft, ArrowRight } from "lucide-react";

// Validation schema for registration
const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().regex(/^\+?[1-9]\d{10,14}$/, "Please enter a valid phone number with country code (e.g., +2348012345678)"),
  password: z.string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      "Password must contain uppercase, lowercase, number, and special character"
    ),
  confirmPassword: z.string(),
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  accountType: z.enum(["individual", "business"]).default("individual"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

type RegistrationStep = "registration" | "verify-email" | "verify-phone" | "complete";

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [step, setStep] = useState<RegistrationStep>("registration");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [registrationData, setRegistrationData] = useState<RegisterFormData | null>(null);
  const [emailOTP, setEmailOTP] = useState("");
  const [phoneOTP, setPhoneOTP] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      accountType: "individual",
    },
  });

  // Step 1: Handle registration
  const onRegister = async (data: RegisterFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.register({
        email: data.email,
        phone: data.phone,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        accountType: data.accountType,
      });

      if (response.success) {
        setUserId(response.data.userId);
        setRegistrationData(data);
        setStep("verify-email");
        toast.success("Registration successful! Please check your email for the verification code.");
      } else {
        setError(response.error?.message || "Registration failed");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify email OTP
  const onVerifyEmail = async () => {
    if (emailOTP.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.verifyOTP({
        email: registrationData?.email,
        otpCode: emailOTP,
        otpType: "email",
      });

      if (response.success) {
        toast.success("Email verified successfully!");
        setStep("verify-phone");
        setEmailOTP("");
      } else {
        setError(response.error?.message || "Email verification failed");
        toast.error(response.error?.message || "Invalid OTP code");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Email verification failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Verify phone OTP
  const onVerifyPhone = async () => {
    if (phoneOTP.length !== 6) {
      toast.error("Please enter a valid 6-digit code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.verifyOTP({
        phone: registrationData?.phone,
        otpCode: phoneOTP,
        otpType: "phone",
      });

      if (response.success) {
        toast.success("Phone verified successfully! Registration complete!");
        setStep("complete");
        setPhoneOTP("");
        
        // Set user in auth context if returned
        if (response.data?.user) {
          setUser(response.data.user);
        }
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(response.error?.message || "Phone verification failed");
        toast.error(response.error?.message || "Invalid OTP code");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Phone verification failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const onResendOTP = async (otpType: "email" | "phone") => {
    setLoading(true);

    try {
      const response = await api.resendOTP({
        email: otpType === "email" ? registrationData?.email : undefined,
        phone: otpType === "phone" ? registrationData?.phone : undefined,
        otpType,
      });

      if (response.success) {
        toast.success(`New OTP sent to your ${otpType}`);
      } else {
        toast.error(response.error?.message || "Failed to resend OTP");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-md">
        {/* Progress Indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center ${step === "registration" ? "text-purple-600" : "text-green-600"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "registration" ? "bg-purple-600 text-white" : "bg-green-600 text-white"}`}>
                {step !== "registration" ? <CheckCircle2 className="w-5 h-5" /> : "1"}
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:inline">Register</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-200">
              <div className={`h-full ${step !== "registration" ? "bg-green-600" : "bg-gray-200"} transition-all duration-300`}></div>
            </div>
            <div className={`flex items-center ${step === "verify-email" ? "text-purple-600" : step === "verify-phone" || step === "complete" ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "verify-email" ? "bg-purple-600 text-white" : step === "verify-phone" || step === "complete" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
                {step === "verify-phone" || step === "complete" ? <CheckCircle2 className="w-5 h-5" /> : <Mail className="w-4 h-4" />}
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:inline">Email</span>
            </div>
            <div className="flex-1 h-1 mx-2 bg-gray-200">
              <div className={`h-full ${step === "verify-phone" || step === "complete" ? "bg-green-600" : "bg-gray-200"} transition-all duration-300`}></div>
            </div>
            <div className={`flex items-center ${step === "verify-phone" ? "text-purple-600" : step === "complete" ? "text-green-600" : "text-gray-400"}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === "verify-phone" ? "bg-purple-600 text-white" : step === "complete" ? "bg-green-600 text-white" : "bg-gray-200"}`}>
                {step === "complete" ? <CheckCircle2 className="w-5 h-5" /> : <Phone className="w-4 h-4" />}
              </div>
              <span className="ml-2 text-sm font-medium hidden sm:inline">Phone</span>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        {step === "registration" && (
          <Card>
            <CardHeader>
              <CardTitle>Create Your Account</CardTitle>
              <CardDescription>Enter your details to get started with Naira Vault</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onRegister)} className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="John"
                      {...register("firstName")}
                      disabled={loading}
                    />
                    {errors.firstName && (
                      <p className="text-sm text-red-500">{errors.firstName.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Doe"
                      {...register("lastName")}
                      disabled={loading}
                    />
                    {errors.lastName && (
                      <p className="text-sm text-red-500">{errors.lastName.message}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    {...register("email")}
                    disabled={loading}
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+2348012345678"
                    {...register("phone")}
                    disabled={loading}
                  />
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    {...register("password")}
                    disabled={loading}
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    {...register("confirmPassword")}
                    disabled={loading}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    <>
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link to="/login" className="text-purple-600 hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </CardFooter>
          </Card>
        )}

        {/* Email OTP Verification */}
        {step === "verify-email" && (
          <Card>
            <CardHeader>
              <CardTitle>Verify Your Email</CardTitle>
              <CardDescription>
                We've sent a 6-digit code to <strong>{registrationData?.email}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <Mail className="w-12 h-12 text-purple-600" />
                  <Label>Enter Email Verification Code</Label>
                  <InputOTP
                    maxLength={6}
                    value={emailOTP}
                    onChange={setEmailOTP}
                    disabled={loading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button 
                  onClick={onVerifyEmail} 
                  className="w-full" 
                  disabled={loading || emailOTP.length !== 6}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Verify Email"
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => onResendOTP("email")}
                    disabled={loading}
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Didn't receive the code? Resend
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => setStep("registration")}
                className="w-full"
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Registration
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Phone OTP Verification */}
        {step === "verify-phone" && (
          <Card>
            <CardHeader>
              <CardTitle>Verify Your Phone</CardTitle>
              <CardDescription>
                We've sent a 6-digit code to <strong>{registrationData?.phone}</strong>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                  <Phone className="w-12 h-12 text-purple-600" />
                  <Label>Enter Phone Verification Code</Label>
                  <InputOTP
                    maxLength={6}
                    value={phoneOTP}
                    onChange={setPhoneOTP}
                    disabled={loading}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <Button 
                  onClick={onVerifyPhone} 
                  className="w-full" 
                  disabled={loading || phoneOTP.length !== 6}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    "Complete Registration"
                  )}
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => onResendOTP("phone")}
                    disabled={loading}
                    className="text-sm text-purple-600 hover:underline"
                  >
                    Didn't receive the code? Resend
                  </button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                onClick={() => setStep("verify-email")}
                className="w-full"
                disabled={loading}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Email Verification
              </Button>
            </CardFooter>
          </Card>
        )}

        {/* Registration Complete */}
        {step === "complete" && (
          <Card>
            <CardHeader>
              <CardTitle className="text-center">Registration Complete!</CardTitle>
              <CardDescription className="text-center">
                Welcome to Naira Vault
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-4 py-8">
              <CheckCircle2 className="w-20 h-20 text-green-600" />
              <p className="text-center text-gray-600">
                Your account has been successfully created and verified.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to dashboard...
              </p>
            </CardContent>
          </Card>
        )}

        {/* Back to Home Link */}
        <div className="mt-6 text-center">
          <Link to="/landing" className="text-sm text-gray-600 hover:text-purple-600">
            <ArrowLeft className="inline w-4 h-4 mr-1" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

