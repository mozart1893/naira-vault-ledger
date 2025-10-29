import { useState, useEffect } from "react";
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
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { 
  Loader2, 
  Edit2, 
  Save, 
  X, 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Calendar,
  CheckCircle,
  XCircle
} from "lucide-react";

const profileSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phone: z.string().regex(/^\+?[1-9]\d{10,14}$/, "Please enter a valid phone number with country code"),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      phone: user?.phone || "",
    },
  });

  // Fetch complete profile data on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.getProfile();
        if (response.success && response.data) {
          setProfileData(response.data);
          reset({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            phone: response.data.phone,
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
      }
    };

    fetchProfile();
  }, [reset]);

  const getUserInitials = () => {
    if (!user) return "U";
    const firstInitial = user.firstName?.charAt(0) || "";
    const lastInitial = user.lastName?.charAt(0) || "";
    return (firstInitial + lastInitial).toUpperCase() || "U";
  };

  const onSubmit = async (data: ProfileFormData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.updateProfile(data);
      
      if (response.success && response.data) {
        // Update auth context
        setUser({
          ...user!,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          phone: response.data.phone,
        });
        
        setProfileData({
          ...profileData,
          ...response.data
        });

        toast.success("Profile updated successfully!");
        setIsEditing(false);
      } else {
        setError(response.error?.message || "Failed to update profile");
        toast.error(response.error?.message || "Update failed");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Failed to update profile";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    reset({
      firstName: profileData?.firstName || user?.firstName || "",
      lastName: profileData?.lastName || user?.lastName || "",
      phone: profileData?.phone || user?.phone || "",
    });
    setIsEditing(false);
    setError(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Profile Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
            <p className="text-gray-600 mt-2">Manage your account information</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Summary Card */}
            <Card className="lg:col-span-1">
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24">
                    <AvatarFallback className="bg-purple-600 text-white text-2xl">
                      {getUserInitials()}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-xl">
                  {user?.firstName} {user?.lastName}
                </CardTitle>
                <CardDescription>{user?.email}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Account Type</span>
                  <Badge variant="outline" className="capitalize">
                    {user?.accountType || "Individual"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">KYC Status</span>
                  <Badge 
                    variant={user?.kycStatus === "verified" ? "default" : "secondary"}
                    className="capitalize"
                  >
                    {user?.kycStatus || "Pending"}
                  </Badge>
                </div>
                <Separator />
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Email Verified</span>
                    {profileData?.emailVerified ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Phone Verified</span>
                    {profileData?.phoneVerified ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-gray-400" />
                    )}
                  </div>
                </div>
                <Separator />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>Member since {formatDate(profileData?.createdAt)}</span>
                  </div>
                  {profileData?.lastLoginAt && (
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>Last login {formatDate(profileData?.lastLoginAt)}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Profile Details Card */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      {isEditing ? "Edit your profile details" : "Your personal information"}
                    </CardDescription>
                  </div>
                  {!isEditing && (
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit2 className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {error && (
                  <Alert variant="destructive" className="mb-6">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {!isEditing ? (
                  // View Mode
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-gray-600 text-sm">First Name</Label>
                        <div className="mt-1 flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{user?.firstName || "Not set"}</span>
                        </div>
                      </div>
                      <div>
                        <Label className="text-gray-600 text-sm">Last Name</Label>
                        <div className="mt-1 flex items-center">
                          <User className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900">{user?.lastName || "Not set"}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-600 text-sm">Email Address</Label>
                      <div className="mt-1 flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{user?.email}</span>
                        {profileData?.emailVerified && (
                          <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                    </div>

                    <div>
                      <Label className="text-gray-600 text-sm">Phone Number</Label>
                      <div className="mt-1 flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900">{user?.phone || "Not set"}</span>
                        {profileData?.phoneVerified && (
                          <Badge variant="outline" className="ml-2 text-green-600 border-green-600">
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label className="text-gray-600 text-sm">Account Type</Label>
                      <div className="mt-1 flex items-center">
                        <Shield className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-gray-900 capitalize">{user?.accountType || "Individual"}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Edit Mode
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <p className="text-xs text-gray-500">
                        Changing your phone number will require re-verification
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-gray-600">Email Address</Label>
                      <Input
                        value={user?.email}
                        disabled
                        className="bg-gray-50"
                      />
                      <p className="text-xs text-gray-500">
                        Email address cannot be changed for security reasons
                      </p>
                    </div>

                    <div className="flex items-center gap-4 pt-4">
                      <Button type="submit" disabled={loading} className="flex-1">
                        {loading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={loading}
                        className="flex-1"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Additional Information */}
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Security Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Security</CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium">Password</p>
                      <p className="text-xs text-gray-500">Last changed recently</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    Change
                  </Button>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium">Email Verification</p>
                      <p className="text-xs text-gray-500">
                        {profileData?.emailVerified ? "Verified" : "Not verified"}
                      </p>
                    </div>
                  </div>
                  {profileData?.emailVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Button variant="ghost" size="sm">
                      Verify
                    </Button>
                  )}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                      <p className="text-sm font-medium">Phone Verification</p>
                      <p className="text-xs text-gray-500">
                        {profileData?.phoneVerified ? "Verified" : "Not verified"}
                      </p>
                    </div>
                  </div>
                  {profileData?.phoneVerified ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Button variant="ghost" size="sm">
                      Verify
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Account Activity Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Account Activity</CardTitle>
                <CardDescription>Recent account information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Member Since</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(profileData?.createdAt)}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium">Last Login</p>
                    <p className="text-xs text-gray-500">
                      {profileData?.lastLoginAt 
                        ? formatDate(profileData.lastLoginAt)
                        : "Just now"}
                    </p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center">
                  <Shield className="h-5 w-5 text-gray-400 mr-3" />
                  <div>
                    <p className="text-sm font-medium">KYC Status</p>
                    <p className="text-xs text-gray-500 capitalize">
                      {user?.kycStatus || "Not started"}
                    </p>
                  </div>
                </div>
                {user?.kycStatus !== "verified" && (
                  <>
                    <Separator />
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      size="sm"
                      onClick={() => navigate("/kyc")}
                      disabled={user?.kycStatus === "pending"}
                    >
                      {user?.kycStatus === "pending" 
                        ? "KYC Verification Pending" 
                        : "Complete KYC Verification"}
                    </Button>
                    {user?.kycStatus === "pending" && (
                      <p className="text-xs text-center text-gray-500 mt-2">
                        Your documents are being reviewed
                      </p>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Danger Zone */}
          <Card className="mt-6 border-red-200">
            <CardHeader>
              <CardTitle className="text-lg text-red-600">Danger Zone</CardTitle>
              <CardDescription>Irreversible account actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">Delete Account</p>
                  <p className="text-xs text-gray-500">
                    Permanently delete your account and all associated data
                  </p>
                </div>
                <Button variant="destructive" size="sm" disabled>
                  Delete Account
                </Button>
              </div>
            </CardContent>
          </Card>
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

