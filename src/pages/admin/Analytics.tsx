import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

export default function Analytics() {
  // Mock data
  const metrics = {
    totalUsers: 1247,
    newUsersToday: 23,
    newUsersChange: 12.5,
    totalVolume: 456789000,
    volumeChange: 8.3,
    totalTransactions: 8942,
    transactionsChange: -2.4,
    totalWallets: 3892,
  };

  const userGrowth = [
    { month: "Jun", users: 450 },
    { month: "Jul", users: 680 },
    { month: "Aug", users: 890 },
    { month: "Sep", users: 1050 },
    { month: "Oct", users: 1247 },
  ];

  const transactionVolume = [
    { date: "Oct 24", volume: 42500000 },
    { date: "Oct 25", volume: 38900000 },
    { date: "Oct 26", volume: 51200000 },
    { date: "Oct 27", volume: 47800000 },
    { date: "Oct 28", volume: 53600000 },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="text-gray-600 mt-2">System performance and user metrics</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Users */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalUsers.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  {metrics.newUsersChange >= 0 ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                  )}
                  <span className={metrics.newUsersChange >= 0 ? "text-green-600" : "text-red-600"}>
                    {Math.abs(metrics.newUsersChange)}%
                  </span>
                  <span className="ml-1">from last month</span>
                </div>
              </CardContent>
            </Card>

            {/* Transaction Volume */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Volume</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  ₦{(metrics.totalVolume / 1000000).toFixed(1)}M
                </div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <ArrowUpRight className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">{metrics.volumeChange}%</span>
                  <span className="ml-1">from last week</span>
                </div>
              </CardContent>
            </Card>

            {/* Total Transactions */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Transactions</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalTransactions.toLocaleString()}</div>
                <div className="flex items-center text-xs text-muted-foreground mt-1">
                  <ArrowDownRight className="h-3 w-3 text-red-600 mr-1" />
                  <span className="text-red-600">{Math.abs(metrics.transactionsChange)}%</span>
                  <span className="ml-1">from yesterday</span>
                </div>
              </CardContent>
            </Card>

            {/* Total Wallets */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Wallets</CardTitle>
                <Wallet className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalWallets.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across {metrics.totalUsers} users
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <Tabs defaultValue="users" className="space-y-4">
            <TabsList>
              <TabsTrigger value="users">User Growth</TabsTrigger>
              <TabsTrigger value="volume">Transaction Volume</TabsTrigger>
              <TabsTrigger value="revenue">Revenue</TabsTrigger>
            </TabsList>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Growth</CardTitle>
                  <CardDescription>Monthly user registration trends</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-end space-x-4">
                    {userGrowth.map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-purple-600 rounded-t"
                          style={{ height: `${(data.users / 1500) * 100}%` }}
                        />
                        <p className="text-xs text-gray-600 mt-2">{data.month}</p>
                        <p className="text-xs font-medium">{data.users}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="volume">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction Volume</CardTitle>
                  <CardDescription>Daily transaction volume (Last 5 days)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-end space-x-4">
                    {transactionVolume.map((data, index) => (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div
                          className="w-full bg-green-600 rounded-t"
                          style={{ height: `${(data.volume / 60000000) * 100}%` }}
                        />
                        <p className="text-xs text-gray-600 mt-2">{data.date}</p>
                        <p className="text-xs font-medium">
                          ₦{(data.volume / 1000000).toFixed(1)}M
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="revenue">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Analytics</CardTitle>
                  <CardDescription>Platform revenue and fees collected</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Revenue analytics coming soon</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

