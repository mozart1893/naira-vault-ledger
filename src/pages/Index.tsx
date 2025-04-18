
import { Header } from "@/components/Header";
import { CurrencyCard } from "@/components/CurrencyCard";
import { TransactionList } from "@/components/TransactionList";
import { CurrencyConverter } from "@/components/CurrencyConverter";
import { mockWallets, mockTransactions } from "@/lib/mockData";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-6 text-vault-dark">Wallet Dashboard</h1>
          
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

export default Index;
