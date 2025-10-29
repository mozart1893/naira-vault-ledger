import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { adminApi } from "@/lib/api";
import { toast } from "sonner";
import { Wallet, DollarSign, ArrowDown, Loader2, Search } from "lucide-react";

export default function WalletManagement() {
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [currency, setCurrency] = useState<string>("NGN");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminApi.getAllUsers({ limit: 1000 });
      if (response.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handlePayin = async () => {
    if (!selectedUser || !amount) {
      toast.error("Please select user and enter amount");
      return;
    }

    const payinAmount = parseFloat(amount);
    if (isNaN(payinAmount) || payinAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    setLoading(true);

    try {
      const response = await adminApi.simulatePayin(
        selectedUser,
        currency,
        payinAmount,
        description || `Admin pay-in - ${currency}`
      );

      if (response.success) {
        toast.success(`Successfully added ${payinAmount} ${currency} to user's wallet`);
        setAmount("");
        setDescription("");
      } else {
        toast.error(response.error?.message || "Pay-in failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to process pay-in");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedUserData = users.find(u => u.id === selectedUser);

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="py-6">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Wallet Management</h1>
            <p className="text-gray-600 mt-2">Simulate pay-ins and manage user wallets</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* User Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Select User</CardTitle>
                <CardDescription>Choose a user to add funds</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search by name or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* User List */}
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => setSelectedUser(user.id)}
                      className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedUser === user.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  ))}
                </div>

                {selectedUserData && (
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Selected User:</p>
                    <p className="text-sm text-blue-700">{selectedUserData.name}</p>
                    <p className="text-xs text-blue-600">{selectedUserData.email}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pay-in Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Simulate Pay-in
                </CardTitle>
                <CardDescription>Add funds to user's wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">NGN - Nigerian Naira</SelectItem>
                      <SelectItem value="USD">USD - US Dollar</SelectItem>
                      <SelectItem value="GBP">GBP - British Pound</SelectItem>
                      <SelectItem value="EUR">EUR - Euro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    disabled={loading || !selectedUser}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="e.g., Bank transfer, Credit adjustment"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    disabled={loading || !selectedUser}
                  />
                </div>

                <Button
                  onClick={handlePayin}
                  disabled={loading || !selectedUser || !amount}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <ArrowDown className="mr-2 h-4 w-4" />
                      Process Pay-in
                    </>
                  )}
                </Button>

                {!selectedUser && (
                  <p className="text-xs text-center text-gray-500">
                    Select a user from the list to continue
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Info Card */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Pay-in Information</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              <ul className="space-y-2">
                <li>• Pay-ins are simulated transactions that add funds to a user's wallet</li>
                <li>• Each pay-in creates a transaction record with type "deposit"</li>
                <li>• All pay-ins are logged with admin ID for audit purposes</li>
                <li>• If the user doesn't have a wallet for the selected currency, one will be created automatically</li>
                <li>• Only enabled currencies can receive pay-ins</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

