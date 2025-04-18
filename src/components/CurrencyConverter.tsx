
import { useState, useEffect } from "react";
import { CURRENCIES, EXCHANGE_RATES } from "@/lib/constants";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowRightLeft, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const CurrencyConverter = () => {
  const [fromCurrency, setFromCurrency] = useState<keyof typeof CURRENCIES>("NGN");
  const [toCurrency, setToCurrency] = useState<keyof typeof CURRENCIES>("USD");
  const [amount, setAmount] = useState<string>("1000");
  const [convertedAmount, setConvertedAmount] = useState<number>(0);
  const [exchangeRate, setExchangeRate] = useState<number>(0);
  const [isConverting, setIsConverting] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Update exchange rate whenever currencies change
    const rate = EXCHANGE_RATES[fromCurrency][toCurrency];
    setExchangeRate(rate);
    
    // Calculate converted amount
    const parsedAmount = parseFloat(amount) || 0;
    setConvertedAmount(parsedAmount * rate);
  }, [fromCurrency, toCurrency, amount]);

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const handleConvert = () => {
    setIsConverting(true);
    
    // Simulate API call
    setTimeout(() => {
      const parsedAmount = parseFloat(amount) || 0;
      const converted = parsedAmount * exchangeRate;
      setConvertedAmount(converted);
      setIsConverting(false);
      
      toast({
        title: "Conversion Simulated",
        description: `${parsedAmount} ${fromCurrency} = ${converted.toFixed(2)} ${toCurrency}`,
      });
    }, 800);
  };

  const formatCurrency = (value: number, currency: keyof typeof CURRENCIES) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <ArrowRightLeft className="h-5 w-5 text-vault-primary" />
          <span>Currency Converter</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="from-amount">Amount</Label>
            <div className="flex space-x-2">
              <Input
                id="from-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="flex-1"
              />
              <Select value={fromCurrency} onValueChange={(value) => setFromCurrency(value as keyof typeof CURRENCIES)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CURRENCIES).map((code) => (
                    <SelectItem key={code} value={code}>
                      {CURRENCIES[code as keyof typeof CURRENCIES].code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="flex justify-center my-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSwapCurrencies}
              className="hover:bg-vault-light hover:text-vault-primary"
            >
              <ArrowRightLeft className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="to-amount">Converted Amount</Label>
            <div className="flex space-x-2">
              <Input
                id="to-amount"
                readOnly
                value={convertedAmount.toFixed(2)}
                className="flex-1 bg-muted"
              />
              <Select value={toCurrency} onValueChange={(value) => setToCurrency(value as keyof typeof CURRENCIES)}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(CURRENCIES).map((code) => (
                    <SelectItem key={code} value={code}>
                      {CURRENCIES[code as keyof typeof CURRENCIES].code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="text-sm text-center text-muted-foreground">
            <p>Exchange Rate: 1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}</p>
          </div>
          
          <Button 
            onClick={handleConvert} 
            className="w-full bg-vault-primary hover:bg-vault-secondary"
            disabled={isConverting}
          >
            {isConverting ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Converting...
              </>
            ) : (
              'Convert'
            )}
          </Button>
          
          <p className="text-xs text-center text-muted-foreground">
            This is a simulation using static exchange rates. 
            In a production environment, real-time rates would be fetched from FMDQ or other rate providers.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
