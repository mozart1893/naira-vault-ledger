import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { ArrowDownUp, Loader2, Info, TrendingUp } from "lucide-react";

export const EnhancedCurrencyConverter = () => {
  const [wallets, setWallets] = useState<any[]>([]);
  const [fromWallet, setFromWallet] = useState<string>("");
  const [toWallet, setToWallet] = useState<string>("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<any>(null);

  useEffect(() => {
    fetchWallets();
  }, []);

  const fetchWallets = async () => {
    try {
      const response = await api.getWallets();
      if (response.success && response.data.length > 0) {
        setWallets(response.data);
        setFromWallet(response.data[0].id);
        if (response.data.length > 1) {
          setToWallet(response.data[1].id);
        }
      }
    } catch (error) {
      console.error('Error fetching wallets:', error);
    }
  };

  const calculatePreview = () => {
    if (!amount || !fromWallet || !toWallet) return;

    const sourceWallet = wallets.find(w => w.id === fromWallet);
    const targetWallet = wallets.find(w => w.id === toWallet);
    const convertAmount = parseFloat(amount);

    if (!sourceWallet || !targetWallet || isNaN(convertAmount)) return;

    // Estimate conversion (will get real rate from backend)
    // For preview, use approximate rates
    const rates: any = {
      'NGN-USD': 0.00067,
      'USD-NGN': 1500,
      'NGN-GBP': 0.00053,
      'GBP-NGN': 1900,
      'NGN-EUR': 0.00061,
      'EUR-NGN': 1650,
      'USD-GBP': 0.79,
      'GBP-USD': 1.27,
      'USD-EUR': 0.91,
      'EUR-USD': 1.10
    };

    const rateKey = `${sourceWallet.currency}-${targetWallet.currency}`;
    const rate = rates[rateKey] || 1;
    const converted = convertAmount * rate;
    const fee = converted * 0.01; // 1% fee
    const net = converted - fee;

    setPreview({
      fromAmount: convertAmount,
      fromCurrency: sourceWallet.currency,
      toAmount: converted,
      toCurrency: targetWallet.currency,
      fee,
      netAmount: net,
      rate
    });
  };

  useEffect(() => {
    calculatePreview();
  }, [amount, fromWallet, toWallet]);

  const handleConvert = async () => {
    if (!amount || !fromWallet || !toWallet) {
      toast.error("Please fill in all fields");
      return;
    }

    const convertAmount = parseFloat(amount);
    if (isNaN(convertAmount) || convertAmount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    const sourceWallet = wallets.find(w => w.id === fromWallet);
    if (convertAmount > sourceWallet.availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    setLoading(true);

    try {
      const response = await api.convertCurrency(fromWallet, toWallet, convertAmount);
      
      if (response.success) {
        toast.success(
          `Successfully converted ${response.data.fromAmount} ${response.data.fromCurrency} to ${response.data.netAmount.toFixed(2)} ${response.data.toCurrency}`
        );
        setAmount("");
        setPreview(null);
        fetchWallets(); // Refresh wallets
      } else {
        toast.error(response.error?.message || "Conversion failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to convert currency");
    } finally {
      setLoading(false);
    }
  };

  const sourceWallet = wallets.find(w => w.id === fromWallet);
  const targetWallet = wallets.find(w => w.id === toWallet);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowDownUp className="mr-2 h-5 w-5" />
          Currency Converter
        </CardTitle>
        <CardDescription>Convert between your wallet currencies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {wallets.length < 2 ? (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              You need at least 2 wallets to convert currencies
            </AlertDescription>
          </Alert>
        ) : (
          <>
            {/* From Wallet */}
            <div className="space-y-2">
              <Label htmlFor="from-wallet">From Wallet</Label>
              <Select value={fromWallet} onValueChange={setFromWallet}>
                <SelectTrigger id="from-wallet">
                  <SelectValue placeholder="Select wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.currency} - Balance: {wallet.availableBalance.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Amount */}
            <div className="space-y-2">
              <Label htmlFor="amount">Amount</Label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                disabled={loading}
              />
              {sourceWallet && (
                <p className="text-xs text-gray-500">
                  Available: {sourceWallet.availableBalance.toLocaleString()} {sourceWallet.currency}
                </p>
              )}
            </div>

            {/* To Wallet */}
            <div className="space-y-2">
              <Label htmlFor="to-wallet">To Wallet</Label>
              <Select value={toWallet} onValueChange={setToWallet}>
                <SelectTrigger id="to-wallet">
                  <SelectValue placeholder="Select wallet" />
                </SelectTrigger>
                <SelectContent>
                  {wallets.filter(w => w.id !== fromWallet).map((wallet) => (
                    <SelectItem key={wallet.id} value={wallet.id}>
                      {wallet.currency} - Balance: {wallet.availableBalance.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Conversion Preview */}
            {preview && (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg space-y-2">
                <div className="flex items-center text-sm font-medium text-purple-900">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Conversion Preview
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">You send:</span>
                    <span className="font-medium">{preview.fromAmount.toLocaleString()} {preview.fromCurrency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Exchange rate:</span>
                    <span className="font-medium">1 {preview.fromCurrency} = {preview.rate} {preview.toCurrency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Conversion fee (1%):</span>
                    <span className="font-medium">{preview.fee.toFixed(2)} {preview.toCurrency}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-purple-300">
                    <span className="font-semibold text-purple-900">You receive:</span>
                    <span className="font-bold text-purple-900">{preview.netAmount.toFixed(2)} {preview.toCurrency}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Convert Button */}
            <Button
              onClick={handleConvert}
              disabled={loading || !amount || !fromWallet || !toWallet}
              className="w-full"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Converting...
                </>
              ) : (
                <>
                  <ArrowDownUp className="mr-2 h-4 w-4" />
                  Convert Currency
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

