import { useState, useEffect } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { adminApi } from "@/lib/api";
import { toast } from "sonner";
import { Globe, AlertCircle } from "lucide-react";

export default function CurrencyManagement() {
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCurrencies();
  }, []);

  const fetchCurrencies = async () => {
    try {
      setLoading(true);
      const response = await adminApi.getCurrencies();
      if (response.success) {
        setCurrencies(response.data);
      }
    } catch (error) {
      console.error('Error fetching currencies:', error);
      toast.error('Failed to load currencies');
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (code: string, enabled: boolean) => {
    try {
      const response = await adminApi.toggleCurrency(code, enabled);
      if (response.success) {
        toast.success(`${code} ${enabled ? 'enabled' : 'disabled'} successfully`);
        // Update local state
        setCurrencies(currencies.map(c =>
          c.code === code ? { ...c, enabled } : c
        ));
      }
    } catch (error) {
      toast.error('Failed to toggle currency');
    }
  };

  const getCurrencyIcon = (code: string) => {
    const icons: any = {
      NGN: '₦',
      USD: '$',
      GBP: '£',
      EUR: '€'
    };
    return icons[code] || code;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      <main className="py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Currency Management</h1>
            <p className="text-gray-600 mt-2">Enable or disable currencies for all users</p>
          </div>

          {/* Currency List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Globe className="mr-2 h-5 w-5" />
                Supported Currencies
              </CardTitle>
              <CardDescription>
                Control which currencies are available to users
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600" />
                </div>
              ) : (
                <div className="space-y-4">
                  {currencies.map((currency) => (
                    <div
                      key={currency.code}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-center space-x-4">
                        <div className="text-3xl font-bold text-gray-700">
                          {getCurrencyIcon(currency.code)}
                        </div>
                        <div>
                          <p className="font-semibold text-lg">{currency.name}</p>
                          <p className="text-sm text-gray-500">{currency.code}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <Badge
                          variant={currency.enabled ? "default" : "secondary"}
                          className={currency.enabled ? "bg-green-600" : ""}
                        >
                          {currency.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                        
                        <Switch
                          id={`currency-${currency.code}`}
                          checked={currency.enabled}
                          onCheckedChange={(enabled) => handleToggle(currency.code, enabled)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mt-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-2">Important Information:</p>
                  <ul className="space-y-1 text-blue-800">
                    <li>• Disabling a currency will hide it from all users immediately</li>
                    <li>• Users won't be able to perform any operations with disabled currencies</li>
                    <li>• Existing balances in disabled currencies remain safe but inaccessible</li>
                    <li>• Re-enabling a currency restores access to existing balances</li>
                    <li>• All currency status changes are logged for audit purposes</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Status Summary */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-lg">Currency Status Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {currencies.map((currency) => (
                  <div
                    key={currency.code}
                    className={`p-4 rounded-lg text-center ${
                      currency.enabled
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="text-2xl font-bold mb-1">{getCurrencyIcon(currency.code)}</div>
                    <div className="text-xs font-medium">{currency.code}</div>
                    <div className={`text-xs mt-1 ${
                      currency.enabled ? "text-green-600" : "text-gray-500"
                    }`}>
                      {currency.enabled ? "Active" : "Inactive"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}

