import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { adminApi } from "@/lib/api";
import { toast } from "sonner";
import {
  Users,
  DollarSign,
  TrendingUp,
  FileCheck,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2,
  Loader2
} from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [pendingKYC, setPendingKYC] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch stats
      const statsResponse = await adminApi.getAdminStats();
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }

      // Fetch recent users
      const usersResponse = await adminApi.getRecentUsers(5);
      if (usersResponse.success) {
        setRecentUsers(usersResponse.data);
      }

      // Fetch pending KYC
      const kycResponse = await adminApi.getPendingKYC();
      if (kycResponse.success) {
        setPendingKYC(kycResponse.data.slice(0, 3)); // Show only 3
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} mins ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Overview of system metrics and activity</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.totalUsers?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.activeUsers || 0} active users
                </p>
              </CardContent>
            </Card>

            {/* Active Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.activeUsers?.toLocaleString() || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.totalUsers ? ((stats.activeUsers / stats.totalUsers) * 100).toFixed(1) : 0}% of total
                </p>
              </CardContent>
            </Card>

            {/* Pending KYC */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
                <FileCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats?.pendingKYC || 0}</div>
                <p className="text-xs text-muted-foreground">
                  {stats?.verifiedKYC || 0} verified
                </p>
              </CardContent>
            </Card>

            {/* Today's Volume */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today's Volume</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₦{((stats?.todayVolume || 0) / 1000000).toFixed(2)}M
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats?.todayTransactions || 0} transactions
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Users */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Recent Users</CardTitle>
                    <CardDescription>Latest user registrations</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentUsers.length > 0 ? (
                    recentUsers.map((user) => (
                      <div key={user.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="text-sm font-medium">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant={user.status === "verified" ? "default" : "secondary"}>
                            {user.status}
                          </Badge>
                          <span className="text-xs text-gray-500">{formatTimeAgo(user.joined)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No recent users</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Pending KYC Verifications */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center">
                      Pending KYC
                      <Badge variant="secondary" className="ml-2">
                        {pendingKYC.length}
                      </Badge>
                    </CardTitle>
                    <CardDescription>Awaiting verification review</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    Review All
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingKYC.length > 0 ? (
                    pendingKYC.map((kyc) => (
                      <div key={kyc.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="p-2 bg-yellow-100 rounded">
                            <Clock className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <p className="text-sm font-medium">{kyc.user.name}</p>
                            <p className="text-xs text-gray-500">{kyc.user.email}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Badge variant="outline">{kyc.verificationType}</Badge>
                          <span className="text-xs text-gray-500">{formatTimeAgo(kyc.submittedAt)}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 text-center py-4">No pending KYC</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common administrative tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="justify-start h-auto py-4">
                  <div className="flex items-start space-x-3">
                    <FileCheck className="h-5 w-5 text-purple-600 mt-0.5" />
                    <div className="text-left">
                      <p className="font-medium">Review KYC Submissions</p>
                      <p className="text-xs text-gray-500">
                        {stats?.pendingKYC || 0} pending verifications
                      </p>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto py-4">
                  <div className="flex items-start space-x-3">
                    <Users className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div className="text-left">
                      <p className="font-medium">Manage Users</p>
                      <p className="text-xs text-gray-500">
                        View and manage all users
                      </p>
                    </div>
                  </div>
                </Button>

                <Button variant="outline" className="justify-start h-auto py-4">
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-green-600 mt-0.5" />
                    <div className="text-left">
                      <p className="font-medium">View Analytics</p>
                      <p className="text-xs text-gray-500">
                        System reports and insights
                      </p>
                    </div>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

