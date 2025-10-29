import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { api } from "@/lib/api";
import { toast } from "sonner";
import {
  Loader2,
  Upload,
  CheckCircle2,
  XCircle,
  AlertCircle,
  FileText,
  Shield,
  Camera,
  ArrowRight,
  ArrowLeft,
  Info
} from "lucide-react";

const kycSchema = z.object({
  verificationType: z.enum(["bvn", "nin"], {
    required_error: "Please select a verification type",
  }),
  verificationNumber: z.string()
    .min(11, "Must be 11 digits")
    .max(11, "Must be 11 digits")
    .regex(/^\d{11}$/, "Must be exactly 11 digits"),
  idType: z.enum(["passport", "drivers_license", "voters_card", "national_id"], {
    required_error: "Please select an ID type",
  }),
  idNumber: z.string().min(5, "ID number is required"),
});

type KYCFormData = z.infer<typeof kycSchema>;

type KYCStep = "info" | "verification" | "documents" | "review" | "submitted";

export default function KYCVerification() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<KYCStep>("info");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  // File uploads
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [idCardPreview, setIdCardPreview] = useState<string | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [selfiePreview, setSelfiePreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<KYCFormData>({
    resolver: zodResolver(kycSchema),
  });

  const verificationType = watch("verificationType");
  const idType = watch("idType");

  // Update progress based on step
  const updateProgress = (currentStep: KYCStep) => {
    const progressMap = {
      info: 0,
      verification: 25,
      documents: 50,
      review: 75,
      submitted: 100,
    };
    setProgress(progressMap[currentStep]);
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: "idCard" | "selfie"
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      toast.error("Please upload an image (JPG, PNG) or PDF file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    // Create preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === "idCard") {
          setIdCardPreview(reader.result as string);
        } else {
          setSelfiePreview(reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }

    if (type === "idCard") {
      setIdCardFile(file);
    } else {
      setSelfieFile(file);
    }
  };

  const onSubmitKYC = async (data: KYCFormData) => {
    if (!idCardFile || !selfieFile) {
      toast.error("Please upload all required documents");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Convert files to base64
      const idCardBase64 = await fileToBase64(idCardFile);
      const selfieBase64 = await fileToBase64(selfieFile);

      const kycData = {
        verificationType: data.verificationType,
        verificationNumber: data.verificationNumber,
        idType: data.idType,
        idNumber: data.idNumber,
        documents: {
          idCard: idCardBase64,
          idCardType: idCardFile.type,
          idCardName: idCardFile.name,
          selfie: selfieBase64,
          selfieType: selfieFile.type,
          selfieName: selfieFile.name,
        },
      };

      // Submit KYC to backend
      const response = await api.submitKYC(kycData);

      if (response.success) {
        setStep("submitted");
        updateProgress("submitted");
        toast.success("KYC documents submitted successfully!");

        // Update user KYC status in context
        if (user) {
          setUser({
            ...user,
            kycStatus: "pending",
          });
        }
      } else {
        throw new Error(response.error?.message || "Submission failed");
      }
    } catch (err: any) {
      const errorMessage = err.message || "KYC submission failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data:image/...;base64, prefix
        resolve(base64.split(',')[1]);
      };
      reader.onerror = reject;
    });
  };

  const getKYCStatusInfo = () => {
    switch (user?.kycStatus) {
      case "verified":
        return {
          color: "green",
          icon: CheckCircle2,
          text: "Your identity is verified",
          description: "You have full access to all platform features",
        };
      case "pending":
        return {
          color: "yellow",
          icon: AlertCircle,
          text: "Verification in progress",
          description: "Your documents are being reviewed. This usually takes 24-48 hours.",
        };
      case "rejected":
        return {
          color: "red",
          icon: XCircle,
          text: "Verification failed",
          description: "Please resubmit your documents with correct information.",
        };
      default:
        return {
          color: "gray",
          icon: Info,
          text: "Identity not verified",
          description: "Complete KYC verification to access all features",
        };
    }
  };

  const status = getKYCStatusInfo();
  const StatusIcon = status.icon;

  // If already verified
  if (user?.kycStatus === "verified") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                  <div>
                    <CardTitle>Identity Verified</CardTitle>
                    <CardDescription>Your KYC verification is complete</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✅ Your identity has been successfully verified
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    You now have full access to all platform features including higher transaction limits.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Verification Method:</p>
                    <p className="font-medium">BVN/NIN</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Status:</p>
                    <Badge className="bg-green-600">Verified</Badge>
                  </div>
                </div>
                <div className="pt-4">
                  <Button onClick={() => navigate("/dashboard")}>
                    Go to Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  // If verification is pending
  if (user?.kycStatus === "pending" && step !== "submitted") {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 py-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <AlertCircle className="h-8 w-8 text-yellow-600" />
                  <div>
                    <CardTitle>Verification In Progress</CardTitle>
                    <CardDescription>Your KYC documents are being reviewed</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-yellow-800 font-medium">
                    ⏳ Your documents are under review
                  </p>
                  <p className="text-yellow-600 text-sm mt-1">
                    This process usually takes 24-48 hours. You'll receive an email notification once complete.
                  </p>
                </div>
                <div className="pt-4 space-x-4">
                  <Button onClick={() => navigate("/dashboard")}>
                    Go to Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/profile")}>
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Progress Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">KYC Verification</h1>
            <p className="text-gray-600">Complete your identity verification to access all features</p>
            <div className="mt-4">
              <Progress value={progress} className="h-2" />
              <div className="flex justify-between mt-2 text-xs text-gray-500">
                <span>Start</span>
                <span>Information</span>
                <span>Documents</span>
                <span>Review</span>
                <span>Complete</span>
              </div>
            </div>
          </div>

          {/* Info Step */}
          {step === "info" && (
            <Card>
              <CardHeader>
                <CardTitle>Why We Need This Information</CardTitle>
                <CardDescription>
                  KYC (Know Your Customer) verification is required by financial regulations
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Your personal information is encrypted and securely stored. We comply with all data protection regulations.
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Higher Transaction Limits</p>
                      <p className="text-sm text-gray-600">
                        Access higher daily and monthly transaction limits
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Full Platform Access</p>
                      <p className="text-sm text-gray-600">
                        Unlock all features including international transfers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="font-medium">Enhanced Security</p>
                      <p className="text-sm text-gray-600">
                        Protect your account with verified identity
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">What You'll Need:</h4>
                  <ul className="space-y-1 text-sm text-blue-800">
                    <li>• BVN (Bank Verification Number) or NIN (National Identity Number)</li>
                    <li>• Government-issued ID (Passport, Driver's License, Voter's Card, or National ID)</li>
                    <li>• Clear photo of yourself (selfie)</li>
                  </ul>
                </div>

                <div className="flex justify-end pt-4">
                  <Button onClick={() => { setStep("verification"); updateProgress("verification"); }}>
                    Continue
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Verification Step */}
          {step === "verification" && (
            <Card>
              <CardHeader>
                <CardTitle>Identity Verification</CardTitle>
                <CardDescription>
                  Provide your BVN or NIN for identity verification
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(() => { setStep("documents"); updateProgress("documents"); })} className="space-y-6">
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Verification Type */}
                  <div className="space-y-3">
                    <Label>Verification Type *</Label>
                    <RadioGroup
                      value={verificationType}
                      onValueChange={(value) => setValue("verificationType", value as "bvn" | "nin")}
                    >
                      <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="bvn" id="bvn" />
                        <Label htmlFor="bvn" className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">BVN (Bank Verification Number)</p>
                            <p className="text-sm text-gray-500">
                              Your 11-digit Bank Verification Number
                            </p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 border p-4 rounded-lg cursor-pointer hover:bg-gray-50">
                        <RadioGroupItem value="nin" id="nin" />
                        <Label htmlFor="nin" className="flex-1 cursor-pointer">
                          <div>
                            <p className="font-medium">NIN (National Identity Number)</p>
                            <p className="text-sm text-gray-500">
                              Your 11-digit National Identity Number
                            </p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                    {errors.verificationType && (
                      <p className="text-sm text-red-500">{errors.verificationType.message}</p>
                    )}
                  </div>

                  {/* Verification Number */}
                  <div className="space-y-2">
                    <Label htmlFor="verificationNumber">
                      {verificationType === "bvn" ? "BVN" : "NIN"} Number *
                    </Label>
                    <Input
                      id="verificationNumber"
                      type="text"
                      placeholder="Enter 11-digit number"
                      maxLength={11}
                      {...register("verificationNumber")}
                      disabled={loading}
                    />
                    {errors.verificationNumber && (
                      <p className="text-sm text-red-500">{errors.verificationNumber.message}</p>
                    )}
                    <p className="text-xs text-gray-500">
                      This will be validated against the CBN database
                    </p>
                  </div>

                  {/* ID Type */}
                  <div className="space-y-2">
                    <Label htmlFor="idType">Government-Issued ID Type *</Label>
                    <Select
                      value={idType}
                      onValueChange={(value) => setValue("idType", value as any)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select ID type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="passport">International Passport</SelectItem>
                        <SelectItem value="drivers_license">Driver's License</SelectItem>
                        <SelectItem value="voters_card">Voter's Card</SelectItem>
                        <SelectItem value="national_id">National ID Card</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.idType && (
                      <p className="text-sm text-red-500">{errors.idType.message}</p>
                    )}
                  </div>

                  {/* ID Number */}
                  <div className="space-y-2">
                    <Label htmlFor="idNumber">ID Number *</Label>
                    <Input
                      id="idNumber"
                      type="text"
                      placeholder="Enter ID number as shown on document"
                      {...register("idNumber")}
                      disabled={loading}
                    />
                    {errors.idNumber && (
                      <p className="text-sm text-red-500">{errors.idNumber.message}</p>
                    )}
                  </div>

                  <div className="flex justify-between pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => { setStep("info"); updateProgress("info"); }}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button type="submit" disabled={loading}>
                      Continue
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Documents Step */}
          {step === "documents" && (
            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>
                  Upload clear photos of your ID and a selfie
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* ID Card Upload */}
                <div className="space-y-3">
                  <Label>Government-Issued ID *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    {idCardPreview ? (
                      <div className="space-y-4">
                        <img
                          src={idCardPreview}
                          alt="ID Card"
                          className="max-h-48 mx-auto rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{idCardFile?.name}</p>
                          <p className="text-xs text-gray-500">
                            {(idCardFile!.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setIdCardFile(null);
                            setIdCardPreview(null);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <label htmlFor="id-upload" className="cursor-pointer">
                            <span className="text-purple-600 hover:text-purple-700 font-medium">
                              Click to upload
                            </span>
                            <span className="text-gray-600"> or drag and drop</span>
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, or PDF (max 5MB)
                          </p>
                        </div>
                        <input
                          id="id-upload"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,application/pdf"
                          onChange={(e) => handleFileUpload(e, "idCard")}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload a clear photo of your {idType?.replace("_", " ") || "government ID"}
                  </p>
                </div>

                {/* Selfie Upload */}
                <div className="space-y-3">
                  <Label>Selfie Photo *</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                    {selfiePreview ? (
                      <div className="space-y-4">
                        <img
                          src={selfiePreview}
                          alt="Selfie"
                          className="max-h-48 mx-auto rounded"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-700">{selfieFile?.name}</p>
                          <p className="text-xs text-gray-500">
                            {(selfieFile!.size / 1024).toFixed(2)} KB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelfieFile(null);
                            setSelfiePreview(null);
                          }}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <Camera className="h-12 w-12 text-gray-400 mx-auto" />
                        <div>
                          <label htmlFor="selfie-upload" className="cursor-pointer">
                            <span className="text-purple-600 hover:text-purple-700 font-medium">
                              Click to upload
                            </span>
                            <span className="text-gray-600"> or drag and drop</span>
                          </label>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG or JPG (max 5MB)
                          </p>
                        </div>
                        <input
                          id="selfie-upload"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={(e) => handleFileUpload(e, "selfie")}
                          className="hidden"
                        />
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    Upload a clear photo of yourself for identity verification
                  </p>
                </div>

                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Photo Requirements:</strong> Make sure your face is clearly visible, well-lit, and matches your ID photo.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setStep("verification"); updateProgress("verification"); }}
                    disabled={loading}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      if (idCardFile && selfieFile) {
                        setStep("review");
                        updateProgress("review");
                      } else {
                        toast.error("Please upload both documents before continuing");
                      }
                    }}
                    disabled={!idCardFile || !selfieFile || loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Continue to Review
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Review Step */}
          {step === "review" && (
            <Card>
              <CardHeader>
                <CardTitle>Review Your Information</CardTitle>
                <CardDescription>
                  Please verify all information is correct before submitting
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600">Verification Method</Label>
                    <p className="text-lg font-medium mt-1">
                      {watch("verificationType")?.toUpperCase()}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">
                      {watch("verificationType") === "bvn" ? "BVN" : "NIN"} Number
                    </Label>
                    <p className="text-lg font-medium mt-1">
                      {watch("verificationNumber")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">ID Type</Label>
                    <p className="text-lg font-medium mt-1 capitalize">
                      {watch("idType")?.replace("_", " ")}
                    </p>
                  </div>
                  <div>
                    <Label className="text-gray-600">ID Number</Label>
                    <p className="text-lg font-medium mt-1">
                      {watch("idNumber")}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-600">Uploaded Documents</Label>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center space-x-2 text-sm">
                        <FileText className="h-4 w-4 text-gray-400" />
                        <span>{idCardFile?.name}</span>
                        <Badge variant="outline">ID Card</Badge>
                      </div>
                      <div className="flex items-center space-x-2 text-sm">
                        <Camera className="h-4 w-4 text-gray-400" />
                        <span>{selfieFile?.name}</span>
                        <Badge variant="outline">Selfie</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    By submitting, you confirm that all information provided is accurate and belongs to you. False information may result in account suspension.
                  </AlertDescription>
                </Alert>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => { setStep("documents"); updateProgress("documents"); }}
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button onClick={handleSubmit(onSubmitKYC)} disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit for Verification
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Submitted Step */}
          {step === "submitted" && (
            <Card>
              <CardHeader>
                <div className="text-center">
                  <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto mb-4" />
                  <CardTitle>KYC Documents Submitted!</CardTitle>
                  <CardDescription>
                    Your verification is now being processed
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-green-800 font-medium">
                    ✅ Your documents have been received
                  </p>
                  <p className="text-green-600 text-sm mt-1">
                    We'll review your information and notify you via email within 24-48 hours
                  </p>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">What Happens Next:</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="rounded-full bg-purple-100 p-1 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-purple-600" />
                      </div>
                      <p className="text-gray-700">
                        Our team will verify your BVN/NIN against the CBN database
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="rounded-full bg-purple-100 p-1 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-purple-600" />
                      </div>
                      <p className="text-gray-700">
                        We'll verify your ID documents and selfie photo
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="rounded-full bg-purple-100 p-1 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-purple-600" />
                      </div>
                      <p className="text-gray-700">
                        You'll receive an email notification with the verification result
                      </p>
                    </div>
                    <div className="flex items-start space-x-2">
                      <div className="rounded-full bg-purple-100 p-1 mt-0.5">
                        <div className="h-2 w-2 rounded-full bg-purple-600" />
                      </div>
                      <p className="text-gray-700">
                        Once verified, you'll have full access to all features
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button onClick={() => navigate("/dashboard")}>
                    Go to Dashboard
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <footer className="py-4 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 NairaVault Ledger System
          </p>
        </div>
      </footer>
    </div>
  );
}

