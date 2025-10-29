import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { CurrencyCard } from "@/components/CurrencyCard";
import { TransactionList } from "@/components/TransactionList";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { mockWallets, mockTransactions } from "@/lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-vault-dark">
              Welcome back, {user?.firstName || 'User'}!
            </h1>
            <p className="text-gray-600">Manage your multi-currency wallets</p>
          </div>

          {/* KYC Verification Alert */}
          {user?.kycStatus !== "verified" && (
            <Alert className="mb-6 border-purple-200 bg-purple-50">
              <Shield className="h-4 w-4 text-purple-600" />
              <AlertDescription className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-purple-900">
                    {user?.kycStatus === "pending" 
                      ? "KYC Verification In Progress" 
                      : "Complete Your KYC Verification"}
                  </p>
                  <p className="text-sm text-purple-700 mt-1">
                    {user?.kycStatus === "pending"
                      ? "Your documents are being reviewed. We'll notify you within 24-48 hours."
                      : "Verify your identity to unlock higher transaction limits and full platform access."}
                  </p>
                </div>
                {user?.kycStatus !== "pending" && (
                  <Button 
                    size="sm" 
                    className="ml-4"
                    onClick={() => navigate("/kyc")}
                  >
                    Complete KYC
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          )}

          {user?.kycStatus === "verified" && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription>
                <p className="font-medium text-green-900">
                  ✅ Your identity is verified
                </p>
                <p className="text-sm text-green-700 mt-1">
                  You have full access to all platform features with higher transaction limits.
                </p>
              </AlertDescription>
            </Alert>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {mockWallets.map((wallet) => (
              <CurrencyCard
                key={wallet.id}
                currencyCode={wallet.currencyCode as any}
                ledgerBalance={wallet.ledgerBalance}
                availableBalance={wallet.availableBalance}
                holds={wallet.holds}
                lastUpdated={wallet.lastUpdated}
              />
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-2">
              <h2 className="text-xl font-semibold mb-4 text-vault-dark">Recent Transactions</h2>
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="mb-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="deposits">Deposits</TabsTrigger>
                  <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
                  <TabsTrigger value="transfers">Transfers</TabsTrigger>
                  <TabsTrigger value="conversions">Conversions</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <TransactionList transactions={mockTransactions} />
                </TabsContent>
                
                <TabsContent value="deposits">
                  <TransactionList 
                    transactions={mockTransactions.filter(t => t.type === 'deposit')} 
                  />
                </TabsContent>
                
                <TabsContent value="withdrawals">
                  <TransactionList 
                    transactions={mockTransactions.filter(t => t.type === 'withdrawal')} 
                  />
                </TabsContent>
                
                <TabsContent value="transfers">
                  <TransactionList 
                    transactions={mockTransactions.filter(t => t.type === 'transfer')} 
                  />
                </TabsContent>
                
                <TabsContent value="conversions">
                  <TransactionList 
                    transactions={mockTransactions.filter(t => t.type === 'conversion')} 
                  />
                </TabsContent>
              </Tabs>
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-4 text-vault-dark">Currency Conversion</h2>
              <CurrencyConverter />
            </div>
          </div>
        </div>
      </main>
      <footer className="py-4 border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            © 2025 NairaVault Ledger System - For demonstration purposes only
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;

