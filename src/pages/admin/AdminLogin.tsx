import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { Loader2, Shield, Lock } from "lucide-react";

const adminLoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  token: z.string().min(6, "2FA token must be at least 6 characters"),
});

type AdminLoginFormData = z.infer<typeof adminLoginSchema>;

export default function AdminLogin() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminLoginFormData>({
    resolver: zodResolver(adminLoginSchema),
  });

  const onLogin = async (data: AdminLoginFormData) => {
    setLoading(true);
    setError(null);

    try {
      // TODO: Implement actual admin login API call
      // const response = await api.adminLogin(data.email, data.password, data.token);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // For demo purposes, accept specific credentials
      if (data.email === "admin@nairavault.com" && data.password === "Admin@123" && data.token === "000000") {
        localStorage.setItem('admin_token', 'demo-admin-token');
        toast.success("Admin login successful!");
        navigate("/admin/dashboard");
      } else {
        setError("Invalid credentials or 2FA token");
        toast.error("Login failed");
      }
    } catch (err: any) {
      const errorMessage = err.message || "Admin login failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="w-full max-w-md p-4">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-4 bg-purple-600 rounded-full">
              <Shield className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-white">Admin Portal</h1>
          <p className="text-purple-200 mt-2">Naira Vault Ledger - Back Office</p>
        </div>

        <Card className="border-purple-200">
          <CardHeader>
            <CardTitle>Admin Sign In</CardTitle>
            <CardDescription>
              Enter your admin credentials to access the back office
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Demo Credentials Alert */}
              <Alert className="bg-blue-50 border-blue-200">
                <Lock className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <p className="font-medium">Demo Credentials:</p>
                  <p className="text-sm mt-1">Email: admin@nairavault.com</p>
                  <p className="text-sm">Password: Admin@123</p>
                  <p className="text-sm">2FA Token: 000000</p>
                </AlertDescription>
              </Alert>

              <div className="space-y-2">
                <Label htmlFor="email">Admin Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@nairavault.com"
                  {...register("email")}
                  disabled={loading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
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
                <Label htmlFor="token">2FA Token</Label>
                <Input
                  id="token"
                  type="text"
                  placeholder="Enter 2FA token"
                  {...register("token")}
                  disabled={loading}
                />
                {errors.token && (
                  <p className="text-sm text-red-500">{errors.token.message}</p>
                )}
                <p className="text-xs text-gray-500">
                  Enter your two-factor authentication code
                </p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <Shield className="mr-2 h-4 w-4" />
                    Admin Sign In
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-purple-200">
            Back to{" "}
            <a href="/landing" className="text-purple-300 hover:text-white underline">
              Main Site
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

