import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import {
  Bell,
  Shield,
  Palette,
  Globe,
  Lock,
  Mail,
  Phone,
  Smartphone,
  Database,
  Download,
  Trash2,
  Save,
  AlertTriangle
} from "lucide-react";

export default function Settings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Notification Settings
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(false);
  const [transactionAlerts, setTransactionAlerts] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  
  // Privacy Settings
  const [profileVisible, setProfileVisible] = useState(false);
  const [showActivity, setShowActivity] = useState(true);
  const [dataSharing, setDataSharing] = useState(false);
  
  // Security Settings
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginAlerts, setLoginAlerts] = useState(true);
  
  // Display Settings
  const [darkMode, setDarkMode] = useState(false);
  const [compactView, setCompactView] = useState(false);
  
  const [loading, setLoading] = useState(false);

  const handleSaveNotifications = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to save notification settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Notification settings saved!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrivacy = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to save privacy settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Privacy settings saved!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSecurity = async () => {
    setLoading(true);
    try {
      // TODO: Implement API call to save security settings
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      toast.success("Security settings saved!");
    } catch (error) {
      toast.error("Failed to save settings");
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    toast.success("Data export started! You'll receive an email when ready.");
  };

  const handleDeleteData = () => {
    toast.info("This feature requires additional verification");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
            <p className="text-gray-600 mt-2">Manage your account preferences and settings</p>
          </div>

          {/* Settings Tabs */}
          <Tabs defaultValue="notifications" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </TabsTrigger>
              <TabsTrigger value="security">
                <Shield className="h-4 w-4 mr-2" />
                Security
              </TabsTrigger>
              <TabsTrigger value="privacy">
                <Lock className="h-4 w-4 mr-2" />
                Privacy
              </TabsTrigger>
              <TabsTrigger value="preferences">
                <Palette className="h-4 w-4 mr-2" />
                Preferences
              </TabsTrigger>
            </TabsList>

            {/* Notifications Tab */}
            <TabsContent value="notifications">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Choose how you want to be notified about account activity
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Email Notifications */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label htmlFor="email-notifications" className="text-base">
                            Email Notifications
                          </Label>
                          <p className="text-sm text-gray-500">
                            Receive notifications via email
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="email-notifications"
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>

                    <Separator />

                    {/* SMS Notifications */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label htmlFor="sms-notifications" className="text-base">
                            SMS Notifications
                          </Label>
                          <p className="text-sm text-gray-500">
                            Receive notifications via text message
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="sms-notifications"
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                      />
                    </div>

                    <Separator />

                    {/* Push Notifications */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Smartphone className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label htmlFor="push-notifications" className="text-base">
                            Push Notifications
                          </Label>
                          <p className="text-sm text-gray-500">
                            Receive push notifications in your browser
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="push-notifications"
                        checked={pushNotifications}
                        onCheckedChange={setPushNotifications}
                      />
                    </div>

                    <Separator />

                    {/* Transaction Alerts */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Bell className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label htmlFor="transaction-alerts" className="text-base">
                            Transaction Alerts
                          </Label>
                          <p className="text-sm text-gray-500">
                            Get notified of all transactions
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="transaction-alerts"
                        checked={transactionAlerts}
                        onCheckedChange={setTransactionAlerts}
                      />
                    </div>

                    <Separator />

                    {/* Marketing Emails */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label htmlFor="marketing-emails" className="text-base">
                            Marketing Emails
                          </Label>
                          <p className="text-sm text-gray-500">
                            Receive updates about new features and offers
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="marketing-emails"
                        checked={marketingEmails}
                        onCheckedChange={setMarketingEmails}
                      />
                    </div>

                    <div className="pt-4">
                      <Button onClick={handleSaveNotifications} disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Notification Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security and authentication
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Two-Factor Authentication */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Shield className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label htmlFor="two-factor" className="text-base">
                            Two-Factor Authentication
                          </Label>
                          <p className="text-sm text-gray-500">
                            Add an extra layer of security to your account
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="two-factor"
                        checked={twoFactorEnabled}
                        onCheckedChange={setTwoFactorEnabled}
                      />
                    </div>

                    <Separator />

                    {/* Login Alerts */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Bell className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label htmlFor="login-alerts" className="text-base">
                            Login Alerts
                          </Label>
                          <p className="text-sm text-gray-500">
                            Get notified when someone logs into your account
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="login-alerts"
                        checked={loginAlerts}
                        onCheckedChange={setLoginAlerts}
                      />
                    </div>

                    <Separator />

                    {/* KYC Verification */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Shield className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label className="text-base">KYC Verification</Label>
                          <p className="text-sm text-gray-500">
                            {user?.kycStatus === "verified" 
                              ? "Your identity is verified" 
                              : user?.kycStatus === "pending"
                              ? "Verification in progress"
                              : "Verify your identity"}
                          </p>
                        </div>
                      </div>
                      {user?.kycStatus === "verified" ? (
                        <span className="text-green-600 text-sm font-medium">✅ Verified</span>
                      ) : user?.kycStatus === "pending" ? (
                        <span className="text-yellow-600 text-sm font-medium">⏳ Pending</span>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => navigate("/kyc")}
                        >
                          Complete KYC
                        </Button>
                      )}
                    </div>

                    <Separator />

                    {/* Password */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Lock className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label className="text-base">Password</Label>
                          <p className="text-sm text-gray-500">
                            Change your account password
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        Change Password
                      </Button>
                    </div>

                    <Separator />

                    {/* Active Sessions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Smartphone className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label className="text-base">Active Sessions</Label>
                          <p className="text-sm text-gray-500">
                            Manage devices logged into your account
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        View Sessions
                      </Button>
                    </div>

                    <div className="pt-4">
                      <Button onClick={handleSaveSecurity} disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Security Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Privacy Tab */}
            <TabsContent value="privacy">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Privacy Settings</CardTitle>
                    <CardDescription>
                      Control your privacy and data sharing preferences
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Profile Visibility */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Globe className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label htmlFor="profile-visible" className="text-base">
                            Public Profile
                          </Label>
                          <p className="text-sm text-gray-500">
                            Make your profile visible to other users
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="profile-visible"
                        checked={profileVisible}
                        onCheckedChange={setProfileVisible}
                      />
                    </div>

                    <Separator />

                    {/* Activity Status */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Database className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label htmlFor="show-activity" className="text-base">
                            Show Activity Status
                          </Label>
                          <p className="text-sm text-gray-500">
                            Let others see when you're online
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="show-activity"
                        checked={showActivity}
                        onCheckedChange={setShowActivity}
                      />
                    </div>

                    <Separator />

                    {/* Data Sharing */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Shield className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label htmlFor="data-sharing" className="text-base">
                            Data Sharing
                          </Label>
                          <p className="text-sm text-gray-500">
                            Share anonymous usage data to improve the service
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="data-sharing"
                        checked={dataSharing}
                        onCheckedChange={setDataSharing}
                      />
                    </div>

                    <div className="pt-4">
                      <Button onClick={handleSavePrivacy} disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Privacy Settings
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Data Management */}
                <Card>
                  <CardHeader>
                    <CardTitle>Data Management</CardTitle>
                    <CardDescription>
                      Download or delete your personal data
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Download className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label className="text-base">Export Data</Label>
                          <p className="text-sm text-gray-500">
                            Download a copy of your data
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" onClick={handleExportData}>
                        Request Export
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Trash2 className="h-5 w-5 text-red-500" />
                        <div>
                          <Label className="text-base text-red-600">Delete All Data</Label>
                          <p className="text-sm text-gray-500">
                            Permanently delete all your personal data
                          </p>
                        </div>
                      </div>
                      <Button variant="destructive" size="sm" onClick={handleDeleteData}>
                        Delete Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Preferences Tab */}
            <TabsContent value="preferences">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Display Preferences</CardTitle>
                    <CardDescription>
                      Customize how the application looks and feels
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Dark Mode */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Palette className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label htmlFor="dark-mode" className="text-base">
                            Dark Mode
                          </Label>
                          <p className="text-sm text-gray-500">
                            Use dark theme throughout the application
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="dark-mode"
                        checked={darkMode}
                        onCheckedChange={setDarkMode}
                      />
                    </div>

                    <Separator />

                    {/* Compact View */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Database className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label htmlFor="compact-view" className="text-base">
                            Compact View
                          </Label>
                          <p className="text-sm text-gray-500">
                            Show more information in less space
                          </p>
                        </div>
                      </div>
                      <Switch
                        id="compact-view"
                        checked={compactView}
                        onCheckedChange={setCompactView}
                      />
                    </div>

                    <div className="pt-4">
                      <Button disabled={loading}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Display Preferences
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Language & Region */}
                <Card>
                  <CardHeader>
                    <CardTitle>Language & Region</CardTitle>
                    <CardDescription>
                      Set your preferred language and regional settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Globe className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label className="text-base">Language</Label>
                          <p className="text-sm text-gray-500">
                            Current: English (US)
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        Change Language
                      </Button>
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Globe className="h-5 w-5 text-gray-400" />
                        <div>
                          <Label className="text-base">Default Currency</Label>
                          <p className="text-sm text-gray-500">
                            Current: NGN (Nigerian Naira)
                          </p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm" disabled>
                        Change Currency
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          {/* Account Info */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Your account details and status</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Account ID:</span>
                  <span className="ml-2 font-mono text-xs">{user?.id}</span>
                </div>
                <div>
                  <span className="text-gray-600">Account Type:</span>
                  <span className="ml-2 capitalize">{user?.accountType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2">{user?.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">KYC Status:</span>
                  <span className="ml-2 capitalize">{user?.kycStatus}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Danger Zone */}
          <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">Danger Zone</p>
                  <p className="text-sm mt-1">
                    Deactivate or delete your account. This action cannot be undone.
                  </p>
                </div>
                <Button variant="destructive" size="sm" disabled>
                  Deactivate Account
                </Button>
              </div>
            </AlertDescription>
          </Alert>
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

