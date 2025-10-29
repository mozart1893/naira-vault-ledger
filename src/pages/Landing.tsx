import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Wallet, 
  TrendingUp, 
  Shield, 
  Zap, 
  Globe, 
  Lock,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Wallet className="h-8 w-8 text-purple-600" />
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Naira Vault
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link to="/register">
                <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your Multi-Currency
            <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Digital Wallet
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Manage NGN, USD, GBP, and EUR all in one secure platform. 
            Send, receive, and convert currencies with ease.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <Button size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/documentation">
              <Button size="lg" variant="outline" className="text-lg px-8">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            Why Choose Naira Vault?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Multi-Currency Support</CardTitle>
                <CardDescription>
                  Manage NGN, USD, GBP, and EUR wallets seamlessly in one place.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 2 */}
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Instant Transactions</CardTitle>
                <CardDescription>
                  Send and receive money instantly with real-time balance updates.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 3 */}
            <Card className="border-green-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Currency Conversion</CardTitle>
                <CardDescription>
                  Convert between currencies at competitive exchange rates.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 4 */}
            <Card className="border-purple-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Bank-Level Security</CardTitle>
                <CardDescription>
                  Your funds are protected with enterprise-grade encryption and security.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 5 */}
            <Card className="border-blue-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Global Reach</CardTitle>
                <CardDescription>
                  Send money across borders with support for multiple currencies.
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Feature 6 */}
            <Card className="border-green-100 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Lock className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Complete Privacy</CardTitle>
                <CardDescription>
                  Your financial data is encrypted and never shared with third parties.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12 text-gray-900">
            How It Works
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="text-xl font-semibold mb-2">Sign Up</h4>
              <p className="text-gray-600">
                Create your account in minutes with email and phone verification.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="text-xl font-semibold mb-2">Add Funds</h4>
              <p className="text-gray-600">
                Deposit money into your wallets via bank transfer or card.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="text-xl font-semibold mb-2">Transact</h4>
              <p className="text-gray-600">
                Send, receive, and convert currencies instantly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold mb-6">
                Trusted by Thousands of Users
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Real-time balance updates and transaction notifications</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Comprehensive transaction history and audit trails</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5" />
                  <span>24/7 customer support and account protection</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle2 className="h-6 w-6 mr-3 flex-shrink-0 mt-0.5" />
                  <span>Competitive exchange rates with low fees</span>
                </li>
              </ul>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
              <h4 className="text-2xl font-bold mb-4">Ready to Get Started?</h4>
              <p className="mb-6 text-white/90">
                Join thousands of users managing their finances with Naira Vault.
              </p>
              <Link to="/register">
                <Button size="lg" className="w-full bg-white text-purple-600 hover:bg-gray-100">
                  Create Your Account
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <p className="text-sm text-white/70 mt-4 text-center">
                Already have an account?{" "}
                <Link to="/login" className="text-white hover:underline font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <Wallet className="h-6 w-6 text-purple-600" />
                <span className="text-xl font-bold">Naira Vault</span>
              </div>
              <p className="text-gray-600 text-sm">
                A comprehensive multi-currency digital wallet and ledger system 
                built for the modern world.
              </p>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Product</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/register" className="hover:text-purple-600">Features</Link></li>
                <li><Link to="/documentation" className="hover:text-purple-600">Documentation</Link></li>
                <li><Link to="/register" className="hover:text-purple-600">Pricing</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold mb-3">Company</h5>
              <ul className="space-y-2 text-sm text-gray-600">
                <li><Link to="/register" className="hover:text-purple-600">About Us</Link></li>
                <li><Link to="/register" className="hover:text-purple-600">Contact</Link></li>
                <li><Link to="/register" className="hover:text-purple-600">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t">
            <p className="text-center text-sm text-gray-500">
              © {new Date().getFullYear()} Naira Vault Ledger System. All rights reserved.
              <span className="block mt-1">For demonstration purposes only.</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

