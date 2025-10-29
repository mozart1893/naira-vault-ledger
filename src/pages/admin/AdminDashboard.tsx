import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  DollarSign,
  TrendingUp,
  FileCheck,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  CheckCircle2
} from "lucide-react";

export default function AdminDashboard() {
  // Mock data - replace with real API calls
  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    pendingKYC: 23,
    verifiedKYC: 1115,
    todayTransactions: 156,
    todayVolume: 45678900.50,
    pendingTransactions: 8,
    totalWallets: 3892,
  };

  const recentUsers = [
    { id: 1, name: "John Doe", email: "john@example.com", status: "verified", joined: "2 hours ago" },
    { id: 2, name: "Jane Smith", email: "jane@example.com", status: "pending", joined: "5 hours ago" },
    { id: 3, name: "Bob Wilson", email: "bob@example.com", status: "verified", joined: "1 day ago" },
  ];

  const pendingKYC = [
    { id: 1, name: "Alice Johnson", email: "alice@example.com", submitted: "30 mins ago", type: "BVN" },
    { id: 2, name: "Charlie Brown", email: "charlie@example.com", submitted: "2 hours ago", type: "NIN" },
    { id: 3, name: "Diana Prince", email: "diana@example.com", submitted: "5 hours ago", type: "BVN" },
  ];

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
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600 font-medium">+12%</span> from last month
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
                <div className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% of total
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
                <div className="text-2xl font-bold">{stats.pendingKYC}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.verifiedKYC} verified
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
                  ₦{(stats.todayVolume / 1000000).toFixed(2)}M
                </div>
                <p className="text-xs text-muted-foreground">
                  {stats.todayTransactions} transactions
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
                  {recentUsers.map((user) => (
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
                        <span className="text-xs text-gray-500">{user.joined}</span>
                      </div>
                    </div>
                  ))}
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
                  {pendingKYC.map((kyc) => (
                    <div key={kyc.id} className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-yellow-100 rounded">
                          <Clock className="h-4 w-4 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{kyc.name}</p>
                          <p className="text-xs text-gray-500">{kyc.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge variant="outline">{kyc.type}</Badge>
                        <span className="text-xs text-gray-500">{kyc.submitted}</span>
                      </div>
                    </div>
                  ))}
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
                        {stats.pendingKYC} pending verifications
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

