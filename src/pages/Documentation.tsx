
import { Header } from "@/components/Header";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { MermaidDiagram } from "@/components/MermaidDiagram";
import { UserStoryCard } from "@/components/UserStoryCard";
import { ToolCard } from "@/components/ToolCard";
import { 
  mockArchitectureDiagram, 
  mockDepositFlowDiagram, 
  mockTransferFlowDiagram, 
  mockLedgerSchemaDiagram,
  mockUserStories,
  recommendedTools
} from "@/lib/mockData";
import { 
  LayoutDashboard, 
  GitBranch, 
  Database, 
  UserCheck, 
  Wrench 
} from "lucide-react";

const Documentation = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold mb-2 text-vault-dark">System Documentation</h1>
          <p className="text-muted-foreground mb-6">
            Visual documentation for the NairaVault multi-currency wallet system
          </p>
          
          <Tabs defaultValue="architecture" className="w-full">
            <TabsList className="mb-6 grid grid-cols-5 w-full max-w-4xl">
              <TabsTrigger value="architecture" className="flex items-center">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Architecture</span>
              </TabsTrigger>
              <TabsTrigger value="flows" className="flex items-center">
                <GitBranch className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Flows</span>
              </TabsTrigger>
              <TabsTrigger value="database" className="flex items-center">
                <Database className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Database</span>
              </TabsTrigger>
              <TabsTrigger value="user-stories" className="flex items-center">
                <UserCheck className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">User Stories</span>
              </TabsTrigger>
              <TabsTrigger value="tools" className="flex items-center">
                <Wrench className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Tools</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="architecture" className="animate-fade-in">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-vault-dark">System Architecture</h2>
                <p className="mb-6 text-muted-foreground">
                  The NairaVault system is built on a microservices architecture with the following components:
                </p>
                <MermaidDiagram chart={mockArchitectureDiagram} />
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-2">Key Components</h3>
                  <ul className="space-y-2 list-disc pl-6">
                    <li>
                      <strong>Client Applications</strong>: Web and mobile interfaces for users to interact with the system.
                    </li>
                    <li>
                      <strong>API Gateway</strong>: Single entry point that routes requests to appropriate microservices.
                    </li>
                    <li>
                      <strong>Core Services</strong>: Independent services handling specific business functions.
                    </li>
                    <li>
                      <strong>Auth & Security</strong>: Services ensuring secure access and regulatory compliance.
                    </li>
                    <li>
                      <strong>External Integrations</strong>: Connections to payment gateways, banks, and other external services.
                    </li>
                    <li>
                      <strong>Data Storage</strong>: Segregated databases for different domains, ensuring data isolation.
                    </li>
                    <li>
                      <strong>Infrastructure</strong>: Supporting systems like message queues, caches, and monitoring tools.
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="flows" className="animate-fade-in">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-vault-dark">Critical Process Flows</h2>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Deposit Flow</h3>
                  <p className="mb-4 text-muted-foreground">
                    This diagram illustrates the end-to-end process of depositing funds into a wallet.
                  </p>
                  <MermaidDiagram chart={mockDepositFlowDiagram} />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">Cross-Currency Transfer Flow</h3>
                  <p className="mb-4 text-muted-foreground">
                    This diagram shows how transfers between different currencies are handled with automated FX conversion.
                  </p>
                  <MermaidDiagram chart={mockTransferFlowDiagram} />
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="database" className="animate-fade-in">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-vault-dark">Database Schema</h2>
                <p className="mb-6 text-muted-foreground">
                  The ledger system uses a double-entry accounting approach with the following database schema:
                </p>
                
                <MermaidDiagram chart={mockLedgerSchemaDiagram} />
                
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-2">Schema Details</h3>
                  <ul className="space-y-2 list-disc pl-6">
                    <li>
                      <strong>USERS</strong>: Stores user information and KYC status.
                    </li>
                    <li>
                      <strong>WALLETS</strong>: Contains wallet information with both ledger and available balances.
                    </li>
                    <li>
                      <strong>TRANSACTIONS</strong>: Records all financial transactions in the system.
                    </li>
                    <li>
                      <strong>LEDGER_ENTRIES</strong>: Implements double-entry accounting with debit and credit entries.
                    </li>
                    <li>
                      <strong>CURRENCY_CONVERSIONS</strong>: Tracks FX conversions with rates at the time of conversion.
                    </li>
                    <li>
                      <strong>HOLDS</strong>: Manages temporary holds on funds that affect available balance.
                    </li>
                  </ul>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="user-stories" className="animate-fade-in">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-vault-dark">User Stories</h2>
                <p className="mb-6 text-muted-foreground">
                  Key user stories defining system requirements and functionality:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {mockUserStories.map((story) => (
                    <UserStoryCard
                      key={story.id}
                      id={story.id}
                      title={story.title}
                      description={story.description}
                      acceptanceCriteria={story.acceptanceCriteria}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="tools" className="animate-fade-in">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h2 className="text-xl font-semibold mb-4 text-vault-dark">Recommended Tools & Technologies</h2>
                <p className="mb-6 text-muted-foreground">
                  Suggested tools and technologies for implementing the NairaVault system:
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recommendedTools.map((tool, index) => (
                    <ToolCard
                      key={index}
                      category={tool.category}
                      name={tool.name}
                      description={tool.description}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
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

export default Documentation;
